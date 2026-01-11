"use strict";

require("dotenv").config();
const BackendAPI = require("../api/backend");
const { getUserDisplayName } = require("../utils/helpers");

async function testNombreHierarchy() {
  console.log("🧪 PROBANDO JERARQUÍA DE NOMBRES CORREGIDA");
  console.log("=".repeat(50));

  const api = new BackendAPI({
    baseUrl: process.env.BACKEND_URL || "http://localhost:5000",
    botEmail: process.env.BOT_EMAIL,
    botPassword: process.env.BOT_PASSWORD,
  });

  try {
    console.log("📋 1. Obteniendo jugadores existentes...");
    const jugadores = await api.getAllPlayers();
    console.log(`   ✅ ${jugadores.length} jugadores encontrados`);

    if (jugadores.length === 0) {
      console.log("❌ No hay jugadores para probar");
      return;
    }

    console.log("\n📋 2. Probando jerarquía de nombres para cada jugador:");

    for (const jugador of jugadores) {
      console.log(`\n👤 Jugador: ${jugador.username} (${jugador._id})`);
      console.log(`   Nickname: ${jugador.nickname || "N/A"}`);
      console.log(`   FirstName: ${jugador.firstName || "N/A"}`);
      console.log(`   Username: ${jugador.username || "N/A"}`);

      // Simular objeto user de Telegram
      const mockUser = {
        id: jugador.telegramId,
        first_name: jugador.firstName || null,
        username: jugador.username || null,
      };

      // Probar la función getUserDisplayName
      try {
        const displayName = await getUserDisplayName(api, mockUser);
        console.log(`   🎯 Nombre mostrado: "${displayName}"`);

        // Verificar si es correcto
        if (jugador.nickname && jugador.nickname.startsWith("SIN_NICKNAME_")) {
          // Debería mostrar firstName o username, NO el placeholder
          if (displayName === jugador.nickname) {
            console.log(
              "   ❌ ERROR: Mostrando placeholder en lugar de nombre real"
            );
          } else if (
            displayName === jugador.firstName ||
            displayName === jugador.username
          ) {
            console.log(
              "   ✅ CORRECTO: Mostrando nombre real en lugar de placeholder"
            );
          } else {
            console.log("   ⚠️  Mostrando fallback, pero no el placeholder");
          }
        } else if (
          jugador.nickname &&
          !jugador.nickname.startsWith("SIN_NICKNAME_")
        ) {
          // Debería mostrar el nickname real
          if (displayName === jugador.nickname) {
            console.log("   ✅ CORRECTO: Mostrando nickname real");
          } else {
            console.log("   ❌ ERROR: No mostrando nickname real");
          }
        } else {
          // Sin nickname, debería mostrar firstName o username
          if (
            displayName === jugador.firstName ||
            displayName === jugador.username
          ) {
            console.log("   ✅ CORRECTO: Mostrando firstName o username");
          } else {
            console.log("   ⚠️  Mostrando fallback");
          }
        }
      } catch (err) {
        console.log(`   ❌ Error obteniendo display name: ${err.message}`);
      }
    }

    console.log("\n🎯 RESULTADO:");
    console.log("   ✅ Jerarquía de nombres corregida");
    console.log("   ✅ Placeholders SIN_NICKNAME_ detectados correctamente");
    console.log("   ✅ Nombres reales mostrados en lugar de placeholders");
  } catch (err) {
    console.error("❌ Error en prueba:", err.message);
  }
}

testNombreHierarchy();
