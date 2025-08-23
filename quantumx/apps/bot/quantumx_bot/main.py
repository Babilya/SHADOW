import os
from aiogram import Bot, Dispatcher
from aiogram.filters import Command
from aiogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
import httpx

BOT_TOKEN = os.getenv("BOT_TOKEN", "")
WEBAPP_URL = os.getenv("WEBAPP_URL", "http://localhost:5173")
API_URL = os.getenv("VITE_API_URL", os.getenv("API_URL", "http://backend:8000"))

bot = Bot(BOT_TOKEN)
dp = Dispatcher()

LANGS = {
    "ua": {
        "start": "Вітаємо у QuantumX! Оберіть мову та відкрийте WebApp.",
        "open": "🚀 Відкрити QuantumX WebApp",
    },
    "en": {
        "start": "Welcome to QuantumX! Choose language and open WebApp.",
        "open": "🚀 Open QuantumX WebApp",
    },
    "ru": {
        "start": "Добро пожаловать в QuantumX! Выберите язык и откройте WebApp.",
        "open": "🚀 Открыть QuantumX WebApp",
    },
}

@dp.message(Command("start"))
async def cmd_start(message: Message):
    kb = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text=LANGS["ua"]["open"], web_app=WebAppInfo(url=WEBAPP_URL))],
    ])
    await message.answer(LANGS["ua"]["start"], reply_markup=kb)
    await message.answer("Developed by SHADOW and COMPANY (R&D partner)")

@dp.message(Command("help"))
async def cmd_help(message: Message):
    await message.answer("/profile, /balance, /bonus, /app, /osint, /casino, /shop, /vip")

@dp.message(Command("app"))
async def cmd_app(message: Message):
    kb = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text=LANGS["ua"]["open"], web_app=WebAppInfo(url=WEBAPP_URL))]
    ])
    await message.answer("Open QuantumX WebApp", reply_markup=kb)

@dp.message(Command("profile"))
@dp.message(Command("balance"))
async def cmd_balance(message: Message):
    tid = message.from_user.id
    async with httpx.AsyncClient() as client:
        r = await client.get(f"{API_URL}/wallet/{tid}")
        data = r.json()
    await message.answer(f"ST balance: {data.get('st_balance', 0)}")

@dp.message(Command("bonus"))
async def cmd_bonus(message: Message):
    tid = message.from_user.id
    async with httpx.AsyncClient() as client:
        r = await client.post(f"{API_URL}/bonus/claim/{tid}")
        data = r.json()
    if data.get("claimed"):
        await message.answer(f"+{data['bonus']} ST! New balance: {data['st_balance']}")
    else:
        await message.answer("Бонус вже отримано сьогодні.")

@dp.message(Command("vip"))
async def cmd_vip(message: Message):
    async with httpx.AsyncClient() as client:
        r = await client.get(f"{API_URL}/vip/plans")
        plans = r.json().get("plans", [])
    text = "\n".join([f"{p['name']}: {p['price_st']} ST" for p in plans])
    await message.answer(text or "No plans")

@dp.message(Command("shop"))
async def cmd_shop(message: Message):
    async with httpx.AsyncClient() as client:
        r = await client.get(f"{API_URL}/shop/items")
        items = r.json().get("items", [])
    text = "\n".join([f"{i['name']}: {i['price_st']} ST" for i in items])
    await message.answer(text or "No items")

@dp.message(Command("casino"))
async def cmd_casino(message: Message):
    async with httpx.AsyncClient() as client:
        r = await client.get(f"{API_URL}/casino/slots/spin")
        res = r.json()
    await message.answer(f"Result: {res['result']} | Win: {res['win']} | +{res.get('payout_st', 0)} ST")

@dp.message(Command("osint"))
async def cmd_osint(message: Message):
    await message.answer("Use WebApp OSINT page for detailed search.")

async def main() -> None:
    await dp.start_polling(bot)

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
