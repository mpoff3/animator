import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get('query');

  return Response.json({
    success: true,
    explanation: `Video generated for query: "${query}". Explanation feature not yet implemented via LLM.`
  });

}
