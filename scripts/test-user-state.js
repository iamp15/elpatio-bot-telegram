"use strict";

require("dotenv").config();
const userStateManager = require("../user-state");

function testUserState() {
  console.log("🧪 Probando funciones del user-state...");

  const testUserId = "test_user_123";

  try {
    // Probar setSelectedGame
    console.log("\n1️⃣ Probando setSelectedGame...");
    userStateManager.setSelectedGame(testUserId, "ludo");
    console.log("✅ setSelectedGame ejecutado correctamente");

    // Probar getSelectedGame
    console.log("\n2️⃣ Probando getSelectedGame...");
    const selectedGame = userStateManager.getSelectedGame(testUserId);
    console.log(`✅ getSelectedGame: ${selectedGame}`);

    // Probar getStats
    console.log("\n3️⃣ Probando getStats...");
    const stats = userStateManager.getStats();
    console.log("✅ getStats:", stats);

    // Probar setState y getState (funciones temporales)
    console.log("\n4️⃣ Probando setState/getState...");
    userStateManager.setState(testUserId, { waitingForNickname: true });
    const state = userStateManager.getState(testUserId);
    console.log("✅ setState/getState:", state);

    // Limpiar estado de prueba
    console.log("\n5️⃣ Limpiando estado de prueba...");
    userStateManager.clearSelectedGame(testUserId);
    userStateManager.clearState(testUserId);
    console.log("✅ Estado limpiado correctamente");

    console.log("\n🎉 Todas las funciones funcionan correctamente!");
  } catch (err) {
    console.error("❌ Error en las pruebas:", err.message);
  }
}

testUserState();
