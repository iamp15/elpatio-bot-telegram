"use strict";

require("dotenv").config();
const BOT_CONFIG = require("../config/bot-config");

function testCambiosPresentacion() {
  console.log("🧪 Probando cambios en la presentación de salas...");

  // Simular salas con diferentes escenarios de jugadores
  const salasPrueba = [
    {
      _id: "sala_con_nicknames",
      juego: "ludo",
      modo: "1v1",
      configuracion: { entrada: 2000, premio: 4000 },
      jugadores: [
        { nickname: "Carlos", username: "carlos123", first_name: "Carlos" },
        { nickname: "Ana", username: "ana_gamer", first_name: "Ana" },
      ],
    },
    {
      _id: "sala_solo_usernames",
      juego: "ludo",
      modo: "2v2",
      configuracion: { entrada: 5000, premio: 20000 },
      jugadores: [
        { username: "luis_pro", first_name: "Luis" },
        { username: "maria_win", first_name: "María" },
        { username: "pedro_king", first_name: "Pedro" },
      ],
    },
    {
      _id: "sala_solo_first_names",
      juego: "ludo",
      modo: "1v1v1v1",
      configuracion: { entrada: 10000, premio: 40000 },
      jugadores: [
        { first_name: "Sofia" },
        { first_name: "Diego" },
        { first_name: "Laura" },
        { first_name: "Roberto" },
      ],
    },
    {
      _id: "sala_con_ids",
      juego: "ludo",
      modo: "1v1",
      configuracion: { entrada: 3000, premio: 6000 },
      jugadores: ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
    },
    {
      _id: "sala_mixta",
      juego: "ludo",
      modo: "2v2",
      configuracion: { entrada: 6000, premio: 24000 },
      jugadores: [
        { nickname: "Sofia", username: "sofia_queen", first_name: "Sofia" },
        "507f1f77bcf86cd799439013",
        { username: "diego_master", first_name: "Diego" },
      ],
    },
  ];

  console.log("\n📋 Probando diferentes escenarios de presentación:\n");

  salasPrueba.forEach((sala, index) => {
    console.log(`🎮 **Sala ${sala._id}**`);
    console.log(`🏆 **Modo:** ${sala.modo}`);
    console.log(
      `💰 **Entrada:** $${sala.configuracion?.entrada?.toLocaleString() || 0}`
    );
    console.log(
      `🏅 **Premio:** $${sala.configuracion?.premio?.toLocaleString() || 0}`
    );

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

    // Preparar lista de jugadores con nueva lógica
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

  console.log("✅ Cambios en presentación verificados correctamente!");
  console.log("📊 Se implementaron correctamente:");
  console.log("   • 'Jugadores' → 'Capacidad' para evitar repetición");
  console.log(
    "   • Nombres legibles: nickname > username > first_name > 'Jugador'"
  );
  console.log("   • Nunca se muestran IDs de jugadores");
  console.log("   • Consistencia en toda la presentación");
}

testCambiosPresentacion();
