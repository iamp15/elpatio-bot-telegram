// Script para probar el comando /verprecios con validación
console.log("🧪 Probando comando /verprecios con validación...\n");

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

// Casos de prueba
const testCases = [
  {
    name: "Mensaje válido",
    msg: {
      chat: { id: 123456789 },
      from: { id: 123456789, username: "test_admin" },
      text: "/verprecios",
    },
  },
  {
    name: "Mensaje sin msg.from",
    msg: {
      chat: { id: 123456789 },
      text: "/verprecios",
    },
  },
  {
    name: "Mensaje sin msg.from.id",
    msg: {
      chat: { id: 123456789 },
      from: { username: "test_admin" },
      text: "/verprecios",
    },
  },
  {
    name: "Mensaje con msg.from null",
    msg: {
      chat: { id: 123456789 },
      from: null,
      text: "/verprecios",
    },
  },
];

async function testCommand() {
  try {
    const adminCommands = require("../handlers/commands/admin-payment-commands");

    // Configurar variables de entorno para las pruebas
    process.env.ADMIN_ID = "123456789";
    process.env.BACKEND_URL = "http://localhost:5000";
    process.env.BOT_EMAIL = "bot@elpatio.com";
    process.env.BOT_PASSWORD = "tu_password";

    for (const testCase of testCases) {
      console.log(`\n🔍 Probando: ${testCase.name}`);
      console.log("─".repeat(30));

      try {
        await adminCommands.handleVerPrecios(mockBot, testCase.msg);
        console.log("✅ Comando ejecutado sin errores");
      } catch (error) {
        console.log("❌ Error:", error.message);
      }

      console.log("─".repeat(30));
    }

    console.log("\n🎉 Pruebas completadas");
  } catch (error) {
    console.error("💥 Error en las pruebas:", error.message);
  }
}

// Ejecutar las pruebas
testCommand();
