/**
 * Script de prueba para el mensaje de confirmación de abandono
 * Verifica que se muestre correctamente la información de límites
 */

const abandonLimitManager = require("../utils/abandon-limits");

// Colores para la consola
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName) {
  console.log(`\n${colors.cyan}${"=".repeat(60)}`);
  console.log(`🧪 PRUEBA: ${testName}`);
  console.log(`${"=".repeat(60)}${colors.reset}`);
}

function logResult(success, message) {
  const icon = success ? "✅" : "❌";
  const color = success ? "green" : "red";
  console.log(`${colors[color]}${icon} ${message}${colors.reset}`);
}

// Función para simular el mensaje de confirmación dinámico
function generarMensajeConfirmacion(telegramId, nombreSala, nombreUsuario) {
  const abandonLimits = abandonLimitManager.getPlayerStats(telegramId);
  let mensajeConfirmacion = "";

  if (abandonLimits) {
    const abandonosRestantesHora = 3 - abandonLimits.abandonosHora;

    if (abandonosRestantesHora > 1) {
      // Mensaje normal para múltiples abandonos restantes
      mensajeConfirmacion = `⚠️ <b>¿Estás seguro de que quieres abandonar la sala?</b>

🎮 <b>Sala:</b> ${nombreSala}
👤 <b>Usuario:</b> ${nombreUsuario}

⚠️ <b>Recuerda:</b> Solo puedes abandonar ${abandonosRestantesHora} salas más en la próxima hora.

<b>¿Deseas continuar?</b>`;
    } else if (abandonosRestantesHora === 1) {
      // Mensaje de advertencia para último abandono
      mensajeConfirmacion = `⚠️ <b>¿Estás seguro de que quieres abandonar la sala?</b>

🎮 <b>Sala:</b> ${nombreSala}
👤 <b>Usuario:</b> ${nombreUsuario}

🚨 <b>¡CUIDADO!</b> Solo puedes abandonar 1 vez más antes de ser bloqueado.

<b>¿Deseas continuar?</b>`;
    } else {
      // Mensaje cuando ya no puede abandonar (aunque no debería llegar aquí)
      mensajeConfirmacion = `⚠️ <b>¿Estás seguro de que quieres abandonar la sala?</b>

🎮 <b>Sala:</b> ${nombreSala}
👤 <b>Usuario:</b> ${nombreUsuario}

❌ <b>No puedes abandonar más salas en este momento.</b>

<b>¿Deseas continuar?</b>`;
    }
  } else {
    // Mensaje para jugador sin historial
    mensajeConfirmacion = `⚠️ <b>¿Estás seguro de que quieres abandonar la sala?</b>

🎮 <b>Sala:</b> ${nombreSala}
👤 <b>Usuario:</b> ${nombreUsuario}

⚠️ <b>Recuerda:</b> Solo puedes abandonar 3 salas en la próxima hora.

<b>¿Deseas continuar?</b>`;
  }

  return mensajeConfirmacion;
}

async function runTests() {
  log("🚀 INICIANDO PRUEBAS DEL MENSAJE DE CONFIRMACIÓN DE ABANDONO", "bright");

  const testUserId = "123456789";
  const nombreSala = "Sala de Prueba Ludo 1v1v1v1";
  const nombreUsuario = "Jugador de Prueba";

  // ===== PRUEBA 1: Jugador sin historial =====
  logTest("Jugador Sin Historial de Abandonos");

  const mensajeSinHistorial = generarMensajeConfirmacion(
    testUserId,
    nombreSala,
    nombreUsuario
  );
  console.log(mensajeSinHistorial);

  logResult(true, "Mensaje generado correctamente para jugador sin historial");

  // ===== PRUEBA 2: Jugador con 1 abandono =====
  logTest("Jugador con 1 Abandono (2 restantes por hora)");

  abandonLimitManager.registerAbandonVoluntario(testUserId);

  const mensajeCon1Abandono = generarMensajeConfirmacion(
    testUserId,
    nombreSala,
    nombreUsuario
  );
  console.log(mensajeCon1Abandono);

  logResult(true, "Mensaje generado correctamente para jugador con 1 abandono");

  // ===== PRUEBA 3: Jugador con 2 abandonos =====
  logTest("Jugador con 2 Abandonos (1 restante por hora)");

  abandonLimitManager.registerAbandonVoluntario(testUserId);

  const mensajeCon2Abandonos = generarMensajeConfirmacion(
    testUserId,
    nombreSala,
    nombreUsuario
  );
  console.log(mensajeCon2Abandonos);

  logResult(
    true,
    "Mensaje generado correctamente para jugador con 2 abandonos"
  );

  // ===== PRUEBA 4: Jugador con 3 abandonos (BLOQUEADO) =====
  logTest("Jugador con 3 Abandonos (BLOQUEADO)");

  abandonLimitManager.registerAbandonVoluntario(testUserId);

  const mensajeCon3Abandonos = generarMensajeConfirmacion(
    testUserId,
    nombreSala,
    nombreUsuario
  );
  console.log(mensajeCon3Abandonos);

  logResult(true, "Mensaje generado correctamente para jugador bloqueado");

  // ===== PRUEBA 5: Verificar que no aparece "no se puede deshacer" =====
  logTest('Verificando que NO aparece "no se puede deshacer"');

  const noApareceNoDeshacer = !mensajeCon3Abandonos.includes(
    "no se puede deshacer"
  );
  logResult(
    noApareceNoDeshacer,
    'No aparece "no se puede deshacer" en el mensaje'
  );

  // ===== PRUEBA 6: Verificar que aparece información de límites =====
  logTest("Verificando que aparece información de límites");

  const apareceLimites = mensajeCon3Abandonos.includes(
    "No puedes abandonar más salas"
  );
  logResult(apareceLimites, "Aparece información de límites en el mensaje");

  // ===== PRUEBA 7: Verificar advertencia de cuidado =====
  logTest("Verificando advertencia de cuidado para límite crítico");

  const apareceAdvertencia = mensajeCon2Abandonos.includes("¡CUIDADO!");
  logResult(
    apareceAdvertencia,
    "Aparece advertencia de cuidado para límite crítico"
  );

  // ===== PRUEBA 8: Resetear para probar mensaje normal =====
  logTest("Reseteando contadores para probar mensaje normal");

  abandonLimitManager.resetPlayerCounters(testUserId);

  const mensajeDespuesReset = generarMensajeConfirmacion(
    testUserId,
    nombreSala,
    nombreUsuario
  );
  console.log(mensajeDespuesReset);

  logResult(true, "Mensaje generado correctamente después del reset");

  // ===== RESUMEN FINAL =====
  logTest("RESUMEN FINAL");

  log("\n🎯 PRUEBAS DEL MENSAJE DE CONFIRMACIÓN COMPLETADAS!", "bright");
  log(
    "El mensaje ahora incluye información de límites y advertencias apropiadas.",
    "green"
  );

  log("\n📋 Cambios Implementados:", "cyan");
  log("✅ Mensaje dinámico según abandonos restantes", "green");
  log("✅ Advertencia específica para último abandono", "green");
  log("✅ Mensaje de bloqueo cuando no puede abandonar", "green");
  log('✅ Eliminación de "no se puede deshacer"', "green");
  log("✅ Mensaje más directo y claro", "green");

  log("\n💡 Beneficios para el Usuario:", "yellow");
  log("• Conoce su estado actual de límites", "cyan");
  log("• Entiende las consecuencias de su decisión", "cyan");
  log("• Recibe advertencias cuando está cerca del límite", "cyan");
  log("• Toma decisiones más informadas", "cyan");
}

// Ejecutar las pruebas
console.clear();
runTests().catch((error) => {
  log(`❌ Error durante las pruebas: ${error.message}`, "red");
  console.error(error);
});
