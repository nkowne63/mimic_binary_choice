export const loadText = (folderName: string, fileName: string) => {
  const path = `./${folderName}/${fileName}`;
  const decoder = new TextDecoder("utf-8");
  const data = decoder.decode(Deno.readFileSync(path));
  return data;
};

export const writeText = (
  folderName: string,
  fileName: string,
  text: string
) => {
  const path = `./${folderName}/${fileName}`;
  const encoder = new TextEncoder();
  Deno.writeFileSync(path, encoder.encode(text));
};
