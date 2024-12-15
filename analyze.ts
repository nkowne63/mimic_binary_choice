import { loadText, writeText } from "./lib/text.ts";
import { folderNames, fileNames } from "./lib/files.ts";
import type { AnswersJson } from "./lib/llm.ts";

type AnswerWithoutConfidence = {
  question: string;
  choice: "A" | "B";
};

const rootAnswer = JSON.parse(
  await loadText(folderNames[0], fileNames.answers)
) as unknown as AnswerWithoutConfidence[];

type AnalyzeResult = {
  matched: number;
  variance: number;
};

const models = ["flash", "pro"] as const;

const pickMatchQuestion = (
  question: string,
  answers: AnswerWithoutConfidence[]
) => answers.find((a) => a.question === question);

const confidenceMap = {
  1: 0.5,
  2: 0.75,
  3: 0.9,
} as const;

const analyze = (
  folderName: string,
  model: (typeof models)[number]
): AnalyzeResult => {
  const llmAnswer = JSON.parse(
    loadText(folderName, fileNames.results(model))
  ) as unknown as AnswersJson;
  const matchProb = llmAnswer.response.map((answer) => {
    const rootCorrespondingAnswer = pickMatchQuestion(
      answer.question,
      rootAnswer
    );
    const isMatching = rootCorrespondingAnswer?.choice === answer.choice;
    return isMatching
      ? confidenceMap[answer.confidence]
      : 1 - confidenceMap[answer.confidence];
  });
  const matched =
    matchProb.reduce((acc, cur) => acc + cur, 0) / matchProb.length;
  const variance =
    Math.sqrt(matchProb.reduce((acc, cur) => acc + (cur - cur ** 2), 0)) /
    matchProb.length;
  return { matched, variance };
};

const aggregated = folderNames.map((folderName) => {
  const modelResults = models.map((model) => ({
    ...analyze(folderName, model),
    model,
  }));
  return {
    folderName,
    modelResults,
  };
});

writeText(".", "analyze.json", JSON.stringify(aggregated, null, 2));
