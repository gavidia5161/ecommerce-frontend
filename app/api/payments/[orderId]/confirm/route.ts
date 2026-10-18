import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Inicia sesión para confirmar el pago." },
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

  const apiResponse = await fetch(
    `${baseUrl}/payments/${encodeURIComponent(orderId)}/confirm`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  const result = await apiResponse.json();

  return NextResponse.json(result, { status: apiResponse.status });
}
