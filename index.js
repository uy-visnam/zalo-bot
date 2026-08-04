require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const ZALO_TOKEN = process.env.ZALO_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const TELE_TOKEN = process.env.TELE_TOKEN;
const TELE_GROUP_ID = process.env.TELE_GROUP_ID;
const PORT = process.env.PORT || 3000;

const TELEGRAM_API = `https://api.telegram.org/bot${TELE_TOKEN}/sendMessage`;

async function sendTelegram(message) {
  const response = await fetch(
    TELEGRAM_API,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELE_GROUP_ID,
        text: message,
      }),
    }
  );

  const data = await response.json();
  console.log(data);
}

app.post('/diawi-callback', async (req, res) => {
  try {
    const data = req.body;
    const platform = req.query.platform || 'unknown';

    console.log('📥 Diawi callback:', data);

    if (data.link) {
      const platformName =
        platform === 'android'
          ? 'Android'
          : platform === 'ios'
          ? 'iOS'
          : platform;

      const iconApp = platform === 'android' ? '🤖' : '📱';
      const appName = data.application?.name || 'OneCare Dev';
      const version = data.application?.version || '';

      const message =
        `✅ Build ${platformName} thành công!\n\n` +
        `${iconApp} App: ${appName}\n` +
        `🔢 Version: ${version}\n` +
        `🔗 Link cài đặt ${platformName}: ${data.link}`;

      await sendTelegram(message);

      console.log(`✅ Đã gửi thông báo ${platformName}`);
    }

    res.status(200).json({ status: 'OK' });
  } catch (err) {
    console.error('❌ Lỗi:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server chạy trên port ${PORT}`);
  console.log(`TELE_TOKEN: ${TELE_TOKEN ? '✅ Có' : '❌ Không có'}`);
});
