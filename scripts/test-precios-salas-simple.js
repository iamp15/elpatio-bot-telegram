// Script para probar precios en salas
console.log("💰 Probando precios en salas...\n");

async function testPreciosSalas() {
  try {
    console.log("🔧 Configurando variables de entorno...");
    process.env.ADMIN_ID = "123456789";
    process.env.BACKEND_URL = "http://localhost:5000";
    process.env.BOT_EMAIL = "bot@elpatio.games";
    process.env.BOT_PASSWORD = "BotCl4ve#Sup3rS3gur4!2025";

    console.log("📋 Importando dependencias...");
    const BackendAPI = require("../api/backend");
    const PaymentConfigManager = require("../utils/payment-config-manager");
    const moneyUtils = require("../utils/money-utils");

    // Crear instancia de la API del backend
    const api = new BackendAPI({
      baseUrl: process.env.BACKEND_URL,
      botEmail: process.env.BOT_EMAIL,
      botPassword: process.env.BOT_PASSWORD,
    });

    const configManager = new PaymentConfigManager(api);

    console.log("✅ Configuración completada");

    // Simular la lógica de precios de sendFilteredRooms
    const sala = {
      _id: "sala1",
      nombre: "Sala Ludo 1v1",
      juego: "ludo",
      modo: "1v1",
      limiteJugadores: 2,
    };

    console.log(`\n🎮 Probando sala: ${sala.nombre}`);
    console.log(`Modo: ${sala.modo}`);
    console.log(`Jugadores: ${sala.limiteJugadores}`);

    // Obtener precio de entrada desde el backend
    let precioEntrada = 0;
    let premioCalculado = 0;
    let precioFormateado = "0,00 Bs";
    let premioFormateado = "0,00 Bs";

    try {
      // Obtener precio de entrada según el modo de la sala
      precioEntrada = await configManager.getGamePrice(sala.juego, sala.modo);

      // Calcular premio usando la función calculatePrize
      const prizeInfo = await configManager.calculatePrize(
        precioEntrada,
        sala.limiteJugadores
      );
      if (prizeInfo) {
        premioCalculado = prizeInfo.winnerPrize;
      }

      // Formatear precios
      precioFormateado = moneyUtils.formatCurrency(precioEntrada, "VES");
      premioFormateado = moneyUtils.formatCurrency(premioCalculado, "VES");

      console.log(`✅ Precio entrada: ${precioFormateado}`);
      console.log(`🏆 Premio: ${premioFormateado}`);
      console.log(
        `💰 Pote total: ${moneyUtils.formatCurrency(prizeInfo.totalPot, "VES")}`
      );
      console.log(
        `🏦 Comisión (${
          prizeInfo.housePercentage
        }%): ${moneyUtils.formatCurrency(prizeInfo.houseCommission, "VES")}`
      );
    } catch (error) {
      console.log(`❌ Error obteniendo precios: ${error.message}`);
    }

    console.log("\n✅ Prueba completada exitosamente");
  } catch (error) {
    console.error("💥 Error:", error.message);
    console.error("📍 Stack trace:", error.stack);
  }
}

// Ejecutar la prueba
testPreciosSalas();


