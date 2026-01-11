// Script para probar el cálculo de premios
console.log("🏆 Probando cálculo de premios...\n");

async function testPrizeCalculation() {
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

    console.log("💰 Obteniendo porcentaje de ganancia...");
    const housePercentage = await configManager.getHousePercentage();
    console.log(`✅ Porcentaje de ganancia: ${housePercentage}%`);

    // Ejemplos de cálculo de premios
    const testCases = [
      {
        game: "Ludo 1v1",
        entryPrice: 70000, // 700 Bs
        playerCount: 2,
        expectedPot: 140000, // 1.400 Bs
      },
      {
        game: "Ludo 1v1v1v1",
        entryPrice: 200000, // 2.000 Bs
        playerCount: 4,
        expectedPot: 800000, // 8.000 Bs
      },
      {
        game: "Dominó 2v2",
        entryPrice: 100000, // 1.000 Bs
        playerCount: 4,
        expectedPot: 400000, // 4.000 Bs
      },
    ];

    console.log("\n🎮 Calculando premios para diferentes partidas:\n");

    for (const testCase of testCases) {
      console.log(`📊 ${testCase.game}:`);
      console.log(
        `   Precio entrada: ${moneyUtils.formatCurrency(
          testCase.entryPrice,
          "VES"
        )}`
      );
      console.log(`   Jugadores: ${testCase.playerCount}`);

      const prizeInfo = await configManager.calculatePrize(
        testCase.entryPrice,
        testCase.playerCount
      );

      if (prizeInfo) {
        console.log(
          `   Pote total: ${moneyUtils.formatCurrency(
            prizeInfo.totalPot,
            "VES"
          )}`
        );
        console.log(
          `   Comisión casa (${
            prizeInfo.housePercentage
          }%): ${moneyUtils.formatCurrency(prizeInfo.houseCommission, "VES")}`
        );
        console.log(
          `   🏆 Premio ganador: ${moneyUtils.formatCurrency(
            prizeInfo.winnerPrize,
            "VES"
          )}`
        );

        // Verificar cálculo
        const expectedCommission = Math.floor(
          (prizeInfo.totalPot * housePercentage) / 100
        );
        const expectedPrize = prizeInfo.totalPot - expectedCommission;

        console.log(
          `   ✅ Verificación: ${
            expectedPrize === prizeInfo.winnerPrize ? "CORRECTO" : "ERROR"
          }`
        );
      } else {
        console.log(`   ❌ Error calculando premio`);
      }

      console.log("");
    }

    // Mostrar fórmula
    console.log("📝 Fórmula utilizada:");
    console.log("   Pote Total = Precio Entrada × Número de Jugadores");
    console.log("   Comisión Casa = Pote Total × Porcentaje Ganancia");
    console.log("   Premio Ganador = Pote Total - Comisión Casa");
  } catch (error) {
    console.error("💥 Error:", error.message);
    console.error("📍 Stack trace:", error.stack);
  }
}

// Ejecutar la prueba
testPrizeCalculation();
