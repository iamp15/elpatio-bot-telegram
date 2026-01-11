/**
 * Ejemplo de uso del nuevo sistema de variables de entorno
 * Este script demuestra cómo usar el sistema centralizado
 * Ejecuta: node scripts/example-usage.js
 */

const {
  getEnvVar,
  getAllEnvVars,
  isEnvironmentValid,
  showEnvironmentStatus,
} = require("../config/env-config");

console.log(
  "🚀 **EJEMPLO DE USO DEL NUEVO SISTEMA DE VARIABLES DE ENTORNO**\n"
);
console.log("=".repeat(70) + "\n");

// 1. Verificar si el entorno es válido
console.log("1️⃣ **VERIFICACIÓN DEL ENTORNO**");
const isValid = isEnvironmentValid();
console.log(
  `   Estado del entorno: ${isValid ? "✅ Válido" : "❌ Inválido"}\n`
);

// 2. Obtener variables individuales
console.log("2️⃣ **OBTENCIÓN DE VARIABLES INDIVIDUALES**");
const botToken = getEnvVar("BOT_TOKEN");
const backendUrl = getEnvVar("BACKEND_URL");
const testMode = getEnvVar("TEST_MODE", false); // Con valor por defecto
const cacheType = getEnvVar("CACHE_TYPE", "local"); // Con valor por defecto

console.log(
  `   BOT_TOKEN: ${
    botToken ? botToken.substring(0, 8) + "..." : "NO CONFIGURADO"
  }`
);
console.log(`   BACKEND_URL: ${backendUrl || "NO CONFIGURADO"}`);
console.log(`   TEST_MODE: ${testMode}`);
console.log(`   CACHE_TYPE: ${cacheType}\n`);

// 3. Obtener todas las variables
console.log("3️⃣ **OBTENCIÓN DE TODAS LAS VARIABLES**");
const allVars = getAllEnvVars();
console.log("   Variables disponibles:");
Object.entries(allVars).forEach(([key, value]) => {
  const displayValue =
    key.includes("TOKEN") || key.includes("PASSWORD")
      ? value
        ? value.substring(0, 8) + "..."
        : "NO CONFIGURADO"
      : value !== null && value !== undefined
      ? value
      : "NO CONFIGURADO";
  console.log(`     ${key}: ${displayValue}`);
});
console.log("");

// 4. Ejemplo de uso en un script real
console.log("4️⃣ **EJEMPLO DE USO EN UN SCRIPT REAL**");
console.log("   // En lugar de esto (ANTES):");
console.log("   const token = process.env.BOT_TOKEN;");
console.log(
  "   const url = process.env.BACKEND_URL || 'http://localhost:5000';"
);
console.log("   ");
console.log("   // Ahora usas esto (DESPUÉS):");
console.log("   const token = getEnvVar('BOT_TOKEN');");
console.log("   const url = getEnvVar('BACKEND_URL');");
console.log("   const testMode = getEnvVar('TEST_MODE', false);");
console.log("");

// 5. Validación automática
console.log("5️⃣ **VALIDACIÓN AUTOMÁTICA**");
console.log("   El sistema valida automáticamente:");
console.log("   • Formato de URLs (debe empezar con http:// o https://)");
console.log("   • Formato de emails (debe contener @)");
console.log("   • Valores numéricos (puertos, IDs)");
console.log("   • Valores booleanos (TEST_MODE)");
console.log("   • Valores enumerados (MODE, CACHE_TYPE)");
console.log("");

// 6. Estado completo del entorno
console.log("6️⃣ **ESTADO COMPLETO DEL ENTORNO**");
console.log("   Ejecutando verificación completa...\n");
showEnvironmentStatus();

console.log("\n" + "=".repeat(70));
console.log("💡 **BENEFICIOS DEL NUEVO SISTEMA:**");
console.log("   ✅ Validación automática de variables");
console.log("   ✅ Valores por defecto para variables opcionales");
console.log("   ✅ Manejo centralizado de la configuración");
console.log("   ✅ Detección temprana de errores");
console.log("   ✅ Documentación automática de variables");
console.log("   ✅ Compatibilidad con scripts existentes");
console.log("");
console.log("🚀 **PRÓXIMOS PASOS:**");
console.log("   1. Usa getEnvVar() en lugar de process.env directamente");
console.log("   2. Ejecuta check-env.js para verificar la configuración");
console.log("   3. Aprovecha la validación automática");
console.log("   4. Usa valores por defecto para variables opcionales");
