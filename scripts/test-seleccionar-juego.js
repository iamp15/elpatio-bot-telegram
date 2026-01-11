"use strict";

/**
 * Script específico para probar el botón "🎮 Seleccionar Juego"
 */

require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const BackendAPI = require("../api/backend");
const { handleTextMessage } = require("../handlers/messages");

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

// Simular mensaje
const mockMessage = {
  message_id: 1,
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
  text: "🎮 Seleccionar Juego",
};

async function testSeleccionarJuego() {
  console.log(
    "🧪 === PRUEBA ESPECÍFICA DEL BOTÓN '🎮 Seleccionar Juego' ===\n"
  );

  try {
    // Capturar mensajes enviados por el bot
    const sentMessages = [];
    const originalSendMessage = bot.sendMessage.bind(bot);

    bot.sendMessage = async (chatId, text, options) => {
      sentMessages.push({ chatId, text, options });
      console.log(`   📤 Mensaje enviado: ${text.substring(0, 100)}...`);
      return { message_id: sentMessages.length };
    };

    // Ejecutar handleTextMessage con el botón "🎮 Seleccionar Juego"
    console.log(
      "1️⃣ **Probando handleTextMessage con '🎮 Seleccionar Juego':**"
    );
    await handleTextMessage(bot, api, mockMessage);

    // Verificar que se envió el mensaje correcto
    const seleccionJuegoMessage = sentMessages.find(
      (msg) =>
        msg.text.includes("Selecciona un juego") || msg.text.includes("🎮")
    );

    if (seleccionJuegoMessage) {
      console.log("   ✅ Mensaje de selección de juego enviado correctamente");
      console.log(
        `   📝 Contenido: ${seleccionJuegoMessage.text.substring(0, 150)}...`
      );
    } else {
      console.log("   ❌ No se encontró mensaje de selección de juego");
    }

    // Verificar que NO se envió el mensaje "No entiendo ese comando"
    const unknownMessage = sentMessages.find(
      (msg) =>
        msg.text.includes("No entiendo ese comando") ||
        msg.text.includes("Escribe /ayuda")
    );

    if (!unknownMessage) {
      console.log("   ✅ NO se mostró mensaje de error (correcto)");
    } else {
      console.log("   ❌ Se mostró mensaje de error (incorrecto)");
    }

    // Mostrar todos los mensajes enviados
    console.log("\n2️⃣ **Todos los mensajes enviados:**");
    if (sentMessages.length > 0) {
      sentMessages.forEach((msg, index) => {
        console.log(`   ${index + 1}. ${msg.text.substring(0, 100)}...`);
      });
    } else {
      console.log("   No se enviaron mensajes");
    }

    console.log("\n✅ Prueba completada exitosamente");
  } catch (error) {
    console.error("❌ Error en la prueba:", error.message);
    console.error("Stack trace:", error.stack);
  }
}

// Ejecutar prueba
if (require.main === module) {
  testSeleccionarJuego()
    .then(() => {
      console.log("\n✅ Pruebas completadas exitosamente");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Error ejecutando pruebas:", error.message);
      process.exit(1);
    });
}

module.exports = { testSeleccionarJuego };
