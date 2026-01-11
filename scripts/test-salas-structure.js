"use strict";

require("dotenv").config();

// Definir las salas de prueba directamente (mismo formato que en callbacks.js)
const TEST_SALAS = [
  {
    _id: "sala_test_1",
    juego: "ludo",
    modo: "clásico",
    configuracion: {
      entrada: 5000,
      jugadoresMax: 4,
      juego: "ludo",
      premio: 20000, // Premio requerido por el backend
    },
    jugadores: [],
  },
  {
    _id: "sala_test_2",
    juego: "ludo",
    modo: "rápido",
    configuracion: {
      entrada: 3000,
      jugadoresMax: 4,
      juego: "ludo",
      premio: 12000, // Premio requerido por el backend
    },
    jugadores: [{ id: "jugador1" }],
  },
];

function testSalasStructure() {
  console.log("🧪 Verificando estructura de salas de prueba...");

  TEST_SALAS.forEach((sala, index) => {
    console.log(`\n📋 Sala ${index + 1}:`);
    console.log(`   ID: ${sala._id}`);
    console.log(`   Juego: ${sala.juego}`);
    console.log(`   Modo: ${sala.modo}`);
    console.log(`   Entrada: ${sala.configuracion?.entrada}`);
    console.log(`   Premio: ${sala.configuracion?.premio || "❌ FALTANTE"}`);

    if (sala.configuracion?.premio) {
      console.log(`   ✅ Premio configurado correctamente`);
    } else {
      console.log(`   ❌ Falta campo premio`);
    }
  });

  console.log("\n🎉 Verificación completada!");
}

testSalasStructure();
