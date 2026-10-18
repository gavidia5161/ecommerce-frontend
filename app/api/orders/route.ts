import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Inicia sesión para crear una orden." },
      { status: 401 },
    );
  }

  const baseUrl = process.env.BASE_URL;

  if (!baseUrl) {
    return NextResponse.json(
      { message: "Falta configurar BASE_URL" },
      { status: 500 },
    );
  }

  const body = await request.json();

  const apiResponse = await fetch(`${baseUrl}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ items: body.items }),
    cache: "no-store",
  });

  const result = await apiResponse.json();

  return NextResponse.json(result, { status: apiResponse.status });
}
