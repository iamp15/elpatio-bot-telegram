// Script para verificar que los comandos se están importando correctamente
console.log("🔍 Verificando importación de comandos...\n");

try {
  // Importar el módulo de comandos
  const commands = require("../handlers/commands");

  console.log("✅ Módulo de comandos importado correctamente");
  console.log("📋 Funciones disponibles:");

  // Listar todas las funciones disponibles
  Object.keys(commands).forEach((key) => {
    if (typeof commands[key] === "function") {
      console.log(`  ✅ ${key}: Función`);
    } else {
      console.log(`  ❌ ${key}: ${typeof commands[key]}`);
    }
  });

  // Verificar específicamente los comandos de configuración de precios
  console.log("\n🎯 Verificando comandos de configuración de precios:");

  const paymentCommands = [
    "handleVerPrecios",
    "handleVerHistorial",
    "handleVerCacheStats",
    "handleLimpiarCache",
    "handleAyudaPrecios",
  ];

  paymentCommands.forEach((cmd) => {
    if (commands[cmd] && typeof commands[cmd] === "function") {
      console.log(`  ✅ ${cmd}: Disponible`);
    } else {
      console.log(`  ❌ ${cmd}: No disponible`);
    }
  });

  console.log("\n🎉 Verificación completada");
} catch (error) {
  console.error("❌ Error importando comandos:", error.message);
  console.error("Stack trace:", error.stack);
}
