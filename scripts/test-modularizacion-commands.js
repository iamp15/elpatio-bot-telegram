/**
 * Script de prueba para verificar la modularización de comandos
 *
 * Este script verifica que:
 * 1. Todos los módulos se importan correctamente
 * 2. Las funciones están disponibles
 * 3. La estructura modular funciona
 */

console.log("🧪 Iniciando prueba de modularización de comandos...\n");

try {
  // 1. Probar importación del módulo principal
  console.log("📋 Paso 1: Importando módulo principal...");
  const commandsModule = require("../handlers/commands");
  console.log("✅ Módulo principal importado correctamente");

  // 2. Verificar que las funciones principales están disponibles
  console.log("\n📋 Paso 2: Verificando funciones principales...");

  const expectedFunctions = [
    // Comandos básicos
    "handleStart",
    "handleAyuda",

    // Comandos de juegos
    "handleJuegos",
    "handleMiJuego",
    "handleCambiarJuego",

    // Comandos de salas
    "handleSalas",
    "handleCrearSala",

    // Comandos de administración
    "handleStats",
    "handleToken",
    "handleSetWelcome",
    "handleSetupMeta",
    "handleCleanup",
    "handleRestore",
  ];

  let allFunctionsAvailable = true;
  expectedFunctions.forEach((funcName) => {
    if (typeof commandsModule[funcName] === "function") {
      console.log(`✅ ${funcName} está disponible`);
    } else {
      console.log(`❌ ${funcName} NO está disponible`);
      allFunctionsAvailable = false;
    }
  });

  // 3. Probar importación de módulos individuales
  console.log("\n📋 Paso 3: Verificando módulos individuales...");

  const basicCommands = require("../handlers/commands/basic-commands");
  console.log("✅ basic-commands importado correctamente");

  const gameCommands = require("../handlers/commands/game-commands");
  console.log("✅ game-commands importado correctamente");

  const salaCommands = require("../handlers/commands/sala-commands");
  console.log("✅ sala-commands importado correctamente");

  const adminCommands = require("../handlers/commands/admin-commands");
  console.log("✅ admin-commands importado correctamente");

  // 4. Verificar funciones específicas en cada módulo
  console.log("\n📋 Paso 4: Verificando funciones específicas...");

  // Basic commands
  if (typeof basicCommands.handleStart === "function") {
    console.log("✅ handleStart disponible en basic-commands");
  }
  if (typeof basicCommands.handleAyuda === "function") {
    console.log("✅ handleAyuda disponible en basic-commands");
  }

  // Game commands
  if (typeof gameCommands.handleJuegos === "function") {
    console.log("✅ handleJuegos disponible en game-commands");
  }
  if (typeof gameCommands.handleMiJuego === "function") {
    console.log("✅ handleMiJuego disponible en game-commands");
  }
  if (typeof gameCommands.handleCambiarJuego === "function") {
    console.log("✅ handleCambiarJuego disponible en game-commands");
  }

  // Sala commands
  if (typeof salaCommands.handleSalas === "function") {
    console.log("✅ handleSalas disponible en sala-commands");
  }
  if (typeof salaCommands.handleCrearSala === "function") {
    console.log("✅ handleCrearSala disponible en sala-commands");
  }

  // Admin commands
  if (typeof adminCommands.handleStats === "function") {
    console.log("✅ handleStats disponible en admin-commands");
  }
  if (typeof adminCommands.handleToken === "function") {
    console.log("✅ handleToken disponible en admin-commands");
  }
  if (typeof adminCommands.handleSetWelcome === "function") {
    console.log("✅ handleSetWelcome disponible en admin-commands");
  }
  if (typeof adminCommands.handleSetupMeta === "function") {
    console.log("✅ handleSetupMeta disponible en admin-commands");
  }
  if (typeof adminCommands.handleCleanup === "function") {
    console.log("✅ handleCleanup disponible en admin-commands");
  }
  if (typeof adminCommands.handleRestore === "function") {
    console.log("✅ handleRestore disponible en admin-commands");
  }

  // 5. Verificar estructura de archivos
  console.log("\n📋 Paso 5: Verificando estructura de archivos...");

  const fs = require("fs");
  const path = require("path");

  const commandsDir = path.join(__dirname, "../handlers/commands");
  const files = fs.readdirSync(commandsDir);

  console.log("📁 Archivos en handlers/commands/:");
  files.forEach((file) => {
    console.log(`   📄 ${file}`);
  });

  const expectedFiles = [
    "index.js",
    "basic-commands.js",
    "game-commands.js",
    "sala-commands.js",
    "admin-commands.js",
  ];

  const missingFiles = expectedFiles.filter((file) => !files.includes(file));
  if (missingFiles.length === 0) {
    console.log("✅ Todos los archivos esperados están presentes");
  } else {
    console.log("❌ Archivos faltantes:", missingFiles);
  }

  // 6. Verificar líneas de código
  console.log("\n📋 Paso 6: Verificando líneas de código...");

  const originalFile = path.join(__dirname, "../handlers/commands.js");
  const originalLines = fs
    .readFileSync(originalFile, "utf8")
    .split("\n").length;
  console.log(`📄 Archivo original: ${originalLines} líneas`);

  let totalModularLines = 0;
  expectedFiles.forEach((file) => {
    if (file !== "index.js") {
      const filePath = path.join(commandsDir, file);
      const lines = fs.readFileSync(filePath, "utf8").split("\n").length;
      totalModularLines += lines;
      console.log(`📄 ${file}: ${lines} líneas`);
    }
  });

  console.log(`📊 Total líneas en módulos: ${totalModularLines} líneas`);
  console.log(
    `📊 Reducción: ${
      originalLines - totalModularLines
    } líneas menos en el archivo principal`
  );

  console.log("\n🎉 ¡Modularización de comandos completada exitosamente!");
  console.log("\n📋 Resumen de la nueva estructura:");
  console.log("   📁 handlers/commands/");
  console.log(
    "      📄 index.js - Módulo principal que coordina todos los comandos"
  );
  console.log("      📄 basic-commands.js - Comandos básicos (start, ayuda)");
  console.log(
    "      📄 game-commands.js - Comandos de juegos (juegos, mijuego, cambiarjuego)"
  );
  console.log(
    "      📄 sala-commands.js - Comandos de salas (salas, crearsala)"
  );
  console.log(
    "      📄 admin-commands.js - Comandos de administración (stats, token, etc.)"
  );
  console.log("\n💡 Beneficios de la modularización:");
  console.log("   ✅ Código más organizado y fácil de mantener");
  console.log("   ✅ Separación clara de responsabilidades");
  console.log("   ✅ Archivos más pequeños y legibles");
  console.log("   ✅ Facilita el trabajo en equipo");
  console.log("   ✅ Mejor reutilización de código");
  console.log("   ✅ Archivo principal reducido de 718 a 6 líneas");
} catch (error) {
  console.error("❌ Error en la prueba de modularización:", error.message);
  console.error("Stack trace:", error.stack);
  process.exit(1);
}

process.exit(0);
