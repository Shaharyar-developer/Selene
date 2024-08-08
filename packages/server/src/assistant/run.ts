import type OpenAI from "openai";
import { EventEmitter } from "events";
import { openai as client } from "@/libs/openai";
import { workspaceDB, db } from "@/libs/db";
import type { Stream } from "openai/streaming";
import { getAllFromDB, runCommand } from "./functions";

//TODO: Ensure all existing runs are closed before creating a new one
class Run extends EventEmitter {
  private assistant: OpenAI.Beta.Assistant;
  private thread: OpenAI.Beta.Thread;

  constructor(args: {
    assistant: OpenAI.Beta.Assistant;
    thread: OpenAI.Beta.Thread;
  }) {
    super();
    this.assistant = args.assistant;
    this.thread = args.thread;
  }

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

  private async handleStream(
    stream: Stream<OpenAI.Beta.Assistants.AssistantStreamEvent>,
  ) {
    for await (const event of stream) {
      this.emit("data", event);
      await this.handleRunStreamEvent(event);
    }
  }

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
            const data = await workspaceDB.set(key, value);
            const _ = await workspaceDB.get(key);
            console.log(key, value, _);
            return {
              output: data,
              tool_call_id: toolCall.id,
            };
          }

          case "deleteFromDB": {
            const { key } = JSON.parse(toolCall.function.arguments);
            const data = await workspaceDB.del(key);
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
