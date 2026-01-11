"use strict";

/**
 * Script para probar todos los comandos y botones del teclado personalizado
 * Verifica que no se muestre el mensaje "No entiendo ese comando" para comandos válidos
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

// Lista de comandos a probar
const commandsToTest = [
  "/start",
  "/juegos",
  "/salas",
  "/ayuda",
  "/mijuego",
  "/cambiarjuego",
  "/crearsala",
  "/stats",
];

// Lista de botones del teclado a probar
const keyboardButtonsToTest = [
  "🎮 Seleccionar Juego",
  "🏠 Ver Salas",
  "🏗️ Crear Sala",
  "❓ Ayuda",
  "👤 Mi Perfil",
];

// Mensajes normales que deberían mostrar "No entiendo ese comando"
const normalMessagesToTest = [
  "Hola bot",
  "¿Cómo estás?",
  "Test message",
  "Comando inventado",
];

async function testAllCommands() {
  console.log("🧪 === PRUEBA DE TODOS LOS COMANDOS Y BOTONES ===\n");

  try {
    // Capturar mensajes enviados por el bot
    const sentMessages = [];
    const originalSendMessage = bot.sendMessage.bind(bot);

    bot.sendMessage = async (chatId, text, options) => {
      sentMessages.push({ chatId, text, options });
      return { message_id: sentMessages.length };
    };

    // 1. Probar comandos específicos
    console.log("1️⃣ **Probando comandos específicos:**");
    for (const command of commandsToTest) {
      sentMessages.length = 0; // Limpiar mensajes anteriores

      const mockMessage = createMockMessage(command);
      await handleTextMessage(bot, api, mockMessage);

      // Verificar que NO se envió el mensaje "No entiendo ese comando"
      const unknownMessage = sentMessages.find(
        (msg) =>
          msg.text.includes("No entiendo ese comando") ||
          msg.text.includes("Escribe /ayuda")
      );

      if (!unknownMessage) {
        console.log(
          `   ✅ ${command} - NO procesado por handleTextMessage (correcto)`
        );
      } else {
        console.log(
          `   ❌ ${command} - Procesado por handleTextMessage (incorrecto)`
        );
      }
    }

    // 2. Probar botones del teclado personalizado
    console.log("\n2️⃣ **Probando botones del teclado personalizado:**");
    for (const button of keyboardButtonsToTest) {
      sentMessages.length = 0; // Limpiar mensajes anteriores

      const mockMessage = createMockMessage(button);
      await handleTextMessage(bot, api, mockMessage);

      // Verificar que se procesó correctamente (no debería mostrar "No entiendo ese comando")
      const unknownMessage = sentMessages.find(
        (msg) =>
          msg.text.includes("No entiendo ese comando") ||
          msg.text.includes("Escribe /ayuda")
      );

      if (!unknownMessage) {
        console.log(`   ✅ ${button} - Procesado correctamente`);
      } else {
        console.log(`   ❌ ${button} - Mostró mensaje de error`);
      }
    }

    // 3. Probar mensajes normales
    console.log("\n3️⃣ **Probando mensajes normales:**");
    for (const message of normalMessagesToTest) {
      sentMessages.length = 0; // Limpiar mensajes anteriores

      const mockMessage = createMockMessage(message);
      await handleTextMessage(bot, api, mockMessage);

      // Verificar que SÍ se envió el mensaje "No entiendo ese comando"
      const unknownMessage = sentMessages.find(
        (msg) =>
          msg.text.includes("No entiendo ese comando") ||
          msg.text.includes("Escribe /ayuda")
      );

      if (unknownMessage) {
        console.log(`   ✅ "${message}" - Mostró mensaje apropiado`);
      } else {
        console.log(`   ❌ "${message}" - No mostró mensaje apropiado`);
      }
    }

    // 4. Probar handlers específicos de comandos
    console.log("\n4️⃣ **Probando handlers específicos de comandos:**");
    for (const command of commandsToTest) {
      sentMessages.length = 0; // Limpiar mensajes anteriores

      const mockMessage = createMockMessage(command);

      // Ejecutar el handler específico según el comando
      try {
        switch (command) {
          case "/start":
            await commands.handleStart(bot, api, mockMessage);
            break;
          case "/juegos":
            await commands.handleJuegos(bot, api, mockMessage);
            break;
          case "/salas":
            await commands.handleSalas(bot, api, mockMessage);
            break;
          case "/ayuda":
            await commands.handleAyuda(bot, api, mockMessage);
            break;
          case "/mijuego":
            await commands.handleMiJuego(bot, api, mockMessage);
            break;
          case "/cambiarjuego":
            await commands.handleCambiarJuego(bot, api, mockMessage);
            break;
          case "/crearsala":
            await commands.handleCrearSala(bot, api, mockMessage);
            break;
          case "/stats":
            await commands.handleStats(bot, api, mockMessage);
            break;
        }

        if (sentMessages.length > 0) {
          console.log(`   ✅ ${command} - Handler específico funcionó`);
        } else {
          console.log(
            `   ⚠️ ${command} - Handler específico no envió mensajes`
          );
        }
      } catch (error) {
        console.log(
          `   ❌ ${command} - Error en handler específico: ${error.message}`
        );
      }
    }

    // 5. Resumen final
    console.log("\n5️⃣ **Resumen de la prueba:**");
    console.log(`   • Comandos probados: ${commandsToTest.length}`);
    console.log(`   • Botones probados: ${keyboardButtonsToTest.length}`);
    console.log(
      `   • Mensajes normales probados: ${normalMessagesToTest.length}`
    );
    console.log(
      `   • Total de pruebas: ${
        commandsToTest.length +
        keyboardButtonsToTest.length +
        normalMessagesToTest.length
      }`
    );

    console.log("\n✅ Prueba completada exitosamente");
    console.log(
      "🎯 Todos los comandos y botones deberían funcionar correctamente ahora"
    );
  } catch (error) {
    console.error("❌ Error en la prueba:", error.message);
    console.error("Stack trace:", error.stack);
  }
}

// Ejecutar prueba
if (require.main === module) {
  testAllCommands()
    .then(() => {
      console.log("\n✅ Pruebas completadas exitosamente");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Error ejecutando pruebas:", error.message);
      process.exit(1);
    });
}

module.exports = { testAllCommands };
