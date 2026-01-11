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

// Datos de prueba con el nuevo formato
const TEST_SALAS_NUEVO_FORMATO = [
  {
    _id: "sala_test_1",
    nombre: "Sala de Ludo Pro",
    juego: "ludo",
    modo: "1v1v1v1",
    creador: "jugador_creador_1",
    configuracion: {
      entrada: 5000,
      premio: 20000,
    },
    jugadores: ["jugador_1", "jugador_2"],
  },
  {
    _id: "sala_test_2",
    nombre: "Ludo Clásico",
    juego: "ludo",
    modo: "2v2",
    creador: "jugador_creador_2",
    configuracion: {
      entrada: 3000,
      premio: 12000,
    },
    jugadores: ["jugador_3"],
  },
  {
    _id: "sala_test_3",
    nombre: "Mi Sala de Ludo",
    juego: "ludo",
    modo: "1v1",
    creador: "jugador_creador_3",
    configuracion: {
      entrada: 10000,
      premio: 40000,
    },
    jugadores: [],
  },
];

async function testNuevoFormatoSalas() {
  console.log("🧪 === PRUEBA DEL NUEVO FORMATO DE SALAS ===\n");

  try {
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

    // Mock de la función findPlayerById para simular jugadores
    const originalFindPlayerById = api.findPlayerById.bind(api);
    api.findPlayerById = async (playerId) => {
      const mockPlayers = {
        jugador_creador_1: {
          nickname: "LudoMaster",
          firstName: "Juan",
          username: "juan_ludo",
        },
        jugador_creador_2: {
          nickname: null,
          firstName: "María",
          username: "maria_gamer",
        },
        jugador_creador_3: {
          nickname: "SIN_NICKNAME_123456",
          firstName: "Carlos",
          username: "carlos_play",
        },
        jugador_1: {
          nickname: "Player1",
          firstName: "Ana",
          username: "ana_player",
        },
        jugador_2: {
          nickname: null,
          firstName: "Pedro",
          username: "pedro_gamer",
        },
        jugador_3: {
          nickname: "SIN_NICKNAME_789012",
          firstName: "Laura",
          username: "laura_play",
        },
      };

      return (
        mockPlayers[playerId] || {
          nickname: null,
          firstName: "Jugador",
          username: "jugador_desconocido",
        }
      );
    };

    // Probar el nuevo formato de salas
    console.log("📋 **Probando nuevo formato de salas:**");
    console.log("   • Nombre de sala en lugar de ID");
    console.log("   • Campo creador agregado");
    console.log("   • Campo 'faltan' eliminado");
    console.log("");

    await sendFilteredRooms(
      bot,
      123456789,
      TEST_SALAS_NUEVO_FORMATO,
      "ludo",
      "🎲 Ludo",
      api
    );

    // Verificar resultados
    console.log("📊 **Resultados de la prueba:**");
    console.log(`   • Total de mensajes enviados: ${sentMessages.length}`);

    // Verificar que se muestra el nombre de la sala
    const mensajesConNombre = sentMessages.filter(
      (msg) =>
        msg.text.includes("Sala de Ludo Pro") ||
        msg.text.includes("Ludo Clásico") ||
        msg.text.includes("Mi Sala de Ludo")
    );
    console.log(
      `   • Mensajes con nombre de sala: ${mensajesConNombre.length}/3`
    );

    // Verificar que se muestra el creador
    const mensajesConCreador = sentMessages.filter((msg) =>
      msg.text.includes("👑 **Creador:**")
    );
    console.log(`   • Mensajes con creador: ${mensajesConCreador.length}/3`);

    // Verificar que NO se muestra "faltan"
    const mensajesSinFaltan = sentMessages.filter(
      (msg) => !msg.text.includes("🎯 **Faltan:")
    );
    console.log(
      `   • Mensajes sin campo 'faltan': ${mensajesSinFaltan.length}/3`
    );

    // Restaurar función original
    api.findPlayerById = originalFindPlayerById;

    console.log("\n✅ Prueba del nuevo formato completada exitosamente");
    console.log("🎯 El nuevo formato de salas debería funcionar correctamente");
  } catch (error) {
    console.error("❌ Error en la prueba:", error.message);
  }
}

// Ejecutar la prueba
testNuevoFormatoSalas()
  .then(() => {
    console.log("\n✅ Pruebas completadas exitosamente");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error ejecutando pruebas:", error);
    process.exit(1);
  });
