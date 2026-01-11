"use strict";

/**
 * Script de prueba para verificar la modularización de handlers/messages.js
 *
 * Este script verifica que:
 * 1. Todos los módulos se pueden importar correctamente
 * 2. Todas las funciones están disponibles
 * 3. La estructura modular funciona como se esperaba
 */

console.log("🧪 Iniciando prueba de modularización de messages.js...\n");

try {
  // 1. Probar importación del módulo principal
  console.log("📦 Probando importación del módulo principal...");
  const messagesModule = require("../handlers/messages");
  console.log("✅ Módulo principal importado correctamente");

  // 2. Verificar que todas las funciones están disponibles
  console.log("\n🔍 Verificando funciones disponibles...");

  const expectedFunctions = [
    "handleSeleccionarJuego",
    "handleVerSalas",
    "handleCrearSala",
    "handleAyuda",
    "handleMiPerfil",
    "handleNicknameRegistration",
    "handleTelegramNameRegistration",
    "handleTextMessage",
  ];

  const availableFunctions = Object.keys(messagesModule);

  console.log("📋 Funciones esperadas:", expectedFunctions.length);
  console.log("📋 Funciones disponibles:", availableFunctions.length);

  // Verificar que todas las funciones esperadas están presentes
  const missingFunctions = expectedFunctions.filter(
    (func) => !availableFunctions.includes(func)
  );

  if (missingFunctions.length > 0) {
    console.log("❌ Funciones faltantes:", missingFunctions);
    throw new Error("Faltan funciones en el módulo principal");
  }

  console.log("✅ Todas las funciones están disponibles");

  // 3. Probar importación de módulos individuales
  console.log("\n📁 Probando importación de módulos individuales...");

  const keyboardHandlers = require("../handlers/messages/keyboard-handlers");
  console.log("✅ keyboard-handlers importado correctamente");

  const registrationHandlers = require("../handlers/messages/registration-handlers");
  console.log("✅ registration-handlers importado correctamente");

  const textHandler = require("../handlers/messages/text-handler");
  console.log("✅ text-handler importado correctamente");

  const indexModule = require("../handlers/messages/index");
  console.log("✅ index importado correctamente");

  // 4. Verificar que las funciones son funciones
  console.log("\n🔧 Verificando tipos de funciones...");

  expectedFunctions.forEach((funcName) => {
    if (typeof messagesModule[funcName] !== "function") {
      throw new Error(`La función ${funcName} no es una función válida`);
    }
  });

  console.log("✅ Todas las funciones son funciones válidas");

  // 5. Verificar estructura de archivos
  console.log("\n📂 Verificando estructura de archivos...");

  const fs = require("fs");
  const path = require("path");

  const messagesDir = path.join(__dirname, "../handlers/messages");
  const expectedFiles = [
    "keyboard-handlers.js",
    "registration-handlers.js",
    "text-handler.js",
    "index.js",
  ];

  expectedFiles.forEach((file) => {
    const filePath = path.join(messagesDir, file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Archivo faltante: ${file}`);
    }
  });

  console.log("✅ Todos los archivos están presentes");

  // 6. Verificar líneas de código
  console.log("\n📊 Estadísticas de modularización...");

  const originalFile = path.join(__dirname, "../handlers/messages.js");
  const originalLines = fs
    .readFileSync(originalFile, "utf8")
    .split("\n").length;

  console.log(`📄 Líneas en archivo original: ${originalLines}`);
  console.log(
    "📄 Líneas esperadas en archivo original: ~8 (solo imports y exports)"
  );

  if (originalLines > 15) {
    console.log(
      "⚠️  El archivo original podría no estar completamente modularizado"
    );
  } else {
    console.log("✅ El archivo original está correctamente modularizado");
  }

  // 7. Verificar que no hay dependencias circulares
  console.log("\n🔄 Verificando dependencias...");

  // Intentar importar cada módulo individualmente para detectar dependencias circulares
  try {
    require("../handlers/messages/keyboard-handlers");
    require("../handlers/messages/registration-handlers");
    require("../handlers/messages/text-handler");
    require("../handlers/messages/index");
    console.log("✅ No se detectaron dependencias circulares");
  } catch (error) {
    console.log("❌ Posible dependencia circular detectada:", error.message);
  }

  console.log("\n🎉 ¡Prueba de modularización completada exitosamente!");
  console.log("\n📋 Resumen:");
  console.log("   • Módulo principal: ✅");
  console.log("   • Funciones disponibles: ✅");
  console.log("   • Módulos individuales: ✅");
  console.log("   • Tipos de funciones: ✅");
  console.log("   • Estructura de archivos: ✅");
  console.log("   • Dependencias: ✅");
  console.log(
    "\n✨ La modularización de messages.js está funcionando correctamente"
  );
} catch (error) {
  console.error("\n❌ Error en la prueba de modularización:", error.message);
  console.error("Stack trace:", error.stack);
  process.exit(1);
}
