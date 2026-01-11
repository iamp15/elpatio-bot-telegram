#!/usr/bin/env node

/**
 * Script para debuggear la URL de la Mini App de depósitos
 */

const path = require("path");

// Importar la configuración
const { getWebAppUrl } = require("../config/webapp-config.js");

console.log("🔍 Debug de URL de Mini App de Depósitos\n");

try {
  // Obtener la URL de depósitos
  const depositoUrl = getWebAppUrl("DEPOSITO");

  console.log("✅ URL generada correctamente:");
  console.log(`   ${depositoUrl}\n`);

  // Verificar si la URL es válida
  const url = new URL(depositoUrl);
  console.log("📋 Análisis de la URL:");
  console.log(`   Protocolo: ${url.protocol}`);
  console.log(`   Host: ${url.hostname}`);
  console.log(`   Path: ${url.pathname}`);
  console.log(`   Puerto: ${url.port || "default"}\n`);

  // Verificar si es HTTPS
  if (url.protocol === "https:") {
    console.log("✅ La URL usa HTTPS (requerido para Telegram Web Apps)");
  } else {
    console.log("❌ La URL NO usa HTTPS (requerido para Telegram Web Apps)");
  }

  // Verificar si la URL termina con /
  if (depositoUrl.endsWith("/")) {
    console.log("✅ La URL termina con / (correcto)");
  } else {
    console.log("⚠️  La URL NO termina con / (puede causar problemas)");
  }

  console.log("\n🌐 Variables de entorno:");
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || "undefined"}`);
  console.log(
    `   WEBAPP_DEPOSITO_URL: ${process.env.WEBAPP_DEPOSITO_URL || "undefined"}`
  );
} catch (error) {
  console.error("❌ Error obteniendo URL:", error.message);
  process.exit(1);
}

console.log("\n💡 Para probar la URL:");
console.log("   1. Copia la URL generada");
console.log("   2. Ábrela en un navegador");
console.log("   3. Verifica que cargue la Mini App correctamente");
console.log(
  "   4. Si aparece login de Vercel, hay un problema de configuración"
);
