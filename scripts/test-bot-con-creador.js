"use strict";
require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const BackendAPI = require("../api/backend");
const { sendFilteredRooms } = require("../utils/helpers");
const BOT_CONFIG = require("../config/bot-config");

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

async function testBotConCreador() {
  console.log("🧪 === PRUEBA BOT CON CREADOR ===\n");

  try {
    // Obtener salas reales del backend
    console.log("📡 Obteniendo salas del backend...");
    const salas = await api.getSalasDisponibles();

    console.log(`✅ Se obtuvieron ${salas.length} salas del backend\n`);

    if (salas.length === 0) {
      console.log("❌ No hay salas en el backend");
      return;
    }

    // Mostrar información de las salas
    salas.forEach((sala, index) => {
      console.log(`🏠 **Sala ${index + 1}:**`);
      console.log(`   Nombre: ${sala.nombre}`);
      console.log(`   Creador: ${sala.creador || "Sin creador"}`);
      console.log(`   Jugadores: ${sala.jugadores?.length || 0}`);
      console.log("");
    });

    // Capturar mensajes enviados
    const sentMessages = [];
    const originalSendMessage = bot.sendMessage.bind(bot);
    bot.sendMessage = async (chatId, text, options = {}) => {
      sentMessages.push({ chatId, text, options });
      console.log(`📤 Mensaje enviado:`);
      console.log(`   ${text}`);
      if (options.reply_markup) {
        console.log(`   🔘 Botones: ${JSON.stringify(options.reply_markup)}`);
      }
      console.log(""); // Línea en blanco para separar
      return { message_id: Date.now() };
    };

    // Probar la función sendFilteredRooms con salas reales
    console.log("🎮 **Probando presentación de salas con creador:**");
    await sendFilteredRooms(bot, 123456789, salas, "ludo", "🎲 Ludo", api);

    // Verificar resultados
    console.log("📊 **Resultados de la prueba:**");
    console.log(`   • Total de mensajes enviados: ${sentMessages.length}`);

    // Verificar que se muestra el creador
    const mensajesConCreador = sentMessages.filter((msg) =>
      msg.text.includes("👑 **Creador:**")
    );
    console.log(
      `   • Mensajes con creador: ${mensajesConCreador.length}/${salas.length}`
    );

    // Mostrar contenido de los mensajes para debug
    console.log("\n🔍 **Contenido de los mensajes:**");
    sentMessages.forEach((msg, index) => {
      console.log(`\n   Mensaje ${index + 1}:`);
      console.log(`   ${msg.text}`);
    });

    // Verificar si hay salas con creador
    const salasConCreador = salas.filter((sala) => sala.creador);
    console.log(`\n📊 **Resumen:**`);
    console.log(
      `   • Salas con campo creador: ${salasConCreador.length}/${salas.length}`
    );
    console.log(
      `   • Mensajes mostrando creador: ${mensajesConCreador.length}`
    );

    if (
      salasConCreador.length > 0 &&
      mensajesConCreador.length === salasConCreador.length
    ) {
      console.log(
        "\n🎉 **¡ÉXITO!** El bot está mostrando correctamente el creador"
      );
    } else if (salasConCreador.length === 0) {
      console.log("\nℹ️ **INFO:** No hay salas con creador para mostrar");
    } else {
      console.log(
        "\n❌ **PROBLEMA:** No se están mostrando todos los creadores"
      );
    }
  } catch (error) {
    console.error("❌ Error en la prueba:", error.message);
    if (error.response) {
      console.error("   Status:", error.response.status);
      console.error("   Data:", error.response.data);
    }
  }
}

// Ejecutar la prueba
testBotConCreador()
  .then(() => {
    console.log("\n✅ Prueba completada exitosamente");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error ejecutando pruebas:", error);
    process.exit(1);
  });
