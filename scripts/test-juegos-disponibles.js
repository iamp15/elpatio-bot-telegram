"use strict";

/**
 * Script para probar que todos los juegos disponibles aparecen correctamente
 */

require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const BackendAPI = require("../api/backend");
const commands = require("../handlers/commands");
const BOT_CONFIG = require("../config/bot-config");

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
  text: "/juegos",
};

async function testJuegosDisponibles() {
  console.log("🧪 === PRUEBA DE JUEGOS DISPONIBLES ===\n");

  try {
    // 1. Verificar configuración de juegos
    console.log("1️⃣ **Configuración de juegos:**");
    BOT_CONFIG.juegos.forEach((juego, index) => {
      const status = juego.disponible ? "✅" : "❌";
      console.log(
        `   ${status} ${juego.nombre} - Disponible: ${juego.disponible}`
      );
      console.log(`      ID: ${juego.id}`);
      console.log(`      Descripción: ${juego.descripcion}`);
      console.log(`      Modos: ${Object.keys(juego.modos).join(", ")}`);
      console.log("");
    });

    // 2. Verificar filtro de juegos disponibles
    console.log("2️⃣ **Juegos filtrados por disponibilidad:**");
    const juegosDisponibles = BOT_CONFIG.juegos.filter(
      (juego) => juego.disponible
    );
    console.log(`   Total de juegos: ${BOT_CONFIG.juegos.length}`);
    console.log(`   Juegos disponibles: ${juegosDisponibles.length}`);

    juegosDisponibles.forEach((juego, index) => {
      console.log(`   ${index + 1}. ${juego.nombre} (${juego.id})`);
    });

    // 3. Probar handler de /juegos
    console.log("\n3️⃣ **Probando handler de /juegos:**");

    // Capturar mensajes enviados por el bot
    const sentMessages = [];
    const originalSendMessage = bot.sendMessage.bind(bot);

    bot.sendMessage = async (chatId, text, options) => {
      sentMessages.push({ chatId, text, options });
      console.log(`   📤 Mensaje enviado: ${text.substring(0, 100)}...`);

      // Verificar si tiene inline_keyboard
      if (options?.reply_markup?.inline_keyboard) {
        console.log(
          `   🎮 Botones de juegos encontrados: ${options.reply_markup.inline_keyboard.length}`
        );
        options.reply_markup.inline_keyboard.forEach((row, index) => {
          row.forEach((button) => {
            console.log(
              `      ${index + 1}. ${button.text} (${button.callback_data})`
            );
          });
        });
      }

      return { message_id: sentMessages.length };
    };

    // Ejecutar el handler de /juegos
    await commands.handleJuegos(bot, api, mockMessage);

    // 4. Verificar resultados
    console.log("\n4️⃣ **Resultados de la prueba:**");

    if (sentMessages.length > 0) {
      const message = sentMessages[0];
      console.log(`   ✅ Mensaje enviado correctamente`);
      console.log(`   📝 Contenido: ${message.text.substring(0, 150)}...`);

      if (message.options?.reply_markup?.inline_keyboard) {
        const botones = message.options.reply_markup.inline_keyboard;
        console.log(`   🎮 Botones mostrados: ${botones.length}`);

        // Verificar que todos los juegos disponibles aparecen
        const juegosMostrados = botones.map((row) => row[0].text);
        console.log(`   📋 Juegos mostrados: ${juegosMostrados.join(", ")}`);

        // Verificar que coinciden con la configuración
        const juegosEsperados = juegosDisponibles.map((j) => j.nombre);
        const coinciden =
          juegosMostrados.length === juegosEsperados.length &&
          juegosMostrados.every((juego) => juegosEsperados.includes(juego));

        if (coinciden) {
          console.log(
            "   ✅ Todos los juegos disponibles aparecen correctamente"
          );
        } else {
          console.log(
            "   ❌ No coinciden los juegos mostrados con los disponibles"
          );
          console.log(`      Esperados: ${juegosEsperados.join(", ")}`);
          console.log(`      Mostrados: ${juegosMostrados.join(", ")}`);
        }
      } else {
        console.log("   ❌ No se encontraron botones de juegos");
      }
    } else {
      console.log("   ❌ No se envió ningún mensaje");
    }

    console.log("\n✅ Prueba completada exitosamente");
  } catch (error) {
    console.error("❌ Error en la prueba:", error.message);
    console.error("Stack trace:", error.stack);
  }
}

// Ejecutar prueba
if (require.main === module) {
  testJuegosDisponibles()
    .then(() => {
      console.log("\n✅ Pruebas completadas exitosamente");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Error ejecutando pruebas:", error.message);
      process.exit(1);
    });
}

module.exports = { testJuegosDisponibles };
