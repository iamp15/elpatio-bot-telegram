"use strict";

require("dotenv").config();
const axios = require("axios");

const BACKEND_URL = process.env.BACKEND_URL;
const BOT_JWT = process.env.BOT_JWT;

async function testSpecificEndpoint() {
  console.log("🔍 Probando endpoint específico check-nickname...");
  console.log("📋 URL base:", BACKEND_URL);

  try {
    // Probar diferentes variaciones del endpoint
    const testNickname = "testnickname123";

    console.log("\n🧪 Probando diferentes rutas:");

    // 1. Ruta exacta que debería funcionar
    console.log("\n1️⃣ GET /api/jugadores/check-nickname/:nickname:");
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/jugadores/check-nickname/${encodeURIComponent(
          testNickname
        )}`,
        {
          headers: {
            Authorization: `Bearer ${BOT_JWT}`,
          },
        }
      );
      console.log("✅ Endpoint funciona correctamente");
      console.log("   Status:", response.status);
      console.log("   Respuesta:", response.data);
    } catch (err) {
      console.log(
        `❌ Error: ${err.response?.status} - ${
          err.response?.data?.mensaje ||
          err.response?.data?.error ||
          err.message
        }`
      );
    }

    // 2. Probar sin el parámetro nickname
    console.log("\n2️⃣ GET /api/jugadores/check-nickname (sin parámetro):");
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/jugadores/check-nickname`,
        {
          headers: {
            Authorization: `Bearer ${BOT_JWT}`,
          },
        }
      );
      console.log("✅ Endpoint sin parámetro funciona");
      console.log("   Status:", response.status);
    } catch (err) {
      console.log(
        `❌ Error: ${err.response?.status} - ${
          err.response?.data?.mensaje ||
          err.response?.data?.error ||
          err.message
        }`
      );
    }

    // 3. Probar con POST en lugar de GET
    console.log("\n3️⃣ POST /api/jugadores/check-nickname:");
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/jugadores/check-nickname`,
        { nickname: testNickname },
        {
          headers: {
            Authorization: `Bearer ${BOT_JWT}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("✅ POST funciona");
      console.log("   Status:", response.status);
      console.log("   Respuesta:", response.data);
    } catch (err) {
      console.log(
        `❌ Error: ${err.response?.status} - ${
          err.response?.data?.mensaje ||
          err.response?.data?.error ||
          err.message
        }`
      );
    }

    // 4. Probar endpoint base de jugadores
    console.log("\n4️⃣ GET /api/jugadores (base):");
    try {
      const response = await axios.get(`${BACKEND_URL}/api/jugadores`, {
        headers: {
          Authorization: `Bearer ${BOT_JWT}`,
        },
      });
      console.log("✅ Endpoint base funciona");
      console.log("   Status:", response.status);
    } catch (err) {
      console.log(
        `❌ Error: ${err.response?.status} - ${
          err.response?.data?.mensaje ||
          err.response?.data?.error ||
          err.message
        }`
      );
    }
  } catch (err) {
    console.error("❌ Error general:", err.message);
  }
}

testSpecificEndpoint();
