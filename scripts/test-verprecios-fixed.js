// Script para probar /verprecios después de la corrección
console.log("🧪 Probando comando /verprecios (corregido)...\n");

// Mock del bot
const mockBot = {
  sendMessage: async (chatId, message, options = {}) => {
    console.log(`📱 MENSAJE ENVIADO A ${chatId}:`);
    console.log("─".repeat(50));
    console.log(message);
    if (options.parse_mode) {
      console.log(`📝 Modo de parseo: ${options.parse_mode}`);
    }
    console.log("─".repeat(50));
    return { message_id: 1 };
  },
};

// Mensaje de prueba (estructura real de Telegram)
const testMsg = {
  message_id: 123,
  from: {
    id: 123456789,
    is_bot: false,
    first_name: "Test",
    username: "test_admin",
    language_code: "es",
  },
  chat: {
    id: 123456789,
    first_name: "Test",
    username: "test_admin",
    type: "private",
  },
  date: Math.floor(Date.now() / 1000),
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
    process.env.BOT_EMAIL = "bot@elpatio.games";
    process.env.BOT_PASSWORD = "BotCl4ve#Sup3rS3gur4!2025";
    console.log("✅ Variables configuradas");

    console.log("📋 Estructura del mensaje de prueba:");
    console.log(JSON.stringify(testMsg, null, 2));

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
