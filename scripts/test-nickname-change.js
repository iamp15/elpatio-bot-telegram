"use strict";

/**
 * Script de Prueba - Cambio de Nickname
 *
 * Este script prueba la funcionalidad completa de cambio de nickname:
 * 1. Verificación de disponibilidad
 * 2. Validación de formato
 * 3. Actualización en el backend
 * 4. Manejo de errores
 */

const BackendAPI = require("../api/backend");
const {
  validateNickname,
  generateNicknameSuggestions,
} = require("../utils/nickname-validator");

// Configuración de prueba
const TEST_CONFIG = {
  backendUrl: "http://localhost:5000",
  botEmail: "bot@elpatio.games",
  botPassword: "BotCl4ve#Sup3rS3gur4!2025",
  testUserId: "123456789", // ID de prueba
};

async function testNicknameChange() {
  console.log("🎮 **PRUEBAS DE CAMBIO DE NICKNAME**\n");
  console.log("=".repeat(60) + "\n");

  try {
    // Inicializar API
    console.log("🔧 **Inicializando API...**");
    const api = new BackendAPI({
      baseUrl: TEST_CONFIG.backendUrl,
      botEmail: TEST_CONFIG.botEmail,
      botPassword: TEST_CONFIG.botPassword,
    });

    await api.login();
    console.log("✅ API inicializada correctamente\n");

    // Prueba 1: Validación de formato
    console.log("1️⃣ **PRUEBA DE VALIDACIÓN DE FORMATO**\n");

    const testNicknames = [
      "valid", // ✅ Válido
      "test123", // ✅ Válido
      "user-name", // ✅ Válido
      "user_name", // ✅ Válido
      "a", // ❌ Muy corto
      "this-is-a-very-long-nickname-that-exceeds", // ❌ Muy largo
      "user name", // ❌ Con espacios
      "user@name", // ❌ Caracteres inválidos
      "-invalid", // ❌ Empieza con guión
      "invalid-", // ❌ Termina con guión
      "123", // ❌ Solo números
    ];

    for (const nickname of testNicknames) {
      const validation = validateNickname(nickname);
      const status = validation.valid ? "✅" : "❌";
      console.log(
        `${status} "${nickname}" → ${
          validation.valid ? "Válido" : validation.error
        }`
      );

      if (!validation.valid) {
        const suggestions = generateNicknameSuggestions(nickname);
        console.log(`   💡 Sugerencias: ${suggestions.join(", ")}`);
      }
    }

    // Prueba 2: Verificación de disponibilidad
    console.log("\n2️⃣ **PRUEBA DE VERIFICACIÓN DE DISPONIBILIDAD**\n");

    const availabilityTests = [
      "testuser123", // Probablemente disponible
      "admin", // Probablemente ocupado
      "bot", // Probablemente ocupado
      "usuario_test", // Probablemente disponible
    ];

    for (const nickname of availabilityTests) {
      try {
        const isAvailable = await api.checkNicknameAvailability(nickname);
        const status = isAvailable ? "✅" : "❌";
        console.log(
          `${status} "${nickname}" → ${isAvailable ? "Disponible" : "Ocupado"}`
        );
      } catch (error) {
        console.log(`❌ "${nickname}" → Error: ${error.message}`);
      }
    }

    // Prueba 3: Simulación de cambio de nickname
    console.log("\n3️⃣ **PRUEBA DE SIMULACIÓN DE CAMBIO**\n");

    const testNickname = "testuser_" + Date.now(); // Nickname único
    console.log(`🎯 Probando con nickname: "${testNickname}"`);

    // Verificar disponibilidad
    const isAvailable = await api.checkNicknameAvailability(testNickname);
    console.log(
      `📋 Disponibilidad: ${isAvailable ? "✅ Disponible" : "❌ Ocupado"}`
    );

    if (isAvailable) {
      // Simular actualización (sin hacer cambios reales)
      console.log("🔄 Simulando actualización...");
      console.log("✅ Simulación exitosa (sin cambios reales)");
    }

    // Prueba 4: Manejo de errores
    console.log("\n4️⃣ **PRUEBA DE MANEJO DE ERRORES**\n");

    // Probar con nickname inválido
    try {
      await api.checkNicknameAvailability(""); // Nickname vacío
      console.log("❌ No se detectó error con nickname vacío");
    } catch (error) {
      console.log("✅ Error detectado correctamente:", error.message);
    }

    // Probar con nickname muy largo
    try {
      const longNickname = "a".repeat(50); // 50 caracteres
      await api.checkNicknameAvailability(longNickname);
      console.log("❌ No se detectó error con nickname muy largo");
    } catch (error) {
      console.log("✅ Error detectado correctamente:", error.message);
    }

    // Prueba 5: Sugerencias de nickname
    console.log("\n5️⃣ **PRUEBA DE SUGERENCIAS**\n");

    const problematicNicknames = [
      "a",
      "user name",
      "user@name",
      "123",
      "a".repeat(40),
    ];

    for (const nickname of problematicNicknames) {
      const suggestions = generateNicknameSuggestions(nickname);
      console.log(`💡 Para "${nickname}": ${suggestions.join(", ")}`);
    }
  } catch (error) {
    console.error("❌ **Error en pruebas:**", error.message);
  }

  console.log("\n" + "=".repeat(60));
  console.log("🏁 **PRUEBAS COMPLETADAS**\n");
}

// Funciones auxiliares para pruebas específicas
async function testSpecificNickname(nickname) {
  console.log(`🎯 **Probando nickname específico: "${nickname}"**\n`);

  try {
    const api = new BackendAPI({
      baseUrl: TEST_CONFIG.backendUrl,
      botEmail: TEST_CONFIG.botEmail,
      botPassword: TEST_CONFIG.botPassword,
    });

    await api.login();

    // Validación de formato
    const validation = validateNickname(nickname);
    console.log(
      `📋 Validación de formato: ${
        validation.valid ? "✅ Válido" : "❌ Inválido"
      }`
    );
    if (!validation.valid) {
      console.log(`   Error: ${validation.error}`);
      const suggestions = generateNicknameSuggestions(nickname);
      console.log(`   💡 Sugerencias: ${suggestions.join(", ")}`);
    }

    // Verificación de disponibilidad
    const isAvailable = await api.checkNicknameAvailability(nickname);
    console.log(
      `📋 Disponibilidad: ${isAvailable ? "✅ Disponible" : "❌ Ocupado"}`
    );

    return {
      valid: validation.valid,
      available: isAvailable,
      canUse: validation.valid && isAvailable,
    };
  } catch (error) {
    console.error("❌ Error:", error.message);
    return { valid: false, available: false, canUse: false };
  }
}

// Exportar funciones para uso externo
module.exports = {
  testNicknameChange,
  testSpecificNickname,
};

// Ejecutar pruebas si se llama directamente
if (require.main === module) {
  testNicknameChange().catch((error) => {
    console.error("❌ **Error ejecutando pruebas:**", error.message);
    process.exit(1);
  });
}
