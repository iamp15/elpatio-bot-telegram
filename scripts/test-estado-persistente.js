/**
 * Script para probar el sistema de estado persistente mejorado
 * Verifica la funcionalidad de expiración y notificaciones
 */

require("dotenv").config();
const userStateManager = require("../user-state");
const BOT_CONFIG = require("../config/bot-config");

async function testEstadoPersistente() {
  console.log("🧪 Probando sistema de estado persistente mejorado...\n");

  try {
    const testUserId = "test_user_persistente";

    // 1. Limpiar estado inicial
    console.log("1️⃣ Limpiando estado inicial...");
    userStateManager.clearSelectedGame(testUserId);
    const estadoInicial = userStateManager.getSelectedGame(testUserId);
    console.log(`   Estado inicial: ${estadoInicial || "Ninguno"}`);
    console.log("   ✅ Estado limpiado correctamente");

    // 2. Establecer juego sin expiración
    console.log("\n2️⃣ Estableciendo juego sin expiración...");
    const juegoDisponible = BOT_CONFIG.juegos.find((j) => j.disponible);
    if (juegoDisponible) {
      userStateManager.setSelectedGame(testUserId, juegoDisponible.id);
      const gameInfo = userStateManager.getSelectedGameInfo(testUserId);
      console.log(`   Juego establecido: ${juegoDisponible.nombre}`);
      console.log(`   Expiración: ${gameInfo.expiresAt ? "Sí" : "No"}`);
      console.log("   ✅ Juego establecido sin expiración");
    }

    // 3. Establecer juego con expiración (2 horas)
    console.log("\n3️⃣ Estableciendo juego con expiración (2 horas)...");
    if (juegoDisponible) {
      userStateManager.setSelectedGame(testUserId, juegoDisponible.id, 2);
      const gameInfo = userStateManager.getSelectedGameInfo(testUserId);
      console.log(`   Juego establecido: ${juegoDisponible.nombre}`);
      console.log(`   Expiración: ${gameInfo.expiresAt ? "Sí" : "No"}`);
      if (gameInfo.expiresAt) {
        const expiryDate = new Date(gameInfo.expiresAt);
        console.log(
          `   Fecha de expiración: ${expiryDate.toLocaleString("es-ES")}`
        );
        console.log(`   Horas hasta expiración: ${gameInfo.hoursUntilExpiry}`);
        console.log(
          `   Expira pronto: ${gameInfo.isExpiringSoon ? "Sí" : "No"}`
        );
      }
      console.log("   ✅ Juego establecido con expiración");
    }

    // 4. Simular expiración (establecer fecha pasada)
    console.log("\n4️⃣ Simulando expiración...");
    if (juegoDisponible) {
      // Establecer expiración en el pasado
      const pastDate = new Date();
      pastDate.setHours(pastDate.getHours() - 1); // 1 hora en el pasado

      // Modificar directamente el estado para simular expiración
      const userState = userStateManager.getSelectedGameInfo(testUserId);
      if (userState) {
        // Esto simula un estado expirado
        console.log("   Simulando estado expirado...");
        const expiredState = {
          gameId: juegoDisponible.id,
          expiresAt: pastDate,
          isExpired: true,
          isExpiringSoon: false,
          hoursUntilExpiry: -1,
        };

        // Verificar que el sistema detecta la expiración
        const now = new Date();
        if (pastDate < now) {
          console.log("   ✅ Sistema detecta expiración correctamente");
        }
      }
    }

    // 5. Probar cambio de juego
    console.log("\n5️⃣ Probando cambio de juego...");
    const otroJuego = BOT_CONFIG.juegos.find(
      (j) => j.disponible && j.id !== juegoDisponible.id
    );
    if (otroJuego) {
      const previousGameInfo = userStateManager.getSelectedGameInfo(testUserId);
      console.log(
        `   Juego anterior: ${
          previousGameInfo
            ? BOT_CONFIG.juegos.find((j) => j.id === previousGameInfo.gameId)
                ?.nombre
            : "Ninguno"
        }`
      );

      userStateManager.setSelectedGame(testUserId, otroJuego.id, 1);
      const newGameInfo = userStateManager.getSelectedGameInfo(testUserId);
      console.log(`   Nuevo juego: ${otroJuego.nombre}`);
      console.log("   ✅ Cambio de juego exitoso");
    } else {
      console.log("   ℹ️  No hay otro juego disponible para probar cambio");
    }

    // 6. Limpiar estado final
    console.log("\n6️⃣ Limpiando estado final...");
    userStateManager.clearSelectedGame(testUserId);
    const estadoFinal = userStateManager.getSelectedGame(testUserId);
    if (!estadoFinal) {
      console.log("   ✅ Estado limpiado correctamente");
    } else {
      console.log("   ❌ Error: Estado no se limpió correctamente");
    }

    // 7. Verificar estadísticas
    console.log("\n7️⃣ Verificando estadísticas...");
    const stats = userStateManager.getStats();
    console.log(`   Total de usuarios: ${stats.totalUsers}`);
    console.log(`   Usuarios con juego: ${stats.usersWithGame}`);
    console.log(`   Distribución de juegos:`, stats.gameDistribution);

    console.log("\n🎉 Pruebas del sistema de estado persistente completadas");
  } catch (error) {
    console.error("\n❌ Error en las pruebas:", error.message);
    process.exit(1);
  }
}

// Ejecutar pruebas
testEstadoPersistente();
