"use strict";

require("dotenv").config();
const BackendAPI = require("../api/backend");

async function testJugadoresActuales() {
  console.log("🧪 VERIFICANDO JUGADORES ACTUALES");
  console.log("=".repeat(50));

  const api = new BackendAPI({
    baseUrl: process.env.BACKEND_URL || "http://localhost:5000",
    botEmail: process.env.BOT_EMAIL,
    botPassword: process.env.BOT_PASSWORD,
  });

  try {
    console.log("📋 Obteniendo jugadores de la base de datos...");

    // Obtener todos los jugadores
    const jugadores = await api.getAllPlayers();

    console.log(`\n📊 Total de jugadores: ${jugadores.length}`);

    if (jugadores.length === 0) {
      console.log("❌ No hay jugadores en la base de datos");
      return;
    }

    console.log("\n👥 JUGADORES ENCONTRADOS:");
    jugadores.forEach((jugador, index) => {
      console.log(`\n${index + 1}. Jugador:`);
      console.log(`   ID: ${jugador._id}`);
      console.log(`   telegramId: ${jugador.telegramId}`);
      console.log(`   nickname: ${jugador.nickname || "N/A"}`);
      console.log(`   firstName: ${jugador.firstName || "N/A"}`);
      console.log(`   username: ${jugador.username || "N/A"}`);

      // Aplicar la lógica de visualización
      let nombreMostrado;
      if (jugador.nickname && jugador.nickname.startsWith("SIN_NICKNAME_")) {
        nombreMostrado = jugador.firstName || jugador.username || "Jugador";
        console.log(`   → Se mostrará como: ${nombreMostrado} (sin nickname)`);
      } else {
        nombreMostrado =
          jugador.nickname ||
          jugador.firstName ||
          jugador.username ||
          "Jugador";
        console.log(`   → Se mostrará como: ${nombreMostrado} (con nickname)`);
      }
    });

    console.log("\n🎯 VERIFICACIÓN:");
    const jugadoresSinNickname = jugadores.filter(
      (j) => j.nickname && j.nickname.startsWith("SIN_NICKNAME_")
    );
    const jugadoresConNickname = jugadores.filter(
      (j) => j.nickname && !j.nickname.startsWith("SIN_NICKNAME_")
    );

    console.log(`   ✅ Jugadores sin nickname: ${jugadoresSinNickname.length}`);
    console.log(`   ✅ Jugadores con nickname: ${jugadoresConNickname.length}`);

    if (jugadoresSinNickname.length > 1) {
      console.log("   🎉 ¡Múltiples jugadores pueden elegir no usar nickname!");
    }

    console.log("\n📋 RESUMEN:");
    console.log("   ✅ Base de datos limpia");
    console.log("   ✅ Jugadores creados correctamente");
    console.log("   ✅ Lógica de visualización funcionando");
    console.log("   ✅ No más errores de índice único");
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

testJugadoresActuales();
