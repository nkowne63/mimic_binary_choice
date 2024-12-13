import results from "./results.json" with { type: "json" };

const { results: answers } = results;

const getRandomAnswersAndOthers = (n: number) => {
  if (n > answers.length) {
    throw new Error("Requested more items than available in answers array");
  }

  const shuffled = [...answers].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, n);
  const others = shuffled.slice(n);

  return { selected, others };
};

const { selected, others } = getRandomAnswersAndOthers(50);

const onlyQuestionsAndChoices = others.map(({ question, choiceA, choiceB }) => ({
    question,
    choiceA,
    choiceB,
}));

const writeToFile = async (filename: string, data: unknown) => {
    const encoder = new TextEncoder();
    await Deno.writeFile(filename, encoder.encode(JSON.stringify(data, null, 2)));
};

const folder = "set50-3";

// Write 'selected' to a file
await writeToFile(`${folder}/answers.json`, selected);

// Write 'onlyQuestionsAndChoices' to a file
await writeToFile(`${folder}/questions.json`, onlyQuestionsAndChoices);
