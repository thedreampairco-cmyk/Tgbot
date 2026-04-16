require('dotenv').config();
const { Telegraf } = require('telegraf');
const express = require('express'); // Added Express

const bot = new Telegraf(process.env.BOT_TOKEN);
const ADMIN_ID = process.env.ADMIN_ID;
const UPI_ID = process.env.UPI_ID;

// --- 1. DUMMY WEB SERVER (To keep Render happy) ---
const app = express();
app.get('/', (req, res) => res.send('Bot is running!'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Web server listening on port ${PORT}`));

// --- 2. SEND PAYMENT DETAILS ---
bot.start((ctx) => {
    ctx.reply(
        `Welcome to the VIP Movie Channel! 🎬\n\n` +
        `To get your private access link:\n` +
        `1. Pay exactly ₹19 to this UPI ID: \`${UPI_ID}\`\n` +
        `2. Send a screenshot of the successful payment directly to me here.`,
        { parse_mode: 'Markdown' }
    );
});

// --- 3. COLLECT & FORWARD SCREENSHOTS ---
bot.on('photo', async (ctx) => {
    const userId = ctx.from.id;
    const username = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;
    
    ctx.reply("✅ Screenshot received! Please wait while your payment is verified. Your channel link will be sent here shortly.");

    const photoId = ctx.message.photo[ctx.message.photo.length - 1].file_id;

    await bot.telegram.sendPhoto(ADMIN_ID, photoId, {
        caption: `🔔 NEW SCREENSHOT!\n\nFrom: ${username} (ID: ${userId})\n\nCheck your bank. If they paid, manually send them the channel link.`
    });
});

bot.launch().then(() => console.log('🚀 Simple Receptionist Bot is running!'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
