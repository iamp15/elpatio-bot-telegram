"use strict";

require("dotenv").config();
const axios = require("axios");

const BACKEND_URL = process.env.BACKEND_URL;
const BOT_JWT = process.env.BOT_JWT;

async function testBackendNickname() {
  console.log("🧪 Probando validación de nicknames en el backend...");
  console.log("📋 URL:", BACKEND_URL);

  if (!BACKEND_URL || !BOT_JWT) {
    console.error("❌ Configuración incompleta");
    return;
  }

  const testNicknames = ["el-niño", "niño123", "español", "cañón", "normal123"];

  for (const nickname of testNicknames) {
    console.log(`\n🧪 Probando: "${nickname}"`);

    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/jugadores/check-nickname/${encodeURIComponent(
          nickname
        )}`,
        {
          headers: {
            Authorization: `Bearer ${BOT_JWT}`,
          },
        }
      );
      console.log(`✅ Disponible: ${response.data.available}`);
    } catch (err) {
      if (err.response?.status === 400) {
        console.log(`❌ Error 400: ${err.response.data.error}`);
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

testBackendNickname();
