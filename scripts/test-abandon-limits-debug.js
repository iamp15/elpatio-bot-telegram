"use strict";

const abandonLimitManager = require("../utils/abandon-limits");

/**
 * Script de prueba para verificar el sistema de límites de abandono
 */
async function testAbandonLimits() {
  console.log("🧪 [TEST] Probando sistema de límites de abandono");
  console.log("=".repeat(60));

  const testUserId = 7250505651;

  try {
    // 1. Verificar estado inicial del usuario
    console.log("\n🔍 [TEST] 1. Verificando estado inicial del usuario...");
    const statsIniciales = abandonLimitManager.getPlayerStats(testUserId);
    console.log("📊 [TEST] Estadísticas iniciales:", statsIniciales);

    // 2. Verificar si puede abandonar
    console.log("\n🔍 [TEST] 2. Verificando si puede abandonar...");
    const canAbandon = abandonLimitManager.canAbandon(testUserId);
    console.log("📊 [TEST] ¿Puede abandonar?:", canAbandon);

    // 3. Registrar primer abandono voluntario
    console.log("\n🔍 [TEST] 3. Registrando primer abandono voluntario...");
    const resultado1 =
      abandonLimitManager.registerAbandonVoluntario(testUserId);
    console.log("📊 [TEST] Resultado del primer abandono:", resultado1);

    // 4. Verificar estado después del primer abandono
    console.log(
      "\n🔍 [TEST] 4. Verificando estado después del primer abandono..."
    );
    const statsDespues1 = abandonLimitManager.getPlayerStats(testUserId);
    console.log(
      "📊 [TEST] Estadísticas después del primer abandono:",
      statsDespues1
    );

    // 5. Verificar si puede abandonar nuevamente
    console.log("\n🔍 [TEST] 5. Verificando si puede abandonar nuevamente...");
    const canAbandon2 = abandonLimitManager.canAbandon(testUserId);
    console.log("📊 [TEST] ¿Puede abandonar nuevamente?:", canAbandon2);

    // 6. Registrar segundo abandono
    console.log("\n🔍 [TEST] 6. Registrando segundo abandono...");
    const resultado2 =
      abandonLimitManager.registerAbandonVoluntario(testUserId);
    console.log("📊 [TEST] Resultado del segundo abandono:", resultado2);

    // 7. Verificar estado después del segundo abandono
    console.log(
      "\n🔍 [TEST] 7. Verificando estado después del segundo abandono..."
    );
    const statsDespues2 = abandonLimitManager.getPlayerStats(testUserId);
    console.log(
      "📊 [TEST] Estadísticas después del segundo abandono:",
      statsDespues2
    );

    // 8. Verificar si puede abandonar una tercera vez
    console.log(
      "\n🔍 [TEST] 8. Verificando si puede abandonar una tercera vez..."
    );
    const canAbandon3 = abandonLimitManager.canAbandon(testUserId);
    console.log("📊 [TEST] ¿Puede abandonar una tercera vez?:", canAbandon3);

    // 9. Registrar tercer abandono
    console.log("\n🔍 [TEST] 9. Registrando tercer abandono...");
    const resultado3 =
      abandonLimitManager.registerAbandonVoluntario(testUserId);
    console.log("📊 [TEST] Resultado del tercer abandono:", resultado3);

    // 10. Verificar estado después del tercer abandono
    console.log(
      "\n🔍 [TEST] 10. Verificando estado después del tercer abandono..."
    );
    const statsDespues3 = abandonLimitManager.getPlayerStats(testUserId);
    console.log(
      "📊 [TEST] Estadísticas después del tercer abandono:",
      statsDespues3
    );

    // 11. Verificar si puede abandonar una cuarta vez (debería estar bloqueado)
    console.log(
      "\n🔍 [TEST] 11. Verificando si puede abandonar una cuarta vez..."
    );
    const canAbandon4 = abandonLimitManager.canAbandon(testUserId);
    console.log("📊 [TEST] ¿Puede abandonar una cuarta vez?:", canAbandon4);

    // 12. Mostrar estadísticas del sistema
    console.log("\n🔍 [TEST] 12. Mostrando estadísticas del sistema...");
    const systemStats = abandonLimitManager.getSystemStats();
    console.log("📊 [TEST] Estadísticas del sistema:", systemStats);

    console.log("\n🎯 [TEST] Prueba completada exitosamente!");
  } catch (error) {
    console.error("\n❌ [TEST] Error en la prueba:", error.message);
    process.exit(1);
  }
}

// Ejecutar la prueba
if (require.main === module) {
  testAbandonLimits()
    .then(() => {
      console.log("\n✅ [TEST] Script ejecutado correctamente");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ [TEST] Script falló:", error.message);
      process.exit(1);
    });
}

module.exports = { testAbandonLimits };
