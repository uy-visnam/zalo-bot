require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const ZALO_TOKEN = process.env.ZALO_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const PORT = process.env.PORT || 3000;

const ZALO_API = `https://bot-api.zaloplatforms.com/bot${ZALO_TOKEN}`;

app.post('/diawi-callback', async (req, res) => {
    try {
        const data = req.body;
        console.log('📥 Diawi callback:', data);

        if (data.link) {
            const message = `✅ **Build mới thành công!**\n\n` +
                `📱 App: ${data.application?.name || 'OneCare Dev'}\n` +
                `🔢 Version: ${data.application?.version || ''}\n` +
                `🔗 Link cài đặt: ${data.link}`;
            // `🕒 ${new Date().toLocaleString('vi-VN')}`;

            await axios.post(`${ZALO_API}/sendMessage`, {
                chat_id: CHAT_ID,
                // text: message,
                text: `🔗 Link cài đặt: ${data.link}`
            });

            console.log('✅ Đã gửi thông báo Zalo');
        }

        res.status(200).send({ status: 'OK' });
    } catch (err) {
        console.error('❌ Lỗi:', err.message);
        res.status(500).send({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server chạy trên port ${PORT}`);
    console.log(`ZALO_TOKEN: ${ZALO_TOKEN ? '✅ Có' : '❌ Không có'}`);
});