"use strict";

require("dotenv").config();
const BackendAPI = require("../api/backend");

async function eliminarJugadorNull() {
  console.log("🗑️ ELIMINANDO JUGADOR CON NICKNAME NULL");
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

    console.log(`\n⚠️  ¿Estás seguro de que quieres eliminar este jugador?`);
    console.log(
      `   Esto permitirá que se registre de nuevo con la nueva lógica.`
    );

    // Simular eliminación (no ejecutar realmente por seguridad)
    console.log(`\n🔧 PARA ELIMINAR MANUALMENTE:`);
    console.log(`1. Ve a MongoDB Atlas`);
    console.log(`2. Busca la colección 'jugadores'`);
    console.log(`3. Encuentra el documento con _id: ${jugadorNull._id}`);
    console.log(`4. Elimínalo`);

    console.log(`\n📝 O usa este comando en MongoDB Atlas:`);
    console.log(
      `db.jugadores.deleteOne({ "_id": ObjectId("${jugadorNull._id}") })`
    );

    console.log(`\n🎯 DESPUÉS DE ELIMINAR:`);
    console.log(`1. El bot podrá registrar jugadores sin problemas`);
    console.log(`2. El jugador se registrará de nuevo con nickname: "Igor"`);
    console.log(`3. No más errores de índice único`);
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

eliminarJugadorNull();
