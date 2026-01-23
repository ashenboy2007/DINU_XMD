const { cmd } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');
const config = require('../config');

cmd({
    pattern: "alive",
    desc: "Check bot is alive or not",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        const status = `
╭──〔 🤖 *💞𝙰𝚕𝚒𝚟𝚎 𝚂𝚃𝙰𝚃𝚄𝚂💥* 〕──◉
│
│ ✨ _𝐵𝑜𝑡 𝐼𝑠 𝐴𝑐𝑡𝑖𝑣𝑒 & 𝑂𝑛𝑙𝑖𝑛𝑒.🫦☠️!_
│
│  👑 𝐎𝐖𝐍𝐄𝐑: ${config.OWNER_NAME}
│  💫 𝐕𝐄𝐑𝐒𝐈𝐎𝐍: 2.0.0
│ 🗯️ 𝐏𝐑𝐄𝐅𝐈𝐗: [${config.PREFIX}]
│ 🌬️ 𝐌𝐎𝐃𝐄: [${config.MODE}]
│ 💽 𝐑𝐀𝐌: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB
│ 🌬️ 𝐇𝐎𝐒𝐓: ${os.hostname()}
│ ⏲️𝐔𝐏𝐓𝐈𝐌𝐄: ${runtime(process.uptime())}
╰───────────────◉
> ${config.DESCRIPTION}`;

       // Fake VCard
        const FakeVCard = {
      key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
      },
      message: {
        contactMessage: {
          displayName: "© 𝙳𝙰𝚁𝙺-𝙰𝚂𝙷𝙴𝙽",
          vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:Meta\nORG:META AI;\nTEL;type=CELL;type=VOICE;waid=13135550002:+13135550002\nEND:VCARD`
        }
      }
    };      
        
        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL },
            caption: status,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 1000,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363400240662312@newsletter',
                    newsletterName: '𝙳𝙰𝚁𝙺-𝙰𝚂𝙷𝙴𝙽-𝚇𝙼𝙳',
                    serverMessageId: 143
                }
            }
        }, { quoted: FakeVCard });

    } catch (e) {
        console.error("Alive Error:", e);
        reply(`An error occurred: ${e.message}`);
    }
});
