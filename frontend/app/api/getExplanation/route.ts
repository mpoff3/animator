import { NextRequest } from 'next/server';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  // const query = searchParams.get('query');
  const query = 'matrix multiplication';
  if (!query) {
    return Response.json({
      success: false,
      message: 'No query provided',
    });
  }

  const gptInpItem = (
    role: "system" | "user" | "assistant",
    text: string
  ): OpenAI.Responses.ResponseInputItem => {
    return { role, content: [ { type: "input_text", text } ] };
  };

  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: [
      gptInpItem('system', 'You will be provided with a piece of code, and your task is to explain it in a concise way.'),
      gptInpItem('user', `Explain the following: ${query}`),
    ],
  });

  // console.log('Response:', response.output_text);

  return Response.json({
    success: true,
    // explanation: `Video generated for query: "${query}". Explanation feature not yet implemented via LLM.`
    explanation: response.output_text
  });

}
