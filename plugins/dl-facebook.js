const axios = require("axios");
const { cmd } = require('../command');

cmd({
  pattern: "facebook",
  alias: ["fb"], 
  desc: "Download Facebook videos",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, quoted, q, reply }) => {
  try {
    if (!q || !q.startsWith("https://")) {
      return conn.sendMessage(from, { text: "❌ Please provide a valid Facebook video URL." }, { quoted: m });
    }

    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // ✅ Fetching data from Aswin API
    const apiUrl = `https://api-aswin-sparky.koyeb.app/api/downloader/fbdl?url=${encodeURIComponent(q)}`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data?.status || !data?.data) {
      return reply("⚠️ Failed to retrieve Facebook media. Please check the link and try again.");
    }

    const { title, thumbnail, low, high } = data.data;

    const caption = `
📺 *Facebook Downloader.* 📥

📑 *Title:* ${title || "No title"}
🔗 *Link:* ${q}

🔢 *Reply Below Number*

1️⃣ *SD Quality*🪫
2️⃣ *HD Quality*🔋
3️⃣ *Audio (MP3)*🎶

> Powered by 𝙳𝙰𝚁𝙺-𝙰𝚂𝙷𝙴𝙽-𝚇𝙼𝙳`;

    const sentMsg = await conn.sendMessage(from, {
      image: { url: thumbnail },
      caption
    }, { quoted: m });

    const messageID = sentMsg.key.id;

    // 🧠 Interactive Reply System
    conn.ev.on("messages.upsert", async (msgData) => {
      const receivedMsg = msgData.messages[0];
      if (!receivedMsg?.message) return;

      const receivedText = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
      const senderID = receivedMsg.key.remoteJid;
      const isReplyToBot = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

      if (isReplyToBot) {
        await conn.sendMessage(senderID, { react: { text: '⏳', key: receivedMsg.key } });

        switch (receivedText.trim()) {
          case "1":
            await conn.sendMessage(senderID, {
              video: { url: low },
              caption: "📥 *Downloaded in SD Quality*"
            }, { quoted: receivedMsg });
            break;

          case "2":
            await conn.sendMessage(senderID, {
              video: { url: high },
              caption: "📥 *Downloaded in HD Quality*"
            }, { quoted: receivedMsg });
            break;

          case "3": 
            await conn.sendMessage(senderID, { 
              audio: { url: low || high }, 
              mimetype: "audio/mp4", 
              ptt: false 
          }, { quoted: receivedMsg }); 
          break;
            
           default:
            reply("❌ Invalid option! Please reply with 1, 2, or 3.");
        }
      }
    });

  } catch (error) {
    console.error("Facebook Plugin Error:", error);
    reply("❌ An error occurred while processing your request. Please try again later.");
  }
});


cmd({
  pattern: "tiktok",
  alias: ["tt"],
  desc: "Download TikTok videos",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, quoted, q, reply }) => {
  try {
    if (!q || !q.startsWith("https://")) {
      return conn.sendMessage(from, { text: "❌ Please provide a valid TikTok URL." }, { quoted: m });
    }

    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // ✅ Using Delirius API (new structure)
    const response = await axios.get(`https://delirius-apiofc.vercel.app/download/tiktok?url=${q}`);
    const res = response.data;

    if (!res || !res.status || !res.data) {
      return reply("⚠️ Failed to fetch TikTok media. Please check the link and try again.");
    }

    const videoData = res.data;
    const media = videoData.meta.media?.[0] || {};

    const title = videoData.title || "No title";
    const wm = media.wm;
    const hd = media.hd;
    const org = media.org;

    const thumbnail = "https://files.catbox.moe/36ndl3.jpg";
    
    const caption = `
📺 Tiktok Downloader. 📥
    
📑 *Title:* ${title || "No Title"}
⏱️ *Duration:* ${videoData.duration || "Unknown"}s
👍 *Likes:* ${videoData.like || "0"}
💬 *Comments:* ${videoData.comment || "0"}
🔁 *Shares:* ${videoData.share || "0"}
📥 *Downloads:* ${videoData.download || "0"}

🔢 *Reply Below Number*

1️⃣  *With Watermark* 🎫
2️⃣  *No Watermark (HD)* 🎟️
3️⃣  *Original Quality* 📼
4️⃣  *Audio (MP3)*🎶

> Powered by 𝙳𝙰𝚁𝙺-𝙰𝚂𝙷𝙴𝙽-𝚇𝙼𝙳`;

    // Send preview (if thumbnail unavailable, fallback to caption only)
    const sentMsg = await conn.sendMessage(from, {
      image: { url: thumbnail },
      caption
    }, { quoted: m });
    
    const messageID = sentMsg.key.id;

    // 🧠 Handle reply selector
    conn.ev.on("messages.upsert", async (msgData) => {
      const receivedMsg = msgData.messages[0];
      if (!receivedMsg?.message) return;

      const receivedText = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
      const senderID = receivedMsg.key.remoteJid;
      const isReplyToBot = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

      if (isReplyToBot) {
        await conn.sendMessage(senderID, { react: { text: '⏳', key: receivedMsg.key } });

        switch (receivedText.trim()) {
          case "1":
            await conn.sendMessage(senderID, {
              video: { url: wm },
              caption: "📥 *Downloaded With Watermark*"
            }, { quoted: receivedMsg });
            break;

          case "2":
            await conn.sendMessage(senderID, {
              video: { url: hd },
              caption: "📥 *Downloaded No Watermark (HD)*"
            }, { quoted: receivedMsg });
            break;

          case "3":
            await conn.sendMessage(senderID, {
              video: { url: org },
              caption: "📥 *Downloaded Original Quality*"
            }, { quoted: receivedMsg });
            break;

          case "4":
            await conn.sendMessage(senderID, {
              audio: { url: wm || hd },
              mimetype: "audio/mp4",
              ptt: false
            }, { quoted: receivedMsg });
            break;      
          
          default:
            reply("❌ Invalid option! Please reply with 1, 2, 3, or 4.");
        }
      }
    });

  } catch (error) {
    console.error("TikTok Plugin Error:", error);
    reply("❌ An error occurred while processing your request. Please try again later.");
  }
});
