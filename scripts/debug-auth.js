/**
 * Script de diagnóstico detallado para autenticación
 * Ejecuta: node debug-auth.js
 */

require("dotenv").config();
const axios = require("axios");

const BACKEND_URL = process.env.BACKEND_URL;
const BOT_EMAIL = process.env.BOT_EMAIL;
const BOT_PASSWORD = process.env.BOT_PASSWORD;

async function debugAuth() {
  console.log("🔍 Diagnóstico de autenticación detallado");
  console.log("=".repeat(50));

  // 1. Verificar variables de entorno
  console.log("1️⃣ Verificando variables de entorno:");
  console.log(`   BACKEND_URL: ${BACKEND_URL}`);
  console.log(`   BOT_EMAIL: ${BOT_EMAIL}`);
  console.log(
    `   BOT_PASSWORD: ${
      BOT_PASSWORD ? "***configurado***" : "❌ NO CONFIGURADO"
    }`
  );
  console.log();

  if (!BACKEND_URL || !BOT_EMAIL || !BOT_PASSWORD) {
    console.error("❌ Faltan variables de entorno requeridas");
    return;
  }

  // 2. Probar conectividad básica
  console.log("2️⃣ Probando conectividad al backend:");
  try {
    const healthCheck = await axios.get(`${BACKEND_URL}/health`, {
      timeout: 5000,
    });
    console.log(`   ✅ Backend responde: ${healthCheck.status}`);
  } catch (err) {
    if (err.code === "ECONNREFUSED") {
      console.log("   ❌ Backend no está ejecutándose (ECONNREFUSED)");
      console.log(
        "   💡 Asegúrate de que el backend esté corriendo en:",
        BACKEND_URL
      );
      return;
    } else if (err.response) {
      console.log(
        `   ⚠️  Backend responde pero con error: ${err.response.status}`
      );
    } else {
      console.log(`   ❌ Error de conectividad: ${err.message}`);
      return;
    }
  }
  console.log();

  // 3. Probar endpoint de login específicamente
  console.log("3️⃣ Probando endpoint de login:");
  try {
    const loginResponse = await axios.post(
      `${BACKEND_URL}/api/admin/login`,
      {
        email: BOT_EMAIL,
        password: BOT_PASSWORD,
      },
      { timeout: 10000 }
    );

    console.log(`   ✅ Login exitoso: ${loginResponse.status}`);
    console.log(
      `   🔑 Token recibido: ${loginResponse.data.token ? "SÍ" : "NO"}`
    );

    if (loginResponse.data.token) {
      console.log(
        `   📝 Token (primeros 20 chars): ${loginResponse.data.token.substring(
          0,
          20
        )}...`
      );
    }
  } catch (err) {
    if (err.response) {
      console.log(
        `   ❌ Error de login: ${err.response.status} - ${err.response.statusText}`
      );
      console.log(`   📄 Respuesta del servidor:`, err.response.data);

      if (err.response.status === 401) {
        console.log("   💡 Credenciales incorrectas. Verifica:");
        console.log("      - El email del bot en el backend");
        console.log("      - La contraseña del bot en el backend");
        console.log("      - Que el usuario bot tenga permisos de admin");
      }
    } else {
      console.log(`   ❌ Error de red: ${err.message}`);
    }
  }
  console.log();

  // 4. Probar con token manual si tenemos uno
  console.log("4️⃣ Probando endpoint de jugadores (si tenemos token):");
  try {
    // Intentar login primero
    const loginRes = await axios.post(`${BACKEND_URL}/api/admin/login`, {
      email: BOT_EMAIL,
      password: BOT_PASSWORD,
    });

    if (loginRes.data.token) {
      const token = loginRes.data.token;

      // Probar endpoint de jugadores
      const jugadoresRes = await axios.get(`${BACKEND_URL}/api/jugadores`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });

      console.log(
        `   ✅ Endpoint de jugadores funciona: ${jugadoresRes.status}`
      );
    }
  } catch (err) {
    if (err.response) {
      console.log(
        `   ❌ Error en endpoint de jugadores: ${err.response.status}`
      );
    } else {
      console.log(`   ❌ Error: ${err.message}`);
    }
  }
  console.log();

  console.log("🏁 Diagnóstico completado");
}

debugAuth().catch(console.error);

