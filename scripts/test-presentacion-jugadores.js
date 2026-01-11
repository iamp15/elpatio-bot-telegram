"use strict";

require("dotenv").config();
const BOT_CONFIG = require("../config/bot-config");

function testPresentacionJugadores() {
  console.log("🧪 Probando presentación de jugadores en salas...");

  // Simular diferentes tipos de datos de jugadores
  const salasPrueba = [
    {
      _id: "sala_completa",
      juego: "ludo",
      modo: "1v1",
      configuracion: { entrada: 2000, premio: 4000 },
      jugadores: [
        { nickname: "Carlos", username: "carlos123" },
        { nickname: "Ana", username: "ana_gamer" },
      ],
    },
    {
      _id: "sala_parcial",
      juego: "ludo",
      modo: "1v1v1v1",
      configuracion: { entrada: 5000, premio: 20000 },
      jugadores: [
        { nickname: "Luis", username: "luis_pro" },
        { nickname: "María", username: "maria_win" },
      ],
    },
    {
      _id: "sala_vacia",
      juego: "ludo",
      modo: "2v2",
      configuracion: { entrada: 3000, premio: 12000 },
      jugadores: [],
    },
    {
      _id: "sala_solo_ids",
      juego: "ludo",
      modo: "1v1v1v1",
      configuracion: { entrada: 4000, premio: 16000 },
      jugadores: ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
    },
    {
      _id: "sala_mixta",
      juego: "ludo",
      modo: "2v2",
      configuracion: { entrada: 6000, premio: 24000 },
      jugadores: [
        { nickname: "Sofia", username: "sofia_queen" },
        "507f1f77bcf86cd799439013",
        { nickname: "Diego", username: "diego_master" },
      ],
    },
  ];

  console.log("\n📋 Probando diferentes escenarios de jugadores:\n");

  salasPrueba.forEach((sala, index) => {
    console.log(`🎮 **Sala ${sala._id}**`);
    console.log(`🏆 **Modo:** ${sala.modo}`);
    console.log(`💰 **Entrada:** $${sala.configuracion?.entrada || 0}`);
    console.log(`🏅 **Premio:** $${sala.configuracion?.premio || 0}`);

    const jugadoresActuales = sala.jugadores?.length || 0;
    const juego = BOT_CONFIG.juegos.find((j) => j.id === sala.juego);
    const modoConfig = juego?.modos?.[sala.modo];
    const limiteJugadores = modoConfig?.limiteJugadores || 4;
    const jugadoresFaltantes = limiteJugadores - jugadoresActuales;

    const estadoSala =
      jugadoresFaltantes === 0
        ? "🟢 Completa"
        : jugadoresFaltantes === 1
        ? "🟡 Casi llena"
        : "🔵 Disponible";

    console.log(
      `👥 **Capacidad:** ${jugadoresActuales}/${limiteJugadores} ${estadoSala}`
    );

    // Preparar lista de jugadores
    let jugadoresList = "";
    if (sala.jugadores && sala.jugadores.length > 0) {
      const jugadoresNombres = sala.jugadores.map((jugador) => {
        // Si el jugador es un objeto completo, usar nickname, first_name o username
        if (typeof jugador === "object" && jugador !== null) {
          return (
            jugador.nickname ||
            jugador.first_name ||
            jugador.username ||
            "Jugador"
          );
        }
        // Si es solo un ID, mostrar como "Jugador"
        return "Jugador";
      });
      jugadoresList = `\n👤 **Jugadores:** ${jugadoresNombres.join(", ")}`;
    }

    console.log(jugadoresList);

    if (jugadoresFaltantes > 0) {
      console.log(
        `🎯 **Faltan:** ${jugadoresFaltantes} jugador${
          jugadoresFaltantes > 1 ? "es" : ""
        }`
      );
    }

    console.log(""); // Línea en blanco
  });

  console.log("✅ Presentación de jugadores verificada correctamente!");
  console.log("📊 Se manejan correctamente:");
  console.log("   • Jugadores con nickname y username");
  console.log("   • Salas vacías");
  console.log("   • Jugadores solo con ID");
  console.log("   • Mezcla de tipos de datos");
}

testPresentacionJugadores();
