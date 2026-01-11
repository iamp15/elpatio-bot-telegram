/**
 * Script de Prueba - Conexión al Backend
 *
 * Este script prueba la conexión básica al backend
 */

const axios = require("axios");

// Configuración
const BACKEND_URL = "http://localhost:5000";
const ADMIN_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OGUwN2EzNTI5MmE3YmI5ZTQ3ZGY4YSIsImVtYWlsIjoiaWFtcDE4QGdtYWlsLmNvbSIsInJvbCI6InN1cGVyYWRtaW4iLCJpYXQiOjE3NTYxNjg3MDYsImV4cCI6MTc1Njc3MzUwNn0.IKSxOANO0v1akbcNfJQrqIZNTby7H2ymZvs4fy9lWB0";

/**
 * Probar diferentes rutas base
 */
async function testRoutes() {
  console.log("🔍 **PROBANDO DIFERENTES RUTAS BASE**\n");

  const routes = [
    "/",
    "/api",
    "/api/payment-config",
    "/payment-config",
    "/admin/login",
    "/api/admin/login",
  ];

  for (const route of routes) {
    try {
      console.log(`🧪 Probando: ${BACKEND_URL}${route}`);

      const response = await axios.get(`${BACKEND_URL}${route}`, {
        timeout: 5000,
      });

      console.log(`✅ Status: ${response.status}`);
      console.log(
        `   Data: ${JSON.stringify(response.data).substring(0, 100)}...`
      );
    } catch (error) {
      console.log(`❌ Error: ${error.response?.status || error.code}`);
      if (error.response?.status === 404) {
        console.log(`   Ruta no encontrada: ${route}`);
      }
    }
    console.log("");
  }
}

/**
 * Probar endpoint de payment-config con diferentes rutas
 */
async function testPaymentConfigRoutes() {
  console.log("🧪 **PROBANDO ENDPOINT PAYMENT-CONFIG**\n");

  const routes = ["/api/payment-config", "/payment-config"];

  for (const route of routes) {
    try {
      console.log(`Probando POST: ${BACKEND_URL}${route}`);

      const response = await axios.post(
        `${BACKEND_URL}${route}`,
        {
          configType: "precios",
          configKey: "ludo.1v1",
          configValue: 70000,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ADMIN_TOKEN}`,
          },
          timeout: 5000,
        }
      );

      console.log(`✅ Éxito: ${response.status}`);
      console.log(`   Data: ${JSON.stringify(response.data)}`);
    } catch (error) {
      console.log(`❌ Error: ${error.response?.status || error.code}`);
      if (error.response?.data) {
        console.log(`   Mensaje: ${JSON.stringify(error.response.data)}`);
      }
    }
    console.log("");
  }
}

/**
 * Ejecutar pruebas
 */
async function runTests() {
  console.log("🚀 **INICIANDO PRUEBAS DE CONEXIÓN AL BACKEND**\n");

  try {
    await testRoutes();
    await testPaymentConfigRoutes();

    console.log("✅ **PRUEBAS COMPLETADAS**");
  } catch (error) {
    console.error("❌ **ERROR EN LAS PRUEBAS:**", error.message);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runTests();
}
