"use strict";

require("dotenv").config();
const axios = require("axios");

const BACKEND_URL = process.env.BACKEND_URL;
const BOT_EMAIL = process.env.BOT_EMAIL;
const BOT_PASSWORD = process.env.BOT_PASSWORD;
const BOT_JWT = process.env.BOT_JWT;

async function debugNicknameEndpoint() {
  console.log("🔍 Iniciando diagnóstico del endpoint check-nickname...");
  console.log("📋 Configuración:");
  console.log(`   Backend URL: ${BACKEND_URL}`);
  console.log(`   Bot Email: ${BOT_EMAIL}`);
  console.log(`   Bot JWT: ${BOT_JWT ? "Configurado" : "No configurado"}`);

  if (!BACKEND_URL) {
    console.error("❌ BACKEND_URL no configurado");
    return;
  }

  try {
    let token = BOT_JWT;

    // Si no hay token preconfigurado, hacer login
    if (!token) {
      console.log("🔐 Haciendo login para obtener token...");
      const loginResponse = await axios.post(`${BACKEND_URL}/admin/login`, {
        email: BOT_EMAIL,
        password: BOT_PASSWORD,
      });
      token = loginResponse.data.token;
      console.log("✅ Token obtenido del login");
    } else {
      console.log("✅ Usando token preconfigurado");
    }

    // Probar diferentes endpoints para comparar
    const testNickname = "testnickname123";

    console.log("\n🧪 Probando endpoints...");

    // 1. Probar endpoint que funciona (crear jugador)
    console.log("\n1️⃣ Probando POST /api/jugadores (debería funcionar):");
    try {
      const createResponse = await axios.post(
        `${BACKEND_URL}/jugadores`,
        {
          telegramId: "test123",
          username: "testuser",
          nickname: "testnick",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("✅ POST /api/jugadores: OK");
    } catch (err) {
      console.log(
        `❌ POST /api/jugadores: ${err.response?.status} - ${
          err.response?.data?.error || err.message
        }`
      );
    }

    // 2. Probar endpoint problemático
    console.log("\n2️⃣ Probando GET /api/jugadores/check-nickname/:nickname:");
    try {
      const checkResponse = await axios.get(
        `${BACKEND_URL}/jugadores/check-nickname/${encodeURIComponent(
          testNickname
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ GET /api/jugadores/check-nickname: OK");
      console.log("   Respuesta:", checkResponse.data);
    } catch (err) {
      console.log(
        `❌ GET /api/jugadores/check-nickname: ${err.response?.status} - ${
          err.response?.data?.error || err.message
        }`
      );

      if (err.response?.status === 403) {
        console.log("\n🔍 Análisis del error 403:");
        console.log("   - El token es válido (porque POST funciona)");
        console.log("   - El problema está en la ruta específica");
        console.log("   - Posibles causas:");
        console.log(
          "     • Middleware de autorización específico para esta ruta"
        );
        console.log("     • Ruta mal configurada en el backend");
        console.log("     • Permisos insuficientes para esta operación");
      }
    }

    // 3. Probar sin autenticación (debería dar 401)
    console.log("\n3️⃣ Probando sin autenticación (debería dar 401):");
    try {
      const noAuthResponse = await axios.get(
        `${BACKEND_URL}/jugadores/check-nickname/${encodeURIComponent(
          testNickname
        )}`
      );
      console.log("⚠️ GET sin auth: OK (no debería funcionar)");
    } catch (err) {
      console.log(
        `✅ GET sin auth: ${err.response?.status} - ${
          err.response?.data?.error || err.message
        }`
      );
    }

    // 4. Verificar el token
    console.log("\n4️⃣ Verificando token:");
    try {
      const tokenResponse = await axios.get(`${BACKEND_URL}/admin/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("✅ Token válido");
      console.log("   Usuario:", tokenResponse.data);
    } catch (err) {
      console.log(
        `❌ Token inválido: ${err.response?.status} - ${
          err.response?.data?.error || err.message
        }`
      );
    }
  } catch (err) {
    console.error("❌ Error general:", err.message);
    if (err.response) {
      console.error("   Status:", err.response.status);
      console.error("   Data:", err.response.data);
    }
  }
}

debugNicknameEndpoint();
