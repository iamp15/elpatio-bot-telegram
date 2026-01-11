/**
 * Script de prueba para verificar el registro de jugadores
 * Ejecuta: node test-player-registration.js
 */

require("dotenv").config();
const BackendAPI = require("./api/backend");

const BACKEND_URL = process.env.BACKEND_URL;
const BOT_EMAIL = process.env.BOT_EMAIL;
const BOT_PASSWORD = process.env.BOT_PASSWORD;

async function testPlayerRegistration() {
  console.log("🧪 Iniciando prueba de registro de jugadores...");

  if (!BACKEND_URL || !BOT_EMAIL || !BOT_PASSWORD) {
    console.error("❌ Faltan variables de entorno");
    return;
  }

  const api = new BackendAPI({
    baseUrl: BACKEND_URL,
    botEmail: BOT_EMAIL,
    botPassword: BOT_PASSWORD,
  });

  try {
    console.log("🔐 Autenticando...");
    await api.ensureAuth();
    console.log("✅ Autenticación exitosa");

    // Datos de prueba
    const testPlayer = {
      telegramId: "qweasdqwe123",
      username: "qweasdqwe123",
      nickname: "ElPatioKing",
    };

    console.log("👤 Datos a enviar para crear jugador:", testPlayer);

    console.log("👤 Creando jugador de prueba...");
    const jugador = await api.createPlayer(testPlayer);
    console.log("✅ Jugador creado:", jugador);

    console.log("🔍 Buscando jugador por Telegram ID...");
    const jugadorEncontrado = await api.findPlayerByTelegram(
      testPlayer.telegramId
    );
    console.log("✅ Jugador encontrado:", jugadorEncontrado);

    console.log("✅ Prueba completada exitosamente");
  } catch (err) {
    console.error("❌ Error en prueba:", err.message);
    if (err.response && err.response.data) {
      console.error("Respuesta del backend:", err.response.data);
    }
    console.error("Stack trace:", err.stack);
  }
}

testPlayerRegistration();
