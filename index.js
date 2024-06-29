import "dotenv/config";
import fetch from "node-fetch";
import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const targetPrice = parseFloat(process.env.TARGET_PRICE);
const chatId = process.env.CHAT_ID;

async function checkPrice() {
  try {
    const response = await fetch(
      "https://api.coindesk.com/v1/bpi/currentprice.json"
    );
    const data = await response.json();
    const currentPrice = data.bpi.USD.rate_float; // Assuming the API response structure has USD rate

    console.log("Current Bitcoin Price (USD):", currentPrice);

    if (currentPrice >= targetPrice) {
      await bot.telegram.sendMessage(
        chatId,
        `السعر وصل إلى ${currentPrice}. أرسل أمر شراء.`
      );
      console.log("Notification sent.");
    } else {
      console.log("Price is below target.");
    }
  } catch (error) {
    console.error("Error fetching price:", error);
  }
}

// Check price every minute
setInterval(checkPrice, 60000);

// Launch the bot
bot.launch();
