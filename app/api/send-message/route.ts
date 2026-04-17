import { NextRequest, NextResponse } from "next/server";
import { sendTelegramMessage } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { name?: string; message?: string };
    const { name, message } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "Tên không được để trống" }, { status: 400 });
    }

    if (!message?.trim() || message.trim().length < 5) {
      return NextResponse.json(
        { error: "Nội dung phải có ít nhất 5 ký tự" },
        { status: 400 }
      );
    }

    await sendTelegramMessage({ name: name.trim(), message: message.trim() });

    return NextResponse.json({ success: true, message: "Gửi thành công!" });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json({ error: "Có lỗi xảy ra, thử lại sau" }, { status: 500 });
  }
}
