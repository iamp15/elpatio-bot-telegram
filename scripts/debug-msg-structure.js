// Script para debuggear la estructura del mensaje
console.log("🔍 Debuggeando estructura del mensaje...\n");

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

// Función para debuggear la estructura del mensaje
function debugMessageStructure(msg) {
  console.log("📋 Estructura del mensaje recibido:");
  console.log("─".repeat(50));
  console.log("msg:", JSON.stringify(msg, null, 2));
  console.log("─".repeat(50));

  console.log("\n🔍 Análisis detallado:");
  console.log(`msg.chat: ${msg.chat ? "✅ Existe" : "❌ No existe"}`);
  if (msg.chat) {
    console.log(`msg.chat.id: ${msg.chat.id ? "✅ Existe" : "❌ No existe"}`);
  }

  console.log(`msg.from: ${msg.from ? "✅ Existe" : "❌ No existe"}`);
  if (msg.from) {
    console.log(`msg.from.id: ${msg.from.id ? "✅ Existe" : "❌ No existe"}`);
    console.log(
      `msg.from.username: ${msg.from.username ? "✅ Existe" : "❌ No existe"}`
    );
  }

  console.log(`msg.text: ${msg.text ? "✅ Existe" : "❌ No existe"}`);

  console.log("\n🎯 Validación:");
  console.log(`!msg.from: ${!msg.from}`);
  console.log(`!msg.from.id: ${!msg.from?.id}`);
  console.log(`!msg.from || !msg.from.id: ${!msg.from || !msg.from?.id}`);
}

// Casos de prueba que podrían estar causando el error
const testCases = [
  {
    name: "Mensaje completo válido",
    msg: {
      chat: { id: 123456789 },
      from: { id: 123456789, username: "test_admin" },
      text: "/verprecios",
    },
  },
  {
    name: "Mensaje sin from (caso problemático)",
    msg: {
      chat: { id: 123456789 },
      text: "/verprecios",
    },
  },
  {
    name: "Mensaje con from null",
    msg: {
      chat: { id: 123456789 },
      from: null,
      text: "/verprecios",
    },
  },
  {
    name: "Mensaje con from pero sin id",
    msg: {
      chat: { id: 123456789 },
      from: { username: "test_admin" },
      text: "/verprecios",
    },
  },
  {
    name: "Mensaje con from.id undefined",
    msg: {
      chat: { id: 123456789 },
      from: { id: undefined, username: "test_admin" },
      text: "/verprecios",
    },
  },
];

async function testAllCases() {
  try {
    const adminCommands = require("../handlers/commands/admin-payment-commands");

    // Configurar variables de entorno
    process.env.ADMIN_ID = "123456789";
    process.env.BACKEND_URL = "http://localhost:5000";
    process.env.BOT_EMAIL = "bot@elpatio.com";
    process.env.BOT_PASSWORD = "tu_password";

    for (const testCase of testCases) {
      console.log(`\n🧪 Probando: ${testCase.name}`);
      console.log("=".repeat(60));

      // Debuggear la estructura del mensaje
      debugMessageStructure(testCase.msg);

      try {
        await adminCommands.handleVerPrecios(mockBot, testCase.msg);
        console.log("✅ Comando ejecutado exitosamente");
      } catch (error) {
        console.log("❌ Error:", error.message);
        console.log("📍 Stack trace:", error.stack);
      }

      console.log("=".repeat(60));
    }
  } catch (error) {
    console.error("💥 Error en las pruebas:", error.message);
  }
}

// Ejecutar las pruebas
testAllCases();
