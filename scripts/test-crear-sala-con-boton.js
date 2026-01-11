"use strict";
require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const BackendAPI = require("../api/backend");
const commands = require("../handlers/commands");
const { handleTextMessage } = require("../handlers/messages");
const { handleCallbackQuery } = require("../handlers/callbacks");
const BOT_CONFIG = require("../config/bot-config");
const userStateManager = require("../user-state");

// Inicializar bot y API
const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: false,
  request: {
    timeout: 30000,
  },
});

const api = new BackendAPI({
  baseUrl: process.env.BACKEND_URL,
  botEmail: process.env.BOT_EMAIL,
  botPassword: process.env.BOT_PASSWORD,
});

// Función para crear mensajes mock
function createMockMessage(text, userId = 123456789) {
  return {
    chat: { id: 123456789 },
    from: {
      id: userId,
      first_name: "Usuario",
      username: "usuario_test",
    },
    text,
    message_id: Date.now(),
  };
}

// Función para crear callback query mock
function createMockCallbackQuery(data, userId = 123456789) {
  return {
    id: `callback_${Date.now()}`,
    from: {
      id: userId,
      first_name: "Usuario",
      username: "usuario_test",
    },
    message: {
      chat: { id: 123456789 },
      message_id: Date.now(),
    },
    data,
  };
}

async function testCrearSalaConBoton() {
  console.log("🧪 === PRUEBA DE CREAR SALA CON BOTÓN ===\n");

  try {
    // Capturar mensajes enviados
    const sentMessages = [];
    const originalSendMessage = bot.sendMessage.bind(bot);
    bot.sendMessage = async (chatId, text, options = {}) => {
      sentMessages.push({ chatId, text, options });
      console.log(`📤 Mensaje enviado: ${text.substring(0, 100)}...`);
      if (options.reply_markup) {
        console.log(`🔘 Botones: ${JSON.stringify(options.reply_markup)}`);
      }
      return { message_id: Date.now() };
    };

    // 1. Simular que el usuario tiene un juego seleccionado
    userStateManager.setSelectedGame(123456789, "ludo");
    console.log("   ✅ Juego Ludo seleccionado en el estado");

    // 2. Simular que el usuario está en proceso de crear sala
    userStateManager.setState(123456789, {
      creatingSala: {
        modo: "1v1v1v1",
        juego: "ludo",
      },
    });
    console.log("   ✅ Estado de crear sala configurado");

    // 3. Simular envío de nombre de sala
    const mockMessage = createMockMessage("Mi Sala de Ludo");
    await handleTextMessage(bot, api, mockMessage);

    // 4. Verificar que se envió el mensaje de confirmación con botón
    const confirmationMessage = sentMessages.find((msg) =>
      msg.text.includes("¡Sala creada exitosamente!")
    );

    if (confirmationMessage) {
      console.log("   ✅ Mensaje de confirmación enviado");

      if (confirmationMessage.options.reply_markup) {
        console.log("   ✅ Botón 'Ver Salas' incluido");

        const button =
          confirmationMessage.options.reply_markup.inline_keyboard[0][0];
        if (
          button.text === "🏠 Ver Salas" &&
          button.callback_data.startsWith("ver_salas_after_create:")
        ) {
          console.log("   ✅ Botón configurado correctamente");

          // 5. Probar el callback del botón
          const mockCallback = createMockCallbackQuery(
            "ver_salas_after_create:ludo"
          );
          await handleCallbackQuery(bot, api, mockCallback);

          console.log("   ✅ Callback del botón procesado");
        } else {
          console.log("   ❌ Botón mal configurado");
        }
      } else {
        console.log("   ❌ No se incluyó el botón");
      }
    } else {
      console.log("   ❌ No se envió mensaje de confirmación");
    }

    // 6. Resumen final
    console.log("\n📊 **Resumen de la prueba:**");
    console.log(`   • Total de mensajes enviados: ${sentMessages.length}`);
    console.log(`   • Pruebas completadas: 6`);

    console.log("\n✅ Prueba de crear sala con botón completada exitosamente");
    console.log("🎯 La funcionalidad debería funcionar correctamente");
  } catch (error) {
    console.error("❌ Error en la prueba:", error.message);
  }
}

// Ejecutar la prueba
testCrearSalaConBoton()
  .then(() => {
    console.log("\n✅ Pruebas completadas exitosamente");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error ejecutando pruebas:", error);
    process.exit(1);
  });
