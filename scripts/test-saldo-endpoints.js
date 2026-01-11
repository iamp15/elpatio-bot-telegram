/**
 * Script de prueba para verificar los endpoints de saldo
 *
 * Este script prueba:
 * 1. Obtener saldo de un jugador
 * 2. Debitar saldo de un jugador
 * 3. Validación de tipos de datos
 */

require("dotenv").config();
const BackendAPI = require("../api/backend");

// Configuración
const BACKEND_URL = process.env.BACKEND_URL;
const BOT_EMAIL = process.env.BOT_EMAIL;
const BOT_PASSWORD = process.env.BOT_PASSWORD;
const PRE_TOKEN = process.env.BOT_JWT || null;

// ID de prueba (reemplazar con un ID real)
const TEST_TELEGRAM_ID = "1604252279"; // El ID del error que viste

async function testSaldoEndpoints() {
  console.log("🧪 **PRUEBA DE ENDPOINTS DE SALDO**\n");

  if (!BACKEND_URL || !BOT_EMAIL || !BOT_PASSWORD) {
    console.error("❌ Faltan variables de entorno necesarias");
    console.log("Variables requeridas:");
    console.log("- BACKEND_URL");
    console.log("- BOT_EMAIL");
    console.log("- BOT_PASSWORD");
    return;
  }

  try {
    // Inicializar API
    console.log("🔧 Inicializando API...");
    const api = new BackendAPI({
      baseUrl: BACKEND_URL,
      botEmail: BOT_EMAIL,
      botPassword: BOT_PASSWORD,
      preToken: PRE_TOKEN,
    });

    // Autenticar
    console.log("🔐 Autenticando...");
    await api.login();
    console.log("✅ Autenticación exitosa\n");

    // 1. Probar obtener saldo
    console.log("📊 **1. PRUEBA: Obtener Saldo**");
    try {
      const saldo = await api.getPlayerBalance(TEST_TELEGRAM_ID);
      console.log(
        `✅ Saldo obtenido: ${saldo} centavos (tipo: ${typeof saldo})`
      );

      if (typeof saldo !== "number") {
        console.warn("⚠️  ADVERTENCIA: El saldo no es un número");
      }
    } catch (error) {
      console.error(`❌ Error obteniendo saldo: ${error.message}`);
      if (error.response?.data) {
        console.error("Detalles del error:", error.response.data);
      }
    }

    console.log();

    // 2. Probar debitar saldo con diferentes tipos de datos
    console.log("💳 **2. PRUEBA: Debitar Saldo**");

    const testAmounts = [
      100, // número
      "100", // string
      0, // cero
      -100, // negativo
      "abc", // string inválido
      null, // null
      undefined, // undefined
    ];

    for (const amount of testAmounts) {
      console.log(`\n🔍 Probando con: ${amount} (tipo: ${typeof amount})`);

      try {
        const result = await api.debitPlayerBalance(
          TEST_TELEGRAM_ID,
          amount,
          `Prueba con ${amount}`
        );
        console.log(`✅ Débito exitoso:`, result);
      } catch (error) {
        console.log(`❌ Error: ${error.message}`);
        if (error.response?.data) {
          console.log("Detalles:", error.response.data);
        }
      }
    }

    console.log("\n🎯 **PRUEBA COMPLETADA**");
  } catch (error) {
    console.error("❌ Error general:", error.message);
    if (error.response?.data) {
      console.error("Detalles del error:", error.response.data);
    }
  }
}

// Ejecutar prueba
if (require.main === module) {
  testSaldoEndpoints()
    .then(() => {
      console.log("\n✅ Script completado");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Script falló:", error.message);
      process.exit(1);
    });
}

module.exports = {
  testSaldoEndpoints,
};
