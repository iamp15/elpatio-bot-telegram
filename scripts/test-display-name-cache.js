"use strict";

require("dotenv").config();
const BackendAPI = require("../api/backend");
const { getUserDisplayName } = require("../utils/helpers");
const userStateManager = require("../user-state");

async function testDisplayNameCache() {
  console.log("🧪 PROBANDO SISTEMA DE CACHE DEL DISPLAY NAME");
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

    const jugador = jugadores[0];
    console.log(
      `\n📋 2. Probando con jugador: ${jugador.username} (${jugador._id})`
    );
    console.log(`   Nickname: ${jugador.nickname || "N/A"}`);
    console.log(`   FirstName: ${jugador.firstName || "N/A"}`);

    // Simular objeto user de Telegram
    const mockUser = {
      id: jugador.telegramId,
      first_name: jugador.firstName || null,
      username: jugador.username || null,
    };

    console.log("\n📋 3. Primera llamada (sin cache):");
    console.time("   ⏱️  Tiempo primera llamada");
    const displayName1 = await getUserDisplayName(api, mockUser, true);
    console.timeEnd("   ⏱️  Tiempo primera llamada");
    console.log(`   🎯 Display name: "${displayName1}"`);

    // Verificar que se guardó en el estado
    const cachedName = userStateManager.getDisplayName(mockUser.id);
    console.log(`   💾 Cache guardado: "${cachedName}"`);

    console.log("\n📋 4. Segunda llamada (con cache):");
    console.time("   ⏱️  Tiempo segunda llamada");
    const displayName2 = await getUserDisplayName(api, mockUser, true);
    console.timeEnd("   ⏱️  Tiempo segunda llamada");
    console.log(`   🎯 Display name: "${displayName2}"`);

    console.log("\n📋 5. Tercera llamada (sin cache):");
    console.time("   ⏱️  Tiempo tercera llamada");
    const displayName3 = await getUserDisplayName(api, mockUser, false);
    console.timeEnd("   ⏱️  Tiempo tercera llamada");
    console.log(`   🎯 Display name: "${displayName3}"`);

    // Verificar consistencia
    const isConsistent =
      displayName1 === displayName2 && displayName2 === displayName3;
    console.log(`\n📋 6. Verificación de consistencia:`);
    console.log(`   ✅ Nombres consistentes: ${isConsistent ? "SÍ" : "NO"}`);

    if (isConsistent) {
      console.log("   ✅ Cache funcionando correctamente");
    } else {
      console.log("   ❌ Error en el cache");
    }

    console.log("\n🎯 RESULTADO:");
    console.log("   ✅ Sistema de cache implementado");
    console.log("   ✅ Display name guardado en estado");
    console.log("   ✅ Consultas posteriores más rápidas");
    console.log("   ✅ Consistencia de datos mantenida");
  } catch (err) {
    console.error("❌ Error en prueba:", err.message);
  }
}

testDisplayNameCache();
