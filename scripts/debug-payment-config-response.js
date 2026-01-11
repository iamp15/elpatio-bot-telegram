// Script para debuggear la respuesta del backend de configuración de pagos
console.log(
  "🔍 Debuggeando respuesta del backend de configuración de pagos...\n"
);

const axios = require("axios");

const BACKEND_URL = "http://localhost:5000/api";
const ADMIN_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OGUwN2EzNTI5MmE3YmI5ZTQ3ZGY4YSIsImVtYWlsIjoiaWFtcDE4QGdtYWlsLmNvbSIsInJvbCI6InN1cGVyYWRtaW4iLCJpYXQiOjE3NTYxNjg3MDYsImV4cCI6MTc1Njc3MzUwNn0.IKSxOANO0v1akbcNfJQrqIZNTby7H2ymZvs4fy9lWB0";

async function debugPaymentConfig() {
  try {
    console.log("🔧 Configurando variables de entorno...");
    process.env.ADMIN_ID = "123456789";
    process.env.BACKEND_URL = "http://localhost:5000";
    process.env.BOT_EMAIL = "bot@elpatio.games";
    process.env.BOT_PASSWORD = "BotCl4ve#Sup3rS3gur4!2025";

    console.log("📋 Importando PaymentConfigManager...");
    const BackendAPI = require("../api/backend");
    const PaymentConfigManager = require("../utils/payment-config-manager");

    // Crear instancia de la API del backend
    const api = new BackendAPI({
      baseUrl: process.env.BACKEND_URL,
      botEmail: process.env.BOT_EMAIL,
      botPassword: process.env.BOT_PASSWORD,
    });

    const configManager = new PaymentConfigManager(api);

    console.log("🚀 Probando getConfig()...");
    const config = await configManager.getConfig();

    console.log("📊 Respuesta completa:");
    console.log(JSON.stringify(config, null, 2));

    console.log("\n🔍 Análisis de la respuesta:");
    console.log(`config.currency: ${config.currency}`);
    console.log(`config.prices: ${config.prices ? "Existe" : "No existe"}`);
    console.log(`config.limits: ${config.limits ? "Existe" : "No existe"}`);
    console.log(
      `config.commissions: ${config.commissions ? "Existe" : "No existe"}`
    );

    if (config.prices) {
      console.log("\n🎮 Precios:");
      console.log(JSON.stringify(config.prices, null, 2));
    }

    if (config.limits) {
      console.log("\n📏 Límites:");
      console.log(JSON.stringify(config.limits, null, 2));
    }

    if (config.commissions) {
      console.log("\n💸 Comisiones:");
      console.log(JSON.stringify(config.commissions, null, 2));
    }

    // Probar también las llamadas directas al backend
    console.log("\n🌐 Probando llamadas directas al backend...");

    try {
      console.log("📡 GET /api/payment-config/precios");
      const preciosResponse = await axios.get(
        `${BACKEND_URL}/payment-config/precios`,
        {
          headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
        }
      );
      console.log(
        "✅ Respuesta precios:",
        JSON.stringify(preciosResponse.data, null, 2)
      );
    } catch (error) {
      console.log("❌ Error precios:", error.response?.data || error.message);
    }

    try {
      console.log("📡 GET /api/payment-config/limites");
      const limitesResponse = await axios.get(
        `${BACKEND_URL}/payment-config/limites`,
        {
          headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
        }
      );
      console.log(
        "✅ Respuesta límites:",
        JSON.stringify(limitesResponse.data, null, 2)
      );
    } catch (error) {
      console.log("❌ Error límites:", error.response?.data || error.message);
    }

    try {
      console.log("📡 GET /api/payment-config/comisiones");
      const comisionesResponse = await axios.get(
        `${BACKEND_URL}/payment-config/comisiones`,
        {
          headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
        }
      );
      console.log(
        "✅ Respuesta comisiones:",
        JSON.stringify(comisionesResponse.data, null, 2)
      );
    } catch (error) {
      console.log(
        "❌ Error comisiones:",
        error.response?.data || error.message
      );
    }
  } catch (error) {
    console.error("💥 Error:", error.message);
    console.error("📍 Stack trace:", error.stack);
  }
}

// Ejecutar el debug
debugPaymentConfig();
