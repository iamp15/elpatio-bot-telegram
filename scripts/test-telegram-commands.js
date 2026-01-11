const axios = require("axios");

// Configuración
const BACKEND_URL = "http://localhost:5000/api";
const ADMIN_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OGUwN2EzNTI5MmE3YmI5ZTQ3ZGY4YSIsImVtYWlsIjoiaWFtcDE4QGdtYWlsLmNvbSIsInJvbCI6InN1cGVyYWRtaW4iLCJpYXQiOjE3NTYxNjg3MDYsImV4cCI6MTc1Njc3MzUwNn0.IKSxOANO0v1akbcNfJQrqIZNTby7H2ymZvs4fy9lWB0";

// Mock del bot de Telegram
const mockBot = {
  sendMessage: async (chatId, message, options = {}) => {
    console.log(`\n📱 MENSAJE ENVIADO A ${chatId}:`);
    console.log("─".repeat(50));
    console.log(message);
    if (options.parse_mode) {
      console.log(`\n📝 Modo de parseo: ${options.parse_mode}`);
    }
    console.log("─".repeat(50));
    return { message_id: 1 };
  },
};

// Mock del mensaje de Telegram
const mockMsg = {
  chat: { id: 123456789 },
  from: { id: 123456789, username: "test_admin" },
  text: "/verprecios",
};

// Usar la API real del backend
const BackendAPI = require("../api/backend");
const mockBackendAPI = new BackendAPI({
  baseUrl: "http://localhost:5000",
  botEmail: "bot@elpatio.com",
  botPassword: "tu_password",
  preToken: ADMIN_TOKEN,
});

// Función para probar comando /verprecios
async function testVerPrecios() {
  console.log("🎮 Probando comando /verprecios...\n");

  try {
    const adminCommands = require("../handlers/commands/admin-payment-commands");
    await adminCommands.handleVerPrecios(mockBot, mockMsg);
    console.log("✅ Comando /verprecios ejecutado exitosamente");
  } catch (error) {
    console.error("❌ Error en /verprecios:", error.message);
  }
}

// Función para probar comando /verhistorial
async function testVerHistorial() {
  console.log("\n📋 Probando comando /verhistorial...\n");

  try {
    const adminCommands = require("../handlers/commands/admin-payment-commands");
    await adminCommands.handleVerHistorial(mockBot, mockMsg);
    console.log("✅ Comando /verhistorial ejecutado exitosamente");
  } catch (error) {
    console.error("❌ Error en /verhistorial:", error.message);
  }
}

// Función para probar comando /vercachestats
async function testVerCacheStats() {
  console.log("\n📈 Probando comando /vercachestats...\n");

  try {
    const adminCommands = require("../handlers/commands/admin-payment-commands");
    await adminCommands.handleVerCacheStats(mockBot, mockMsg);
    console.log("✅ Comando /vercachestats ejecutado exitosamente");
  } catch (error) {
    console.error("❌ Error en /vercachestats:", error.message);
  }
}

// Función para probar comando /limpiarcache
async function testLimpiarCache() {
  console.log("\n🗑️ Probando comando /limpiarcache...\n");

  try {
    const adminCommands = require("../handlers/commands/admin-payment-commands");
    await adminCommands.handleLimpiarCache(mockBot, mockMsg);
    console.log("✅ Comando /limpiarcache ejecutado exitosamente");
  } catch (error) {
    console.error("❌ Error en /limpiarcache:", error.message);
  }
}

// Función para probar comando /ayudaprecios
async function testAyudaPrecios() {
  console.log("\n❓ Probando comando /ayudaprecios...\n");

  try {
    const adminCommands = require("../handlers/commands/admin-payment-commands");
    await adminCommands.handleAyudaPrecios(mockBot, mockMsg);
    console.log("✅ Comando /ayudaprecios ejecutado exitosamente");
  } catch (error) {
    console.error("❌ Error en /ayudaprecios:", error.message);
  }
}

// Función para probar PaymentConfigManager directamente
async function testPaymentConfigManager() {
  console.log("\n🔧 Probando PaymentConfigManager directamente...\n");

  try {
    const PaymentConfigManager = require("../utils/payment-config-manager");
    const configManager = new PaymentConfigManager(mockBackendAPI);

    console.log("📊 Obteniendo configuración completa...");
    const config = await configManager.getConfig();
    console.log("✅ Configuración obtenida:", JSON.stringify(config, null, 2));

    console.log("\n💰 Obteniendo precios...");
    const prices = await configManager.getPrices();
    console.log("✅ Precios obtenidos:", JSON.stringify(prices, null, 2));

    console.log("\n📏 Obteniendo límites...");
    const limits = await configManager.getLimits();
    console.log("✅ Límites obtenidos:", JSON.stringify(limits, null, 2));

    console.log("\n💸 Obteniendo comisiones...");
    const commissions = await configManager.getCommissions();
    console.log(
      "✅ Comisiones obtenidas:",
      JSON.stringify(commissions, null, 2)
    );
  } catch (error) {
    console.error("❌ Error en PaymentConfigManager:", error.message);
  }
}

// Función principal
async function testAllCommands() {
  console.log("🚀 Iniciando pruebas de comandos de Telegram...\n");

  // Configurar variables de entorno para las pruebas
  process.env.ADMIN_ID = "123456789";

  try {
    // Probar PaymentConfigManager primero
    await testPaymentConfigManager();

    // Probar comandos de Telegram
    await testVerPrecios();
    await testVerHistorial();
    await testVerCacheStats();
    await testLimpiarCache();
    await testAyudaPrecios();

    console.log("\n🎉 ¡Todas las pruebas completadas!");
  } catch (error) {
    console.error("💥 Error en las pruebas:", error.message);
  }
}

// Ejecutar las pruebas
if (require.main === module) {
  testAllCommands().catch((error) => {
    console.error("💥 Error fatal:", error.message);
    process.exit(1);
  });
}

module.exports = {
  testAllCommands,
  testVerPrecios,
  testVerHistorial,
  testVerCacheStats,
  testLimpiarCache,
  testAyudaPrecios,
  testPaymentConfigManager,
};
