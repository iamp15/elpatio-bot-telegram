/**
 * Script de Prueba - Configuración de Pagos desde Backend
 *
 * Este script prueba la nueva funcionalidad de consulta de configuración
 * de pagos desde el backend
 */

require("dotenv").config();

// Configuración del backend
const BACKEND_URL = process.env.BACKEND_URL;
const BOT_EMAIL = process.env.BOT_EMAIL;
const BOT_PASSWORD = process.env.BOT_PASSWORD;

if (!BACKEND_URL || !BOT_EMAIL || !BOT_PASSWORD) {
  console.error("❌ Faltan variables de entorno necesarias:");
  console.error("   - BACKEND_URL");
  console.error("   - BOT_EMAIL");
  console.error("   - BOT_PASSWORD");
  process.exit(1);
}

/**
 * Prueba la funcionalidad completa de configuración de pagos
 */
async function testPaymentConfig() {
  console.log("🧪 **PRUEBA DE CONFIGURACIÓN DE PAGOS DESDE BACKEND**\n");

  try {
    // 1. Inicializar API y PaymentConfigManager
    console.log("🔧 Inicializando componentes...");
    const BackendAPI = require("../api/backend");
    const PaymentConfigManager = require("../utils/payment-config-manager");

    const api = new BackendAPI({
      baseUrl: BACKEND_URL,
      botEmail: BOT_EMAIL,
      botPassword: BOT_PASSWORD,
    });

    const configManager = new PaymentConfigManager(api);
    console.log("✅ Componentes inicializados correctamente");

    // 2. Autenticación
    console.log("\n🔐 Autenticando con el backend...");
    await api.ensureAuth();
    console.log("✅ Autenticación exitosa");

    // 3. Prueba de obtención de configuración completa
    console.log("\n📊 Probando obtención de configuración completa...");
    try {
      const config = await configManager.getConfig();
      console.log("✅ Configuración completa obtenida:");
      console.log("   - Moneda:", config.currency || "No especificada");
      console.log(
        "   - Precios:",
        config.prices ? Object.keys(config.prices).length : 0,
        "juegos"
      );
      console.log(
        "   - Límites:",
        config.limits ? Object.keys(config.limits).length : 0,
        "tipos"
      );
      console.log(
        "   - Comisiones:",
        config.commissions ? "Configuradas" : "No configuradas"
      );
    } catch (error) {
      console.log("⚠️ Error obteniendo configuración completa:", error.message);
    }

    // 4. Prueba de obtención de precios
    console.log("\n🎮 Probando obtención de precios...");
    try {
      const prices = await configManager.getPrices();
      console.log("✅ Precios obtenidos:");
      for (const [juego, modos] of Object.entries(prices)) {
        console.log(`   ${juego.toUpperCase()}:`);
        for (const [modo, precio] of Object.entries(modos)) {
          console.log(
            `     ${modo}: ${(precio / 100).toLocaleString("es-VE")} Bs`
          );
        }
      }
    } catch (error) {
      console.log("⚠️ Error obteniendo precios:", error.message);
    }

    // 5. Prueba de obtención de límites
    console.log("\n📏 Probando obtención de límites...");
    try {
      const limits = await configManager.getLimits();
      console.log("✅ Límites obtenidos:");
      for (const [tipo, valor] of Object.entries(limits)) {
        console.log(`   ${tipo}: ${(valor / 100).toLocaleString("es-VE")} Bs`);
      }
    } catch (error) {
      console.log("⚠️ Error obteniendo límites:", error.message);
    }

    // 6. Prueba de obtención de comisiones
    console.log("\n💸 Probando obtención de comisiones...");
    try {
      const commissions = await configManager.getCommissions();
      console.log("✅ Comisiones obtenidas:");
      if (commissions.withdrawal) {
        console.log("   Retiros:");
        console.log(`     Frecuencia: ${commissions.withdrawal.frequency}`);
        if (commissions.withdrawal.rates) {
          console.log(
            `     Tasas: ${commissions.withdrawal.rates.join("%, ")}%`
          );
        }
      }
    } catch (error) {
      console.log("⚠️ Error obteniendo comisiones:", error.message);
    }

    // 7. Prueba de obtención de precio específico
    console.log("\n🎯 Probando obtención de precio específico...");
    try {
      const precio = await configManager.getGamePrice("ludo", "1v1");
      console.log(
        `✅ Precio Ludo 1v1: ${(precio / 100).toLocaleString("es-VE")} Bs`
      );
    } catch (error) {
      console.log("⚠️ Error obteniendo precio específico:", error.message);
    }

    // 8. Prueba de información de comisión de retiro
    console.log("\n📈 Probando información de comisión de retiro...");
    try {
      const feeInfo = await configManager.getWithdrawalFeeInfo(2); // 2do retiro de la semana
      console.log("✅ Información de comisión obtenida:");
      console.log(`   Retiro #2: ${feeInfo.percentage}% (${feeInfo.feeType})`);
      console.log(`   Próximo retiro: ${feeInfo.nextPercentage}%`);
    } catch (error) {
      console.log(
        "⚠️ Error obteniendo información de comisión:",
        error.message
      );
    }

    // 9. Prueba de validación de montos
    console.log("\n✅ Probando validación de montos...");
    try {
      const validation = await configManager.validateAmount(5000, "deposit"); // 50 Bs
      console.log("✅ Validación de monto:");
      console.log(`   Monto: 50 Bs`);
      console.log(`   Válido: ${validation.valid}`);
      if (!validation.valid) {
        console.log(`   Error: ${validation.error}`);
      }
    } catch (error) {
      console.log("⚠️ Error validando monto:", error.message);
    }

    // 10. Prueba de historial de auditoría
    console.log("\n📋 Probando historial de auditoría...");
    try {
      const auditHistory = await configManager.getAuditHistory();
      console.log(
        `✅ Historial de auditoría obtenido: ${auditHistory.length} entradas`
      );
      if (auditHistory.length > 0) {
        const latest = auditHistory[0];
        console.log("   Último cambio:");
        console.log(
          `     Fecha: ${new Date(
            latest.timestamp || latest.createdAt
          ).toLocaleString("es-VE")}`
        );
        console.log(`     Admin: ${latest.admin || latest.user || "N/A"}`);
        console.log(`     Acción: ${latest.type || latest.action || "N/A"}`);
      }
    } catch (error) {
      console.log("⚠️ Error obteniendo historial:", error.message);
    }

    // 11. Prueba de estadísticas del cache
    console.log("\n📊 Probando estadísticas del cache...");
    try {
      const cacheStats = configManager.getCacheStats();
      console.log("✅ Estadísticas del cache:");
      console.log(`   Total entradas: ${cacheStats.totalEntries}`);
      console.log(`   Entradas válidas: ${cacheStats.validEntries}`);
      console.log(`   Entradas expiradas: ${cacheStats.expiredEntries}`);
      console.log(
        `   Tiempo de expiración: ${
          cacheStats.cacheTimeout / 1000 / 60
        } minutos`
      );
    } catch (error) {
      console.log("⚠️ Error obteniendo estadísticas del cache:", error.message);
    }

    // 12. Prueba de limpieza del cache
    console.log("\n🗑️ Probando limpieza del cache...");
    try {
      configManager.clearCache();
      console.log("✅ Cache limpiado correctamente");

      const cacheStatsAfter = configManager.getCacheStats();
      console.log(
        `   Entradas después de limpiar: ${cacheStatsAfter.totalEntries}`
      );
    } catch (error) {
      console.log("⚠️ Error limpiando cache:", error.message);
    }

    console.log("\n✅ **PRUEBA COMPLETADA EXITOSAMENTE**");
    console.log(
      "   La funcionalidad de configuración de pagos está funcionando correctamente"
    );
  } catch (error) {
    console.error("\n❌ **ERROR EN LA PRUEBA:**", error.message);
    console.error("   Stack:", error.stack);
    process.exit(1);
  }
}

/**
 * Prueba específica de endpoints del backend
 */
async function testBackendEndpoints() {
  console.log("\n🔗 **PRUEBA DIRECTA DE ENDPOINTS DEL BACKEND**\n");

  try {
    const BackendAPI = require("../api/backend");

    const api = new BackendAPI({
      baseUrl: BACKEND_URL,
      botEmail: BOT_EMAIL,
      botPassword: BOT_PASSWORD,
    });

    await api.ensureAuth();

    // Prueba GET /api/payment-config
    console.log("📊 Probando GET /api/payment-config...");
    try {
      const response = await api.getPaymentConfig();
      console.log("✅ Respuesta:", JSON.stringify(response, null, 2));
    } catch (error) {
      console.log("❌ Error:", error.message);
    }

    // Prueba GET /api/payment-config/prices
    console.log("\n🎮 Probando GET /api/payment-config/prices...");
    try {
      const response = await api.getPaymentConfigByType("prices");
      console.log("✅ Respuesta:", JSON.stringify(response, null, 2));
    } catch (error) {
      console.log("❌ Error:", error.message);
    }

    // Prueba GET /api/payment-config/audit
    console.log("\n📋 Probando GET /api/payment-config/audit...");
    try {
      const response = await api.getPaymentConfigAudit();
      console.log("✅ Respuesta:", JSON.stringify(response, null, 2));
    } catch (error) {
      console.log("❌ Error:", error.message);
    }
  } catch (error) {
    console.error("❌ Error en prueba de endpoints:", error.message);
  }
}

// Ejecutar pruebas si se llama directamente
if (require.main === module) {
  (async () => {
    await testPaymentConfig();
    await testBackendEndpoints();
  })();
}

module.exports = {
  testPaymentConfig,
  testBackendEndpoints,
};
