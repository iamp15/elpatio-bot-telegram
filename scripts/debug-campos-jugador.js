"use strict";

require("dotenv").config();
const BackendAPI = require("../api/backend");

async function debugCamposJugador() {
  console.log("🔍 Debuggeando campos del jugador...");

  // Crear instancia de la API
  const api = new BackendAPI({
    baseUrl: process.env.BACKEND_URL || "http://localhost:5000",
    botEmail: process.env.BOT_EMAIL,
    botPassword: process.env.BOT_PASSWORD,
  });

  try {
    const objectIdCompleto = "68a0e03739027a8c8633146c";

    console.log(`🔍 Buscando jugador: ${objectIdCompleto}`);
    console.log("");

    const jugador = await api.findPlayerById(objectIdCompleto);

    if (jugador) {
      console.log("✅ Jugador encontrado!");
      console.log("");
      console.log("📋 Todos los campos del jugador:");
      console.log(JSON.stringify(jugador, null, 2));
      console.log("");

      console.log("🔍 Campos específicos:");
      console.log(`   _id: ${jugador._id}`);
      console.log(`   nickname: ${jugador.nickname || "null/undefined"}`);
      console.log(`   first_name: ${jugador.first_name || "null/undefined"}`);
      console.log(`   username: ${jugador.username || "null/undefined"}`);
      console.log(`   telegramId: ${jugador.telegramId || "null/undefined"}`);

      // Verificar si hay otros campos similares
      console.log("");
      console.log("🔍 Buscando campos alternativos:");
      const camposAlternativos = [
        "name",
        "nombre",
        "firstName",
        "nombreCompleto",
        "displayName",
      ];
      camposAlternativos.forEach((campo) => {
        if (jugador[campo] !== undefined) {
          console.log(`   ${campo}: ${jugador[campo]}`);
        }
      });

      console.log("");
      console.log("🎯 Aplicando jerarquía de nombres:");
      const nombreMostrado =
        jugador.nickname || jugador.first_name || jugador.username || "Jugador";
      console.log(`   Nombre a mostrar: ${nombreMostrado}`);
    } else {
      console.log("❌ Jugador no encontrado");
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
    if (err.response) {
      console.log(`Status: ${err.response.status}`);
      console.log(`Data: ${JSON.stringify(err.response.data, null, 2)}`);
    }
  }
}

debugCamposJugador();
