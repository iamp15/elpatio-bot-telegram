"use strict";

require("dotenv").config();
const BackendAPI = require("../api/backend");

async function testEndpointJugador() {
  console.log("🔍 Probando endpoint de búsqueda de jugadores por ID...");

  // Crear instancia de la API
  const api = new BackendAPI({
    baseUrl: process.env.BACKEND_URL || "http://localhost:5000",
    botEmail: process.env.BOT_EMAIL,
    botPassword: process.env.BOT_PASSWORD,
  });

  try {
    // Probar diferentes IDs
    const idsToTest = [
      "146c",
      "507f1f77bcf86cd799439011",
      "507f1f77bcf86cd799439012",
      "507f1f77bcf86cd799439013",
    ];

    console.log("\n📋 Probando diferentes IDs:\n");

    for (const id of idsToTest) {
      console.log(`🔍 Probando ID: ${id}`);

      try {
        const jugador = await api.findPlayerById(id);
        if (jugador) {
          console.log(`   ✅ Encontrado:`);
          console.log(`      - _id: ${jugador._id}`);
          console.log(`      - nickname: ${jugador.nickname || "N/A"}`);
          console.log(`      - first_name: ${jugador.first_name || "N/A"}`);
          console.log(`      - username: ${jugador.username || "N/A"}`);
          console.log(`      - telegramId: ${jugador.telegramId || "N/A"}`);
        } else {
          console.log(`   ❌ No encontrado`);
        }
      } catch (err) {
        console.log(`   ❌ Error: ${err.message}`);
        if (err.response) {
          console.log(`      Status: ${err.response.status}`);
          console.log(`      Data: ${JSON.stringify(err.response.data)}`);
        }
      }

      console.log("");
    }

    console.log("✅ Prueba del endpoint completada!");
  } catch (err) {
    console.error("❌ Error en la prueba:", err.message);
  }
}

testEndpointJugador();
