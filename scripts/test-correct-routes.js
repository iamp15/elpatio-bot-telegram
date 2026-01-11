/**
 * Script para encontrar las rutas correctas del backend
 */

const axios = require("axios");

// Configuración
const BACKEND_URL = "http://localhost:5000";
const ADMIN_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OGUwN2EzNTI5MmE3YmI5ZTQ3ZGY4YSIsImVtYWlsIjoiaWFtcDE4QGdtYWlsLmNvbSIsInJvbCI6InN1cGVyYWRtaW4iLCJpYXQiOjE3NTYxNjg3MDYsImV4cCI6MTc1Njc3MzUwNn0.IKSxOANO0v1akbcNfJQrqIZNTby7H2ymZvs4fy9lWB0";

/**
 * Probar diferentes rutas posibles para payment-config
 */
async function testPaymentConfigRoutes() {
  console.log("🧪 **PROBANDO RUTAS PARA PAYMENT-CONFIG**\n");

  const possibleRoutes = [
    "/payment-config",
    "/paymentconfig",
    "/config/payment",
    "/admin/payment-config",
    "/admin/config",
    "/api/payment-config",
    "/api/config",
    "/config",
    "/settings/payment",
    "/admin/settings",
  ];

  for (const route of possibleRoutes) {
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

      console.log(`✅ ÉXITO ENCONTRADO: ${route}`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Data: ${JSON.stringify(response.data)}`);
      return route; // Encontramos la ruta correcta
    } catch (error) {
      if (error.response?.status === 401) {
        console.log(`🔐 Autenticación requerida: ${route}`);
      } else if (error.response?.status === 400) {
        console.log(`📝 Ruta encontrada pero error de validación: ${route}`);
        console.log(`   Error: ${JSON.stringify(error.response.data)}`);
      } else if (error.response?.status === 404) {
        console.log(`❌ No encontrada: ${route}`);
      } else {
        console.log(`⚠️ Otro error (${error.response?.status}): ${route}`);
      }
    }
    console.log("");
  }

  return null;
}

/**
 * Probar diferentes rutas para obtener configuración
 */
async function testGetConfigRoutes() {
  console.log("🔍 **PROBANDO RUTAS PARA OBTENER CONFIGURACIÓN**\n");

  const possibleRoutes = [
    "/payment-config",
    "/paymentconfig",
    "/config/payment",
    "/admin/payment-config",
    "/admin/config",
    "/api/payment-config",
    "/api/config",
    "/config",
    "/settings/payment",
    "/admin/settings",
  ];

  for (const route of possibleRoutes) {
    try {
      console.log(`Probando GET: ${BACKEND_URL}${route}`);

      const response = await axios.get(`${BACKEND_URL}${route}`, {
        headers: {
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
        timeout: 5000,
      });

      console.log(`✅ ÉXITO ENCONTRADO: ${route}`);
      console.log(`   Status: ${response.status}`);
      console.log(
        `   Data: ${JSON.stringify(response.data).substring(0, 200)}...`
      );
      return route;
    } catch (error) {
      if (error.response?.status === 401) {
        console.log(`🔐 Autenticación requerida: ${route}`);
      } else if (error.response?.status === 404) {
        console.log(`❌ No encontrada: ${route}`);
      } else {
        console.log(`⚠️ Otro error (${error.response?.status}): ${route}`);
      }
    }
    console.log("");
  }

  return null;
}

/**
 * Ejecutar pruebas
 */
async function runTests() {
  console.log("🚀 **BUSCANDO RUTAS CORRECTAS DEL BACKEND**\n");

  try {
    const postRoute = await testPaymentConfigRoutes();
    const getRoute = await testGetConfigRoutes();

    console.log("\n📋 **RESUMEN**");
    if (postRoute) {
      console.log(`✅ Ruta POST encontrada: ${postRoute}`);
    } else {
      console.log("❌ No se encontró ruta POST para payment-config");
    }

    if (getRoute) {
      console.log(`✅ Ruta GET encontrada: ${getRoute}`);
    } else {
      console.log("❌ No se encontró ruta GET para payment-config");
    }
  } catch (error) {
    console.error("❌ **ERROR EN LAS PRUEBAS:**", error.message);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runTests();
}
