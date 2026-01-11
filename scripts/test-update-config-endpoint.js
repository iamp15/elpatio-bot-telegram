/**
 * Script de Prueba - Endpoint updateConfig
 *
 * Este script prueba el endpoint de actualización de configuración de pagos
 */

require("dotenv").config();
const axios = require("axios");

// Configuración
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000/api";
const ADMIN_EMAIL = "iamc18@gmail.com";
const ADMIN_PASSWORD = "tu_password_admin"; // Cambiar por la contraseña real del admin

/**
 * Obtener token de autenticación
 */
async function getAuthToken() {
  try {
    const response = await axios.post(`${BACKEND_URL}/admin/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    return response.data.token;
  } catch (error) {
    console.error("Error obteniendo token:", error.message);
    throw error;
  }
}

/**
 * Probar actualización de configuración
 */
async function testUpdateConfig(
  token,
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

    const response = await axios.post(
      `${BACKEND_URL}/payment-config`,
      {
        configType,
        configKey,
        configValue,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(`✅ Éxito: ${response.data.message}`);
    console.log(`   ID: ${response.data.data.id}`);

    return response.data;
  } catch (error) {
    console.error(`❌ Error: ${error.response?.data?.error || error.message}`);
    return null;
  }
}

/**
 * Probar casos de error
 */
async function testErrorCases(token) {
  console.log("\n🚨 **PRUEBAS DE ERROR**\n");

  // Caso 1: Faltan parámetros
  console.log("1. Probando sin configType...");
  await testUpdateConfig(token, null, "ludo.1v1", 70000, "Sin configType");

  // Caso 2: Faltan parámetros
  console.log("\n2. Probando sin configKey...");
  await testUpdateConfig(token, "prices", null, 70000, "Sin configKey");

  // Caso 3: Faltan parámetros
  console.log("\n3. Probando sin configValue...");
  await testUpdateConfig(token, "prices", "ludo.1v1", null, "Sin configValue");

  // Caso 4: Sin autenticación
  console.log("\n4. Probando sin token...");
  try {
    await axios.post(`${BACKEND_URL}/payment-config`, {
      configType: "prices",
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
async function testSuccessCases(token) {
  console.log("\n✅ **PRUEBAS EXITOSAS**\n");

  // Caso 1: Actualizar precio Ludo 1v1
  await testUpdateConfig(
    token,
    "precios",
    "ludo.1v1",
    70000,
    "Actualizar precio Ludo 1v1 a 700 Bs"
  );

  // Caso 2: Actualizar precio Ludo 2v2
  await testUpdateConfig(
    token,
    "precios",
    "ludo.2v2",
    120000,
    "Actualizar precio Ludo 2v2 a 1.200 Bs"
  );

  // Caso 3: Actualizar límite de depósito
  await testUpdateConfig(
    token,
    "limites",
    "maxDeposit",
    15000000,
    "Actualizar límite máximo de depósito a 150.000 Bs"
  );

  // Caso 4: Actualizar comisiones de retiro
  await testUpdateConfig(
    token,
    "comisiones",
    "withdrawal.rates",
    [0, 1, 3, 7],
    "Actualizar comisiones de retiro a [0%, 1%, 3%, 7%]"
  );

  // Caso 5: Actualizar comisión fija de retiro
  await testUpdateConfig(
    token,
    "comisiones",
    "withdrawal.fixed",
    1000,
    "Actualizar comisión fija de retiro a 10 Bs"
  );
}

/**
 * Verificar configuración actual
 */
async function verifyConfig(token) {
  console.log("\n🔍 **VERIFICANDO CONFIGURACIÓN ACTUAL**\n");

  try {
    const response = await axios.get(`${BACKEND_URL}/payment-config`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("✅ Configuración actual:");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log("⚠️ No se pudo verificar configuración:", error.message);
  }
}

/**
 * Ejecutar todas las pruebas
 */
async function runAllTests() {
  console.log("🚀 **INICIANDO PRUEBAS DEL ENDPOINT updateConfig**\n");

  try {
    // 1. Obtener token
    console.log("🔐 Obteniendo token de autenticación...");
    const token = await getAuthToken();
    console.log("✅ Token obtenido correctamente");

    // 2. Probar casos exitosos
    await testSuccessCases(token);

    // 3. Probar casos de error
    await testErrorCases(token);

    // 4. Verificar configuración final
    await verifyConfig(token);

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
};
