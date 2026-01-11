"use strict";

require("dotenv").config();
const axios = require("axios");

const BACKEND_URL = process.env.BACKEND_URL;
const BOT_JWT = process.env.BOT_JWT;

async function testCreatePlayer() {
  console.log("🧪 Probando creación de jugadores con nicknames especiales...");
  console.log("📋 URL:", BACKEND_URL);

  if (!BACKEND_URL || !BOT_JWT) {
    console.error("❌ Configuración incompleta");
    return;
  }

  const testCases = [
    {
      nickname: "el-niño",
      telegramId: "test_niño_" + Date.now(),
      username: "test_niño",
    },
    {
      nickname: "niño123",
      telegramId: "test_niño123_" + Date.now(),
      username: "test_niño123",
    },
    {
      nickname: "español",
      telegramId: "test_español_" + Date.now(),
      username: "test_español",
    },
  ];

  for (const testCase of testCases) {
    console.log(`\n🧪 Probando crear jugador: "${testCase.nickname}"`);

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
      console.log(`✅ Jugador creado: ${response.data.nickname}`);
    } catch (err) {
      if (err.response?.status === 400) {
        console.log(`❌ Error 400: ${err.response.data.error}`);
      } else if (err.response?.status === 409) {
        console.log(
          `❌ Error 409: ${err.response.data.error || "Nickname ya existe"}`
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

testCreatePlayer();
