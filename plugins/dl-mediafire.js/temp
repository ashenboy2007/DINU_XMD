const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "mediafire",
  alias: ["mfire"],
  react: '📂',
  desc: "Download files from MediaFire using Sadiya-Tech API.",
  category: "download",
  use: ".mediafire <MediaFire URL>",
  filename: __filename
}, async (conn, mek, m, { from, reply, args, q }) => {
  try {
    if (!q) {
      return reply('⚠️ Please provide a MediaFire URL.\n\nExample:\n`.mediafire https://www.mediafire.com/file/...`');
    }

    // Add a reaction while processing
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // Build the API URL
    const apiUrl = `https://sadiya-tech-apis.vercel.app/download/mfiredl?url=${encodeURIComponent(q)}&apikey=YOU_API_KEY`;

    // Fetch from API
    const { data } = await axios.get(apiUrl);

    // Validate response
    if (!data.status || !data.result || !data.result.dl_link) {
      return reply('❌ Unable to fetch the file. Please try again later or check the URL.');
    }

    // Extract details
    const { fileName, date, fileType, size, dl_link } = data.result;

    // Inform user
    await reply(`📥 *Downloading:* ${fileName}\n*Size:* ${size}\nPlease wait...`);

    // Download file
    const fileResponse = await axios.get(dl_link, { responseType: 'arraybuffer' });

    // Send file
    await conn.sendMessage(from, {
      document: fileResponse.data,
      mimetype: fileType || 'application/octet-stream',
      fileName: fileName,
      caption: `📂 *File Name:* ${fileName}\n📦 *Size:* ${size}\n📅 *Uploaded:* ${date}\n`,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363400240662312@newsletter',
          newsletterName: '『 𝙳𝙰𝚁𝙺-𝙰𝚂𝙷𝙴𝙽-𝚇𝙼𝙳 』',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

    // Success reaction
    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

  } catch (error) {
    console.error('Error downloading file:', error);
    reply('❌ Error downloading the file. Please check the link or try again later.');
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
  }
});
