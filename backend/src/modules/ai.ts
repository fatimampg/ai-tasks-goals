import { OpenAI } from "@langchain/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import z from "zod"; //to define and validate data schema in JavaScript and TypeScript

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    summary: z
      .string()
      .describe(
        "Analyze the progress of my Tasks by category, specifying the ones that were successful and the ones that require more attention. In the analysis take into account the priority set by me, for each task. Compare that progress with the goals set for the same category. Write a quick summary about my progress in each category.",
      ),
    recommendations: z
      .string()
      .describe(
        "Based on the analysis of tasks progress and goals, and priority set for each task, give specific recommendations to help me complete unsuccessful tasks and achieve the related unmet goals.",
      ),
    status: z.array(
      z.object({
        id: z.number().describe("ID of the goal"),
        status: z
          .enum(["NEEDS_IMPROVEMENT", "ACHIEVED", "IN_PROGRESS"])
          .describe(
            "Status assigned to each goal: 'NEEDS_IMPROVEMENT', 'ACHIEVED' or 'IN_PROGRESS', based on tasks' progress within the same category. Status IN_PROGRESS should only be assigned when related tasks have status IN_PROGRESS. If all tasks within the same category have state TO_DO, then the related goal status must be NEEDS_IMPROVEMENT, no matter what!.If all tasks within the same category have state COMPLETED, then the related goal must be ACHIEVED.",
          ),
      }),
    ),
  }),
);

const getPrompt = async (content: any) => {
  const format_instructions = parser.getFormatInstructions();
  const prompt = new PromptTemplate({
    template:
      "Analyse the following tasks and goals. Follow the instructions and format your response to match the format instructions, no matter what! \n {format_instructions}\n{entry}",
    inputVariables: ["entry"],
    partialVariables: { format_instructions },
  });
  const input = await prompt.format({
    entry: content,
  });
  console.log(input);
  return input;
};

export const analyze = async (content: any) => {
  const input = await getPrompt(content);
  const model = new OpenAI({ temperature: 0, modelName: "gpt-4-turbo" });
  const result = await model.invoke(input);
  console.log(result);
  try {
    return parser.parse(result);
  } catch (e) {
    console.log(e);
  }
};
