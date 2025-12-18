const axios = require("axios");
const crypto = require("crypto");

const chat = async (prompt, chatId = null, webSearch = false) => {
  return new Promise(async (resolve, reject) => {
    const payload = {
      stream: true,
      chatId: chatId, // Menggunakan chatId jika ada
      message: {
        role: "user",
        content: prompt,
        messageId: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        files: [],
      },
      product: "ai-chat",
      originUrl: "/ai-chat",
      prompt: { id: "ai_chat" },
      tools: webSearch ? ["web_search"] : [], // Mode Web Search
    };

    try {
      const res = await axios.post(
        "https://quillbot.com/api/raven/quill-chat/responses",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
            useridtoken: "empty-token",
            "webapp-version": "38.36.1",
            "platform-type": "webapp",
            "qb-product": "ai-chat",
            Origin: "https://quillbot.com",
            Referer: "https://quillbot.com/ai-chat",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
          },
          responseType: "stream",
          decompress: false,
        }
      );

      let buffer = "";
      let finalText = "";
      let finalChatId = chatId;

      res.data.on("data", (chunk) => {
        buffer += chunk.toString("utf8");

        let idx;
        while ((idx = buffer.indexOf("\n\n")) !== -1) {
          const rawEvent = buffer.slice(0, idx).trim();
          buffer = buffer.slice(idx + 2);

          const dataLine = rawEvent.split("\n").find((l) => l.startsWith("data:"));

          if (!dataLine) continue;

          const jsonStr = dataLine.replace("data:", "").trim();

          try {
            const json = JSON.parse(jsonStr);
            if (json.chatId) finalChatId = json.chatId;
            if (json.chunk) finalText += json.chunk;
            if (json.text) finalText = json.text;
          } catch {}
        }
      });

      res.data.on("end", () => {
        resolve({
          success: true,
          chatId: finalChatId,
          answer: finalText.trim(),
        });
      });

      res.data.on("error", (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { chat };
