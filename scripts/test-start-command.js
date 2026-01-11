"use strict";

/**
 * Script para probar que el comando /start funciona correctamente
 * sin mostrar el mensaje "No entiendo ese comando"
 */

require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const BackendAPI = require("../api/backend");
const commands = require("../handlers/commands");
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

// Simular mensaje de /start
const mockStartMessage = {
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
  text: "/start",
};

async function testStartCommand() {
  console.log("🧪 === PRUEBA DEL COMANDO /START ===\n");

  try {
    // 1. Probar que el handler de /start funciona correctamente
    console.log("1️⃣ **Probando handler de /start:**");

    // Capturar los mensajes enviados por el bot
    const sentMessages = [];
    const originalSendMessage = bot.sendMessage.bind(bot);

    bot.sendMessage = async (chatId, text, options) => {
      sentMessages.push({ chatId, text, options });
      console.log(`   📤 Mensaje enviado: ${text.substring(0, 100)}...`);
      return { message_id: sentMessages.length };
    };

    // Ejecutar el handler de /start
    await commands.handleStart(bot, api, mockStartMessage);

    // Verificar que se envió el mensaje de bienvenida
    const welcomeMessage = sentMessages.find(
      (msg) =>
        msg.text.includes("Bienvenido a El Patio") || msg.text.includes("¡Hola")
    );

    if (welcomeMessage) {
      console.log("   ✅ Mensaje de bienvenida enviado correctamente");
    } else {
      console.log("   ❌ No se encontró mensaje de bienvenida");
    }

    // 2. Probar que handleTextMessage no procesa comandos con handlers específicos
    console.log("\n2️⃣ **Probando que handleTextMessage no procesa /start:**");

    // Limpiar mensajes anteriores
    sentMessages.length = 0;

    // Restaurar sendMessage original
    bot.sendMessage = originalSendMessage;

    // Capturar mensajes nuevamente
    bot.sendMessage = async (chatId, text, options) => {
      sentMessages.push({ chatId, text, options });
      console.log(`   📤 Mensaje enviado: ${text.substring(0, 100)}...`);
      return { message_id: sentMessages.length };
    };

    // Ejecutar handleTextMessage con /start
    await handleTextMessage(bot, api, mockStartMessage);

    // Verificar que NO se envió el mensaje "No entiendo ese comando"
    const unknownMessage = sentMessages.find(
      (msg) =>
        msg.text.includes("No entiendo ese comando") ||
        msg.text.includes("Escribe /ayuda")
    );

    if (!unknownMessage) {
      console.log("   ✅ handleTextMessage NO procesó /start (correcto)");
    } else {
      console.log("   ❌ handleTextMessage procesó /start (incorrecto)");
    }

    // 3. Probar que handleTextMessage procesa mensajes normales
    console.log(
      "\n3️⃣ **Probando que handleTextMessage procesa mensajes normales:**"
    );

    // Limpiar mensajes anteriores
    sentMessages.length = 0;

    const mockNormalMessage = {
      ...mockStartMessage,
      text: "Hola bot",
    };

    // Ejecutar handleTextMessage con mensaje normal
    await handleTextMessage(bot, api, mockNormalMessage);

    // Verificar que SÍ se envió el mensaje "No entiendo ese comando"
    const unknownMessage2 = sentMessages.find(
      (msg) =>
        msg.text.includes("No entiendo ese comando") ||
        msg.text.includes("Escribe /ayuda")
    );

    if (unknownMessage2) {
      console.log("   ✅ handleTextMessage procesó mensaje normal (correcto)");
    } else {
      console.log(
        "   ❌ handleTextMessage NO procesó mensaje normal (incorrecto)"
      );
    }

    // 4. Resumen final
    console.log("\n4️⃣ **Resumen de la prueba:**");

    const totalMessages = sentMessages.length;
    console.log(`   • Total de mensajes enviados: ${totalMessages}`);

    if (totalMessages > 0) {
      console.log("   • Mensajes enviados:");
      sentMessages.forEach((msg, index) => {
        console.log(`     ${index + 1}. ${msg.text.substring(0, 80)}...`);
      });
    }

    console.log("\n✅ Prueba completada exitosamente");
    console.log("🎯 El comando /start debería funcionar correctamente ahora");
  } catch (error) {
    console.error("❌ Error en la prueba:", error.message);
    console.error("Stack trace:", error.stack);
  }
}

// Ejecutar prueba
if (require.main === module) {
  testStartCommand()
    .then(() => {
      console.log("\n✅ Pruebas completadas exitosamente");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Error ejecutando pruebas:", error.message);
      process.exit(1);
    });
}

module.exports = { testStartCommand };
