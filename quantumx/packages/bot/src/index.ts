import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Telegraf, Markup } from 'telegraf';
import {
  initialProvablyFairState,
  generateServerSeed,
  sha256Hex,
  playDice,
  playCoinFlip,
  playCrash,
  playSlots,
  playRoulette,
  generateMines,
  getBalances,
  claimDailyBonus,
  exchangeToCoins,
  exchangeToSt,
  credit,
  debit,
  searchEmail,
  searchPhone,
  searchTelegramId,
  analyzeDomain,
  analyzeIp,
  createProject,
  getProject,
  getUserProjects,
  updateProject,
  deleteProject,
  addTask,
  updateTask,
  deleteTask,
  getProjectStats,
} from '@quantumx/shared';

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBAPP_URL = process.env.WEBAPP_URL || 'https://example.com';
const DEFAULT_LOCALE = process.env.LOCALE || 'uk';
if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN is required');
}

const bot = new Telegraf(BOT_TOKEN);
const app = express();
app.use(cors());
app.use(express.json());

let pf = initialProvablyFairState();

// Health & provably-fair
app.get('/health', (_, res) => res.json({ status: 'ok', service: 'quantumx-bot', serverSeedHash: pf.serverSeedHash, nonce: pf.nonce }));
app.get('/pf/state', (_, res) => res.json({ serverSeedHash: pf.serverSeedHash, nonce: pf.nonce }));
app.post('/pf/rotate', (_, res) => {
  const previous = { serverSeed: pf.serverSeed, serverSeedHash: pf.serverSeedHash, finalNonce: pf.nonce };
  const serverSeed = generateServerSeed();
  pf = { serverSeed, serverSeedHash: sha256Hex(serverSeed), nonce: 0 };
  res.json({ previous, next: { serverSeedHash: pf.serverSeedHash, nonce: pf.nonce } });
});

// Economy
app.get('/economy/balances', (req, res) => {
  const userId = String(req.query.userId || 'anon');
  res.json(getBalances(userId));
});
app.post('/economy/daily', (req, res) => {
  try {
    const { userId } = req.body as { userId: string };
    const result = claimDailyBonus(userId);
    res.json({ ok: true, result, balances: getBalances(userId) });
  } catch (e: any) {
    res.status(400).json({ ok: false, error: e.message });
  }
});
app.post('/economy/exchange', (req, res) => {
  try {
    const { userId, direction, amount } = req.body as { userId: string; direction: 'ST_TO_COINS' | 'COINS_TO_ST'; amount: number };
    if (direction === 'ST_TO_COINS') exchangeToCoins(userId, amount); else exchangeToSt(userId, amount);
    res.json({ ok: true, balances: getBalances(userId) });
  } catch (e: any) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

// Projects
app.get('/projects', (req, res) => {
  try {
    const userId = String(req.query.userId || 'anon');
    const projects = getUserProjects(userId);
    res.json({ ok: true, projects });
  } catch (e: any) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

app.post('/projects', (req, res) => {
  try {
    const { userId, title, description } = req.body as { userId: string; title: string; description?: string };
    const project = createProject(userId, title, description);
    res.json({ ok: true, project });
  } catch (e: any) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

app.get('/projects/:projectId', (req, res) => {
  try {
    const userId = String(req.query.userId || 'anon');
    const { projectId } = req.params;
    const project = getProject(userId, projectId);
    if (!project) {
      return res.status(404).json({ ok: false, error: 'Project not found' });
    }
    res.json({ ok: true, project });
  } catch (e: any) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

app.put('/projects/:projectId', (req, res) => {
  try {
    const { userId, title, description, status } = req.body as { userId: string; title?: string; description?: string; status?: 'active' | 'completed' | 'archived' };
    const { projectId } = req.params;
    const project = updateProject(userId, projectId, { title, description, status });
    res.json({ ok: true, project });
  } catch (e: any) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

app.delete('/projects/:projectId', (req, res) => {
  try {
    const userId = String(req.query.userId || 'anon');
    const { projectId } = req.params;
    const deleted = deleteProject(userId, projectId);
    if (!deleted) {
      return res.status(404).json({ ok: false, error: 'Project not found' });
    }
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

app.post('/projects/:projectId/tasks', (req, res) => {
  try {
    const { userId, title, description } = req.body as { userId: string; title: string; description?: string };
    const { projectId } = req.params;
    const task = addTask(userId, projectId, title, description);
    res.json({ ok: true, task });
  } catch (e: any) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

app.put('/projects/:projectId/tasks/:taskId', (req, res) => {
  try {
    const { userId, title, description, completed } = req.body as { userId: string; title?: string; description?: string; completed?: boolean };
    const { projectId, taskId } = req.params;
    const task = updateTask(userId, projectId, taskId, { title, description, completed });
    res.json({ ok: true, task });
  } catch (e: any) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

app.delete('/projects/:projectId/tasks/:taskId', (req, res) => {
  try {
    const userId = String(req.query.userId || 'anon');
    const { projectId, taskId } = req.params;
    const deleted = deleteTask(userId, projectId, taskId);
    if (!deleted) {
      return res.status(404).json({ ok: false, error: 'Task not found' });
    }
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

app.get('/projects/stats', (req, res) => {
  try {
    const userId = String(req.query.userId || 'anon');
    const stats = getProjectStats(userId);
    res.json({ ok: true, stats });
  } catch (e: any) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

// OSINT v2 (lawful/public-only stubs)
app.post('/osint/search', async (req, res) => {
  try {
    const { type, query } = req.body as { type: 'email'|'phone'|'tg-id'|'domain'|'ip'; query: string };
    let data;
    if (type === 'email') data = await searchEmail(query);
    else if (type === 'phone') data = await searchPhone(query);
    else if (type === 'tg-id') data = await searchTelegramId(query);
    else if (type === 'domain') data = await analyzeDomain(query);
    else if (type === 'ip') data = await analyzeIp(query);
    else throw new Error('Unsupported type');
    res.json({ ok: true, data });
  } catch (e: any) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

// Games
app.post('/games/dice', (req, res) => {
  try {
    const { userId, clientSeed, bet, target, threshold } = req.body as { userId: string; clientSeed: string; bet: number; target: 'UNDER'|'OVER'; threshold: number };
    const before = getBalances(userId);
    if (bet <= 0) throw new Error('Invalid bet');
    if (before.coins < bet) throw new Error('Insufficient Coins');
    debit(userId, bet, 'COINS', { game: 'dice' });
    const result = playDice(pf.serverSeedHash, pf.serverSeed, clientSeed, pf.nonce++);
    let win = false;
    let payout = 0;
    if (target === 'UNDER') {
      win = result.roll < threshold;
      const mult = 0.98 * (99 / threshold);
      payout = win ? Math.floor(bet * mult) : 0;
    } else {
      win = result.roll > threshold;
      const mult = 0.98 * (99 / (100 - threshold));
      payout = win ? Math.floor(bet * mult) : 0;
    }
    if (payout > 0) credit(userId, payout, 'COINS', { game: 'dice' });
    res.json({ ok: true, result, win, payout, balances: getBalances(userId) });
  } catch (e: any) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

app.post('/games/coinflip', (req, res) => {
  try {
    const { userId, clientSeed, bet, pick } = req.body as { userId: string; clientSeed: string; bet: number; pick: 'HEADS'|'TAILS' };
    const before = getBalances(userId);
    if (bet <= 0) throw new Error('Invalid bet');
    if (before.coins < bet) throw new Error('Insufficient Coins');
    debit(userId, bet, 'COINS', { game: 'coinflip' });
    const r = playCoinFlip(pf.serverSeedHash, pf.serverSeed, clientSeed, pf.nonce++);
    const win = r.side === pick;
    const payout = win ? Math.floor(bet * 1.96) : 0;
    if (payout > 0) credit(userId, payout, 'COINS', { game: 'coinflip' });
    res.json({ ok: true, result: r, win, payout, balances: getBalances(userId) });
  } catch (e: any) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

app.post('/games/slots', (req, res) => {
  try {
    const { userId, clientSeed, bet } = req.body as { userId: string; clientSeed: string; bet: number };
    const before = getBalances(userId);
    if (bet <= 0) throw new Error('Invalid bet');
    if (before.coins < bet) throw new Error('Insufficient Coins');
    debit(userId, bet, 'COINS', { game: 'slots' });
    const r = playSlots(pf.serverSeedHash, pf.serverSeed, clientSeed, pf.nonce); pf.nonce += 3;
    const payout = r.payoutMultiplier > 0 ? Math.floor(bet * r.payoutMultiplier) : 0;
    if (payout > 0) credit(userId, payout, 'COINS', { game: 'slots', symbols: r.reels });
    res.json({ ok: true, result: r, payout, balances: getBalances(userId) });
  } catch (e: any) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

app.post('/games/crash/sim', (req, res) => {
  try {
    const { clientSeed } = req.body as { clientSeed: string };
    const r = playCrash(pf.serverSeedHash, pf.serverSeed, clientSeed, pf.nonce++);
    res.json({ ok: true, result: r });
  } catch (e: any) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

app.post('/games/roulette/sim', (req, res) => {
  try {
    const { clientSeed } = req.body as { clientSeed: string };
    const r = playRoulette(pf.serverSeedHash, pf.serverSeed, clientSeed, pf.nonce++);
    res.json({ ok: true, result: r });
  } catch (e: any) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

app.post('/games/mines/sim', (req, res) => {
  try {
    const { clientSeed, size, mines } = req.body as { clientSeed: string; size?: number; mines?: number };
    const r = generateMines(pf.serverSeedHash, pf.serverSeed, clientSeed, pf.nonce++, size ?? 25, mines ?? 3);
    res.json({ ok: true, result: r });
  } catch (e: any) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

// Group analytics & moderation (basic)
type ChatId = number;
interface ChatStats { messages: number; users: Map<number, number>; links: number; }
const chatStats = new Map<ChatId, ChatStats>();

function ensureStats(chatId: number): ChatStats {
  if (!chatStats.has(chatId)) chatStats.set(chatId, { messages: 0, users: new Map(), links: 0 });
  return chatStats.get(chatId)!;
}

bot.on('message', async (ctx) => {
  const chat = ctx.chat; if (!chat || (chat.type !== 'group' && chat.type !== 'supergroup')) return;
  const s = ensureStats(chat.id);
  s.messages += 1;
  const uid = ctx.from?.id; if (uid) s.users.set(uid, (s.users.get(uid) || 0) + 1);
  const text = 'text' in ctx.message ? ctx.message.text || '' : '';
  if (/(https?:\/\/|t\.me\/)/i.test(text)) s.links += 1;
});

bot.command('INSIGHTS', async (ctx) => {
  const chat = ctx.chat; if (!chat) return;
  const s = chatStats.get(chat.id);
  if (!s) return ctx.reply('ЩЕ НЕМАЄ ДАНИХ ДЛЯ АНАЛІТИКИ.');
  const topUsers = [...s.users.entries()].sort((a,b)=>b[1]-a[1]).slice(0,5).map(([id,c])=>`• ${id}: ${c}`).join('\n');
  await ctx.reply(`АНАЛІТИКА ЧАТУ\nПОВІДОМЛЕНЬ: ${s.messages}\nЛІНКІВ: ${s.links}\nТОП УЧАСНИКИ:\n${topUsers}`);
});

bot.command('MUTE', async (ctx) => {
  try {
    const chat = ctx.chat; if (!chat || (chat.type !== 'group' && chat.type !== 'supergroup')) return;
    const parts = (ctx.message as any).text.split(/\s+/);
    const username = parts[1]; const duration = parts[2] || '10m';
    if (!username) return ctx.reply('ФОРМАТ: /MUTE @USER 10M');
    const until = Math.floor(Date.now()/1000) + (duration.toLowerCase().endsWith('m') ? parseInt(duration)*60 : parseInt(duration));
    const member = await ctx.telegram.getChatMember(chat.id, username);
    await ctx.telegram.restrictChatMember(chat.id, member.user.id, { permissions: { can_send_messages: false }, until_date: until });
    await ctx.reply(`MUTED ${username} ДО ${duration.toUpperCase()}`);
  } catch {
    await ctx.reply('НЕ ВДАЛОСЯ ВИКОНАТИ MUTE. ПЕРЕВІРТЕ ПРАВА.');
  }
});

bot.command('BAN', async (ctx) => {
  try {
    const chat = ctx.chat; if (!chat || (chat.type !== 'group' && chat.type !== 'supergroup')) return;
    const parts = (ctx.message as any).text.split(/\s+/);
    const username = parts[1]; if (!username) return ctx.reply('ФОРМАТ: /BAN @USER [ПРИЧИНА]');
    const member = await ctx.telegram.getChatMember(chat.id, username);
    await ctx.telegram.banChatMember(chat.id, member.user.id);
    await ctx.reply(`BANNED ${username}`);
  } catch {
    await ctx.reply('НЕ ВДАЛОСЯ ВИКОНАТИ BAN. ПЕРЕВІРТЕ ПРАВА.');
  }
});

// Start & commands (uppercase buttons)
bot.start(async (ctx) => {
  const url = WEBAPP_URL;
  await ctx.reply(
    'QuantumX — кібер‑платформа нового покоління. Розроблено SHADOW AND COMPANY.',
    Markup.inlineKeyboard([
      [Markup.button.webApp('OPEN QUANTUMX', url)],
      [Markup.button.callback('PROFILE', 'profile'), Markup.button.callback('BALANCE', 'balance')],
      [Markup.button.callback('DAILY BONUS', 'bonus'), Markup.button.callback('GAMES', 'games')],
      [Markup.button.callback('PROJECTS', 'projects')],
    ])
  );
});

bot.command('profile', async (ctx) => ctx.reply('ВАШ ПРОФІЛЬ QUANTUMX'));

bot.command('help', async (ctx) => {
  const helpText = `📋 ДОСТУПНІ КОМАНДИ QUANTUMX:

👤 ПРОФІЛЬ:
/profile - Ваш профіль
/balance - Перевірити баланс
/bonus - Отримати щоденний бонус

📊 ПРОЕКТИ:
/projects - Список ваших проектів
/newproject НАЗВА - Створити новий проект
/project ID - Деталі проекту
/addtask PROJECT_ID НАЗВА - Додати завдання
/complete PROJECT_ID TASK_ID - Виконати завдання
/projectstats - Статистика проектів

🔧 АДМІНІСТРУВАННЯ:
/INSIGHTS - Аналітика чату
/MUTE @USER - Замутити користувача
/BAN @USER - Забанити користувача

💡 Використайте WebApp для повного функціоналу!`;
  
  await ctx.reply(helpText);
});

bot.command('balance', async (ctx) => {
  const userId = String(ctx.from?.id || 'anon');
  const b = getBalances(userId);
  await ctx.reply(`БАЛАНС ST=${b.st} | COINS=${b.coins}`);
});

bot.action('profile', async (ctx) => ctx.reply('ВАШ ПРОФІЛЬ QUANTUMX'));
bot.action('balance', async (ctx) => {
  const userId = String(ctx.from?.id || 'anon');
  const b = getBalances(userId);
  await ctx.reply(`БАЛАНС ST=${b.st} | COINS=${b.coins}`);
});

bot.command('bonus', async (ctx) => {
  const userId = String(ctx.from?.id || 'anon');
  try {
    const result = claimDailyBonus(userId);
    const b = getBalances(userId);
    await ctx.reply(`BONUS +${result.awarded} ST. BALANCE ST=${b.st}`);
  } catch (e: any) {
    await ctx.reply(`BONUS ERROR: ${e.message}`);
  }
});

bot.action('bonus', async (ctx) => {
  const userId = String(ctx.from?.id || 'anon');
  try {
    const result = claimDailyBonus(userId);
    const b = getBalances(userId);
    await ctx.reply(`BONUS +${result.awarded} ST. BALANCE ST=${b.st}`);
  } catch {
    await ctx.reply('BONUS ALREADY CLAIMED TODAY');
  }
});

bot.action('games', async (ctx) => {
  await ctx.reply('ВІДКРИЙТЕ РОЗДІЛ GAMES У WEBAPP.');
});

bot.action('projects', async (ctx) => {
  const userId = String(ctx.from?.id || 'anon');
  try {
    const projects = getUserProjects(userId);
    if (projects.length === 0) {
      await ctx.reply('У ВАС НЕМАЄ ПРОЕКТІВ.\nВикористайте /newproject НАЗВА для створення нового проекту.');
      return;
    }
    
    const projectList = projects.slice(0, 5).map(p => 
      `📋 ${p.title}\n   📊 ${p.completedTasks}/${p.taskCount} завдань\n   📅 ${p.status.toUpperCase()}`
    ).join('\n\n');
    
    await ctx.reply(`ВАШІ ПРОЕКТИ:\n\n${projectList}\n\nВикористайте /projects для повного списку`);
  } catch (e: any) {
    await ctx.reply(`ПОМИЛКА: ${e.message}`);
  }
});

// Project Management Commands
bot.command('projects', async (ctx) => {
  const userId = String(ctx.from?.id || 'anon');
  try {
    const projects = getUserProjects(userId);
    if (projects.length === 0) {
      await ctx.reply('У ВАС НЕМАЄ ПРОЕКТІВ.\nВикористайте /newproject НАЗВА для створення нового проекту.');
      return;
    }
    
    const projectList = projects.map(p => 
      `📋 ${p.title}\n   📊 ${p.completedTasks}/${p.taskCount} завдань\n   📅 ${p.status.toUpperCase()}`
    ).join('\n\n');
    
    await ctx.reply(`ВАШІ ПРОЕКТИ:\n\n${projectList}\n\nВикористайте /project ID для деталей`);
  } catch (e: any) {
    await ctx.reply(`ПОМИЛКА: ${e.message}`);
  }
});

bot.command('newproject', async (ctx) => {
  const userId = String(ctx.from?.id || 'anon');
  try {
    const parts = (ctx.message as any).text.split(/\s+/);
    const title = parts.slice(1).join(' ');
    
    if (!title) {
      await ctx.reply('ФОРМАТ: /newproject НАЗВА ПРОЕКТУ');
      return;
    }
    
    const project = createProject(userId, title);
    await ctx.reply(`✅ ПРОЕКТ СТВОРЕНО!\n\n📋 ${project.title}\n🆔 ${project.id}\n\nВикористайте /addtask ${project.id} НАЗВА для додавання завдань`);
  } catch (e: any) {
    await ctx.reply(`ПОМИЛКА: ${e.message}`);
  }
});

bot.command('project', async (ctx) => {
  const userId = String(ctx.from?.id || 'anon');
  try {
    const parts = (ctx.message as any).text.split(/\s+/);
    const projectId = parts[1];
    
    if (!projectId) {
      await ctx.reply('ФОРМАТ: /project ID');
      return;
    }
    
    const project = getProject(userId, projectId);
    if (!project) {
      await ctx.reply('ПРОЕКТ НЕ ЗНАЙДЕНО');
      return;
    }
    
    const taskList = project.tasks.length > 0 
      ? project.tasks.map(t => `${t.completed ? '✅' : '⭕'} ${t.title}`).join('\n')
      : 'Немає завдань';
    
    await ctx.reply(`📋 ${project.title}\n\nЗАВДАННЯ:\n${taskList}\n\n📊 Статус: ${project.status.toUpperCase()}\n🆔 ${project.id}`);
  } catch (e: any) {
    await ctx.reply(`ПОМИЛКА: ${e.message}`);
  }
});

bot.command('addtask', async (ctx) => {
  const userId = String(ctx.from?.id || 'anon');
  try {
    const parts = (ctx.message as any).text.split(/\s+/);
    const projectId = parts[1];
    const taskTitle = parts.slice(2).join(' ');
    
    if (!projectId || !taskTitle) {
      await ctx.reply('ФОРМАТ: /addtask PROJECT_ID НАЗВА ЗАВДАННЯ');
      return;
    }
    
    const task = addTask(userId, projectId, taskTitle);
    await ctx.reply(`✅ ЗАВДАННЯ ДОДАНО!\n\n📝 ${task.title}\n🆔 ${task.id}\n\nВикористайте /complete ${projectId} ${task.id} для позначення як виконане`);
  } catch (e: any) {
    await ctx.reply(`ПОМИЛКА: ${e.message}`);
  }
});

bot.command('complete', async (ctx) => {
  const userId = String(ctx.from?.id || 'anon');
  try {
    const parts = (ctx.message as any).text.split(/\s+/);
    const projectId = parts[1];
    const taskId = parts[2];
    
    if (!projectId || !taskId) {
      await ctx.reply('ФОРМАТ: /complete PROJECT_ID TASK_ID');
      return;
    }
    
    const task = updateTask(userId, projectId, taskId, { completed: true });
    await ctx.reply(`🎉 ЗАВДАННЯ ВИКОНАНО!\n\n✅ ${task.title}`);
  } catch (e: any) {
    await ctx.reply(`ПОМИЛКА: ${e.message}`);
  }
});

bot.command('projectstats', async (ctx) => {
  const userId = String(ctx.from?.id || 'anon');
  try {
    const stats = getProjectStats(userId);
    await ctx.reply(`📊 СТАТИСТИКА ПРОЕКТІВ:\n\n📋 Всього проектів: ${stats.totalProjects}\n🟢 Активних: ${stats.activeProjects}\n✅ Виконаних завдань: ${stats.completedTasks}/${stats.totalTasks}\n📈 Прогрес: ${stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%`);
  } catch (e: any) {
    await ctx.reply(`ПОМИЛКА: ${e.message}`);
  }
});

const PORT = Number(process.env.PORT || 3001);
app.listen(PORT, () => {
  console.log(`Health server on :${PORT}`);
});

bot.launch().then(() => console.log('QuantumX bot launched')).catch(console.error);

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
