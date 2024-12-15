import { loadText, writeText } from "./lib/text.ts";
import { modelName, predictAnswers } from "./lib/llm.ts";

const folderNames = [
  "q-and-a/set12-1",
  "q-and-a/set12-2",
  "q-and-a/set12-3",
  "q-and-a/set25-1",
  "q-and-a/set25-2",
  "q-and-a/set25-3",
  "q-and-a/set50-1",
  "q-and-a/set50-2",
  "q-and-a/set50-3",
];

const fileNames = {
  questions: "questions.json",
  answers: "answers.json",
  results: (model: string) => `results-${model}.json`,
} as const;

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
