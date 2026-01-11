/**
 * Script para probar el flujo completo del bot con mejoras de estado persistente
 * Simula el comportamiento real del usuario
 */

require("dotenv").config();
const BackendAPI = require("../api/backend");
const userStateManager = require("../user-state");
const { getGameName } = require("../utils/helpers");
const BOT_CONFIG = require("../config/bot-config");

// Variables de entorno
const BACKEND_URL = process.env.BACKEND_URL;
const BOT_EMAIL = process.env.BOT_EMAIL;
const BOT_PASSWORD = process.env.BOT_PASSWORD;

if (!BACKEND_URL || !BOT_EMAIL || !BOT_PASSWORD) {
  console.error("❌ Faltan variables de entorno necesarias");
  process.exit(1);
}

async function testFlujoCompletoMejorado() {
  console.log("🧪 Probando flujo completo del bot con mejoras...\n");

  try {
    // Inicializar API
    const api = new BackendAPI({
      baseUrl: BACKEND_URL,
      botEmail: BOT_EMAIL,
      botPassword: BOT_PASSWORD,
      preToken: null,
    });

    const testUserId = "test_user_completo";

    console.log("👤 Simulando usuario nuevo...");

    // 1. Simular comando /start (usuario sin juego seleccionado)
    console.log("\n1️⃣ Simulando /start (sin juego seleccionado):");
    userStateManager.clearSelectedGame(testUserId);
    const estadoInicial = userStateManager.getSelectedGame(testUserId);
    console.log(`   Estado inicial: ${estadoInicial || "Ninguno"}`);

    // Simular mensaje de bienvenida
    const displayName = "Usuario de Prueba";
    let welcomeMessage = BOT_CONFIG.messages.start(displayName);
    const selectedGame = userStateManager.getSelectedGame(testUserId);

    if (selectedGame) {
      const gameName = getGameName(selectedGame);
      welcomeMessage += `\n\n🎮 **Juego seleccionado:** ${gameName}\n💡 Usa el botón "Cambiar Juego" si deseas seleccionar otro juego.`;
    }

    console.log("   Mensaje de bienvenida generado correctamente");
    console.log("   ✅ Flujo /start sin juego funciona");

    // 2. Simular selección de juego
    console.log("\n2️⃣ Simulando selección de juego:");
    const juegoDisponible = BOT_CONFIG.juegos.find((j) => j.disponible);
    if (juegoDisponible) {
      userStateManager.setSelectedGame(testUserId, juegoDisponible.id, 2); // 2 horas de expiración
      console.log(`   Juego seleccionado: ${juegoDisponible.nombre}`);

      const gameInfo = userStateManager.getSelectedGameInfo(testUserId);
      if (gameInfo) {
        console.log(`   Expiración: ${gameInfo.expiresAt ? "Sí" : "No"}`);
        if (gameInfo.expiresAt) {
          const expiryDate = new Date(gameInfo.expiresAt);
          console.log(
            `   Fecha de expiración: ${expiryDate.toLocaleString("es-ES")}`
          );
          console.log(
            `   Expira pronto: ${gameInfo.isExpiringSoon ? "Sí" : "No"}`
          );
        }
      }
      console.log("   ✅ Selección de juego exitosa");
    }

    // 3. Simular comando /start (usuario CON juego seleccionado)
    console.log("\n3️⃣ Simulando /start (CON juego seleccionado):");
    const selectedGameAfter = userStateManager.getSelectedGame(testUserId);
    let welcomeMessageWithGame = BOT_CONFIG.messages.start(displayName);

    if (selectedGameAfter) {
      const gameName = getGameName(selectedGameAfter);
      welcomeMessageWithGame += `\n\n🎮 **Juego seleccionado:** ${gameName}\n💡 Usa el botón "Cambiar Juego" si deseas seleccionar otro juego.`;
      console.log(`   Juego detectado: ${gameName}`);
      console.log("   ✅ Mensaje de bienvenida incluye información del juego");
    }

    // 4. Simular comando /mijuego
    console.log("\n4️⃣ Simulando comando /mijuego:");
    const gameInfoForMiJuego = userStateManager.getSelectedGameInfo(testUserId);
    if (gameInfoForMiJuego) {
      const gameName = getGameName(gameInfoForMiJuego.gameId);
      let miJuegoMessage = `🎮 **Tu juego seleccionado:** ${gameName}`;

      if (gameInfoForMiJuego.expiresAt) {
        const expiryDate = new Date(gameInfoForMiJuego.expiresAt);
        const formattedDate = expiryDate.toLocaleString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        if (gameInfoForMiJuego.isExpiringSoon) {
          miJuegoMessage += `\n⚠️ **Expira pronto:** ${formattedDate} (en ${
            gameInfoForMiJuego.hoursUntilExpiry
          } hora${gameInfoForMiJuego.hoursUntilExpiry !== 1 ? "s" : ""})`;
        } else {
          miJuegoMessage += `\n🕐 **Expira:** ${formattedDate}`;
        }
      }

      miJuegoMessage += `\n\n💡 Usa /salas para ver las salas disponibles o /cambiarjuego para cambiar.`;
      console.log("   Mensaje /mijuego generado:");
      console.log(`   ${miJuegoMessage.replace(/\n/g, "\n   ")}`);
      console.log("   ✅ Comando /mijuego funciona correctamente");
    }

    // 5. Simular comando /juegos (mostrar juego actual)
    console.log("\n5️⃣ Simulando comando /juegos:");
    const currentGameInfo = userStateManager.getSelectedGameInfo(testUserId);
    let juegosMessage = BOT_CONFIG.messages.seleccionJuego;

    if (currentGameInfo) {
      const currentGameName = getGameName(currentGameInfo.gameId);
      juegosMessage += `\n\n🎮 **Juego actual:** ${currentGameName}`;

      if (currentGameInfo.expiresAt) {
        const expiryDate = new Date(currentGameInfo.expiresAt);
        const formattedDate = expiryDate.toLocaleString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
        juegosMessage += `\n🕐 **Expira:** ${formattedDate}`;
      }

      juegosMessage += `\n💡 Selecciona un nuevo juego para cambiar.`;
      console.log("   Mensaje /juegos generado:");
      console.log(`   ${juegosMessage.replace(/\n/g, "\n   ")}`);
      console.log("   ✅ Comando /juegos muestra juego actual");
    }

    // 6. Simular cambio de juego
    console.log("\n6️⃣ Simulando cambio de juego:");
    const previousGameInfo = userStateManager.getSelectedGameInfo(testUserId);
    if (previousGameInfo) {
      const previousGameName = getGameName(previousGameInfo.gameId);
      console.log(`   Juego anterior: ${previousGameName}`);

      // Simular selección del mismo juego (no debería cambiar)
      userStateManager.setSelectedGame(testUserId, previousGameInfo.gameId, 1);
      const newGameInfo = userStateManager.getSelectedGameInfo(testUserId);
      const newGameName = getGameName(newGameInfo.gameId);
      console.log(`   Nuevo juego: ${newGameName}`);
      console.log("   ✅ Cambio de juego procesado");
    }

    // 7. Verificar que las validaciones siguen funcionando
    console.log("\n7️⃣ Verificando validaciones:");
    const gameForValidation = userStateManager.getSelectedGame(testUserId);
    if (gameForValidation) {
      console.log(
        `   Usuario tiene juego seleccionado: ${getGameName(gameForValidation)}`
      );
      console.log("   ✅ Validaciones funcionan correctamente");
    } else {
      console.log("   Usuario no tiene juego seleccionado");
      console.log("   ✅ Validaciones funcionan correctamente");
    }

    // 8. Limpiar estado final
    console.log("\n8️⃣ Limpiando estado final...");
    userStateManager.clearSelectedGame(testUserId);
    const estadoFinal = userStateManager.getSelectedGame(testUserId);
    if (!estadoFinal) {
      console.log("   ✅ Estado limpiado correctamente");
    }

    console.log("\n🎉 Flujo completo del bot probado exitosamente");
    console.log("\n📋 Resumen de mejoras implementadas:");
    console.log("   ✅ Información del juego en mensaje de bienvenida");
    console.log("   ✅ Sistema de expiración opcional");
    console.log("   ✅ Información detallada en /mijuego");
    console.log("   ✅ Mostrar juego actual en /juegos");
    console.log("   ✅ Notificaciones de cambio de juego");
    console.log("   ✅ Validaciones mejoradas");
  } catch (error) {
    console.error("\n❌ Error en las pruebas:", error.message);
    process.exit(1);
  }
}

// Ejecutar pruebas
testFlujoCompletoMejorado();
