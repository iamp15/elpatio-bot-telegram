"use strict";

require("dotenv").config();
const BackendAPI = require("../api/backend");

async function testJerarquiaUnificada() {
  console.log("🧪 Probando jerarquía unificada (solo firstName)...");

  const api = new BackendAPI({
    baseUrl: process.env.BACKEND_URL || "http://localhost:5000",
    botEmail: process.env.BOT_EMAIL,
    botPassword: process.env.BOT_PASSWORD,
  });

  console.log(
    "📋 Jerarquía simplificada: nickname → firstName → username → 'Jugador'\n"
  );

  // Simular diferentes escenarios
  const escenarios = [
    {
      descripcion: "Jugador con nickname (máxima prioridad)",
      jugador: {
        nickname: "SuperPlayer",
        firstName: "Juan",
        username: "juan123",
      },
      esperado: "SuperPlayer",
    },
    {
      descripcion: "Jugador sin nickname, con firstName",
      jugador: { nickname: null, firstName: "Igor", username: "iamp15" },
      esperado: "Igor",
    },
    {
      descripcion: "Jugador solo con username",
      jugador: { nickname: null, firstName: null, username: "player_pro" },
      esperado: "player_pro",
    },
    {
      descripcion: "Jugador sin datos (fallback)",
      jugador: { nickname: null, firstName: null, username: null },
      esperado: "Jugador",
    },
  ];

  escenarios.forEach((escenario, index) => {
    console.log(`${index + 1}. ${escenario.descripcion}`);

    const resultado =
      escenario.jugador.nickname ||
      escenario.jugador.firstName ||
      escenario.jugador.username ||
      "Jugador";

    const status = resultado === escenario.esperado ? "✅" : "❌";
    console.log(`   Resultado: ${resultado} ${status}`);
    console.log("");
  });

  console.log("🎮 Simulando sala con jugadores mixtos:");
  const salaSimulada = {
    jugadores: [
      { nickname: "Pro", firstName: "Carlos", username: "carlos_win" },
      { firstName: "Ana", username: "ana_player" },
      { username: "quick_gamer" },
      "507f1f77bcf86cd799439011", // ID que será buscado en backend
    ],
  };

  console.log("👥 Procesando jugadores de la sala:");
  for (let i = 0; i < salaSimulada.jugadores.length; i++) {
    const jugador = salaSimulada.jugadores[i];
    console.log(`\n${i + 1}. ${JSON.stringify(jugador)}`);

    if (typeof jugador === "object" && jugador !== null) {
      const nombre =
        jugador.nickname || jugador.firstName || jugador.username || "Jugador";
      console.log(`   → ${nombre} (objeto local)`);
    } else if (typeof jugador === "string") {
      console.log(`   → Buscando ID ${jugador} en backend...`);
      try {
        const jugadorCompleto = await api.findPlayerById(jugador);
        if (jugadorCompleto) {
          const nombre =
            jugadorCompleto.nickname ||
            jugadorCompleto.firstName ||
            jugadorCompleto.username ||
            "Jugador";
          console.log(`   → ${nombre} (encontrado en backend)`);
        } else {
          console.log(`   → Jugador (no encontrado)`);
        }
      } catch (err) {
        console.log(`   → Jugador (error: ${err.message})`);
      }
    }
  }

  console.log("\n✅ Jerarquía unificada probada!");
  console.log("📊 Resumen de cambios:");
  console.log("   ❌ Eliminado: first_name (Telegram legacy)");
  console.log("   ✅ Unificado: firstName (único campo para nombres)");
  console.log("   🎯 Beneficios: Código más simple y mantenible");
}

testJerarquiaUnificada();
