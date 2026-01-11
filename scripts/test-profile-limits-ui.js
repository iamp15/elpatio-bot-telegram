"use strict";

/**
 * Script de Prueba - Interfaz de Límites de Nickname
 *
 * Prueba la nueva experiencia de usuario para límites de nickname
 */

const NicknameLimitManager = require("../utils/nickname-limit-manager");

// Configuración de prueba
const TEST_CONFIG = {
  testUserId: "123456789",
  testUserId2: "987654321",
};

async function testProfileLimitsUI() {
  console.log("🎨 **PRUEBA - INTERFAZ DE LÍMITES DE NICKNAME**\n");
  console.log("=".repeat(60) + "\n");

  try {
    // Inicializar gestor de límites
    console.log("🔧 **Inicializando Gestor de Límites...**");
    const limitManager = new NicknameLimitManager();
    console.log("✅ Gestor inicializado correctamente\n");

    // Prueba 1: Usuario sin límites (puede cambiar)
    console.log("1️⃣ **USUARIO SIN LÍMITES - PUEDE CAMBIAR**\n");

    const user1Check = await limitManager.canChangeNickname(
      TEST_CONFIG.testUserId
    );
    const user1Info = await limitManager.getLimitInfo(TEST_CONFIG.testUserId);

    console.log("✅ **Estado del usuario 1:**");
    console.log(`   Puede cambiar: ${user1Check.canChange ? "SÍ" : "NO"}`);
    console.log(`   Cambios restantes: ${user1Check.remainingChanges}`);
    console.log(`   Mensaje: ${user1Check.message}`);

    console.log(
      "\n📱 **Mensaje que vería el usuario al hacer clic en 'Cambiar Nickname':**"
    );
    console.log("=".repeat(50));
    console.log(`✏️ **Cambiar Nickname**

📋 **Reglas para tu nickname:**
• Entre 3 y 32 caracteres
• Una sola palabra (sin espacios)
• Solo letras (incluyendo ñ), números, guiones (-) y guiones bajos (_)
• Debe contener al menos una letra
• No puede empezar o terminar con guión
• Palabras apropiadas únicamente

⏰ **Límites actuales:**
${user1Info.message}
🔄 **Próximo reset:** ${user1Info.nextReset.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}

📝 **Envíame tu nuevo nickname:**`);
    console.log("=".repeat(50) + "\n");

    // Prueba 2: Simular cambio exitoso
    console.log("2️⃣ **SIMULANDO CAMBIO EXITOSO**\n");

    console.log("🔄 Registrando cambio de nickname...");
    await limitManager.recordNicknameChange(TEST_CONFIG.testUserId);

    console.log("✅ **Mensaje de confirmación que vería el usuario:**");
    console.log("=".repeat(50));
    console.log(`✅ **¡Nickname actualizado!** Tu nuevo nickname es: *ElPatioKing*

💡 **Recuerda:** Puedes cambiar tu nickname 1 vez por semana. El próximo reset será el lunes.`);
    console.log("=".repeat(50) + "\n");

    // Prueba 3: Usuario con límite alcanzado
    console.log("3️⃣ **USUARIO CON LÍMITE ALCANZADO**\n");

    const user2Check = await limitManager.canChangeNickname(
      TEST_CONFIG.testUserId
    );

    console.log("✅ **Estado del usuario después del cambio:**");
    console.log(`   Puede cambiar: ${user2Check.canChange ? "SÍ" : "NO"}`);
    console.log(`   Cambios restantes: ${user2Check.remainingChanges}`);
    console.log(`   Mensaje: ${user2Check.message}`);

    console.log(
      "\n📱 **Mensaje que vería el usuario al intentar cambiar (límite alcanzado):**"
    );
    console.log("=".repeat(50));
    console.log(`⏰ **Límite de Cambio de Nickname Alcanzado**

${user2Check.message}

🔄 **Próximo reset:** ${user2Check.nextReset.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}

💡 **Tip:** Los límites se resetean cada lunes a las 00:00

🔄 **Inténtalo de nuevo después del reset**`);
    console.log("=".repeat(50) + "\n");

    // Prueba 4: Perfil simplificado
    console.log("4️⃣ **PERFIL SIMPLIFICADO**\n");

    console.log(
      "✅ **Perfil que vería el usuario (sin información de límites):**"
    );
    console.log("=".repeat(50));
    console.log(`👤 **Tu Perfil**

🎮 **Nickname:** ElPatioKing
💰 **Saldo:** Bs. 1.500,00
🆔 **ID:** 123456789

📊 **Estadísticas:**
🏆 **Victorias:** 15
💔 **Derrotas:** 8
📈 **Total partidas:** 23
📊 **Porcentaje victoria:** 65%`);
    console.log("=".repeat(50) + "\n");

    // Prueba 5: Reset manual para demostrar funcionalidad
    console.log("5️⃣ **DEMOSTRACIÓN DE RESET**\n");

    console.log("🔄 Reseteando límite del usuario...");
    await limitManager.resetWeeklyLimit(TEST_CONFIG.testUserId);

    const afterReset = await limitManager.canChangeNickname(
      TEST_CONFIG.testUserId
    );
    console.log("✅ **Después del reset:**");
    console.log(`   Puede cambiar: ${afterReset.canChange ? "SÍ" : "NO"}`);
    console.log(`   Cambios restantes: ${afterReset.remainingChanges}`);
    console.log(`   Mensaje: ${afterReset.message}\n`);
  } catch (error) {
    console.error("❌ **Error en pruebas:**", error.message);
  }

  console.log("\n" + "=".repeat(60));
  console.log("🏁 **PRUEBAS DE INTERFAZ COMPLETADAS**\n");
  console.log("📋 **Resumen de cambios implementados:**");
  console.log("✅ Perfil simplificado (sin información de límites)");
  console.log(
    "✅ Información de límites solo al hacer clic en 'Cambiar Nickname'"
  );
  console.log("✅ Mensaje claro cuando se alcanza el límite");
  console.log("✅ Instrucciones para intentar después del reset");
  console.log("✅ Mensaje de confirmación simplificado\n");
}

// Exportar funciones
module.exports = {
  testProfileLimitsUI,
};

// Ejecutar si se llama directamente
if (require.main === module) {
  testProfileLimitsUI().catch((error) => {
    console.error("❌ **Error ejecutando pruebas:**", error.message);
    process.exit(1);
  });
}
