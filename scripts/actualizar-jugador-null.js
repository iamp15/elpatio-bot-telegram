"use strict";

require("dotenv").config();
const BackendAPI = require("../api/backend");

async function actualizarJugadorNull() {
  console.log("🔄 ACTUALIZANDO JUGADOR CON NICKNAME NULL");
  console.log("=".repeat(50));

  const api = new BackendAPI({
    baseUrl: process.env.BACKEND_URL || "http://localhost:5000",
    botEmail: process.env.BOT_EMAIL,
    botPassword: process.env.BOT_PASSWORD,
  });

  try {
    console.log("📋 Buscando jugador con nickname null...");

    // Obtener todos los jugadores
    const jugadores = await api.getAllPlayers();
    const jugadorNull = jugadores.find((j) => j.nickname === null);

    if (!jugadorNull) {
      console.log("✅ No hay jugadores con nickname null");
      return;
    }

    console.log(`\n🚨 JUGADOR ENCONTRADO:`);
    console.log(`   ID: ${jugadorNull._id}`);
    console.log(`   telegramId: ${jugadorNull.telegramId}`);
    console.log(`   username: ${jugadorNull.username || "N/A"}`);
    console.log(`   nickname: ${jugadorNull.nickname}`);
    console.log(`   firstName: ${jugadorNull.firstName || "N/A"}`);

    // Crear el nuevo nickname único
    const nuevoNickname = `SIN_NICKNAME_${jugadorNull.telegramId}`;
    const nombreMostrado =
      jugadorNull.firstName || jugadorNull.username || "Jugador";

    console.log(`\n🔧 ACTUALIZACIÓN:`);
    console.log(`   Nuevo nickname: ${nuevoNickname}`);
    console.log(`   Nombre a mostrar: ${nombreMostrado}`);

    console.log(`\n📝 COMANDO PARA MONGODB ATLAS:`);
    console.log(`db.jugadores.updateOne(`);
    console.log(`  { "_id": ObjectId("${jugadorNull._id}") },`);
    console.log(`  {`);
    console.log(`    $set: {`);
    console.log(`      "nickname": "${nuevoNickname}",`);
    console.log(`      "firstName": "${nombreMostrado}"`);
    console.log(`    }`);
    console.log(`  }`);
    console.log(`)`);

    console.log(`\n🎯 DESPUÉS DE LA ACTUALIZACIÓN:`);
    console.log(`1. El jugador tendrá nickname único: ${nuevoNickname}`);
    console.log(`2. Se mostrará como: ${nombreMostrado}`);
    console.log(`3. No más errores de índice único`);
    console.log(`4. Otros jugadores podrán elegir no usar nickname`);
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

actualizarJugadorNull();
