/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js Edge Server-to-Server Proxy API Router
 * 
 * Forwards contract analysis payloads securely to the standalone Express backend on Port 5000.
 * Hides all GEMINI_API_KEY environment variables entirely from client browser networks!
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    
    // Determine target backend server host (defaults to local Express port 5000 in dev)
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    console.log(`[LexGuard Proxy Gateway] Forwarding contract audit payload to backend: ${backendUrl}/api/analyze`);

    const res = await fetch(`${backendUrl}/api/analyze`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[LexGuard Proxy Gateway] Backend responded with status ${res.status}:`, errorText);
      return NextResponse.json(
        { error: `Backend API Error: ${errorText}` }, 
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log(`[LexGuard Proxy Gateway] Received successful audit report from backend.`);
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("[LexGuard Proxy Gateway] Critical failure in request forwarder:", error);
    return NextResponse.json(
      { error: `LexGuard Gateway Gateway Error: ${error.message}` },
      { status: 500 }
    );
  }
}
