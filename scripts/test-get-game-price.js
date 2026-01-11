// Script para probar getGamePrice
console.log("💰 Probando getGamePrice...\n");

async function testGetGamePrice() {
  try {
    console.log("🔧 Configurando variables de entorno...");
    process.env.ADMIN_ID = "123456789";
    process.env.BACKEND_URL = "http://localhost:5000";
    process.env.BOT_EMAIL = "bot@elpatio.games";
    process.env.BOT_PASSWORD = "BotCl4ve#Sup3rS3gur4!2025";

    console.log("📋 Importando PaymentConfigManager...");
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

    console.log("✅ PaymentConfigManager configurado");

    // Probar obtener precios
    const testCases = [
      { game: "ludo", mode: "1v1" },
      { game: "ludo", mode: "1v1v1v1" },
      { game: "domino", mode: "2v2" },
    ];

    for (const testCase of testCases) {
      console.log(`\n🎮 Probando ${testCase.game} ${testCase.mode}:`);

      try {
        const price = await configManager.getGamePrice(
          testCase.game,
          testCase.mode
        );
        const priceFormatted = moneyUtils.formatCurrency(price, "VES");
        console.log(`   ✅ Precio: ${price} centavos (${priceFormatted})`);

        // Calcular premio
        const playerCount =
          testCase.mode === "1v1" ? 2 : testCase.mode === "1v1v1v1" ? 4 : 4;

        const prizeInfo = await configManager.calculatePrize(
          price,
          playerCount
        );
        if (prizeInfo) {
          const prizeFormatted = moneyUtils.formatCurrency(
            prizeInfo.winnerPrize,
            "VES"
          );
          console.log(
            `   🏆 Premio: ${prizeInfo.winnerPrize} centavos (${prizeFormatted})`
          );
          console.log(
            `   💰 Pote total: ${moneyUtils.formatCurrency(
              prizeInfo.totalPot,
              "VES"
            )}`
          );
          console.log(
            `   🏦 Comisión (${
              prizeInfo.housePercentage
            }%): ${moneyUtils.formatCurrency(prizeInfo.houseCommission, "VES")}`
          );
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }
    }
  } catch (error) {
    console.error("💥 Error:", error.message);
    console.error("📍 Stack trace:", error.stack);
  }
}

// Ejecutar la prueba
testGetGamePrice();


