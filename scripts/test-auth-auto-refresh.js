/**
 * Script de prueba para el sistema de autenticación automática
 * Verifica que el token se renueve automáticamente cuando expira
 */

require("dotenv").config();
const BackendAPI = require("../api/backend");

// Variables de entorno
const BACKEND_URL = process.env.BACKEND_URL;
const BOT_EMAIL = process.env.BOT_EMAIL;
const BOT_PASSWORD = process.env.BOT_PASSWORD;
const PRE_TOKEN = process.env.BOT_JWT || null;

if (!BACKEND_URL || !BOT_EMAIL || !BOT_PASSWORD) {
  console.error("❌ Faltan variables de entorno:");
  console.error("   BACKEND_URL:", BACKEND_URL ? "✅" : "❌");
  console.error("   BOT_EMAIL:", BOT_EMAIL ? "✅" : "❌");
  console.error("   BOT_PASSWORD:", BOT_PASSWORD ? "✅" : "❌");
  process.exit(1);
}

async function testAuthSystem() {
  console.log(
    "🧪 Iniciando pruebas del sistema de autenticación automática...\n"
  );

  try {
    // Inicializar API
    const api = new BackendAPI({
      baseUrl: BACKEND_URL,
      botEmail: BOT_EMAIL,
      botPassword: BOT_PASSWORD,
      preToken: PRE_TOKEN,
    });

    console.log("1️⃣ Verificando autenticación inicial...");
    await api.ensureAuth();
    console.log("✅ Autenticación inicial exitosa");

    // Mostrar información del token
    const tokenInfo = api.getTokenInfo();
    console.log("\n📋 Información del token:");
    console.log("   Válido:", tokenInfo.valid ? "✅" : "❌");
    console.log(
      "   Expira:",
      tokenInfo.expiresAt ? tokenInfo.expiresAt.toLocaleString("es-ES") : "N/A"
    );
    console.log(
      "   Tiempo restante:",
      tokenInfo.timeUntilExpiry
        ? `${Math.round(tokenInfo.timeUntilExpiry / 60000)} minutos`
        : "N/A"
    );
    console.log("   Expirará pronto:", tokenInfo.willExpireSoon ? "⚠️" : "✅");

    console.log("\n2️⃣ Probando petición al backend...");
    const jugadores = await api.getAllPlayers();
    console.log(
      `✅ Petición exitosa - ${jugadores.length} jugadores encontrados`
    );

    console.log("\n3️⃣ Probando renovación manual del token...");
    const newToken = await api.refreshToken();
    console.log("✅ Token renovado manualmente");

    const newTokenInfo = api.getTokenInfo();
    console.log(
      "   Nueva expiración:",
      newTokenInfo.expiresAt
        ? newTokenInfo.expiresAt.toLocaleString("es-ES")
        : "N/A"
    );

    console.log("\n4️⃣ Probando petición después de renovación...");
    const salas = await api.getSalasDisponibles();
    console.log(
      `✅ Petición exitosa después de renovación - ${salas.length} salas encontradas`
    );

    console.log("\n5️⃣ Verificando estado final del token...");
    const finalTokenInfo = api.getTokenInfo();
    console.log("   Válido:", finalTokenInfo.valid ? "✅" : "❌");
    console.log(
      "   Expira:",
      finalTokenInfo.expiresAt
        ? finalTokenInfo.expiresAt.toLocaleString("es-ES")
        : "N/A"
    );

    console.log("\n🎉 ¡Todas las pruebas pasaron exitosamente!");
    console.log(
      "✅ El sistema de autenticación automática está funcionando correctamente"
    );
  } catch (error) {
    console.error("\n❌ Error en las pruebas:", error.message);

    if (error.response) {
      console.error("   Status:", error.response.status);
      console.error("   Data:", error.response.data);
    }

    process.exit(1);
  }
}

// Ejecutar pruebas
testAuthSystem();
