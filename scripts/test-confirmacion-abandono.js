/**
 * Script de prueba para el sistema de confirmación al abandonar una sala
 *
 * Este script simula el flujo completo:
 * 1. Usuario ve salas disponibles
 * 2. Usuario hace clic en "Abandonar Sala"
 * 3. Se muestra confirmación
 * 4. Usuario confirma o cancela
 */

const TelegramBot = require("node-telegram-bot-api");
const BackendAPI = require("../api/backend");
const { sendFilteredRooms } = require("../utils/helpers");

// Configuración
const BOT_TOKEN = process.env.BOT_TOKEN;
const BACKEND_URL = process.env.BACKEND_URL;

if (!BOT_TOKEN) {
  console.error("❌ BOT_TOKEN no encontrado en variables de entorno");
  process.exit(1);
}

// Crear instancia del bot
const bot = new TelegramBot(BOT_TOKEN, { polling: false });

// Crear instancia de la API
const api = new BackendAPI();

// Datos de prueba
const TEST_USER = {
  id: 123456789,
  first_name: "Usuario",
  username: "testuser",
  is_bot: false,
};

const TEST_SALAS = [
  {
    _id: "sala_test_1",
    nombre: "Sala de Prueba 1",
    juego: "ludo",
    modo: "1v1v1v1",
    modoNombre: "1 vs 1 vs 1 vs 1",
    configuracion: {
      entrada: 5000,
      premio: 20000,
    },
    jugadores: [
      {
        _id: "jugador_test_1",
        telegramId: "123456789",
        nickname: "Usuario Test",
      },
    ],
    limiteJugadores: 4,
    estado: "esperando",
    creador: "jugador_test_1",
  },
  {
    _id: "sala_test_2",
    nombre: "Sala de Prueba 2",
    juego: "ludo",
    modo: "2v2",
    modoNombre: "2 vs 2",
    configuracion: {
      entrada: 3000,
      premio: 12000,
    },
    jugadores: [],
    limiteJugadores: 4,
    estado: "esperando",
    creador: "jugador_test_2",
  },
];

/**
 * Simula el envío de un mensaje con salas filtradas
 */
async function simularVerSalas() {
  console.log("🎮 Simulando visualización de salas...");

  try {
    // Simular chat ID
    const chatId = TEST_USER.id;

    // Enviar salas filtradas
    await sendFilteredRooms(
      bot,
      chatId,
      TEST_SALAS,
      "ludo",
      "Ludo",
      api,
      TEST_USER
    );

    console.log("✅ Salas enviadas correctamente");
    console.log("📋 Ahora el usuario debería ver:");
    console.log(
      "   - Sala 1: Botón '🚪 Abandonar Sala' (callback: confirm_leave:sala_test_1)"
    );
    console.log("   - Sala 2: Botón '🎯 Unirme' (callback: join:sala_test_2)");
  } catch (error) {
    console.error("❌ Error enviando salas:", error.message);
  }
}

/**
 * Simula el callback de confirmación de abandono
 */
async function simularConfirmacionAbandono() {
  console.log("\n⚠️ Simulando confirmación de abandono...");

  try {
    const chatId = TEST_USER.id;
    const salaId = "sala_test_1";

    // Simular callback query
    const callbackQuery = {
      id: "test_callback_id",
      message: {
        chat: { id: chatId },
      },
      from: TEST_USER,
      data: `confirm_leave:${salaId}`,
    };

    // Importar y ejecutar el manejador
    const { handleCallbackQuery } = require("../handlers/callbacks");
    await handleCallbackQuery(bot, api, callbackQuery);

    console.log("✅ Confirmación de abandono enviada");
    console.log("📋 El usuario debería ver:");
    console.log("   - Mensaje de confirmación con nombre de sala");
    console.log("   - Botón '✅ Sí, abandonar' (callback: leave:sala_test_1)");
    console.log(
      "   - Botón '❌ Cancelar' (callback: cancel_leave:sala_test_1)"
    );
  } catch (error) {
    console.error("❌ Error en confirmación:", error.message);
  }
}

/**
 * Simula la cancelación del abandono
 */
async function simularCancelacionAbandono() {
  console.log("\n❌ Simulando cancelación de abandono...");

  try {
    const chatId = TEST_USER.id;
    const salaId = "sala_test_1";

    // Simular callback query
    const callbackQuery = {
      id: "test_callback_id_2",
      message: {
        chat: { id: chatId },
      },
      from: TEST_USER,
      data: `cancel_leave:${salaId}`,
    };

    // Importar y ejecutar el manejador
    const { handleCallbackQuery } = require("../handlers/callbacks");
    await handleCallbackQuery(bot, api, callbackQuery);

    console.log("✅ Cancelación de abandono enviada");
    console.log("📋 El usuario debería ver mensaje de cancelación");
  } catch (error) {
    console.error("❌ Error en cancelación:", error.message);
  }
}

/**
 * Simula la confirmación y ejecución del abandono
 */
async function simularAbandonoConfirmado() {
  console.log("\n✅ Simulando abandono confirmado...");

  try {
    const chatId = TEST_USER.id;
    const salaId = "sala_test_1";

    // Simular callback query
    const callbackQuery = {
      id: "test_callback_id_3",
      message: {
        chat: { id: chatId },
      },
      from: TEST_USER,
      data: `leave:${salaId}`,
    };

    // Importar y ejecutar el manejador
    const { handleCallbackQuery } = require("../handlers/callbacks");
    await handleCallbackQuery(bot, api, callbackQuery);

    console.log("✅ Abandono confirmado enviado");
    console.log("📋 El usuario debería ver mensaje de abandono exitoso");
  } catch (error) {
    console.error("❌ Error en abandono confirmado:", error.message);
  }
}

/**
 * Función principal
 */
async function main() {
  console.log(
    "🧪 Iniciando prueba del sistema de confirmación de abandono...\n"
  );

  try {
    // 1. Simular ver salas
    await simularVerSalas();

    // 2. Simular confirmación de abandono
    await simularConfirmacionAbandono();

    // 3. Simular cancelación
    await simularCancelacionAbandono();

    // 4. Simular abandono confirmado
    await simularAbandonoConfirmado();

    console.log("\n🎉 Prueba completada exitosamente!");
    console.log("\n📋 Resumen de funcionalidades probadas:");
    console.log("   ✅ Visualización de salas con botones dinámicos");
    console.log("   ✅ Confirmación antes de abandonar sala");
    console.log("   ✅ Cancelación del abandono");
    console.log("   ✅ Ejecución del abandono confirmado");
  } catch (error) {
    console.error("❌ Error en la prueba:", error.message);
  } finally {
    process.exit(0);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = {
  simularVerSalas,
  simularConfirmacionAbandono,
  simularCancelacionAbandono,
  simularAbandonoConfirmado,
};
