"use strict";

require("dotenv").config();
const BackendAPI = require("../api/backend");

function isValidObjectId(id) {
  // ObjectId de MongoDB debe tener 24 caracteres hexadecimales
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  return objectIdPattern.test(id);
}

async function debugObjectId() {
  console.log("🔍 Debuggeando ObjectIds...");

  // Crear instancia de la API
  const api = new BackendAPI({
    baseUrl: process.env.BACKEND_URL || "http://localhost:5000",
    botEmail: process.env.BOT_EMAIL,
    botPassword: process.env.BOT_PASSWORD,
  });

  const idsToTest = [
    "146c",
    "507f1f77bcf86cd799439011",
    "507f1f77bcf86cd799439012",
    "507f1f77bcf86cd799439013",
  ];

  console.log("\n📋 Verificando formato de ObjectIds:\n");

  for (const id of idsToTest) {
    console.log(`🔍 ID: ${id}`);
    console.log(`   Longitud: ${id.length} caracteres`);
    console.log(
      `   Es ObjectId válido: ${isValidObjectId(id) ? "✅ Sí" : "❌ No"}`
    );

    if (!isValidObjectId(id)) {
      console.log(`   ⚠️  Este ID no es un ObjectId válido de MongoDB`);
      console.log(
        `   📝 Los ObjectIds deben tener 24 caracteres hexadecimales (0-9, a-f, A-F)`
      );
    }

    console.log("");
  }

  console.log("🎯 Probando endpoint con más detalle...\n");

  // Probar específicamente el ID problemático
  const problematicId = "146c";
  console.log(`🔍 Probando ID problemático: ${problematicId}`);

  try {
    // Hacer la llamada directamente para ver el error completo
    await api.ensureAuth();
    const response = await api.client.get(
      `/api/jugadores/by-id/${problematicId}`
    );
    console.log("✅ Respuesta exitosa:", response.data);
  } catch (err) {
    console.log("❌ Error detallado:");
    console.log(`   Mensaje: ${err.message}`);
    console.log(`   Status: ${err.response?.status}`);
    console.log(`   StatusText: ${err.response?.statusText}`);
    console.log(`   URL: ${err.config?.url}`);
    console.log(`   Data: ${JSON.stringify(err.response?.data, null, 2)}`);
  }

  console.log("\n💡 Posibles soluciones:");
  console.log("   1. Verificar que '146c' sea realmente un ObjectId válido");
  console.log(
    "   2. Revisar los logs del backend para ver el error específico"
  );
  console.log(
    "   3. Verificar que la función del controlador maneje correctamente ObjectIds inválidos"
  );
}

debugObjectId();
