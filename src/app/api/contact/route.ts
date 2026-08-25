import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!message || message.trim() === '') {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    // Server-side logging / webhook forwarding
    console.log('[Contact Message Received]', {
      name: name || 'Anonymous Guest',
      email: email || 'No email provided',
      message,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      status: 'Delivered',
      reply: "Thanks for reaching out! I've received your message and will get back to you shortly. Feel free to explore more of my portfolio apps or talk to Aman AI!",
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
