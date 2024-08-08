export const isValidUTF8 = (buffer: Buffer) => {
  try {
    const decoder = new TextDecoder("utf-8", { fatal: true });
    decoder.decode(buffer);
    return true;
  } catch (e) {
    return false;
  }
};
