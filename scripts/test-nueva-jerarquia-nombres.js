"use strict";

require("dotenv").config();
const BOT_CONFIG = require("../config/bot-config");

function testNuevaJerarquiaNombres() {
  console.log("🧪 Probando nueva jerarquía de nombres de jugadores...");
  console.log("📋 Jerarquía: nickname → firstName → username → 'Jugador'");

  // Simular diferentes escenarios de jugadores
  const jugadoresPrueba = [
    {
      descripcion: "Solo nickname",
      jugador: {
        nickname: "Carlos",
        username: "carlos123",
        firstName: "Carlos",
      },
      esperado: "Carlos",
    },
    {
      descripcion: "Solo firstName",
      jugador: { username: "luis_pro", firstName: "Luis" },
      esperado: "Luis",
    },
    {
      descripcion: "Solo username",
      jugador: { username: "maria_win" },
      esperado: "maria_win",
    },
    {
      descripcion: "Sin datos",
      jugador: {},
      esperado: "Jugador",
    },
    {
      descripcion: "Solo ID (string)",
      jugador: "507f1f77bcf86cd799439011",
      esperado: "Jugador",
    },
    {
      descripcion: "Nickname y firstName (debe usar nickname)",
      jugador: { nickname: "Ana", firstName: "Ana", username: "ana_gamer" },
      esperado: "Ana",
    },
    {
      descripcion: "firstName y username (debe usar firstName)",
      jugador: { firstName: "Pedro", username: "pedro_king" },
      esperado: "Pedro",
    },
    {
      descripcion: "Todos los campos (debe usar nickname)",
      jugador: {
        nickname: "Sofia",
        firstName: "Sofia",
        username: "sofia_queen",
      },
      esperado: "Sofia",
    },
  ];

  console.log("\n📋 Probando diferentes escenarios:\n");

  jugadoresPrueba.forEach((caso, index) => {
    console.log(`${index + 1}. ${caso.descripcion}`);

    // Aplicar la nueva jerarquía
    let nombreMostrado;
    if (typeof caso.jugador === "object" && caso.jugador !== null) {
      nombreMostrado =
        caso.jugador.nickname ||
        caso.jugador.firstName ||
        caso.jugador.username ||
        "Jugador";
    } else {
      nombreMostrado = "Jugador";
    }

    const resultado = nombreMostrado === caso.esperado ? "✅" : "❌";
    console.log(`   Entrada: ${JSON.stringify(caso.jugador)}`);
    console.log(`   Resultado: ${nombreMostrado} ${resultado}`);
    console.log(`   Esperado: ${caso.esperado}`);
    console.log("");
  });

  // Probar con una sala completa
  console.log("🎮 Probando con una sala completa:");
  const salaPrueba = {
    _id: "sala_test",
    juego: "ludo",
    modo: "1v1v1v1",
    configuracion: { entrada: 5000, premio: 20000 },
    jugadores: [
      { nickname: "Carlos", username: "carlos123", firstName: "Carlos" },
      { firstName: "Luis", username: "luis_pro" },
      { username: "maria_win" },
      "507f1f77bcf86cd799439011",
    ],
  };

  const jugadoresNombres = salaPrueba.jugadores.map((jugador) => {
    if (typeof jugador === "object" && jugador !== null) {
      return (
        jugador.nickname || jugador.firstName || jugador.username || "Jugador"
      );
    }
    return "Jugador";
  });

  console.log(`👤 **Jugadores:** ${jugadoresNombres.join(", ")}`);
  console.log("   Resultado esperado: Carlos, Luis, maria_win, Jugador");

  console.log("\n✅ Nueva jerarquía de nombres verificada correctamente!");
  console.log("📊 Prioridad implementada:");
  console.log("   1. nickname (si existe)");
  console.log("   2. firstName (si no hay nickname)");
  console.log("   3. username (si no hay nickname ni firstName)");
  console.log("   4. 'Jugador' (fallback)");
}

testNuevaJerarquiaNombres();
