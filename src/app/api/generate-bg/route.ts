import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
  }

  const replicateApiKey = process.env.REPLICATE_API_TOKEN!;
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      Authorization: `Token ${replicateApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: "a9758cbf47c02be938ecb8c3489fdbb14dfb43b568e9b6c157fe1f0f1f7bbf86", // SDXL v1.0
      input: {
        prompt,
        width: 768,
        height: 768
      },
    }),
  });

  const result = await response.json();

  return NextResponse.json(result);
}
