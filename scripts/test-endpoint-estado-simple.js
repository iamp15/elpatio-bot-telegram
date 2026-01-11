"use strict";
require("dotenv").config();
const BackendAPI = require("../api/backend");

// Inicializar API
const api = new BackendAPI({
  baseUrl: process.env.BACKEND_URL,
  botEmail: process.env.BOT_EMAIL,
  botPassword: process.env.BOT_PASSWORD,
});

async function testEndpointEstado() {
  console.log("🧪 === PRUEBA ENDPOINT ESTADO ===\n");

  try {
    // 1. Obtener un jugador
    console.log("📡 Obteniendo jugadores...");
    const jugadores = await api.getAllPlayers();

    if (jugadores.length === 0) {
      console.log("❌ No hay jugadores para probar");
      return;
    }

    const jugador = jugadores[0];
    console.log(`✅ Jugador: ${jugador.nickname || jugador.firstName}`);
    console.log(`   ObjectId: ${jugador._id}`);
    console.log(`   TelegramId: ${jugador.telegramId}`);

    // 2. Probar el endpoint de estado directamente
    console.log("\n🔍 **Probando endpoint de estado...**");
    console.log(`URL: /api/jugadores/${jugador._id}/estado`);

    try {
      const res = await api.client.get(`/api/jugadores/${jugador._id}/estado`);
      console.log("✅ Respuesta exitosa:");
      console.log(JSON.stringify(res.data, null, 2));
    } catch (error) {
      console.log("❌ Error en endpoint:");
      console.log("   Status:", error.response?.status);
      console.log("   Data:", error.response?.data);
      console.log("   Message:", error.message);

      // Mostrar más detalles del error
      if (error.response?.data?.error) {
        console.log("   Error details:", error.response.data.error);
      }
    }

    // 3. Verificar que el jugador existe
    console.log("\n🔍 **Verificando que el jugador existe...**");
    try {
      const jugadorVerificado = await api.findPlayerById(jugador._id);
      if (jugadorVerificado) {
        console.log("✅ Jugador encontrado por ObjectId");
        console.log(
          "   Nombre:",
          jugadorVerificado.nickname || jugadorVerificado.firstName
        );
      } else {
        console.log("❌ Jugador no encontrado por ObjectId");
      }
    } catch (error) {
      console.log("❌ Error verificando jugador:", error.message);
    }
  } catch (error) {
    console.error("❌ Error general:", error.message);
    if (error.response) {
      console.error("   Status:", error.response.status);
      console.error("   Data:", error.response.data);
    }
  }
}

// Ejecutar prueba
testEndpointEstado()
  .then(() => {
    console.log("\n✅ Prueba completada");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error ejecutando prueba:", error);
    process.exit(1);
  });
