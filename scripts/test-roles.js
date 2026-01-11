"use strict";

require("dotenv").config();
const axios = require("axios");

const BACKEND_URL = process.env.BACKEND_URL;
const BOT_JWT = process.env.BOT_JWT;

async function testRoles() {
  console.log("🧪 Probando diferentes roles...");

  if (!BACKEND_URL || !BOT_JWT) {
    console.error("❌ Configuración incompleta");
    return;
  }

  try {
    // Decodificar el token para ver el rol actual
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

    console.log("🔍 Token actual:");
    console.log("   Rol:", payload.rol);
    console.log("   Email:", payload.email);

    // Probar el endpoint problemático
    console.log("\n🧪 Probando endpoint check-nickname:");
    try {
      const response = await axios.get(
        `${BACKEND_URL}/jugadores/check-nickname/testnickname123`,
        {
          headers: {
            Authorization: `Bearer ${BOT_JWT}`,
          },
        }
      );
      console.log("✅ Endpoint funciona correctamente");
      console.log("   Respuesta:", response.data);
    } catch (err) {
      console.log(
        `❌ Error: ${err.response?.status} - ${
          err.response?.data?.error || err.message
        }`
      );

      if (err.response?.data?.required && err.response?.data?.current) {
        console.log("\n🔍 Información del error:");
        console.log("   Rol requerido:", err.response.data.required);
        console.log("   Rol actual:", err.response.data.current);
      }
    }

    // Probar otros endpoints para comparar
    console.log("\n🧪 Probando otros endpoints:");

    // Probar crear jugador (debería funcionar)
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
            Authorization: `Bearer ${BOT_JWT}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("✅ POST /jugadores: Funciona");
    } catch (err) {
      console.log(
        `❌ POST /jugadores: ${err.response?.status} - ${
          err.response?.data?.error || err.message
        }`
      );
    }
  } catch (err) {
    console.error("❌ Error general:", err.message);
  }
}

testRoles();
