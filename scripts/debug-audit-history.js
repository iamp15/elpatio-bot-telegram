// Script para debuggear la respuesta del historial de auditoría
console.log("🔍 Debuggeando respuesta del historial de auditoría...\n");

const axios = require("axios");

const BACKEND_URL = "http://localhost:5000/api";
const ADMIN_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OGUwN2EzNTI5MmE3YmI5ZTQ3ZGY4YSIsImVtYWlsIjoiaWFtcDE4QGdtYWlsLmNvbSIsInJvbCI6InN1cGVyYWRtaW4iLCJpYXQiOjE3NTYxNjg3MDYsImV4cCI6MTc1Njc3MzUwNn0.IKSxOANO0v1akbcNfJQrqIZNTby7H2ymZvs4fy9lWB0";

async function debugAuditHistory() {
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

    console.log("🚀 Probando getAuditHistory()...");
    const auditHistory = await configManager.getAuditHistory();

    console.log("📊 Respuesta completa:");
    console.log(JSON.stringify(auditHistory, null, 2));

    console.log("\n🔍 Análisis de la respuesta:");
    console.log(`Tipo de dato: ${typeof auditHistory}`);
    console.log(`Es array: ${Array.isArray(auditHistory)}`);
    console.log(`Es null: ${auditHistory === null}`);
    console.log(`Es undefined: ${auditHistory === undefined}`);

    if (auditHistory) {
      console.log(`Longitud: ${auditHistory.length || "N/A"}`);
      console.log(`Claves: ${Object.keys(auditHistory).join(", ")}`);
    }

    // Probar también la llamada directa al backend
    console.log("\n🌐 Probando llamada directa al backend...");

    try {
      console.log("📡 GET /api/payment-config/audit");
      const auditResponse = await axios.get(
        `${BACKEND_URL}/payment-config/audit`,
        {
          headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
        }
      );
      console.log(
        "✅ Respuesta audit:",
        JSON.stringify(auditResponse.data, null, 2)
      );
    } catch (error) {
      console.log("❌ Error audit:", error.response?.data || error.message);
    }
  } catch (error) {
    console.error("💥 Error:", error.message);
    console.error("📍 Stack trace:", error.stack);
  }
}

// Ejecutar el debug
debugAuditHistory();
