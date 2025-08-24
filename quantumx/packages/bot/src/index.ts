import 'dotenv/config';
import { Telegraf, Markup } from 'telegraf';
import express from 'express';

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBAPP_URL = process.env.WEBAPP_URL || 'https://example.com';
if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN is required');
}

const bot = new Telegraf(BOT_TOKEN);

bot.start(async (ctx) => {
  await ctx.reply(
    'Welcome to QuantumX — cyber platform reimagined. Developed by SHADOW and COMPANY.',
    Markup.inlineKeyboard([
      [Markup.button.webApp('Open QuantumX', WEBAPP_URL)],
      [Markup.button.callback('Profile', 'profile'), Markup.button.callback('Balance', 'balance')],
    ])
  );
});

bot.command('profile', async (ctx) => ctx.reply('Your QuantumX profile'));
bot.command('balance', async (ctx) => ctx.reply('Balance: 1000 ST'));
bot.command('help', async (ctx) => ctx.reply('Commands: /start /profile /balance /help'));

bot.action('profile', async (ctx) => ctx.reply('Your QuantumX profile'));
bot.action('balance', async (ctx) => ctx.reply('Balance: 1000 ST'));

// Health endpoint & webhook-ready express app
const app = express();
app.get('/health', (_, res) => res.json({ status: 'ok', service: 'quantumx-bot' }));

const PORT = Number(process.env.PORT || 3001);
app.listen(PORT, () => {
  console.log(`Health server on :${PORT}`);
});

bot.launch().then(() => console.log('QuantumX bot launched')).catch(console.error);

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
