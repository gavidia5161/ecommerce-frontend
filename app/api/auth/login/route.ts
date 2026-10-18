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

  const apiResponse = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email: body.email,
      password: body.password,
    }),
    cache: "no-store",
  });

  const result = await apiResponse.json();

  if (!apiResponse.ok) {
    return NextResponse.json(result, { status: apiResponse.status });
  }

  const response = NextResponse.json({ message: "Inicio de sesión correcto" });
  response.cookies.set("token", result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return response;
}