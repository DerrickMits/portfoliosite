import { NextRequest, NextResponse } from "next/server";

const ZAPIER_URL = "https://hooks.zapier.com/hooks/catch/24869353/469gbmm/";

export async function POST(_req: NextRequest) {
  try {
    const payload = await _req.json();

    const res = await fetch(ZAPIER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "Unknown error");
      return NextResponse.json(
        { error: `Zapier responded ${res.status}: ${text}` },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to process intake submission." },
      { status: 500 }
    );
  }
}