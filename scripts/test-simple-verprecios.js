// Script simple para probar /verprecios
console.log("🧪 Probando comando /verprecios...\n");

// Mock del bot
const mockBot = {
  sendMessage: async (chatId, message, options = {}) => {
    console.log(`📱 MENSAJE ENVIADO A ${chatId}:`);
    console.log("─".repeat(50));
    console.log(message);
    console.log("─".repeat(50));
    return { message_id: 1 };
  },
};

// Mensaje de prueba
const testMsg = {
  chat: { id: 123456789 },
  from: { id: 123456789, username: "test_admin" },
  text: "/verprecios",
};

async function testCommand() {
  try {
    console.log("📋 Importando comandos...");
    const adminCommands = require("../handlers/commands/admin-payment-commands");
    console.log("✅ Comandos importados correctamente");

    console.log("🔧 Configurando variables de entorno...");
    process.env.ADMIN_ID = "123456789";
    process.env.BACKEND_URL = "http://localhost:5000";
    process.env.BOT_EMAIL = "bot@elpatio.com";
    process.env.BOT_PASSWORD = "tu_password";
    console.log("✅ Variables configuradas");

    console.log("🚀 Ejecutando comando...");
    await adminCommands.handleVerPrecios(mockBot, testMsg);
    console.log("✅ Comando ejecutado exitosamente");
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("📍 Stack trace:", error.stack);
  }
}

// Ejecutar la prueba
testCommand();
