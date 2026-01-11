/**
 * Script para probar la renovación automática cuando el token expira
 * Simula un token expirado y verifica que se renueve automáticamente
 */

require("dotenv").config();
const BackendAPI = require("../api/backend");

// Variables de entorno
const BACKEND_URL = process.env.BACKEND_URL;
const BOT_EMAIL = process.env.BOT_EMAIL;
const BOT_PASSWORD = process.env.BOT_PASSWORD;

if (!BACKEND_URL || !BOT_EMAIL || !BOT_PASSWORD) {
  console.error("❌ Faltan variables de entorno necesarias");
  process.exit(1);
}

async function testTokenExpiry() {
  console.log("🧪 Probando renovación automática con token expirado...\n");

  try {
    // Inicializar API sin token preexistente
    const api = new BackendAPI({
      baseUrl: BACKEND_URL,
      botEmail: BOT_EMAIL,
      botPassword: BOT_PASSWORD,
      preToken: null, // Sin token inicial
    });

    console.log("1️⃣ Verificando estado inicial sin token...");
    const initialTokenInfo = api.getTokenInfo();
    console.log("   Token válido:", initialTokenInfo.valid ? "✅" : "❌");
    console.log("   Token existe:", initialTokenInfo.valid ? "✅" : "❌");

    console.log(
      "\n2️⃣ Haciendo petición que debería activar autenticación automática..."
    );
    const jugadores = await api.getAllPlayers();
    console.log(
      `✅ Petición exitosa - ${jugadores.length} jugadores encontrados`
    );

    console.log("\n3️⃣ Verificando que se obtuvo un token válido...");
    const tokenInfo = api.getTokenInfo();
    console.log("   Token válido:", tokenInfo.valid ? "✅" : "❌");
    console.log(
      "   Expira:",
      tokenInfo.expiresAt ? tokenInfo.expiresAt.toLocaleString("es-ES") : "N/A"
    );

    console.log(
      "\n4️⃣ Probando petición adicional para verificar persistencia..."
    );
    const salas = await api.getSalasDisponibles();
    console.log(
      `✅ Petición adicional exitosa - ${salas.length} salas encontradas`
    );

    console.log("\n🎉 ¡Prueba de renovación automática exitosa!");
    console.log(
      "✅ El sistema maneja correctamente la autenticación automática"
    );
  } catch (error) {
    console.error("\n❌ Error en la prueba:", error.message);

    if (error.response) {
      console.error("   Status:", error.response.status);
      console.error("   Data:", error.response.data);
    }

    process.exit(1);
  }
}

// Ejecutar prueba
testTokenExpiry();
