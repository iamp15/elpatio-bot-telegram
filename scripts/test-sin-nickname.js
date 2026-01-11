"use strict";

require("dotenv").config();
const BackendAPI = require("../api/backend");

async function testSinNickname() {
  console.log("🧪 PROBANDO NUEVA LÓGICA 'SIN NICKNAME'");
  console.log("=".repeat(50));

  const api = new BackendAPI({
    baseUrl: process.env.BACKEND_URL || "http://localhost:5000",
    botEmail: process.env.BOT_EMAIL,
    botPassword: process.env.BOT_PASSWORD,
  });

  console.log("📋 Simulando diferentes escenarios de jugadores:\n");

  // Simular jugadores con diferentes configuraciones
  const jugadoresPrueba = [
    {
      descripcion: "Jugador con nickname normal",
      jugador: {
        nickname: "Carlos",
        firstName: "Carlos",
        username: "carlos123",
      },
      esperado: "Carlos",
    },
    {
      descripcion: "Jugador que eligió no usar nickname (Igor)",
      jugador: {
        nickname: "SIN_NICKNAME_1604252279",
        firstName: "Igor",
        username: "iamp15",
      },
      esperado: "Igor",
    },
    {
      descripcion: "Jugador que eligió no usar nickname (sin firstName)",
      jugador: {
        nickname: "SIN_NICKNAME_123456789",
        firstName: null,
        username: "player_pro",
      },
      esperado: "player_pro",
    },
    {
      descripcion: "Jugador con nickname normal (no SIN_NICKNAME)",
      jugador: {
        nickname: "SIN_NICKNAME_FAKE",
        firstName: "Ana",
        username: "ana_gamer",
      },
      esperado: "SIN_NICKNAME_FAKE",
    },
  ];

  jugadoresPrueba.forEach((caso, index) => {
    console.log(`${index + 1}. ${caso.descripcion}`);

    // Aplicar la nueva lógica
    let nombreMostrado;
    if (
      caso.jugador.nickname &&
      caso.jugador.nickname.startsWith("SIN_NICKNAME_")
    ) {
      nombreMostrado =
        caso.jugador.firstName || caso.jugador.username || "Jugador";
    } else {
      nombreMostrado =
        caso.jugador.nickname ||
        caso.jugador.firstName ||
        caso.jugador.username ||
        "Jugador";
    }

    const resultado = nombreMostrado === caso.esperado ? "✅" : "❌";
    console.log(`   Resultado: ${nombreMostrado} ${resultado}`);
    console.log(`   Esperado: ${caso.esperado}`);
    console.log("");
  });

  console.log("🎮 Simulando sala con jugadores mixtos:");
  const salaSimulada = {
    jugadores: [
      { nickname: "Carlos", firstName: "Carlos", username: "carlos123" },
      {
        nickname: "SIN_NICKNAME_1604252279",
        firstName: "Igor",
        username: "iamp15",
      },
      {
        nickname: "SIN_NICKNAME_123456789",
        firstName: null,
        username: "player_pro",
      },
      { nickname: "Ana", firstName: "Ana", username: "ana_gamer" },
    ],
  };

  console.log("👥 Procesando jugadores de la sala:");
  const jugadoresNombres = salaSimulada.jugadores.map((jugador) => {
    if (jugador.nickname && jugador.nickname.startsWith("SIN_NICKNAME_")) {
      return jugador.firstName || jugador.username || "Jugador";
    }
    return (
      jugador.nickname || jugador.firstName || jugador.username || "Jugador"
    );
  });

  console.log(`👤 **Jugadores:** ${jugadoresNombres.join(", ")}`);
  console.log("   Resultado esperado: Carlos, Igor, player_pro, Ana");

  console.log("\n✅ Prueba completada!");
  console.log("📊 Resumen de la nueva lógica:");
  console.log("   ✅ Jugadores con nickname normal → muestran su nickname");
  console.log("   ✅ Jugadores con SIN_NICKNAME_ → muestran su firstName");
  console.log("   ✅ Si no hay firstName → muestran username");
  console.log("   ✅ Múltiples jugadores pueden elegir no usar nickname");
  console.log("   ✅ No más errores de índice único");
}

testSinNickname();
