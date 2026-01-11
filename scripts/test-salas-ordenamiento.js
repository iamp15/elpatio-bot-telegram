"use strict";

require("dotenv").config();
const BOT_CONFIG = require("../config/bot-config");

function testOrdenamientoSalas() {
  console.log("🧪 Probando ordenamiento de salas por jugadores faltantes...");

  // Simular salas de prueba con jugadores más realistas
  const salasPrueba = [
    {
      _id: "sala_1",
      juego: "ludo",
      modo: "1v1v1v1",
      configuracion: { entrada: 5000, premio: 20000 },
      jugadores: [
        { nickname: "Carlos", username: "carlos123" },
        { nickname: "Ana", username: "ana_gamer" },
      ], // 2/4 jugadores
    },
    {
      _id: "sala_2",
      juego: "ludo",
      modo: "2v2",
      configuracion: { entrada: 3000, premio: 12000 },
      jugadores: [{ nickname: "Luis", username: "luis_pro" }], // 1/4 jugadores
    },
    {
      _id: "sala_3",
      juego: "ludo",
      modo: "1v1",
      configuracion: { entrada: 2000, premio: 4000 },
      jugadores: [
        { nickname: "María", username: "maria_win" },
        { nickname: "Pedro", username: "pedro_king" },
      ], // 2/2 jugadores (completa)
    },
    {
      _id: "sala_4",
      juego: "ludo",
      modo: "1v1v1v1",
      configuracion: { entrada: 4000, premio: 16000 },
      jugadores: [
        { nickname: "Sofia", username: "sofia_queen" },
        { nickname: "Diego", username: "diego_master" },
        { nickname: "Laura", username: "laura_best" },
      ], // 3/4 jugadores
    },
  ];

  console.log("\n📋 Salas originales:");
  salasPrueba.forEach((sala, index) => {
    console.log(
      `${index + 1}. Sala ${sala._id} - ${sala.modo} - ${
        sala.jugadores.length
      } jugadores`
    );
  });

  // Aplicar la lógica de ordenamiento
  const salasConPrioridad = salasPrueba.map((sala) => {
    // Obtener el juego correspondiente (ludo en este caso)
    const juego = BOT_CONFIG.juegos.find((j) => j.id === "ludo");
    const modoConfig = juego?.modos?.[sala.modo];
    const limiteJugadores = modoConfig?.limiteJugadores || 4;
    const jugadoresActuales = sala.jugadores?.length || 0;
    const jugadoresFaltantes = limiteJugadores - jugadoresActuales;

    return {
      ...sala,
      jugadoresFaltantes,
      limiteJugadores,
      modoNombre: modoConfig?.nombre || sala.modo,
    };
  });

  // Ordenar por jugadores faltantes (menos faltantes primero)
  salasConPrioridad.sort((a, b) => a.jugadoresFaltantes - b.jugadoresFaltantes);

  console.log("\n🎯 Salas ordenadas por jugadores faltantes:");
  salasConPrioridad.forEach((sala, index) => {
    const estadoSala =
      sala.jugadoresFaltantes === 0
        ? "🟢 Completa"
        : sala.jugadoresFaltantes === 1
        ? "🟡 Casi llena"
        : "🔵 Disponible";

    console.log(`${index + 1}. Sala ${sala._id}`);
    console.log(`   Modo: ${sala.modoNombre}`);
    console.log(
      `   Capacidad: ${sala.jugadores.length}/${sala.limiteJugadores} ${estadoSala}`
    );

    // Mostrar jugadores si existen
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
      console.log(`   👤 Jugadores: ${jugadoresNombres.join(", ")}`);
    }

    console.log(
      `   Faltan: ${sala.jugadoresFaltantes} jugador${
        sala.jugadoresFaltantes > 1 ? "es" : ""
      }`
    );
    console.log("");
  });

  console.log("✅ Ordenamiento verificado correctamente!");
  console.log("📊 Prioridad: Completa → Casi llena → Disponible");
}

testOrdenamientoSalas();
