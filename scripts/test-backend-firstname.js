"use strict";

require("dotenv").config();
const BackendAPI = require("../api/backend");

async function testBackendFirstName() {
  console.log("🧪 PROBANDO SI EL BACKEND ACEPTA FIRSTNAME");
  console.log("=".repeat(50));

  const api = new BackendAPI({
    baseUrl: process.env.BACKEND_URL || "http://localhost:5000",
    botEmail: process.env.BOT_EMAIL,
    botPassword: process.env.BOT_PASSWORD,
  });

  try {
    console.log("📋 1. Creando jugador de prueba con firstName...");

    const jugadorPrueba = {
      telegramId: "555666777",
      username: "test_firstname_v3",
      nickname: "SIN_NICKNAME_555666777",
      firstName: "TestNombre",
    };

    console.log("📝 Datos enviados al backend:");
    console.log(JSON.stringify(jugadorPrueba, null, 2));

    const nuevoJugador = await api.createPlayer(jugadorPrueba);

    console.log("\n📋 2. Respuesta del backend:");
    console.log(JSON.stringify(nuevoJugador, null, 2));

    console.log("\n📋 3. Verificando campos:");
    const jugador = nuevoJugador.jugador || nuevoJugador;
    console.log(`   telegramId: ${jugador.telegramId}`);
    console.log(`   username: ${jugador.username}`);
    console.log(`   nickname: ${jugador.nickname}`);
    console.log(`   firstName: ${jugador.firstName || "N/A"}`);

    if (jugador.firstName) {
      console.log("   ✅ El backend SÍ guarda el campo firstName");
    } else {
      console.log("   ❌ El backend NO guarda el campo firstName");
      console.log("\n🔧 PROBLEMA IDENTIFICADO:");
      console.log("   El backend no está guardando el campo firstName");
      console.log("   Posibles causas:");
      console.log("   1. El esquema de Jugador no incluye firstName");
      console.log("   2. El controlador no procesa el campo firstName");
      console.log("   3. El campo firstName no está en la validación");
    }

    // Limpiar jugador de prueba
    console.log("\n🧹 Limpiando jugador de prueba...");
    console.log("   (Necesitarás eliminarlo manualmente del backend)");
  } catch (err) {
    console.error("❌ Error:", err.message);
    console.log("\n🔍 Análisis del error:");
    if (err.response) {
      console.log(`   Status: ${err.response.status}`);
      console.log(`   Data: ${JSON.stringify(err.response.data, null, 2)}`);
    }
  }
}

testBackendFirstName();
