/**
 * Script de Prueba Local - Configuración de Pagos
 *
 * Este script prueba la funcionalidad local sin requerir conexión al backend
 */

require("dotenv").config();

/**
 * Prueba la funcionalidad local de configuración de pagos
 */
async function testLocalPaymentConfig() {
  console.log("🧪 **PRUEBA LOCAL DE CONFIGURACIÓN DE PAGOS**\n");

  try {
    // 1. Probar lectura de configuración local
    console.log("📖 Probando lectura de configuración local...");
    const {
      readLocalConfig,
      convertToBackendFormat,
    } = require("./migrate-payment-config");

    const localConfig = await readLocalConfig();
    console.log("✅ Configuración local leída correctamente");
    console.log(
      `   - Moneda: ${localConfig.moneda?.codigo || "No especificada"}`
    );
    console.log(
      `   - Juegos: ${Object.keys(localConfig.precios || {}).length}`
    );
    console.log(
      `   - Límites configurados: ${
        Object.keys(localConfig.limites || {}).length
      }`
    );

    // 2. Probar conversión al formato del backend
    console.log("\n🔄 Probando conversión al formato del backend...");
    const backendConfig = convertToBackendFormat(localConfig);
    console.log("✅ Conversión exitosa");
    console.log(`   - Moneda: ${backendConfig.currency}`);
    console.log(
      `   - Precios: ${Object.keys(backendConfig.prices).length} juegos`
    );
    console.log(
      `   - Límites: ${Object.keys(backendConfig.limits).length} tipos`
    );
    console.log(
      `   - Comisiones: ${
        backendConfig.commissions ? "Configuradas" : "No configuradas"
      }`
    );

    // 3. Probar money-utils
    console.log("\n💰 Probando utilidades de dinero...");
    const moneyUtils = require("../utils/money-utils");

    // Probar formateo de moneda
    const testAmount = 1234567; // 12.345,67 Bs
    const formatted = moneyUtils.formatCurrency(testAmount, "VES");
    console.log(`✅ Formateo de moneda: ${testAmount} centavos = ${formatted}`);

    // Probar cálculo de comisión de retiro
    const feeInfo = moneyUtils.getWeeklyFeeInfo(2, {
      frequency: "weekly",
      rates: [0, 1, 2, 5],
    });
    console.log(
      `✅ Cálculo de comisión: Retiro #2 = ${feeInfo.percentage}% (${feeInfo.feeType})`
    );

    // Probar validación de montos
    const validation = moneyUtils.validateAmount(5000, 1000, 100000);
    console.log(
      `✅ Validación de monto: 50 Bs = ${
        validation.valid ? "Válido" : "Inválido"
      }`
    );

    // 4. Probar PaymentConfigManager (sin backend)
    console.log("\n🔧 Probando PaymentConfigManager (modo local)...");
    const PaymentConfigManager = require("../utils/payment-config-manager");

    // Crear un mock del API para pruebas locales
    const mockAPI = {
      getPaymentConfig: async () => ({
        success: true,
        data: backendConfig,
      }),
      getPaymentConfigByType: async (type) => ({
        success: true,
        data: backendConfig[type] || {},
      }),
      getPaymentConfigAudit: async () => ({
        success: true,
        data: [],
      }),
    };

    const configManager = new PaymentConfigManager(mockAPI);
    console.log("✅ PaymentConfigManager inicializado correctamente");

    // Probar obtención de configuración
    const config = await configManager.getConfig();
    console.log(`✅ Configuración obtenida: ${config.currency}`);

    // Probar obtención de precios
    const prices = await configManager.getPrices();
    console.log(`✅ Precios obtenidos: ${Object.keys(prices).length} juegos`);

    // Probar obtención de precio específico
    const precio = await configManager.getGamePrice("ludo", "1v1");
    console.log(
      `✅ Precio específico: Ludo 1v1 = ${(precio / 100).toLocaleString(
        "es-VE"
      )} Bs`
    );

    // Probar información de comisión
    const feeInfo2 = await configManager.getWithdrawalFeeInfo(1);
    console.log(
      `✅ Información de comisión: Retiro #1 = ${feeInfo2.percentage}%`
    );

    // Probar validación de montos
    const validation2 = await configManager.validateAmount(5000, "deposit");
    console.log(
      `✅ Validación de monto: 50 Bs = ${
        validation2.valid ? "Válido" : "Inválido"
      }`
    );

    // Probar estadísticas del cache
    const cacheStats = configManager.getCacheStats();
    console.log(
      `✅ Estadísticas del cache: ${cacheStats.totalEntries} entradas`
    );

    // Probar limpieza del cache
    configManager.clearCache();
    const cacheStatsAfter = configManager.getCacheStats();
    console.log(`✅ Cache limpiado: ${cacheStatsAfter.totalEntries} entradas`);

    console.log("\n✅ **PRUEBA LOCAL COMPLETADA EXITOSAMENTE**");
    console.log(
      "   Todos los componentes funcionan correctamente en modo local"
    );
  } catch (error) {
    console.error("\n❌ **ERROR EN LA PRUEBA LOCAL:**", error.message);
    console.error("   Stack:", error.stack);
    process.exit(1);
  }
}

/**
 * Probar comandos de administración (sin bot real)
 */
async function testAdminCommands() {
  console.log("\n🤖 **PRUEBA DE COMANDOS DE ADMINISTRACIÓN**\n");

  try {
    const adminCommands = require("../handlers/commands/admin-payment-commands");

    // Crear un mock del bot y API
    const mockBot = {
      sendMessage: async (chatId, message, options) => {
        console.log(`📱 Mensaje enviado a ${chatId}:`);
        console.log(`   ${message.substring(0, 100)}...`);
        return { message_id: 1 };
      },
    };

    const mockAPI = {
      getPaymentConfig: async () => ({
        success: true,
        data: {
          currency: "VES",
          prices: {
            ludo: { "1v1": 60000, "2v2": 100000 },
          },
          limits: {
            minDeposit: 10000,
            maxDeposit: 10000000,
          },
          commissions: {
            withdrawal: {
              frequency: "weekly",
              rates: [0, 1, 2, 5],
            },
          },
        },
      }),
      getPaymentConfigByType: async (type) => ({
        success: true,
        data:
          type === "prices"
            ? {
                ludo: { "1v1": 60000, "2v2": 100000 },
              }
            : {},
      }),
      getPaymentConfigAudit: async () => ({
        success: true,
        data: [
          {
            timestamp: new Date().toISOString(),
            admin: "admin@test.com",
            type: "update",
            description: "Prueba de auditoría",
          },
        ],
      }),
    };

    const mockMsg = {
      chat: { id: 123456789 },
      from: { id: 123456789, first_name: "Admin", username: "admin" },
    };

    // Probar comando /verprecios
    console.log("📊 Probando comando /verprecios...");
    await adminCommands.handleVerPrecios(mockBot, mockMsg);

    // Probar comando /verhistorial
    console.log("\n📋 Probando comando /verhistorial...");
    await adminCommands.handleVerHistorial(mockBot, mockMsg);

    // Probar comando /vercachestats
    console.log("\n📈 Probando comando /vercachestats...");
    await adminCommands.handleVerCacheStats(mockBot, mockMsg);

    // Probar comando /limpiarcache
    console.log("\n🗑️ Probando comando /limpiarcache...");
    await adminCommands.handleLimpiarCache(mockBot, mockMsg);

    // Probar comando /ayudaprecios
    console.log("\n❓ Probando comando /ayudaprecios...");
    await adminCommands.handleAyudaPrecios(mockBot, mockMsg);

    console.log("\n✅ **PRUEBA DE COMANDOS COMPLETADA EXITOSAMENTE**");
    console.log("   Todos los comandos funcionan correctamente");
  } catch (error) {
    console.error("\n❌ **ERROR EN PRUEBA DE COMANDOS:**", error.message);
    console.error("   Stack:", error.stack);
  }
}

// Ejecutar pruebas si se llama directamente
if (require.main === module) {
  (async () => {
    await testLocalPaymentConfig();
    await testAdminCommands();
  })();
}

module.exports = {
  testLocalPaymentConfig,
  testAdminCommands,
};
