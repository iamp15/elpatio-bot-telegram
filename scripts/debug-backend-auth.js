"use strict";

require("dotenv").config();
const axios = require("axios");

const BACKEND_URL = process.env.BACKEND_URL;
const BOT_JWT = process.env.BOT_JWT;

async function debugBackendAuth() {
  console.log("🔍 Diagnosticando autenticación del backend...");

  if (!BACKEND_URL || !BOT_JWT) {
    console.error("❌ Configuración incompleta");
    return;
  }

  try {
    // Decodificar el token para ver qué contiene
    const base64Url = BOT_JWT.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    const payload = JSON.parse(jsonPayload);

    console.log("🔍 Token analizado:");
    console.log("   Rol:", payload.rol);
    console.log("   Email:", payload.email);
    console.log("   ID:", payload.id);

    // Probar el endpoint con diferentes headers
    console.log("\n🧪 Probando endpoint con diferentes configuraciones:");

    // 1. Probar con Authorization header
    console.log("\n1️⃣ Con Authorization header:");
    try {
      const response = await axios.get(
        `${BACKEND_URL}/jugadores/check-nickname/testnickname123`,
        {
          headers: {
            Authorization: `Bearer ${BOT_JWT}`,
          },
        }
      );
      console.log("✅ Funciona con Authorization header");
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

    // 2. Probar con x-access-token header (alternativo)
    console.log("\n2️⃣ Con x-access-token header:");
    try {
      const response = await axios.get(
        `${BACKEND_URL}/jugadores/check-nickname/testnickname123`,
        {
          headers: {
            "x-access-token": BOT_JWT,
          },
        }
      );
      console.log("✅ Funciona con x-access-token header");
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

    // 3. Probar sin headers
    console.log("\n3️⃣ Sin headers de autenticación:");
    try {
      const response = await axios.get(
        `${BACKEND_URL}/jugadores/check-nickname/testnickname123`
      );
      console.log("⚠️ Funciona sin autenticación (no debería)");
      console.log("   Respuesta:", response.data);
    } catch (err) {
      console.log(
        `✅ Error esperado: ${err.response?.status} - ${
          err.response?.data?.mensaje ||
          err.response?.data?.error ||
          err.message
        }`
      );
    }

    // 4. Probar endpoint que sabemos que funciona
    console.log("\n4️⃣ Probando endpoint que funciona (POST /jugadores):");
    try {
      const response = await axios.post(
        `${BACKEND_URL}/jugadores`,
        {
          telegramId: "test123",
          username: "testuser",
          nickname: "testnick" + Date.now(), // Nickname único
        },
        {
          headers: {
            Authorization: `Bearer ${BOT_JWT}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("✅ POST /jugadores funciona");
      console.log("   Respuesta:", response.data);
    } catch (err) {
      console.log(
        `❌ POST /jugadores: ${err.response?.status} - ${
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

debugBackendAuth();
