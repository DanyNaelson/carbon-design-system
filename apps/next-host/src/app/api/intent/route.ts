import { type NextRequest, NextResponse } from 'next/server';
import { IntentTranslator } from '@yourorg/ai-bridge';
import { validateFullMessage, createVersionHeader } from '@yourorg/mcp-adapter';

const translator = new IntentTranslator();

/**
 * POST /api/intent
 * Receives a user message, interprets it as a raw AI intent, and translates
 * it into an MCP-compatible payload via the ai-bridge.
 *
 * In production this would call Gemini first to parse the user's natural
 * language into a structured AiIntent. For the demo, the body is expected
 * to contain a pre-structured intent OR a simple { message } payload that
 * we map to a create-store intent.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const versionHeader = createVersionHeader();

    if (body.intent) {
      const result = translator.translate(body);

      if (result.success && result.payload) {
        const validation = validateFullMessage({
          version: versionHeader.version,
          action: result.action!,
          payload: result.payload,
        });

        return NextResponse.json({
          success: true,
          result,
          validation,
          version: versionHeader,
        });
      }

      return NextResponse.json({ success: false, errors: result.errors }, { status: 400 });
    }

    if (body.message && typeof body.message === 'string') {
      const simpleIntent = messageToIntent(body.message);
      const result = translator.translate(simpleIntent);

      return NextResponse.json({
        success: result.success,
        result: result.success ? result : undefined,
        errors: result.success ? undefined : result.errors,
        version: versionHeader,
      });
    }

    return NextResponse.json(
      { success: false, errors: [{ message: 'Provide an "intent" object or a "message" string' }] },
      { status: 400 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ success: false, errors: [{ message }] }, { status: 500 });
  }
}

/**
 * Naive NLP: maps a plain-text message to a structured AiIntent.
 * In production, this would be replaced by a Gemini API call.
 */
function messageToIntent(message: string): Record<string, unknown> {
  const lower = message.toLowerCase();

  if (lower.includes('create') || lower.includes('build') || lower.includes('make')) {
    const nameMatch = message.match(/(?:called?|named?)\s+"([^"]+)"/i) ??
                      message.match(/(?:create|build|make)\s+(?:a\s+)?(.+?)(?:\s+store|\s+shop|$)/i);

    return {
      intent: 'create-store',
      storeName: nameMatch?.[1]?.trim() ?? 'My Store',
      storeDescription: message,
      theme: lower.includes('dark') ? 'dark' : 'light',
      layout: lower.includes('hero') ? 'hero-with-catalog' : 'grid-catalog',
      products: [],
    };
  }

  return {
    intent: 'create-store',
    storeName: 'My Store',
    storeDescription: message,
    theme: 'light',
    layout: 'grid-catalog',
    products: [],
  };
}
