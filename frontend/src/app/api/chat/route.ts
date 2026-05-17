/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js Edge Server-to-Server Proxy API Router for Chat Copilot
 * 
 * Forwards chat query payloads securely to the standalone Express backend on Port 5000.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    
    // Determine target backend server host (defaults to local Express port 5000 in dev)
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    console.log(`[LexGuard Proxy Gateway] Forwarding chat payload to backend: ${backendUrl}/api/chat`);

    const res = await fetch(`${backendUrl}/api/chat`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[LexGuard Proxy Gateway] Backend chat responded with status ${res.status}:`, errorText);
      return NextResponse.json(
        { error: `Backend API Error: ${errorText}` }, 
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log(`[LexGuard Proxy Gateway] Received successful chat response from backend.`);
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("[LexGuard Proxy Gateway] Critical failure in chat request forwarder:", error);
    return NextResponse.json(
      { error: `LexGuard Gateway Gateway Error: ${error.message}` },
      { status: 500 }
    );
  }
}
