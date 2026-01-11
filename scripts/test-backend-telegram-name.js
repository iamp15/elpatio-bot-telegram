"use strict";

require("dotenv").config();
const axios = require("axios");

const BACKEND_URL = process.env.BACKEND_URL;
const BOT_JWT = process.env.BOT_JWT;

async function testBackendTelegramName() {
  console.log(
    "🧪 Probando creación de jugadores sin nickname (usando nombre de Telegram)..."
  );
  console.log("📋 URL:", BACKEND_URL);

  if (!BACKEND_URL || !BOT_JWT) {
    console.error("❌ Configuración incompleta");
    return;
  }

  const testCases = [
    {
      telegramId: "test_telegram_name_" + Date.now(),
      username: "test_telegram_user",
      nickname: null, // null para usar nombre de Telegram
    },
    {
      telegramId: "test_telegram_name2_" + Date.now(),
      username: "test_telegram_user2",
      nickname: "", // string vacío también debería funcionar
    },
  ];

  for (const testCase of testCases) {
    console.log(`\n🧪 Probando crear jugador sin nickname:`);
    console.log(`   Telegram ID: ${testCase.telegramId}`);
    console.log(`   Username: ${testCase.username}`);
    console.log(
      `   Nickname: ${
        testCase.nickname === null ? "null" : `"${testCase.nickname}"`
      }`
    );

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/jugadores`,
        {
          telegramId: testCase.telegramId,
          username: testCase.username,
          nickname: testCase.nickname,
        },
        {
          headers: {
            Authorization: `Bearer ${BOT_JWT}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(`✅ Jugador creado exitosamente`);
      console.log(`   Respuesta:`, response.data);
    } catch (err) {
      if (err.response?.status === 400) {
        console.log(`❌ Error 400: ${err.response.data.error}`);
      } else if (err.response?.status === 409) {
        console.log(
          `❌ Error 409: ${err.response.data.error || "Jugador ya existe"}`
        );
      } else {
        console.log(
          `❌ Error ${err.response?.status}: ${
            err.response?.data?.error || err.message
          }`
        );
      }
    }
  }
}

testBackendTelegramName();
