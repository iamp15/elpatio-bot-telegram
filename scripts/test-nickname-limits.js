"use strict";

/**
 * Script de Prueba - Sistema de Límites de Nickname
 *
 * Este script prueba el sistema de límites implementado
 * para evitar abuso en cambios de nickname
 */

const NicknameLimitManager = require("../utils/nickname-limit-manager");

// Configuración de prueba
const TEST_CONFIG = {
  testUserId: "123456789", // ID de prueba
  testUserId2: "987654321", // Segundo ID de prueba
};

async function testNicknameLimits() {
  console.log("🔍 **PRUEBA - SISTEMA DE LÍMITES DE NICKNAME**\n");
  console.log("=".repeat(60) + "\n");

  try {
    // Inicializar gestor de límites
    console.log("🔧 **Inicializando Gestor de Límites...**");
    const limitManager = new NicknameLimitManager();
    console.log("✅ Gestor inicializado correctamente\n");

    // Prueba 1: Verificar límites iniciales
    console.log("1️⃣ **VERIFICANDO LÍMITES INICIALES**\n");

    const initialCheck = await limitManager.canChangeNickname(
      TEST_CONFIG.testUserId
    );

    console.log("✅ **Verificación inicial:**");
    console.log(`   Usuario: ${TEST_CONFIG.testUserId}`);
    console.log(`   Puede cambiar: ${initialCheck.canChange ? "SÍ" : "NO"}`);
    console.log(`   Cambios restantes: ${initialCheck.remainingChanges}`);
    console.log(`   Mensaje: ${initialCheck.message}`);
    console.log(
      `   Próximo reset: ${initialCheck.nextReset.toLocaleDateString(
        "es-ES"
      )}\n`
    );

    // Prueba 2: Simular cambio de nickname
    console.log("2️⃣ **SIMULANDO CAMBIO DE NICKNAME**\n");

    console.log("🔄 Registrando cambio de nickname...");
    await limitManager.recordNicknameChange(TEST_CONFIG.testUserId);

    const afterChange = await limitManager.canChangeNickname(
      TEST_CONFIG.testUserId
    );

    console.log("✅ **Después del cambio:**");
    console.log(`   Puede cambiar: ${afterChange.canChange ? "SÍ" : "NO"}`);
    console.log(`   Cambios restantes: ${afterChange.remainingChanges}`);
    console.log(`   Mensaje: ${afterChange.message}\n`);

    // Prueba 3: Verificar información de límites
    console.log("3️⃣ **VERIFICANDO INFORMACIÓN DE LÍMITES**\n");

    const limitInfo = await limitManager.getLimitInfo(TEST_CONFIG.testUserId);

    console.log("✅ **Información de límites:**");
    console.log(`   Tiene límites: ${limitInfo.hasLimits ? "SÍ" : "NO"}`);
    console.log(`   Cambios esta semana: ${limitInfo.changesThisWeek}`);
    console.log(`   Cambios restantes: ${limitInfo.remainingChanges}`);
    console.log(
      `   Último cambio: ${
        limitInfo.lastChange
          ? limitInfo.lastChange.toLocaleDateString("es-ES")
          : "N/A"
      }`
    );
    console.log(
      `   Próximo reset: ${limitInfo.nextReset.toLocaleDateString("es-ES")}`
    );
    console.log(`   Días hasta reset: ${limitInfo.daysUntilReset}`);
    console.log(`   Mensaje: ${limitInfo.message}\n`);

    // Prueba 4: Intentar segundo cambio (debería fallar)
    console.log("4️⃣ **INTENTANDO SEGUNDO CAMBIO**\n");

    const secondChangeCheck = await limitManager.canChangeNickname(
      TEST_CONFIG.testUserId
    );

    console.log("✅ **Verificación segundo cambio:**");
    console.log(
      `   Puede cambiar: ${secondChangeCheck.canChange ? "SÍ" : "NO"}`
    );
    console.log(`   Cambios restantes: ${secondChangeCheck.remainingChanges}`);
    console.log(`   Mensaje: ${secondChangeCheck.message}\n`);

    // Prueba 5: Probar con usuario diferente
    console.log("5️⃣ **PROBANDO CON USUARIO DIFERENTE**\n");

    const otherUserCheck = await limitManager.canChangeNickname(
      TEST_CONFIG.testUserId2
    );

    console.log("✅ **Usuario diferente:**");
    console.log(`   Usuario: ${TEST_CONFIG.testUserId2}`);
    console.log(`   Puede cambiar: ${otherUserCheck.canChange ? "SÍ" : "NO"}`);
    console.log(`   Cambios restantes: ${otherUserCheck.remainingChanges}`);
    console.log(`   Mensaje: ${otherUserCheck.message}\n`);

    // Prueba 6: Simular cambio exitoso en segundo usuario
    console.log("6️⃣ **SIMULANDO CAMBIO EN SEGUNDO USUARIO**\n");

    console.log("🔄 Registrando cambio de nickname en segundo usuario...");
    await limitManager.recordNicknameChange(TEST_CONFIG.testUserId2);

    const otherUserAfterChange = await limitManager.canChangeNickname(
      TEST_CONFIG.testUserId2
    );

    console.log("✅ **Segundo usuario después del cambio:**");
    console.log(
      `   Puede cambiar: ${otherUserAfterChange.canChange ? "SÍ" : "NO"}`
    );
    console.log(
      `   Cambios restantes: ${otherUserAfterChange.remainingChanges}`
    );
    console.log(`   Mensaje: ${otherUserAfterChange.message}\n`);

    // Prueba 7: Verificar estadísticas generales
    console.log("7️⃣ **VERIFICANDO ESTADÍSTICAS GENERALES**\n");

    const stats = await limitManager.getLimitStats();

    console.log("✅ **Estadísticas del sistema:**");
    console.log(`   Máximo cambios por semana: ${stats.maxChangesPerWeek}`);
    console.log(
      `   TTL del cache: ${stats.cacheTTL}ms (${Math.round(
        stats.cacheTTL / (24 * 60 * 60 * 1000)
      )} días)`
    );
    console.log(`   Prefijo del cache: ${stats.cachePrefix}`);
    console.log(`   Mensaje: ${stats.message}\n`);

    // Prueba 8: Simular reset manual
    console.log("8️⃣ **SIMULANDO RESET MANUAL**\n");

    console.log("🔄 Reseteando límite del primer usuario...");
    await limitManager.resetWeeklyLimit(TEST_CONFIG.testUserId);

    const afterReset = await limitManager.canChangeNickname(
      TEST_CONFIG.testUserId
    );

    console.log("✅ **Después del reset:**");
    console.log(`   Puede cambiar: ${afterReset.canChange ? "SÍ" : "NO"}`);
    console.log(`   Cambios restantes: ${afterReset.remainingChanges}`);
    console.log(`   Mensaje: ${afterReset.message}\n`);

    // Prueba 9: Limpiar límites de usuario
    console.log("9️⃣ **LIMPIANDO LÍMITES DE USUARIO**\n");

    console.log("🗑️ Limpiando límite del primer usuario...");
    const cleared = await limitManager.clearUserLimit(TEST_CONFIG.testUserId);

    console.log("✅ **Límite limpiado:**");
    console.log(`   Operación exitosa: ${cleared ? "SÍ" : "NO"}`);

    const afterClear = await limitManager.canChangeNickname(
      TEST_CONFIG.testUserId
    );
    console.log(
      `   Puede cambiar después de limpiar: ${
        afterClear.canChange ? "SÍ" : "NO"
      }`
    );
    console.log(`   Cambios restantes: ${afterClear.remainingChanges}\n`);

    // Prueba 10: Verificar comportamiento con errores
    console.log("🔟 **VERIFICANDO COMPORTAMIENTO CON ERRORES**\n");

    // Probar con ID inválido
    const invalidUserCheck = await limitManager.canChangeNickname("invalid_id");

    console.log("✅ **Usuario con ID inválido:**");
    console.log(
      `   Puede cambiar: ${invalidUserCheck.canChange ? "SÍ" : "NO"}`
    );
    console.log(`   Cambios restantes: ${invalidUserCheck.remainingChanges}`);
    console.log(`   Mensaje: ${invalidUserCheck.message}\n`);
  } catch (error) {
    console.error("❌ **Error en pruebas:**", error.message);
  }

  console.log("\n" + "=".repeat(60));
  console.log("🏁 **PRUEBAS COMPLETADAS**\n");
}

// Exportar funciones
module.exports = {
  testNicknameLimits,
};

// Ejecutar si se llama directamente
if (require.main === module) {
  testNicknameLimits().catch((error) => {
    console.error("❌ **Error ejecutando pruebas:**", error.message);
    process.exit(1);
  });
}
