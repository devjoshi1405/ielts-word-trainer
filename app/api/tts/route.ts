import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// In-memory cache for audio buffers to avoid redundant fetches
const audioCache = new Map<string, { buffer: ArrayBuffer; contentType: string }>();
const MAX_CACHE_ENTRIES = 500;

function getLangCode(accent: string = "british"): string {
  switch (accent.toLowerCase()) {
    case "american":
    case "us":
      return "en-US";
    case "australian":
    case "au":
      return "en-AU";
    case "british":
    case "uk":
    case "gb":
    default:
      return "en-GB";
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get("text")?.trim();
    const accent = searchParams.get("accent") || "british";

    if (!text) {
      return NextResponse.json({ error: "Missing 'text' parameter" }, { status: 400 });
    }

    if (text.length > 500) {
      return NextResponse.json({ error: "Text too long (max 500 chars)" }, { status: 400 });
    }

    const langCode = getLangCode(accent);
    const cacheKey = `${langCode}:${text.toLowerCase()}`;

    // Return from cache if available
    if (audioCache.has(cacheKey)) {
      const cached = audioCache.get(cacheKey)!;
      return new NextResponse(cached.buffer, {
        status: 200,
        headers: {
          "Content-Type": cached.contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
          "Accept-Ranges": "bytes",
        },
      });
    }

    // Google Translate TTS endpoint with natural voice
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      text
    )}&tl=${langCode}&client=tw-ob`;

    const response = await fetch(ttsUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Referer: "https://translate.google.com/",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `TTS service returned status ${response.status}` },
        { status: 502 }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "audio/mpeg";

    // Cache the audio buffer
    if (audioCache.size >= MAX_CACHE_ENTRIES) {
      const firstKey = audioCache.keys().next().value;
      if (firstKey) audioCache.delete(firstKey);
    }
    audioCache.set(cacheKey, { buffer: arrayBuffer, contentType });

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Accept-Ranges": "bytes",
      },
    });
  } catch (error: any) {
    console.error("[TTS API Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate TTS audio" },
      { status: 500 }
    );
  }
}
