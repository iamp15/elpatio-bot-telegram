"use strict";

require("dotenv").config();
const BackendAPI = require("../api/backend");

async function debugBackendResponse() {
  console.log("🔍 Debuggeando respuestas del backend...");

  const api = new BackendAPI({
    baseUrl: process.env.BACKEND_URL,
    botEmail: process.env.BOT_EMAIL,
    botPassword: process.env.BOT_PASSWORD,
    preToken: process.env.BOT_JWT || null,
  });

  try {
    // Autenticar
    await api.ensureAuth();
    console.log("✅ Autenticación exitosa");

    // 1. Crear una sala y ver qué devuelve
    console.log("\n1️⃣ Creando sala...");
    const salaData = {
      juego: "ludo",
      modo: "1v1v1v1",
      configuracion: {
        entrada: 5000,
        premio: 20000,
      },
      cajeroAsignado: "admin",
    };

    const nuevaSala = await api.createSala(salaData);
    console.log("📋 Respuesta completa del backend (crear sala):");
    console.log(JSON.stringify(nuevaSala, null, 2));

    // 2. Crear un jugador y ver qué devuelve
    console.log("\n2️⃣ Creando jugador...");
    const jugadorData = {
      telegramId: "test_user_456",
      username: "test_user_456",
      nickname: "TestPlayer456",
    };

    const jugador = await api.createPlayer(jugadorData);
    console.log("📋 Respuesta completa del backend (crear jugador):");
    console.log(JSON.stringify(jugador, null, 2));

    // 3. Obtener salas disponibles
    console.log("\n3️⃣ Obteniendo salas disponibles...");
    const salas = await api.getSalasDisponibles();
    console.log("📋 Respuesta completa del backend (salas disponibles):");
    console.log(JSON.stringify(salas, null, 2));
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);

    if (err.response?.status) {
      console.error(`   Status: ${err.response.status}`);
    }
  }
}

debugBackendResponse();
