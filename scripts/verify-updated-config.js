const axios = require("axios");

// Configuración
const BACKEND_URL = "http://localhost:5000/api";
const ADMIN_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OGUwN2EzNTI5MmE3YmI5ZTQ3ZGY4YSIsImVtYWlsIjoiaWFtcDE4QGdtYWlsLmNvbSIsInJvbCI6InN1cGVyYWRtaW4iLCJpYXQiOjE3NTYxNjg3MDYsImV4cCI6MTc1Njc3MzUwNn0.IKSxOANO0v1akbcNfJQrqIZNTby7H2ymZvs4fy9lWB0";

// Función para convertir centavos a Bolívares
const centsToBs = (cents) => (cents / 100).toFixed(2);

// Función para obtener configuración
async function getConfig(configType) {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/payment-config/${configType}`,
      {
        headers: {
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
      }
    );
    return response.data.data; // Acceder a response.data.data
  } catch (error) {
    console.error(
      `❌ Error obteniendo ${configType}:`,
      error.response?.data || error.message
    );
    return null;
  }
}

// Función para verificar configuración específica
function verifyConfig(config, expectedValues) {
  console.log(`\n📋 Verificando configuración: ${config.type}`);
  console.log("─".repeat(50));

  let allCorrect = true;

  expectedValues.forEach((expected) => {
    // Acceder a los datos anidados correctamente
    const keys = expected.key.split(".");
    let actualValue = config.data;

    for (const key of keys) {
      actualValue = actualValue?.[key];
    }

    const isCorrect = actualValue === expected.value;

    if (isCorrect) {
      console.log(
        `✅ ${expected.key}: ${actualValue} centavos (${centsToBs(
          actualValue
        )} Bs)`
      );
    } else {
      console.log(
        `❌ ${expected.key}: ${actualValue} centavos (${centsToBs(
          actualValue
        )} Bs) - Esperado: ${expected.value} centavos (${centsToBs(
          expected.value
        )} Bs)`
      );
      allCorrect = false;
    }
  });

  return allCorrect;
}

// Función principal
async function verifyUpdatedConfig() {
  console.log("🔍 Verificando configuraciones actualizadas...\n");

  // Valores esperados después de la actualización
  const expectedPrecios = [
    { key: "ludo.1v1", value: 30000 },
    { key: "ludo.2v2", value: 40000 },
    { key: "ludo.1v1v1", value: 10000 },
    { key: "ludo.1v1v1v1", value: 10000 },
  ];

  const expectedLimites = [
    { key: "deposito.maximo", value: 5000000 },
    { key: "retiro.maximo", value: 3000000 },
  ];

  // Obtener configuraciones actuales
  console.log("📡 Obteniendo configuraciones del backend...");

  const preciosConfig = await getConfig("precios");
  const limitesConfig = await getConfig("limites");

  if (!preciosConfig || !limitesConfig) {
    console.error("💥 No se pudieron obtener las configuraciones");
    return;
  }

  // Verificar configuraciones
  const preciosCorrect = verifyConfig(
    { type: "Precios", data: preciosConfig },
    expectedPrecios
  );
  const limitesCorrect = verifyConfig(
    { type: "Límites", data: limitesConfig },
    expectedLimites
  );

  // Resumen final
  console.log("\n📊 Resumen de verificación:");
  console.log("─".repeat(50));
  console.log(`Precios: ${preciosCorrect ? "✅ Correctos" : "❌ Incorrectos"}`);
  console.log(`Límites: ${limitesCorrect ? "✅ Correctos" : "❌ Incorrectos"}`);

  if (preciosCorrect && limitesCorrect) {
    console.log("\n🎉 ¡Todas las configuraciones están correctas!");
  } else {
    console.log(
      "\n⚠️  Algunas configuraciones no coinciden con los valores esperados."
    );
  }

  // Mostrar configuración completa de precios
  console.log("\n📋 Configuración completa de precios:");
  console.log("─".repeat(50));
  showNestedConfig(preciosConfig, "");

  // Mostrar configuración completa de límites
  console.log("\n📋 Configuración completa de límites:");
  console.log("─".repeat(50));
  showNestedConfig(limitesConfig, "");
}

// Función para mostrar configuración anidada
function showNestedConfig(data, prefix = "") {
  if (typeof data === "object" && data !== null) {
    Object.entries(data).forEach(([key, value]) => {
      const currentPath = prefix ? `${prefix}.${key}` : key;
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        showNestedConfig(value, currentPath);
      } else {
        console.log(
          `${currentPath}: ${value} centavos (${centsToBs(value)} Bs)`
        );
      }
    });
  }
}

// Ejecutar el script
if (require.main === module) {
  verifyUpdatedConfig().catch((error) => {
    console.error("💥 Error fatal:", error.message);
    process.exit(1);
  });
}

module.exports = { verifyUpdatedConfig, getConfig };
