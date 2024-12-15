import { SchemaType } from "npm:@google/generative-ai";
import { GenerativeModel, GoogleGenerativeAI } from "npm:@google/generative-ai";

const client = new GoogleGenerativeAI(Deno.env.get("API_KEY")!);

type ModelName = "gemini-1.5-flash" | "gemini-1.5-pro";

export const modelName = {
  flash: "gemini-1.5-flash",
  pro: "gemini-1.5-pro",
} as const satisfies Record<string, ModelName>;

const model = (model: ModelName, systemInstruction: string) =>
  client.getGenerativeModel({ model, systemInstruction });

const responseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    response: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          question: {
            type: SchemaType.STRING,
          },
          choice: {
            type: SchemaType.STRING,
            enum: ["A", "B"],
          },
          confidence: {
            type: SchemaType.STRING,
            enum: ["1", "2", "3"],
          },
        },
      },
    },
  },
};

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
  responseSchema,
};

const chat = async (model: GenerativeModel, prompt: string) => {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });
  const result = await chatSession.sendMessage(prompt);
  return result.response.text();
};

const systemInstructionTemplate = (jsonStr: string) => `
以下のアンケート結果Aから、答えた人の行動指針を予測してください。

\`\`\`json
${jsonStr}
\`\`\`
`;

const promptTemplate = (jsonStr: string) => `
以下の質問と選択肢について、アンケート結果Aから予測される選択肢を選んでください。
また、選択肢に関する自信度を1から3の範囲で選んでください。
自信度1: 自信がない。50%の確率で正解すると思う。
自信度2: まあまあ自信がある。75%の確率で正解すると思う。
自信度3: 自信がある。90%の確率で正解すると思う。

質問と選択肢は以下の通りです。
\`\`\`json
${jsonStr}
\`\`\`
`;

type QuestionJson = {
  question: string;
  choiceA: string;
  choiceB: string;
};

type QuestionsJson = QuestionJson[];

type InstructionsJson = (QuestionJson & {
  result: "A" | "B";
})[];

type AnswerJson = (QuestionJson & {
  choice: "A" | "B";
  confidence: "1" | "2" | "3";
})[];

export const predictAnswers = async (
  modelName: ModelName,
  instructions: InstructionsJson,
  questions: QuestionsJson
): Promise<AnswerJson> => {
  const systemInstruction = systemInstructionTemplate(
    JSON.stringify(instructions, null, 2)
  );
  const llm = model(modelName, systemInstruction);

  const prompt = promptTemplate(JSON.stringify(questions, null, 2));
  const response = await chat(llm, prompt);

  return JSON.parse(response);
};
