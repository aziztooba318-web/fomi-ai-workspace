import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  const { prompt } = body;

  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const mockResults = [
    {
      id: Date.now(),
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
      prompt: prompt || "AI Generated Masterpiece",
    }
  ];

  return NextResponse.json({ success: true, data: mockResults });
}