// Script para probar salas de Ludo con precios
console.log("🎲 Probando salas de Ludo con precios...\n");

// Mock del bot
const mockBot = {
  sendMessage: async (chatId, message, options = {}) => {
    console.log(`📱 MENSAJE ENVIADO A ${chatId}:`);
    console.log("─".repeat(50));
    console.log(message);
    console.log("─".repeat(50));
    return { message_id: 1 };
  },
};

// Salas de Ludo de prueba
const salasLudo = [
  {
    _id: "sala1",
    nombre: "Sala Ludo 1v1",
    juego: "ludo",
    modo: "1v1",
    jugadores: ["jugador1", "jugador2"],
    creador: "creador1",
  },
  {
    _id: "sala2",
    nombre: "Sala Ludo 1v1v1v1",
    juego: "ludo",
    modo: "1v1v1v1",
    jugadores: ["jugador1"],
    creador: "creador2",
  },
];

async function testSalasLudo() {
  try {
    console.log("🔧 Configurando variables de entorno...");
    process.env.ADMIN_ID = "123456789";
    process.env.BACKEND_URL = "http://localhost:5000";
    process.env.BOT_EMAIL = "bot@elpatio.games";
    process.env.BOT_PASSWORD = "BotCl4ve#Sup3rS3gur4!2025";

    console.log("📋 Importando dependencias...");
    const BackendAPI = require("../api/backend");
    const { sendFilteredRooms } = require("../utils/helpers");

    // Crear instancia de la API del backend
    const api = new BackendAPI({
      baseUrl: process.env.BACKEND_URL,
      botEmail: process.env.BOT_EMAIL,
      botPassword: process.env.BOT_PASSWORD,
    });

    console.log("✅ API configurada");

    console.log("\n🎲 Probando salas de Ludo...");
    await sendFilteredRooms(
      mockBot,
      123456789,
      salasLudo,
      "ludo",
      "🎲 Ludo",
      api
    );

    console.log("\n✅ Prueba completada exitosamente");
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("📍 Stack trace:", error.stack);
  }
}

// Ejecutar la prueba
testSalasLudo();


