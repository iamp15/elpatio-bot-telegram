"use strict";

require("dotenv").config();
const BackendAPI = require("../api/backend");

async function actualizarFirstName() {
  console.log("🔄 ACTUALIZANDO FIRSTNAME DE JUGADORES");
  console.log("=".repeat(50));

  const api = new BackendAPI({
    baseUrl: process.env.BACKEND_URL || "http://localhost:5000",
    botEmail: process.env.BOT_EMAIL,
    botPassword: process.env.BOT_PASSWORD,
  });

  try {
    console.log("📋 Obteniendo jugadores...");
    const jugadores = await api.getAllPlayers();

    if (jugadores.length === 0) {
      console.log("❌ No hay jugadores para actualizar");
      return;
    }

    console.log(`\n📊 Jugadores encontrados: ${jugadores.length}`);

    for (const jugador of jugadores) {
      console.log(`\n🔄 Actualizando jugador: ${jugador.username}`);
      console.log(`   ID: ${jugador._id}`);
      console.log(`   telegramId: ${jugador.telegramId}`);
      console.log(`   firstName actual: ${jugador.firstName || "N/A"}`);

      // Determinar el firstName basado en el telegramId
      let firstName;
      if (jugador.telegramId === "1604252279") {
        firstName = "Igor"; // Basado en el username iamp15
      } else if (jugador.telegramId === "7250505651") {
        firstName = "Usuario"; // Fallback para el segundo jugador
      } else {
        firstName = "Usuario"; // Fallback genérico
      }

      console.log(`   firstName a asignar: ${firstName}`);

      // Generar comando para MongoDB Atlas
      console.log(`\n📝 COMANDO PARA MONGODB ATLAS:`);
      console.log(`db.jugadores.updateOne(`);
      console.log(`  { "_id": ObjectId("${jugador._id}") },`);
      console.log(`  {`);
      console.log(`    $set: {`);
      console.log(`      "firstName": "${firstName}"`);
      console.log(`    }`);
      console.log(`  }`);
      console.log(`)`);

      console.log(`\n🎯 DESPUÉS DE LA ACTUALIZACIÓN:`);
      console.log(`1. El jugador tendrá firstName: ${firstName}`);
      console.log(
        `2. Se mostrará como: ${firstName} en lugar de ${jugador.username}`
      );
      console.log(`3. La jerarquía será: firstName → username → "Jugador"`);
    }

    console.log("\n📋 INSTRUCCIONES:");
    console.log("1. Ejecuta los comandos de MongoDB Atlas mostrados arriba");
    console.log(
      "2. Ejecuta 'node scripts/test-jugadores-actuales.js' para verificar"
    );
    console.log("3. Los jugadores se mostrarán con sus nombres reales");
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

actualizarFirstName();
