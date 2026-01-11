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

// Datos de prueba con creador
const TEST_SALAS_CON_CREADOR = [
  {
    _id: "sala_test_1",
    nombre: "Sala de Ludo Pro",
    juego: "ludo",
    modo: "1v1v1v1",
    creador: "jugador_creador_1", // Campo creador presente
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
    // Sin campo creador para probar el caso
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
    creador: "jugador_creador_3", // Campo creador presente
    configuracion: {
      entrada: 10000,
      premio: 40000,
    },
    jugadores: [],
  },
];

async function testCreadorSala() {
  console.log("🧪 === PRUEBA DEL CAMPO CREADOR ===\n");

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
      console.log(`🔍 Buscando jugador: ${playerId}`);

      const mockPlayers = {
        jugador_creador_1: {
          nickname: "LudoMaster",
          firstName: "Juan",
          username: "juan_ludo",
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

      const player = mockPlayers[playerId];
      if (player) {
        console.log(`   ✅ Jugador encontrado: ${JSON.stringify(player)}`);
      } else {
        console.log(`   ❌ Jugador no encontrado: ${playerId}`);
      }

      return (
        player || {
          nickname: null,
          firstName: "Jugador",
          username: "jugador_desconocido",
        }
      );
    };

    // Probar el campo creador
    console.log("📋 **Probando campo creador:**");
    console.log("   • Sala 1: Tiene creador (jugador_creador_1)");
    console.log("   • Sala 2: Sin creador");
    console.log("   • Sala 3: Tiene creador (jugador_creador_3)");
    console.log("");

    await sendFilteredRooms(
      bot,
      123456789,
      TEST_SALAS_CON_CREADOR,
      "ludo",
      "🎲 Ludo",
      api
    );

    // Verificar resultados
    console.log("📊 **Resultados de la prueba:**");
    console.log(`   • Total de mensajes enviados: ${sentMessages.length}`);

    // Verificar que se muestra el creador
    const mensajesConCreador = sentMessages.filter((msg) =>
      msg.text.includes("👑 **Creador:**")
    );
    console.log(`   • Mensajes con creador: ${mensajesConCreador.length}/3`);

    // Verificar nombres específicos de creadores
    const mensajesConLudoMaster = sentMessages.filter((msg) =>
      msg.text.includes("LudoMaster")
    );
    console.log(
      `   • Mensajes con LudoMaster: ${mensajesConLudoMaster.length}/1`
    );

    const mensajesConCarlos = sentMessages.filter((msg) =>
      msg.text.includes("Carlos")
    );
    console.log(`   • Mensajes con Carlos: ${mensajesConCarlos.length}/1`);

    // Mostrar contenido de los mensajes para debug
    console.log("\n🔍 **Contenido de los mensajes:**");
    sentMessages.forEach((msg, index) => {
      console.log(`\n   Mensaje ${index + 1}:`);
      console.log(`   ${msg.text}`);
    });

    // Restaurar función original
    api.findPlayerById = originalFindPlayerById;

    console.log("\n✅ Prueba del campo creador completada");
    console.log(
      "🎯 Revisa los logs para ver si se está buscando el creador correctamente"
    );
  } catch (error) {
    console.error("❌ Error en la prueba:", error.message);
  }
}

// Ejecutar la prueba
testCreadorSala()
  .then(() => {
    console.log("\n✅ Pruebas completadas exitosamente");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error ejecutando pruebas:", error);
    process.exit(1);
  });
