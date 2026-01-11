"use strict";

/**
 * Script de prueba para verificar la validación de nicknames
 *
 * Este script prueba diferentes casos de nicknames para asegurar
 * que la validación funciona correctamente
 */

const {
  validateNickname,
  generateNicknameSuggestions,
} = require("../utils/nickname-validator");

console.log("🧪 Iniciando prueba de validación de nicknames...\n");

// Casos de prueba
const testCases = [
  // Casos válidos
  { nickname: "soyyo", expected: "válido", description: "Nickname válido" },
  {
    nickname: "sobe",
    expected: "válido",
    description: "Nickname válido corto",
  },
  {
    nickname: "gamer123",
    expected: "válido",
    description: "Nickname con números",
  },
  {
    nickname: "el_pro",
    expected: "válido",
    description: "Nickname con guión bajo",
  },
  {
    nickname: "jugador-pro",
    expected: "válido",
    description: "Nickname con guión",
  },
  { nickname: "José", expected: "válido", description: "Nickname con acentos" },
  {
    nickname: "-no",
    expected: "válido",
    description: "Usar nombre de Telegram",
  },

  // Casos inválidos
  {
    nickname: "so",
    expected: "inválido",
    description: "Muy corto (2 caracteres)",
  },
  {
    nickname: "a",
    expected: "inválido",
    description: "Muy corto (1 carácter)",
  },
  { nickname: "", expected: "inválido", description: "Vacío" },
  { nickname: "   ", expected: "inválido", description: "Solo espacios" },
  { nickname: "soy yo", expected: "inválido", description: "Con espacios" },
  {
    nickname: "soy-yo-",
    expected: "inválido",
    description: "Termina con guión",
  },
  {
    nickname: "-soyyo",
    expected: "inválido",
    description: "Empieza con guión",
  },
  {
    nickname: "soy_yo_",
    expected: "inválido",
    description: "Termina con guión bajo",
  },
  {
    nickname: "_soyyo",
    expected: "inválido",
    description: "Empieza con guión bajo",
  },
  { nickname: "123456", expected: "inválido", description: "Solo números" },
  { nickname: "admin", expected: "inválido", description: "Palabra prohibida" },
  { nickname: "puto", expected: "inválido", description: "Palabra prohibida" },
  {
    nickname: "test123",
    expected: "inválido",
    description: "Empieza con 'test'",
  },
  {
    nickname: "soyyo1234",
    expected: "inválido",
    description: "4 números consecutivos",
  },
  {
    nickname: "soyyo!!!",
    expected: "inválido",
    description: "Caracteres especiales",
  },
  {
    nickname: "soyyo@",
    expected: "inválido",
    description: "Caracteres especiales",
  },
];

let passedTests = 0;
let totalTests = testCases.length;

console.log("📋 Ejecutando casos de prueba:\n");

testCases.forEach((testCase, index) => {
  console.log(
    `🔍 Prueba ${index + 1}: "${testCase.nickname}" (${testCase.description})`
  );

  try {
    const result = validateNickname(testCase.nickname);

    if (testCase.expected === "válido") {
      if (result.valid) {
        console.log(`   ✅ PASÓ - Nickname válido`);
        if (result.nickname) {
          console.log(`   📝 Nickname procesado: "${result.nickname}"`);
        }
        if (result.useTelegramName) {
          console.log(`   📱 Usará nombre de Telegram`);
        }
        passedTests++;
      } else {
        console.log(`   ❌ FALLÓ - Esperaba válido pero fue inválido`);
        console.log(`   🚫 Error: ${result.error}`);
      }
    } else {
      if (!result.valid) {
        console.log(`   ✅ PASÓ - Nickname inválido como se esperaba`);
        console.log(`   🚫 Error: ${result.error}`);

        // Generar sugerencias para nicknames inválidos
        const suggestions = generateNicknameSuggestions(testCase.nickname);
        console.log(`   💡 Sugerencias: ${suggestions.join(", ")}`);

        passedTests++;
      } else {
        console.log(`   ❌ FALLÓ - Esperaba inválido pero fue válido`);
        console.log(`   📝 Nickname procesado: "${result.nickname}"`);
      }
    }
  } catch (error) {
    console.log(`   💥 ERROR - Excepción inesperada: ${error.message}`);
  }

  console.log(""); // Línea en blanco para separar pruebas
});

// Resumen de resultados
console.log("📊 Resumen de resultados:");
console.log(`   ✅ Pruebas pasadas: ${passedTests}/${totalTests}`);
console.log(
  `   ❌ Pruebas fallidas: ${totalTests - passedTests}/${totalTests}`
);
console.log(
  `   📈 Porcentaje de éxito: ${Math.round((passedTests / totalTests) * 100)}%`
);

if (passedTests === totalTests) {
  console.log(
    "\n🎉 ¡Todas las pruebas pasaron! La validación funciona correctamente."
  );
} else {
  console.log("\n⚠️  Algunas pruebas fallaron. Revisa los resultados arriba.");
}

// Pruebas adicionales de sugerencias
console.log("\n🧪 Pruebas adicionales de sugerencias:");
const testSuggestions = ["soyyo", "gamer", "player", "test", "admin"];
testSuggestions.forEach((nickname) => {
  const suggestions = generateNicknameSuggestions(nickname);
  console.log(`   "${nickname}" → ${suggestions.join(", ")}`);
});

console.log("\n✨ Prueba de validación completada.");
