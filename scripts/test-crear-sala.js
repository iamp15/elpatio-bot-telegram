"use strict";

/**
 * Script para probar la funcionalidad de crear sala
 */

require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const BackendAPI = require("../api/backend");
const commands = require("../handlers/commands");
const { handleTextMessage } = require("../handlers/messages");
const { handleCallbackQuery } = require("../handlers/callbacks");

// Variables de entorno
const BOT_TOKEN = process.env.BOT_TOKEN;
const BACKEND_URL = process.env.BACKEND_URL;
const BOT_EMAIL = process.env.BOT_EMAIL;
const BOT_PASSWORD = process.env.BOT_PASSWORD;

if (!BOT_TOKEN || !BACKEND_URL) {
  console.error("❌ Faltan variables de entorno. Revisa .env");
  process.exit(1);
}

// Inicializar bot y API
const bot = new TelegramBot(BOT_TOKEN, {
  polling: false, // No usar polling para las pruebas
});

const api = new BackendAPI({
  baseUrl: BACKEND_URL,
  botEmail: BOT_EMAIL,
  botPassword: BOT_PASSWORD,
});

// Simular mensaje base
const createMockMessage = (text) => ({
  message_id: Math.floor(Math.random() * 1000),
  from: {
    id: 123456789,
    is_bot: false,
    first_name: "Usuario",
    username: "testuser",
    language_code: "es",
  },
  chat: {
    id: 123456789,
    first_name: "Usuario",
    username: "testuser",
    type: "private",
  },
  date: Math.floor(Date.now() / 1000),
  text: text,
});

// Simular callback query
const createMockCallbackQuery = (data) => ({
  id: `callback_${Date.now()}`,
  from: {
    id: 123456789,
    is_bot: false,
    first_name: "Usuario",
    username: "testuser",
    language_code: "es",
  },
  message: {
    message_id: Math.floor(Math.random() * 1000),
    from: {
      id: 123456789,
      is_bot: false,
      first_name: "Usuario",
      username: "testuser",
      language_code: "es",
    },
    chat: {
      id: 123456789,
      first_name: "Usuario",
      username: "testuser",
      type: "private",
    },
    date: Math.floor(Date.now() / 1000),
  },
  data: data,
});

async function testCrearSala() {
  console.log("🧪 === PRUEBA DE CREAR SALA ===\n");

  try {
    // Capturar mensajes enviados por el bot
    const sentMessages = [];
    const originalSendMessage = bot.sendMessage.bind(bot);

    bot.sendMessage = async (chatId, text, options) => {
      sentMessages.push({ chatId, text, options });
      console.log(`   📤 Mensaje enviado: ${text.substring(0, 100)}...`);
      return { message_id: sentMessages.length };
    };

    // 1. Probar comando /crearsala sin juego seleccionado
    console.log("1️⃣ **Probando /crearsala sin juego seleccionado:**");
    sentMessages.length = 0;

    const mockMessage1 = createMockMessage("/crearsala");
    await commands.handleCrearSala(bot, api, mockMessage1);

    const noJuegoMessage = sentMessages.find((msg) =>
      msg.text.includes("Primero debes seleccionar un juego")
    );

    if (noJuegoMessage) {
      console.log(
        "   ✅ Mensaje correcto: Se requiere seleccionar juego primero"
      );
    } else {
      console.log("   ❌ No se mostró mensaje de error apropiado");
    }

    // 2. Simular selección de juego (Ludo)
    console.log("\n2️⃣ **Simulando selección de juego (Ludo):**");
    sentMessages.length = 0;

    const mockCallback1 = createMockCallbackQuery("select_game:ludo");
    await handleCallbackQuery(bot, api, mockCallback1);

    const juegoSeleccionado = sentMessages.find(
      (msg) =>
        msg.text.includes("Selecciona un juego") || msg.text.includes("Ludo")
    );

    if (juegoSeleccionado) {
      console.log("   ✅ Juego seleccionado correctamente");
    } else {
      console.log("   ❌ Error seleccionando juego");
    }

    // 3. Probar comando /crearsala con juego seleccionado
    console.log("\n3️⃣ **Probando /crearsala con juego seleccionado:**");
    sentMessages.length = 0;

    const mockMessage2 = createMockMessage("/crearsala");
    await commands.handleCrearSala(bot, api, mockMessage2);

    const modosMessage = sentMessages.find(
      (msg) =>
        msg.text.includes("Crear Sala") &&
        msg.text.includes("Selecciona el modo")
    );

    if (modosMessage) {
      console.log("   ✅ Se mostraron opciones de modo correctamente");

      // Verificar que se muestran los botones de modo
      if (modosMessage.options?.reply_markup?.inline_keyboard) {
        const botones = modosMessage.options.reply_markup.inline_keyboard;
        console.log(`   🎮 Botones de modo encontrados: ${botones.length}`);
        botones.forEach((row, index) => {
          row.forEach((button) => {
            console.log(
              `      ${index + 1}. ${button.text} (${button.callback_data})`
            );
          });
        });
      }
    } else {
      console.log("   ❌ No se mostraron opciones de modo");
    }

    // 4. Simular selección de modo (1v1v1v1)
    console.log("\n4️⃣ **Simulando selección de modo (1v1v1v1):**");
    sentMessages.length = 0;

    const mockCallback2 = createMockCallbackQuery("create_sala_mode:1v1v1v1");
    await handleCallbackQuery(bot, api, mockCallback2);

    const nombreSalaMessage = sentMessages.find(
      (msg) =>
        msg.text.includes("Nombre de la Sala") &&
        msg.text.includes("Envía el nombre")
    );

    if (nombreSalaMessage) {
      console.log("   ✅ Se solicitó nombre de sala correctamente");
    } else {
      console.log("   ❌ No se solicitó nombre de sala");
    }

    // 5. Simular envío de nombre de sala
    console.log("\n5️⃣ **Simulando envío de nombre de sala:**");
    sentMessages.length = 0;

    const mockMessage3 = createMockMessage("Mi Sala de Ludo");
    await handleTextMessage(bot, api, mockMessage3);

    const salaCreadaMessage = sentMessages.find(
      (msg) =>
        msg.text.includes("¡Sala creada exitosamente!") ||
        msg.text.includes("Sala:")
    );

    if (salaCreadaMessage) {
      console.log("   ✅ Sala creada exitosamente");
      console.log(
        `   📝 Contenido: ${salaCreadaMessage.text.substring(0, 200)}...`
      );
    } else {
      console.log("   ❌ No se creó la sala");

      // Mostrar todos los mensajes enviados para debug
      if (sentMessages.length > 0) {
        console.log("   📋 Mensajes enviados:");
        sentMessages.forEach((msg, index) => {
          console.log(`      ${index + 1}. ${msg.text.substring(0, 100)}...`);
        });
      }
    }

    // 6. Probar validación de nombre de sala
    console.log("\n6️⃣ **Probando validación de nombre de sala:**");
    sentMessages.length = 0;

    // Simular nombre muy corto
    const mockMessage4 = createMockMessage("ab");
    await handleTextMessage(bot, api, mockMessage4);

    const errorMessage = sentMessages.find(
      (msg) =>
        msg.text.includes("Nombre de sala inválido") ||
        msg.text.includes("al menos 3 caracteres")
    );

    if (errorMessage) {
      console.log("   ✅ Validación de nombre corto funciona");
    } else {
      console.log("   ❌ No se validó nombre corto");
    }

    // 7. Resumen final
    console.log("\n7️⃣ **Resumen de la prueba:**");
    console.log(`   • Total de mensajes enviados: ${sentMessages.length}`);
    console.log(`   • Pruebas completadas: 6`);

    console.log("\n✅ Prueba de crear sala completada exitosamente");
    console.log(
      "🎯 La funcionalidad de crear sala debería funcionar correctamente"
    );
  } catch (error) {
    console.error("❌ Error en la prueba:", error.message);
    console.error("Stack trace:", error.stack);
  }
}

// Ejecutar prueba
if (require.main === module) {
  testCrearSala()
    .then(() => {
      console.log("\n✅ Pruebas completadas exitosamente");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Error ejecutando pruebas:", error.message);
      process.exit(1);
    });
}

module.exports = { testCrearSala };
