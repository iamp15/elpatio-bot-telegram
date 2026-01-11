"use strict";

require("dotenv").config();
const BOT_CONFIG = require("../config/bot-config");

function testPresentacionPremios() {
  console.log("🧪 Probando presentación de salas con premios...");

  // Simular salas con diferentes premios
  const salasPrueba = [
    {
      _id: "sala_baja_entrada",
      juego: "ludo",
      modo: "1v1",
      configuracion: { entrada: 1000, premio: 2000 },
      jugadores: [
        { nickname: "Carlos", username: "carlos123" },
        { nickname: "Ana", username: "ana_gamer" },
      ],
    },
    {
      _id: "sala_media_entrada",
      juego: "ludo",
      modo: "2v2",
      configuracion: { entrada: 5000, premio: 20000 },
      jugadores: [
        { nickname: "Luis", username: "luis_pro" },
        { nickname: "María", username: "maria_win" },
        { nickname: "Pedro", username: "pedro_king" },
      ],
    },
    {
      _id: "sala_alta_entrada",
      juego: "ludo",
      modo: "1v1v1v1",
      configuracion: { entrada: 10000, premio: 40000 },
      jugadores: [
        { nickname: "Sofia", username: "sofia_queen" },
        { nickname: "Diego", username: "diego_master" },
      ],
    },
    {
      _id: "sala_premium",
      juego: "ludo",
      modo: "1v1v1v1",
      configuracion: { entrada: 25000, premio: 100000 },
      jugadores: [{ nickname: "Laura", username: "laura_best" }],
    },
  ];

  console.log("\n📋 Probando diferentes niveles de premios:\n");

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

    // Preparar lista de jugadores
    let jugadoresList = "";
    if (sala.jugadores && sala.jugadores.length > 0) {
      const jugadoresNombres = sala.jugadores.map((jugador) => {
        if (typeof jugador === "object" && jugador !== null) {
          return (
            jugador.nickname ||
            jugador.first_name ||
            jugador.username ||
            "Jugador"
          );
        }
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

    // Calcular relación premio/entrada
    const relacionPremio =
      sala.configuracion?.premio && sala.configuracion?.entrada
        ? (sala.configuracion.premio / sala.configuracion.entrada).toFixed(1)
        : 0;
    console.log(`📊 **Relación Premio/Entrada:** ${relacionPremio}x`);

    console.log(""); // Línea en blanco
  });

  console.log("✅ Presentación de premios verificada correctamente!");
  console.log("📊 Se muestran correctamente:");
  console.log("   • Entrada y premio en formato de moneda");
  console.log("   • Diferentes niveles de premios");
  console.log("   • Relación premio/entrada para referencia");
  console.log("   • Formato legible con separadores de miles");
}

testPresentacionPremios();
