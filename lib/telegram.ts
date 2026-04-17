interface TelegramMessage {
  name: string;
  message: string;
}

export async function sendTelegramMessage({ name, message }: TelegramMessage): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error("Telegram credentials chưa được cấu hình");
  }

  const timestamp = new Date().toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    dateStyle: "short",
    timeStyle: "short",
  });

  const text = `💌 *Tin nhắn mới từ Digital Profile*\n\n👤 *Từ*: ${escapeMarkdown(name)}\n🕐 *Thời gian*: ${timestamp}\n\n📝 *Nội dung*:\n${escapeMarkdown(message)}`;

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Telegram API lỗi: ${error}`);
  }
}

// Escape các ký tự đặc biệt trong Markdown của Telegram
function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}
