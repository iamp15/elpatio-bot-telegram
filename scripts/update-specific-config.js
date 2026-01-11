const axios = require("axios");

// Configuración
const BACKEND_URL = "http://localhost:5000/api";
const ADMIN_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OGUwN2EzNTI5MmE3YmI5ZTQ3ZGY4YSIsImVtYWlsIjoiaWFtcDE4QGdtYWlsLmNvbSIsInJvbCI6InN1cGVyYWRtaW4iLCJpYXQiOjE3NTYxNjg3MDYsImV4cCI6MTc1Njc3MzUwNn0.IKSxOANO0v1akbcNfJQrqIZNTby7H2ymZvs4fy9lWB0";

// Función para convertir Bolívares a centavos
const bsToCents = (bs) => Math.round(bs * 100);

// Función para actualizar configuración
async function updateConfig(configType, configKey, configValue) {
  try {
    console.log(
      `🔄 Actualizando ${configType}.${configKey} = ${configValue} centavos (${
        configValue / 100
      } Bs)`
    );

    const response = await axios.put(
      `${BACKEND_URL}/payment-config`,
      {
        configType,
        configKey,
        configValue,
      },
      {
        headers: {
          Authorization: `Bearer ${ADMIN_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`✅ ${configType}.${configKey} actualizado exitosamente`);
    return response.data;
  } catch (error) {
    console.error(
      `❌ Error actualizando ${configType}.${configKey}:`,
      error.response?.data || error.message
    );
    return null;
  }
}

// Función principal
async function updateSpecificConfig() {
  console.log("🚀 Iniciando actualización de configuración específica...\n");

  const updates = [
    // Precios de Ludo
    { type: "precios", key: "ludo.1v1", value: bsToCents(300) },
    { type: "precios", key: "ludo.2v2", value: bsToCents(400) },
    { type: "precios", key: "ludo.1v1v1", value: bsToCents(100) },
    { type: "precios", key: "ludo.1v1v1v1", value: bsToCents(100) },

    // Límites
    { type: "limites", key: "deposito.maximo", value: bsToCents(50000) },
    { type: "limites", key: "retiro.maximo", value: bsToCents(30000) },
  ];

  console.log("📋 Configuraciones a actualizar:");
  updates.forEach((update) => {
    console.log(
      `   • ${update.type}.${update.key}: ${update.value} centavos (${
        update.value / 100
      } Bs)`
    );
  });
  console.log("");

  let successCount = 0;
  let errorCount = 0;

  for (const update of updates) {
    const result = await updateConfig(update.type, update.key, update.value);
    if (result) {
      successCount++;
    } else {
      errorCount++;
    }
    console.log(""); // Línea en blanco para separar
  }

  console.log("📊 Resumen de actualización:");
  console.log(`   ✅ Exitosos: ${successCount}`);
  console.log(`   ❌ Errores: ${errorCount}`);
  console.log(`   📈 Total: ${updates.length}`);

  if (errorCount === 0) {
    console.log(
      "\n🎉 ¡Todas las configuraciones se actualizaron exitosamente!"
    );
  } else {
    console.log(
      "\n⚠️  Algunas configuraciones no se pudieron actualizar. Revisa los errores arriba."
    );
  }
}

// Ejecutar el script
if (require.main === module) {
  updateSpecificConfig().catch((error) => {
    console.error("💥 Error fatal:", error.message);
    process.exit(1);
  });
}

module.exports = { updateSpecificConfig, updateConfig };
