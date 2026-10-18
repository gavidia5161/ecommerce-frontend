import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const baseUrl = process.env.BASE_URL;

  if (!baseUrl) {
    return NextResponse.json(
      { message: "Falta configurar BASE_URL" },
      { status: 500 },
    );
  }

  const body = await request.json();

  const apiResponse = await fetch(`${baseUrl}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: body.name,
      email: body.email,
      password: body.password,
    }),
    cache: "no-store",
  });

  const result = await apiResponse.json();

  return NextResponse.json(result, { status: apiResponse.status });
}
