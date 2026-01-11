"use strict";

/**
 * Script de prueba para simular el flujo completo de registro de nicknames
 *
 * Este script simula el comportamiento del bot cuando un usuario
 * intenta registrar un nickname, incluyendo los casos problemáticos
 */

const {
  validateNickname,
  generateNicknameSuggestions,
} = require("../utils/nickname-validator");

console.log("🧪 Iniciando prueba del flujo de registro de nicknames...\n");

// Simular el comportamiento del bot
function simulateBotRegistration(nickname) {
  console.log(`📝 Usuario intenta registrar: "${nickname}"`);

  try {
    // Validar formato del nickname (como lo hace el bot)
    const validationResult = validateNickname(nickname);

    if (!validationResult.valid) {
      const suggestions = generateNicknameSuggestions(nickname);
      console.log(`❌ **${validationResult.error}**`);
      console.log(`💡 **Sugerencias:** ${suggestions.join(", ")}`);
      console.log(`📝 Intenta de nuevo:`);
      return false;
    }

    // Si es válido, simular el resto del proceso
    console.log(
      `✅ **¡Registro exitoso!** Tu nickname es: *${validationResult.nickname}*`
    );
    if (validationResult.useTelegramName) {
      console.log(`📱 Usando nombre de Telegram`);
    }
    return true;
  } catch (error) {
    console.log(`💥 Error inesperado: ${error.message}`);
    return false;
  }
}

// Casos de prueba específicos que causaban problemas
const problemCases = [
  "soyyo",
  "sobe",
  "gamer123",
  "el_pro",
  "jugador-pro",
  "José",
  "-no",
  "so",
  "a",
  "",
  "   ",
  "soy yo",
  "soy-yo-",
  "-soyyo",
  "soy_yo_",
  "_soyyo",
  "123456",
  "admin",
  "puto",
  "test123",
  "soyyo1234",
  "soyyo!!!",
  "soyyo@",
];

console.log("🔍 Probando casos específicos que causaban problemas:\n");

let successCount = 0;
let failureCount = 0;

problemCases.forEach((nickname, index) => {
  console.log(`--- Prueba ${index + 1} ---`);
  const result = simulateBotRegistration(nickname);

  if (result) {
    successCount++;
  } else {
    failureCount++;
  }

  console.log(""); // Línea en blanco
});

// Resumen
console.log("📊 Resumen del flujo de registro:");
console.log(`   ✅ Registros exitosos: ${successCount}`);
console.log(`   ❌ Registros fallidos: ${failureCount}`);
console.log(
  `   📈 Tasa de éxito: ${Math.round(
    (successCount / problemCases.length) * 100
  )}%`
);

// Verificar que los casos problemáticos originales funcionan
console.log("\n🎯 Verificación de casos problemáticos originales:");
const originalProblemCases = ["soyyo", "sobe"];
originalProblemCases.forEach((nickname) => {
  console.log(`\n📝 Probando "${nickname}":`);
  const result = simulateBotRegistration(nickname);
  if (result) {
    console.log(`   ✅ "${nickname}" ahora funciona correctamente`);
  } else {
    console.log(`   ❌ "${nickname}" aún tiene problemas`);
  }
});

console.log("\n✨ Prueba del flujo de registro completada.");
