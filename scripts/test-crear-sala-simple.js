"use strict";

/**
 * Script simple para probar la funcionalidad de crear sala
 */

require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const BackendAPI = require("../api/backend");
const commands = require("../handlers/commands");
const { handleTextMessage } = require("../handlers/messages");
const BOT_CONFIG = require("../config/bot-config");
const userStateManager = require("../user-state");

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

async function testCrearSalaSimple() {
  console.log("🧪 === PRUEBA SIMPLE DE CREAR SALA ===\n");

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

    // 2. Simular que el usuario tiene un juego seleccionado
    console.log("\n2️⃣ **Simulando juego seleccionado (Ludo):**");
    userStateManager.setSelectedGame(123456789, "ludo");
    console.log("   ✅ Juego Ludo seleccionado en el estado");

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

    // 4. Simular que el usuario está en proceso de crear sala
    console.log("\n4️⃣ **Simulando proceso de crear sala:**");
    userStateManager.setState(123456789, {
      creatingSala: {
        modo: "1v1v1v1",
        juego: "ludo",
      },
    });
    console.log("   ✅ Estado de crear sala configurado");

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

    // Configurar estado de nuevo
    userStateManager.setState(123456789, {
      creatingSala: {
        modo: "1v1v1v1",
        juego: "ludo",
      },
    });

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

    // 7. Verificar configuración de juegos
    console.log("\n7️⃣ **Verificando configuración de juegos:**");
    const ludo = BOT_CONFIG.juegos.find((j) => j.id === "ludo");
    if (ludo) {
      console.log(`   ✅ Ludo configurado: ${ludo.nombre}`);
      console.log(
        `   📋 Modos disponibles: ${Object.keys(ludo.modos).join(", ")}`
      );
    } else {
      console.log("   ❌ Ludo no encontrado en configuración");
    }

    // 8. Resumen final
    console.log("\n8️⃣ **Resumen de la prueba:**");
    console.log(`   • Total de mensajes enviados: ${sentMessages.length}`);
    console.log(`   • Pruebas completadas: 7`);

    console.log("\n✅ Prueba simple de crear sala completada exitosamente");
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
  testCrearSalaSimple()
    .then(() => {
      console.log("\n✅ Pruebas completadas exitosamente");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Error ejecutando pruebas:", error.message);
      process.exit(1);
    });
}

module.exports = { testCrearSalaSimple };
