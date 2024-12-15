export const folderNames = [
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

export const fileNames = {
  questions: "questions.json",
  answers: "answers.json",
  results: (model: string) => `results-${model}.json`,
} as const;
