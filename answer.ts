import { loadText, writeText } from "./lib/text.ts";
import { modelName, predictAnswers } from "./lib/llm.ts";
import { folderNames, fileNames } from "./lib/files.ts";

const experiment = async (folderName: string, name: keyof typeof modelName) => {
  const questions = JSON.parse(loadText(folderName, fileNames.questions));
  const instructions = JSON.parse(loadText(folderName, fileNames.answers));
  const results = await predictAnswers(
    modelName[name],
    instructions,
    questions
  );
  writeText(
    folderName,
    fileNames.results(name),
    JSON.stringify(results, null, 2)
  );
  return results;
};

await Promise.all(
  folderNames.map((folderName) =>
    Object.keys(modelName).map((name) =>
      experiment(folderName, name as keyof typeof modelName)
    )
  )
);
