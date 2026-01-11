/**
 * Script de Prueba - Endpoint updateConfig con Token de Admin
 *
 * Este script prueba el endpoint de actualización de configuración de pagos
 * usando el token de admin proporcionado
 */

require("dotenv").config();
const axios = require("axios");

// Configuración
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";
const ADMIN_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OGUwN2EzNTI5MmE3YmI5ZTQ3ZGY4YSIsImVtYWlsIjoiaWFtcDE4QGdtYWlsLmNvbSIsInJvbCI6InN1cGVyYWRtaW4iLCJpYXQiOjE3NTYxNjg3MDYsImV4cCI6MTc1Njc3MzUwNn0.IKSxOANO0v1akbcNfJQrqIZNTby7H2ymZvs4fy9lWB0";

/**
 * Probar actualización de configuración
 */
async function testUpdateConfig(
  configType,
  configKey,
  configValue,
  description
) {
  try {
    console.log(`\n🧪 Probando: ${description}`);
    console.log(`   Tipo: ${configType}`);
    console.log(`   Clave: ${configKey}`);
    console.log(`   Valor: ${JSON.stringify(configValue)}`);

    const response = await axios.put(
      `${BACKEND_URL}/api/payment-config`,
      {
        configType,
        configKey,
        configValue,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
      }
    );

    console.log(`✅ Éxito: ${response.data.message}`);
    console.log(`   ID: ${response.data.data.id}`);

    return response.data;
  } catch (error) {
    console.error(`❌ Error: ${error.response?.data?.error || error.message}`);
    if (error.response?.status) {
      console.error(`   Status: ${error.response.status}`);
    }
    return null;
  }
}

/**
 * Probar casos de error
 */
async function testErrorCases() {
  console.log("\n🚨 **PRUEBAS DE ERROR**\n");

  // Caso 1: Faltan parámetros
  console.log("1. Probando sin configType...");
  await testUpdateConfig(null, "ludo.1v1", 70000, "Sin configType");

  // Caso 2: Faltan parámetros
  console.log("\n2. Probando sin configKey...");
  await testUpdateConfig("precios", null, 70000, "Sin configKey");

  // Caso 3: Faltan parámetros
  console.log("\n3. Probando sin configValue...");
  await testUpdateConfig("precios", "ludo.1v1", null, "Sin configValue");

  // Caso 4: Sin autenticación
  console.log("\n4. Probando sin token...");
  try {
    await axios.put(`${BACKEND_URL}/api/payment-config`, {
      configType: "precios",
      configKey: "ludo.1v1",
      configValue: 70000,
    });
    console.log("❌ Error: Debería haber fallado sin token");
  } catch (error) {
    console.log(
      `✅ Correcto: Error de autenticación - ${error.response?.status}`
    );
  }
}

/**
 * Probar casos exitosos
 */
async function testSuccessCases() {
  console.log("\n✅ **PRUEBAS EXITOSAS**\n");

  // Caso 1: Actualizar precio Ludo 1v1
  await testUpdateConfig(
    "precios",
    "ludo.1v1",
    70000,
    "Actualizar precio Ludo 1v1 a 700 Bs"
  );

  // Caso 2: Actualizar precio Ludo 2v2
  await testUpdateConfig(
    "precios",
    "ludo.2v2",
    120000,
    "Actualizar precio Ludo 2v2 a 1.200 Bs"
  );

  // Caso 3: Actualizar límite de depósito
  await testUpdateConfig(
    "limites",
    "maxDeposit",
    15000000,
    "Actualizar límite máximo de depósito a 150.000 Bs"
  );

  // Caso 4: Actualizar comisiones de retiro
  await testUpdateConfig(
    "comisiones",
    "withdrawal.rates",
    [0, 1, 3, 7],
    "Actualizar comisiones de retiro a [0%, 1%, 3%, 7%]"
  );

  // Caso 5: Actualizar comisión fija de retiro
  await testUpdateConfig(
    "comisiones",
    "withdrawal.fixed",
    1000,
    "Actualizar comisión fija de retiro a 10 Bs"
  );
}

/**
 * Verificar configuración actual
 */
async function verifyConfig() {
  console.log("\n🔍 **VERIFICANDO CONFIGURACIÓN ACTUAL**\n");

  try {
    const response = await axios.get(`${BACKEND_URL}/api/payment-config`, {
      headers: {
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
    });

    console.log("✅ Configuración actual:");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log("⚠️ No se pudo verificar configuración:", error.message);
    if (error.response?.status) {
      console.log(`   Status: ${error.response.status}`);
    }
  }
}

/**
 * Verificar historial de auditoría
 */
async function verifyAudit() {
  console.log("\n📋 **VERIFICANDO HISTORIAL DE AUDITORÍA**\n");

  try {
    const response = await axios.get(
      `${BACKEND_URL}/api/payment-config/audit`,
      {
        headers: {
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
      }
    );

    console.log("✅ Historial de auditoría:");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log("⚠️ No se pudo verificar auditoría:", error.message);
    if (error.response?.status) {
      console.log(`   Status: ${error.response.status}`);
    }
  }
}

/**
 * Ejecutar todas las pruebas
 */
async function runAllTests() {
  console.log(
    "🚀 **INICIANDO PRUEBAS DEL ENDPOINT updateConfig CON TOKEN DE ADMIN**\n"
  );
  console.log(`🔐 Usando token de admin: ${ADMIN_TOKEN.substring(0, 20)}...`);

  try {
    // 1. Probar casos exitosos
    await testSuccessCases();

    // 2. Probar casos de error
    await testErrorCases();

    // 3. Verificar configuración final
    await verifyConfig();

    // 4. Verificar historial de auditoría
    await verifyAudit();

    console.log("\n✅ **TODAS LAS PRUEBAS COMPLETADAS**");
  } catch (error) {
    console.error("\n❌ **ERROR EN LAS PRUEBAS:**", error.message);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testUpdateConfig,
  testSuccessCases,
  testErrorCases,
  verifyConfig,
  verifyAudit,
};
