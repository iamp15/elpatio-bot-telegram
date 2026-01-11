"use strict";
require("dotenv").config();
const BackendAPI = require("../api/backend");

// Inicializar API
const api = new BackendAPI({
  baseUrl: process.env.BACKEND_URL,
  botEmail: process.env.BOT_EMAIL,
  botPassword: process.env.BOT_PASSWORD,
});

async function debugEndpointEstado() {
  console.log("🔍 === DIAGNÓSTICO ENDPOINT ESTADO ===\n");

  try {
    // 1. Obtener jugadores
    console.log("📡 Obteniendo jugadores...");
    const jugadores = await api.getAllPlayers();

    if (jugadores.length === 0) {
      console.log("❌ No hay jugadores para probar");
      return;
    }

    const jugador = jugadores[0];
    console.log(
      `✅ Jugador de prueba: ${jugador.nickname || jugador.firstName}`
    );
    console.log(`   ID: ${jugador._id}`);
    console.log(`   TelegramId: ${jugador.telegramId}`);

    // 2. Probar endpoint directamente con ObjectId
    console.log("\n🔍 **2. Probando endpoint con ObjectId...**");
    try {
      const res = await api.client.get(`/api/jugadores/${jugador._id}/estado`);
      console.log("✅ Respuesta exitosa:", JSON.stringify(res.data, null, 2));
    } catch (error) {
      console.log("❌ Error con ObjectId:");
      console.log("   Status:", error.response?.status);
      console.log("   Data:", error.response?.data);
      console.log("   Message:", error.message);
    }

    // 3. Probar endpoint con telegramId
    console.log("\n🔍 **3. Probando endpoint con telegramId...**");
    try {
      const res = await api.client.get(
        `/api/jugadores/${jugador.telegramId}/estado`
      );
      console.log("✅ Respuesta exitosa:", JSON.stringify(res.data, null, 2));
    } catch (error) {
      console.log("❌ Error con telegramId:");
      console.log("   Status:", error.response?.status);
      console.log("   Data:", error.response?.data);
      console.log("   Message:", error.message);
    }

    // 4. Verificar si el endpoint existe
    console.log("\n🔍 **4. Verificando rutas disponibles...**");
    try {
      const res = await api.client.get("/api/jugadores");
      console.log("✅ Endpoint /api/jugadores funciona");
    } catch (error) {
      console.log("❌ Error en /api/jugadores:", error.response?.status);
    }

    // 5. Probar con un jugador específico
    console.log("\n🔍 **5. Probando con jugador específico...**");
    try {
      const jugadorEspecifico = await api.findPlayerByTelegram(
        jugador.telegramId
      );
      if (jugadorEspecifico) {
        console.log("✅ Jugador encontrado por telegramId");
        console.log("   ObjectId:", jugadorEspecifico._id);

        // Intentar el endpoint de estado
        const res = await api.client.get(
          `/api/jugadores/${jugadorEspecifico._id}/estado`
        );
        console.log("✅ Estado obtenido:", JSON.stringify(res.data, null, 2));
      } else {
        console.log("❌ Jugador no encontrado por telegramId");
      }
    } catch (error) {
      console.log("❌ Error en búsqueda específica:", error.message);
    }
  } catch (error) {
    console.error("❌ Error general:", error.message);
    if (error.response) {
      console.error("   Status:", error.response.status);
      console.error("   Data:", error.response.data);
    }
  }
}

// Ejecutar diagnóstico
debugEndpointEstado()
  .then(() => {
    console.log("\n✅ Diagnóstico completado");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error ejecutando diagnóstico:", error);
    process.exit(1);
  });
