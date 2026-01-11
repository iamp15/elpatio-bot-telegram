const axios = require("axios");

// Configuración
const BACKEND_URL = "http://localhost:5000/api";
const ADMIN_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OGUwN2EzNTI5MmE3YmI5ZTQ3ZGY4YSIsImVtYWlsIjoiaWFtcDE4QGdtYWlsLmNvbSIsInJvbCI6InN1cGVyYWRtaW4iLCJpYXQiOjE3NTYxNjg3MDYsImV4cCI6MTc1Njc3MzUwNn0.IKSxOANO0v1akbcNfJQrqIZNTby7H2ymZvs4fy9lWB0";

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
    return response.data;
  } catch (error) {
    console.error(
      `❌ Error obteniendo ${configType}:`,
      error.response?.data || error.message
    );
    return null;
  }
}

// Función para mostrar estructura de datos
function showStructure(data, prefix = "") {
  if (typeof data === "object" && data !== null) {
    Object.entries(data).forEach(([key, value]) => {
      const currentPath = prefix ? `${prefix}.${key}` : key;
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        console.log(`${currentPath}: [Object]`);
        showStructure(value, currentPath);
      } else {
        console.log(`${currentPath}: ${value} (${typeof value})`);
      }
    });
  }
}

// Función principal
async function debugConfigStructure() {
  console.log("🔍 Debuggeando estructura de configuración...\n");

  // Obtener configuraciones
  console.log("📡 Obteniendo configuraciones del backend...\n");

  const preciosResponse = await getConfig("precios");
  const limitesResponse = await getConfig("limites");

  if (!preciosResponse || !limitesResponse) {
    console.error("💥 No se pudieron obtener las configuraciones");
    return;
  }

  console.log("📋 Estructura de respuesta de precios:");
  console.log("─".repeat(50));
  console.log(JSON.stringify(preciosResponse, null, 2));
  console.log("\n📋 Estructura detallada de precios:");
  console.log("─".repeat(50));
  showStructure(preciosResponse);

  console.log("\n📋 Estructura de respuesta de límites:");
  console.log("─".repeat(50));
  console.log(JSON.stringify(limitesResponse, null, 2));
  console.log("\n📋 Estructura detallada de límites:");
  console.log("─".repeat(50));
  showStructure(limitesResponse);

  // Intentar acceder a los datos de diferentes maneras
  console.log("\n🔍 Intentando acceder a los datos:");
  console.log("─".repeat(50));

  console.log("preciosResponse.data:", preciosResponse.data);
  console.log("preciosResponse.data.ludo:", preciosResponse.data?.ludo);
  console.log(
    "preciosResponse.data.ludo.1v1:",
    preciosResponse.data?.ludo?.["1v1"]
  );

  console.log("\nlimitesResponse.data:", limitesResponse.data);
  console.log("limitesResponse.data.deposito:", limitesResponse.data?.deposito);
  console.log(
    "limitesResponse.data.deposito.maximo:",
    limitesResponse.data?.deposito?.maximo
  );
}

// Ejecutar el script
if (require.main === module) {
  debugConfigStructure().catch((error) => {
    console.error("💥 Error fatal:", error.message);
    process.exit(1);
  });
}

module.exports = { debugConfigStructure };
