require('dotenv').config();
const express = require('express');
const { Bot } = require('zalo-bot-js');

const app = express();
app.use(express.json());

const ZALO_TOKEN = process.env.ZALO_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const PORT = process.env.PORT;

const bot = new Bot({ token: ZALO_TOKEN });

app.post('/diawi-callback', async (req, res) => {
    try {
        const data = req.body;
        console.log('Diawi callback:', data);

        if (data.status === 2000 && data.link) {  // Upload thành công
            const message = `✅ Build mới đã sẵn sàng!\n` +
                `🔗 Link: ${data.link}\n` +
                `📝 Comment: ${data.comment || 'Không có'}\n` +
                `📱 File: ${data.filename || ''}`;

            await bot.sendMessage(CHAT_ID, message);
        } else if (data.status !== 2000) {
            await bot.sendMessage(CHAT_ID, `❌ Upload Diawi thất bại: ${JSON.stringify(data)}`);
        }

        res.status(200).send('OK');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});

app.listen(PORT, () => console.log(`Webhook server running on port ${PORT}`));