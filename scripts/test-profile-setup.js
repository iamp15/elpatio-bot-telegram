"use strict";

/**
 * Script de Configuración para Pruebas del Perfil
 *
 * Este script ayuda a configurar el entorno para las pruebas del perfil
 * y proporciona comandos útiles para ejecutar las pruebas.
 */

const fs = require("fs");
const path = require("path");

/**
 * Verifica que las variables de entorno estén configuradas
 */
function checkEnvironment() {
  console.log("🔍 **VERIFICANDO CONFIGURACIÓN DEL ENTORNO**\n");

  const requiredVars = ["BACKEND_URL", "BOT_EMAIL", "BOT_PASSWORD"];

  const optionalVars = ["TEST_USER_ID"];

  console.log("📋 **Variables requeridas:**");
  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (value) {
      console.log(`   ✅ ${varName}: ${value}`);
    } else {
      console.log(`   ❌ ${varName}: No configurada`);
    }
  }

  console.log("\n📋 **Variables opcionales:**");
  for (const varName of optionalVars) {
    const value = process.env[varName];
    if (value) {
      console.log(`   ✅ ${varName}: ${value}`);
    } else {
      console.log(`   ⚠️ ${varName}: No configurada (usará valor por defecto)`);
    }
  }

  console.log("");
}

/**
 * Muestra los comandos disponibles para las pruebas
 */
function showCommands() {
  console.log("🚀 **COMANDOS DISPONIBLES PARA PRUEBAS**\n");

  console.log("📋 **Pruebas de Formateo de Moneda:**");
  console.log("   npm run test:currency");
  console.log("   node scripts/test-profile-currency.js\n");

  console.log("📋 **Pruebas del Perfil Completo:**");
  console.log("   npm run test:profile");
  console.log("   node scripts/test-profile-complete.js\n");

  console.log("📋 **Pruebas con Usuario Específico:**");
  console.log(
    "   TEST_USER_ID=123456789 node scripts/test-profile-complete.js\n"
  );

  console.log("📋 **Pruebas con Backend Específico:**");
  console.log(
    "   BACKEND_URL=http://localhost:3000/api node scripts/test-profile-currency.js\n"
  );
}

/**
 * Crea un archivo .env de ejemplo
 */
function createEnvExample() {
  const envExample = `# Configuración del Backend
BACKEND_URL=http://localhost:3000/api

# Credenciales del Bot
BOT_EMAIL=bot@elpatio.com
BOT_PASSWORD=botpassword

# Usuario de Prueba (opcional)
TEST_USER_ID=123456789

# Modo de Prueba
TEST_MODE=false
`;

  const envPath = path.join(__dirname, "..", ".env.example");

  try {
    fs.writeFileSync(envPath, envExample);
    console.log("✅ **Archivo .env.example creado en la raíz del proyecto**\n");
  } catch (error) {
    console.error("❌ **Error creando .env.example:**", error.message);
  }
}

/**
 * Verifica que los archivos necesarios existan
 */
function checkFiles() {
  console.log("📁 **VERIFICANDO ARCHIVOS NECESARIOS**\n");

  const requiredFiles = [
    "../api/backend.js",
    "../utils/payment-config-manager.js",
    "../handlers/commands/profile-commands.js",
    "../handlers/callbacks/profile-callbacks.js",
  ];

  for (const file of requiredFiles) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      console.log(`   ✅ ${file}`);
    } else {
      console.log(`   ❌ ${file} (no encontrado)`);
    }
  }

  console.log("");
}

/**
 * Muestra información sobre las pruebas
 */
function showInfo() {
  console.log("ℹ️ **INFORMACIÓN SOBRE LAS PRUEBAS**\n");

  console.log("🎯 **Propósito:**");
  console.log("   Verificar que el sistema de perfil obtiene correctamente");
  console.log("   la configuración de moneda desde el backend y formatea");
  console.log("   los saldos según la configuración dinámica.\n");

  console.log("🔧 **Qué se prueba:**");
  console.log("   • Configuración de moneda desde /api/paymentConfig");
  console.log("   • Formateo de saldos con diferentes valores");
  console.log("   • Sistema de cache para mejorar rendimiento");
  console.log("   • Fallback en caso de errores del backend");
  console.log("   • Compatibilidad con diferentes monedas");
  console.log("   • Generación completa del mensaje del perfil\n");

  console.log("⚠️ **Requisitos:**");
  console.log("   • Backend funcionando en la URL especificada");
  console.log("   • Credenciales del bot configuradas");
  console.log("   • Configuración de moneda en el backend");
  console.log("   • Usuario de prueba (opcional)\n");
}

/**
 * Función principal
 */
function main() {
  console.log("⚙️ **CONFIGURACIÓN DE PRUEBAS DEL PERFIL**\n");
  console.log("=".repeat(60) + "\n");

  // Verificar archivos
  checkFiles();

  // Verificar entorno
  checkEnvironment();

  // Mostrar información
  showInfo();

  // Mostrar comandos
  showCommands();

  // Crear .env.example si no existe
  const envExamplePath = path.join(__dirname, "..", ".env.example");
  if (!fs.existsSync(envExamplePath)) {
    console.log("📝 **Creando archivo .env.example...**\n");
    createEnvExample();
  }

  console.log("=".repeat(60));
  console.log("✅ **Configuración completada**\n");

  console.log("💡 **Próximos pasos:**");
  console.log("   1. Configura las variables de entorno en .env");
  console.log("   2. Asegúrate de que el backend esté funcionando");
  console.log("   3. Ejecuta: npm run test:currency");
  console.log("   4. Ejecuta: npm run test:profile\n");
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

module.exports = {
  checkEnvironment,
  checkFiles,
  showCommands,
  createEnvExample,
  showInfo,
  main,
};
