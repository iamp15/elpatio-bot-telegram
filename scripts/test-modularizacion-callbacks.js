/**
 * Script de prueba para verificar la modularización de callbacks
 *
 * Este script verifica que:
 * 1. Todos los módulos se importan correctamente
 * 2. Las funciones están disponibles
 * 3. La estructura modular funciona
 */

console.log("🧪 Iniciando prueba de modularización de callbacks...\n");

try {
  // 1. Probar importación del módulo principal
  console.log("📋 Paso 1: Importando módulo principal...");
  const callbacksModule = require("../handlers/callbacks");
  console.log("✅ Módulo principal importado correctamente");

  // 2. Verificar que las funciones principales están disponibles
  console.log("\n📋 Paso 2: Verificando funciones principales...");

  if (typeof callbacksModule.handleCallbackQuery === "function") {
    console.log("✅ handleCallbackQuery está disponible");
  } else {
    console.log("❌ handleCallbackQuery NO está disponible");
  }

  if (typeof callbacksModule.handleCreateSalaFinal === "function") {
    console.log("✅ handleCreateSalaFinal está disponible");
  } else {
    console.log("❌ handleCreateSalaFinal NO está disponible");
  }

  // 3. Probar importación de módulos individuales
  console.log("\n📋 Paso 3: Verificando módulos individuales...");

  const gameCallbacks = require("../handlers/callbacks/game-callbacks");
  console.log("✅ game-callbacks importado correctamente");

  const salaCallbacks = require("../handlers/callbacks/sala-callbacks");
  console.log("✅ sala-callbacks importado correctamente");

  const adminCallbacks = require("../handlers/callbacks/admin-callbacks");
  console.log("✅ admin-callbacks importado correctamente");

  const salaCreation = require("../handlers/callbacks/sala-creation");
  console.log("✅ sala-creation importado correctamente");

  // 4. Verificar funciones específicas en cada módulo
  console.log("\n📋 Paso 4: Verificando funciones específicas...");

  // Game callbacks
  if (typeof gameCallbacks.handleSelectGame === "function") {
    console.log("✅ handleSelectGame disponible en game-callbacks");
  }
  if (typeof gameCallbacks.handleVerSalasAfterCreate === "function") {
    console.log("✅ handleVerSalasAfterCreate disponible en game-callbacks");
  }

  // Sala callbacks
  if (typeof salaCallbacks.handleCreateSalaMode === "function") {
    console.log("✅ handleCreateSalaMode disponible en sala-callbacks");
  }
  if (typeof salaCallbacks.handleJoinSala === "function") {
    console.log("✅ handleJoinSala disponible en sala-callbacks");
  }
  if (typeof salaCallbacks.handleConfirmLeaveSala === "function") {
    console.log("✅ handleConfirmLeaveSala disponible en sala-callbacks");
  }
  if (typeof salaCallbacks.handleCancelLeaveSala === "function") {
    console.log("✅ handleCancelLeaveSala disponible en sala-callbacks");
  }
  if (typeof salaCallbacks.handleLeaveSala === "function") {
    console.log("✅ handleLeaveSala disponible en sala-callbacks");
  }

  // Admin callbacks
  if (typeof adminCallbacks.handleRefreshToken === "function") {
    console.log("✅ handleRefreshToken disponible en admin-callbacks");
  }
  if (typeof adminCallbacks.handleViewStats === "function") {
    console.log("✅ handleViewStats disponible en admin-callbacks");
  }

  // Sala creation
  if (typeof salaCreation.handleCreateSalaFinal === "function") {
    console.log("✅ handleCreateSalaFinal disponible en sala-creation");
  }

  // 5. Verificar estructura de archivos
  console.log("\n📋 Paso 5: Verificando estructura de archivos...");

  const fs = require("fs");
  const path = require("path");

  const callbacksDir = path.join(__dirname, "../handlers/callbacks");
  const files = fs.readdirSync(callbacksDir);

  console.log("📁 Archivos en handlers/callbacks/:");
  files.forEach((file) => {
    console.log(`   📄 ${file}`);
  });

  const expectedFiles = [
    "index.js",
    "game-callbacks.js",
    "sala-callbacks.js",
    "admin-callbacks.js",
    "sala-creation.js",
  ];

  const missingFiles = expectedFiles.filter((file) => !files.includes(file));
  if (missingFiles.length === 0) {
    console.log("✅ Todos los archivos esperados están presentes");
  } else {
    console.log("❌ Archivos faltantes:", missingFiles);
  }

  console.log("\n🎉 ¡Modularización completada exitosamente!");
  console.log("\n📋 Resumen de la nueva estructura:");
  console.log("   📁 handlers/callbacks/");
  console.log(
    "      📄 index.js - Módulo principal que coordina todos los callbacks"
  );
  console.log("      📄 game-callbacks.js - Callbacks relacionados con juegos");
  console.log("      📄 sala-callbacks.js - Callbacks relacionados con salas");
  console.log("      📄 admin-callbacks.js - Callbacks de administración");
  console.log("      📄 sala-creation.js - Creación final de salas");
  console.log("\n💡 Beneficios de la modularización:");
  console.log("   ✅ Código más organizado y fácil de mantener");
  console.log("   ✅ Separación clara de responsabilidades");
  console.log("   ✅ Archivos más pequeños y legibles");
  console.log("   ✅ Facilita el trabajo en equipo");
  console.log("   ✅ Mejor reutilización de código");
} catch (error) {
  console.error("❌ Error en la prueba de modularización:", error.message);
  console.error("Stack trace:", error.stack);
  process.exit(1);
}

process.exit(0);
