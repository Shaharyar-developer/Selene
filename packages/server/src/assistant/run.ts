/**
 * This module defines the `Run` class which extends `EventEmitter`.
 * It interacts with the OpenAI API to create and handle runs, process tool calls, and manage events.
 */

import type OpenAI from "openai";
import { EventEmitter } from "events";
import { openai as client } from "@/libs/openai";
import { workspaceDB, db } from "@/libs/db";
import type { Stream } from "openai/streaming";
import { getAllFromDB, runCommand, deleteFromDB, saveToDB } from "./functions";

class Run extends EventEmitter {
  private assistant: OpenAI.Beta.Assistant;
  private thread: OpenAI.Beta.Thread;

  /**
   * Constructs a new `Run` instance.
   * @param args - An object containing the assistant and thread.
   */
  constructor(args: {
    assistant: OpenAI.Beta.Assistant;
    thread: OpenAI.Beta.Thread;
  }) {
    super();
    this.assistant = args.assistant;
    this.thread = args.thread;
  }

  /**
   * Creates a new run with the given prompt.
   * @param prompt - The prompt to send to the assistant.
   */
  public async createRun(prompt: string) {
    await client.beta.threads.messages.create(this.thread.id, {
      role: "user",
      content: prompt,
    });

    const stream = await client.beta.threads.runs.create(this.thread.id, {
      assistant_id: this.assistant.id,
      stream: true,
    });

    this.handleStream(stream);
  }

  /**
   * Handles the stream of events from the assistant.
   * @param stream - The stream of assistant events.
   */
  private async handleStream(
    stream: Stream<OpenAI.Beta.Assistants.AssistantStreamEvent>,
  ) {
    for await (const event of stream) {
      this.emit("data", event);
      await this.handleRunStreamEvent(event);
    }
  }

  /**
   * Handles individual events from the assistant stream.
   * @param event - The event to handle.
   */
  private async handleRunStreamEvent(
    event: OpenAI.Beta.Assistants.AssistantStreamEvent,
  ) {
    switch (event.event) {
      case "error":
        console.error(event.data);
        break;

      case "thread.message.delta": {
        const content = event.data.delta.content
          ?.map((c) => {
            if (c.type === "text") {
              return c.text?.value;
            }
          })
          .filter((value) => value !== undefined)
          .join("");

        if (content) {
          this.emit("text", content);
        }
        break;
      }

      case "thread.run.requires_action": {
        await this.handleRequiresAction(event.data);
        break;
      }
      case "thread.message.completed":
        const content = event.data.content
          .map((v) => {
            if (v.type === "text") {
              if (v.text.value) return v.text.value;
            }
          })
          .join("");
        this.emit("completed", content);
        break;
      case "thread.run.completed":
        this.emit("end");
        break;

      default:
      // Handle other cases or ignore
    }
  }

  /**
   * Handles events that require an action.
   * @param eventData - The data for the required action event.
   */
  private async handleRequiresAction(
    eventData: OpenAI.Beta.Assistants.AssistantStreamEvent.ThreadRunRequiresAction["data"],
  ) {
    const toolOutputs = await this.processToolCalls(
      eventData.required_action!.submit_tool_outputs.tool_calls,
    );

    const stream = (await this.submitToolOutputs(
      toolOutputs,
      eventData.id,
      this.thread.id,
    )) as unknown as Stream<OpenAI.Beta.Assistants.AssistantStreamEvent>;

    await this.handleStream(stream);
  }

  /**
   * Submits tool outputs to the assistant.
   * @param toolOutputs - The tool outputs to submit.
   * @param runId - The ID of the run.
   * @param threadId - The ID of the thread.
   */
  private async submitToolOutputs(
    toolOutputs: OpenAI.Beta.Threads.Runs.RunSubmitToolOutputsParams.ToolOutput[],
    runId: string,
    threadId: string,
  ) {
    return client.beta.threads.runs.submitToolOutputsStream(threadId, runId, {
      tool_outputs: toolOutputs,
      stream: true,
    });
  }

  /**
   * Processes tool calls and returns their outputs.
   * @param toolCalls - The tool calls to process.
   * @returns A promise that resolves to an array of tool outputs.
   */
  private async processToolCalls(
    toolCalls: OpenAI.Beta.Threads.Runs.RequiredActionFunctionToolCall[],
  ): Promise<OpenAI.Beta.Threads.Runs.RunSubmitToolOutputsParams.ToolOutput[]> {
    const data = Promise.all(
      toolCalls.map(async (toolCall) => {
        switch (toolCall.function.name) {
          case "runShellCommand":
            const { command } = JSON.parse(toolCall.function.arguments);
            const data = await runCommand(command);
            return {
              output: data,
              tool_call_id: toolCall.id,
            };

          case "saveToDB": {
            const { key, value } = JSON.parse(toolCall.function.arguments);
            const data = await saveToDB(key, value);
            return {
              output: data,
              tool_call_id: toolCall.id,
            };
          }

          case "deleteFromDB": {
            const { key } = JSON.parse(toolCall.function.arguments);
            const data = await deleteFromDB(key);
            return {
              output: `Key Value Pairs Deleted: ${data}`,
              tool_call_id: toolCall.id,
            };
          }

          case "getAllFromDB": {
            const data = await getAllFromDB();
            return {
              output: JSON.stringify(data),
              tool_call_id: toolCall.id,
            };
          }

          default:
            return {
              output: "Unsupported Tool Call",
              tool_call_id: toolCall.id,
            };
        }
      }),
    );
    (await data).forEach((v) => {
      console.log(v.output);
    });
    return data;
  }
}

export default Run;
