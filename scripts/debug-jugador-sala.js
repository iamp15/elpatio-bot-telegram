"use strict";

require("dotenv").config();
const BOT_CONFIG = require("../config/bot-config");

function debugJugadorSala() {
  console.log("🔍 Diagnosticando problema con jugador 146c en sala 1474...");

  // Simular diferentes escenarios de datos que podríamos recibir
  const escenariosPrueba = [
    {
      descripcion: "Solo ID (como probablemente viene del backend)",
      jugador: "146c",
      tipo: typeof "146c",
    },
    {
      descripcion: "Objeto completo (ideal)",
      jugador: {
        _id: "146c",
        nickname: null,
        first_name: "Igor",
        username: "iamp15",
      },
      tipo: typeof { _id: "146c" },
    },
    {
      descripcion: "Objeto con ID como string",
      jugador: {
        id: "146c",
        nickname: null,
        first_name: "Igor",
        username: "iamp15",
      },
      tipo: typeof { id: "146c" },
    },
    {
      descripcion: "Objeto con _id como ObjectId",
      jugador: {
        _id: "146c",
        nickname: null,
        first_name: "Igor",
        username: "iamp15",
      },
      tipo: typeof { _id: "146c" },
    },
  ];

  console.log("\n📋 Analizando diferentes formatos de datos:\n");

  escenariosPrueba.forEach((escenario, index) => {
    console.log(`${index + 1}. ${escenario.descripcion}`);
    console.log(`   Tipo: ${escenario.tipo}`);
    console.log(`   Datos: ${JSON.stringify(escenario.jugador)}`);

    // Aplicar la lógica actual
    let nombreMostrado;
    if (typeof escenario.jugador === "object" && escenario.jugador !== null) {
      nombreMostrado =
        escenario.jugador.nickname ||
        escenario.jugador.first_name ||
        escenario.jugador.username ||
        "Jugador";
    } else {
      nombreMostrado = "Jugador";
    }

    console.log(`   Resultado actual: ${nombreMostrado}`);
    console.log(
      `   Problema: ${
        nombreMostrado === "Jugador" ? "❌ Muestra fallback" : "✅ Funciona"
      }`
    );
    console.log("");
  });

  console.log("🎯 Diagnóstico:");
  console.log(
    "   • Si el jugador viene como string '146c', la lógica actual falla"
  );
  console.log("   • Necesitamos buscar la información del jugador por ID");
  console.log("   • O el backend debe enviar objetos completos de jugadores");
  console.log("");
  console.log("💡 Soluciones posibles:");
  console.log(
    "   1. Modificar el backend para enviar objetos completos de jugadores"
  );
  console.log(
    "   2. Hacer una llamada adicional al backend para obtener datos del jugador"
  );
  console.log("   3. Mantener un cache local de jugadores");
}

debugJugadorSala();
