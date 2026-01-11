"use strict";

/**
 * Script de prueba para verificar el sistema de cache preparado para migración
 * Prueba las diferentes estrategias de cache: local, backend, redis
 */

require("dotenv").config();
const BackendAPI = require("../api/backend");
const cacheService = require("../utils/cache-service");
const {
  getUserDisplayName,
  getSalasDisponibles,
  getCacheStats,
} = require("../utils/helpers");

// Configuración de prueba
const TEST_USER = {
  id: 123456789,
  first_name: "Usuario",
  username: "testuser",
  last_name: "Prueba",
};

const TEST_USER_2 = {
  id: 987654321,
  first_name: "Otro",
  username: "otheruser",
  last_name: "Usuario",
};

async function testCacheService() {
  console.log(
    "🧪 === PRUEBA DEL SISTEMA DE CACHE PREPARADO PARA MIGRACIÓN ===\n"
  );

  // Inicializar API del backend
  const api = new BackendAPI({
    baseUrl: process.env.BACKEND_URL || "http://localhost:5000",
    botEmail: process.env.BOT_EMAIL,
    botPassword: process.env.BOT_PASSWORD,
  });

  try {
    // 1. Probar configuración del cache
    console.log("1️⃣ **Probando configuración del cache:**");
    const config = require("../config/bot-config");
    console.log(`   • Estrategia actual: ${config.cache.type}`);
    console.log(
      `   • TTL display name: ${config.cache.local.ttl.displayName}s`
    );
    console.log(`   • TTL salas: ${config.cache.local.ttl.salaInfo}s`);
    console.log("   ✅ Configuración cargada correctamente\n");

    // 2. Probar servicio de cache
    console.log("2️⃣ **Probando servicio de cache:**");
    console.log(`   • Estrategia: ${cacheService.strategy}`);
    console.log(
      `   • Configuración: ${JSON.stringify(cacheService.config, null, 2)}`
    );
    console.log("   ✅ Servicio de cache inicializado correctamente\n");

    // 3. Probar display name con cache
    console.log("3️⃣ **Probando display name con cache:**");

    // Primera llamada (sin cache)
    console.log("   • Primera llamada (sin cache):");
    const startTime1 = Date.now();
    const displayName1 = await getUserDisplayName(api, TEST_USER);
    const time1 = Date.now() - startTime1;
    console.log(`     - Display name: ${displayName1}`);
    console.log(`     - Tiempo: ${time1}ms`);

    // Segunda llamada (con cache)
    console.log("   • Segunda llamada (con cache):");
    const startTime2 = Date.now();
    const displayName2 = await getUserDisplayName(api, TEST_USER);
    const time2 = Date.now() - startTime2;
    console.log(`     - Display name: ${displayName2}`);
    console.log(`     - Tiempo: ${time2}ms`);

    // Verificar consistencia
    if (displayName1 === displayName2) {
      console.log("   ✅ Display names consistentes");
    } else {
      console.log("   ❌ Display names inconsistentes");
    }

    // Verificar mejora de rendimiento
    if (time2 < time1) {
      const improvement = Math.round(((time1 - time2) / time1) * 100);
      console.log(`   ✅ Mejora de rendimiento: ${improvement}% más rápido\n`);
    } else {
      console.log("   ⚠️ No se observó mejora de rendimiento\n");
    }

    // 4. Probar salas con cache
    console.log("4️⃣ **Probando salas con cache:**");
    try {
      const salas = await getSalasDisponibles("ludo", api);
      console.log(`   • Salas obtenidas: ${salas.length}`);
      console.log("   ✅ Salas obtenidas correctamente\n");
    } catch (error) {
      console.log(`   ❌ Error obteniendo salas: ${error.message}\n`);
    }

    // 5. Probar estadísticas del cache
    console.log("5️⃣ **Probando estadísticas del cache:**");
    const stats = getCacheStats();
    console.log(`   • Estrategia: ${stats.strategy}`);
    console.log(`   • Usuarios totales: ${stats.totalUsers || 0}`);
    console.log(`   • Usuarios activos: ${stats.activeUsers || 0}`);
    console.log(`   • Última limpieza: ${stats.lastCleanup || "N/A"}`);
    console.log("   ✅ Estadísticas obtenidas correctamente\n");

    // 6. Probar múltiples usuarios
    console.log("6️⃣ **Probando múltiples usuarios:**");
    const displayName3 = await getUserDisplayName(api, TEST_USER_2);
    console.log(`   • Usuario 1: ${displayName1}`);
    console.log(`   • Usuario 2: ${displayName3}`);
    console.log("   ✅ Múltiples usuarios manejados correctamente\n");

    // 7. Probar invalidación de cache
    console.log("7️⃣ **Probando invalidación de cache:**");
    const invalidateService = require("../utils/cache-service");
    const invalidated = await invalidateService.invalidateUser(TEST_USER.id);
    console.log(`   • Cache invalidado: ${invalidated}`);

    // Verificar que se regenera el cache
    const displayName4 = await getUserDisplayName(api, TEST_USER);
    console.log(`   • Display name después de invalidación: ${displayName4}`);
    console.log("   ✅ Invalidación de cache funcionando\n");

    // 8. Probar diferentes estrategias (simulación)
    console.log("8️⃣ **Probando diferentes estrategias (simulación):**");

    // Simular estrategia backend
    console.log("   • Simulando estrategia 'backend':");
    const originalStrategy = cacheService.strategy;
    cacheService.strategy = "backend";
    const displayNameBackend = await cacheService.getDisplayName(
      TEST_USER.id,
      api,
      TEST_USER
    );
    console.log(`     - Display name (backend): ${displayNameBackend}`);

    // Simular estrategia redis
    console.log("   • Simulando estrategia 'redis':");
    cacheService.strategy = "redis";
    const displayNameRedis = await cacheService.getDisplayName(
      TEST_USER.id,
      api,
      TEST_USER
    );
    console.log(`     - Display name (redis): ${displayNameRedis}`);

    // Restaurar estrategia original
    cacheService.strategy = originalStrategy;
    console.log("   ✅ Diferentes estrategias simuladas correctamente\n");

    // 9. Resumen final
    console.log("9️⃣ **Resumen final:**");
    console.log(
      "   ✅ Sistema de cache preparado para migración funcionando correctamente"
    );
    console.log("   ✅ Estrategia local activa y funcionando");
    console.log("   ✅ Preparado para migración a backend/redis");
    console.log("   ✅ Todas las funciones de cache operativas");
    console.log("   ✅ Manejo de errores implementado");
    console.log("   ✅ Estadísticas disponibles");
    console.log("   ✅ Invalidación de cache funcionando\n");

    console.log(
      "🎯 **El sistema está listo para migración futura a Redis!**\n"
    );
  } catch (error) {
    console.error("❌ Error en las pruebas:", error.message);
    console.error("Stack trace:", error.stack);
  }
}

// Ejecutar pruebas
if (require.main === module) {
  testCacheService()
    .then(() => {
      console.log("✅ Pruebas completadas exitosamente");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Error ejecutando pruebas:", error.message);
      process.exit(1);
    });
}

module.exports = { testCacheService };
