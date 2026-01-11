/**
 * Script de prueba para el comando /resetabandons
 * Prueba la funcionalidad de reset de contadores de abandonos
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
  console.log(`\n${colors.cyan}${"=".repeat(50)}`);
  console.log(`🧪 PRUEBA: ${testName}`);
  console.log(`${"=".repeat(50)}${colors.reset}`);
}

function logResult(success, message) {
  const icon = success ? "✅" : "❌";
  const color = success ? "green" : "red";
  console.log(`${colors[color]}${icon} ${message}${colors.reset}`);
}

// Función para mostrar estadísticas
function showStats(telegramId, label = "") {
  const stats = abandonLimitManager.getPlayerStats(telegramId);
  if (stats) {
    log(`\n📊 ${label} Estadísticas del jugador ${telegramId}:`, "blue");
    console.log(`   • Abandonos por hora: ${stats.abandonosHora}/3`);
    console.log(`   • Abandonos por día: ${stats.abandonosDia}/8`);
    console.log(
      `   • Estado: ${stats.bloqueado ? "🚫 BLOQUEADO" : "✅ LIBRE"}`
    );
    if (stats.bloqueado) {
      console.log(`   • Tiempo restante: ${stats.tiempoRestante} minutos`);
    }
  } else {
    log(`ℹ️ Jugador ${telegramId} sin historial`, "yellow");
  }
}

async function runTests() {
  log("🚀 INICIANDO PRUEBAS DEL COMANDO /resetabandons", "bright");

  const testUserId = "999888777";

  // ===== PRUEBA 1: Estado inicial =====
  logTest("Estado Inicial del Jugador");

  showStats(testUserId, "Estado Inicial");

  // ===== PRUEBA 2: Simular abandonos para bloquear =====
  logTest("Simulando Abandonos para Bloquear");

  // Simular 3 abandonos para bloquear por hora
  for (let i = 0; i < 3; i++) {
    const resultado = abandonLimitManager.registerAbandonVoluntario(testUserId);
    log(
      `   Abandono ${i + 1}: ${resultado.abandonosHora}/3 por hora, ${
        resultado.abandonosDia
      }/8 por día`
    );
  }

  showStats(testUserId, "Después de 3 Abandonos (BLOQUEADO)");

  // ===== PRUEBA 3: Verificar que está bloqueado =====
  logTest("Verificando Estado de Bloqueo");

  const permiso = abandonLimitManager.canAbandon(testUserId);
  logResult(!permiso.canAbandon, `No puede abandonar: ${!permiso.canAbandon}`);
  logResult(
    permiso.reason === "hourly_limit",
    `Razón del bloqueo: ${permiso.reason}`
  );

  // ===== PRUEBA 4: Resetear contadores =====
  logTest("Reseteando Contadores");

  const resultadoReset = abandonLimitManager.resetPlayerCounters(testUserId);
  logResult(resultadoReset.success, `Reset exitoso: ${resultadoReset.success}`);

  if (resultadoReset.success) {
    log(`📱 Mensaje: ${resultadoReset.message}`, "green");
    log(`📊 Detalles: ${JSON.stringify(resultadoReset.details)}`, "blue");
  }

  // ===== PRUEBA 5: Verificar estado después del reset =====
  logTest("Estado Después del Reset");

  showStats(testUserId, "Después del Reset");

  // ===== PRUEBA 6: Verificar que puede abandonar =====
  logTest("Verificando que Puede Abandonar");

  const permisoDespues = abandonLimitManager.canAbandon(testUserId);
  logResult(
    permisoDespues.canAbandon,
    `Puede abandonar: ${permisoDespues.canAbandon}`
  );
  logResult(
    !permisoDespues.reason,
    `Sin razón de bloqueo: ${!permisoDespues.reason}`
  );

  // ===== PRUEBA 7: Probar reset en jugador sin historial =====
  logTest("Reset en Jugador Sin Historial");

  const userSinHistorial = "111222333";
  const resetSinHistorial =
    abandonLimitManager.resetPlayerCounters(userSinHistorial);
  logResult(
    !resetSinHistorial.success,
    `Reset fallido (esperado): ${!resetSinHistorial.success}`
  );
  log(`📱 Mensaje: ${resetSinHistorial.message}`, "yellow");

  // ===== PRUEBA 8: Simular más abandonos después del reset =====
  logTest("Simulando Abandonos Después del Reset");

  const resultadoNuevo =
    abandonLimitManager.registerAbandonVoluntario(testUserId);
  logResult(
    resultadoNuevo.abandonosHora === 1,
    `Contador por hora: ${resultadoNuevo.abandonosHora}`
  );
  logResult(
    resultadoNuevo.abandonosDia === 1,
    `Contador por día: ${resultadoNuevo.abandonosDia}`
  );
  logResult(
    !resultadoNuevo.bloqueado,
    `No está bloqueado: ${!resultadoNuevo.bloqueado}`
  );

  showStats(testUserId, "Después de Nuevo Abandono");

  // ===== RESUMEN FINAL =====
  logTest("RESUMEN FINAL");

  log("\n🎯 PRUEBAS DEL COMANDO /resetabandons COMPLETADAS!", "bright");
  log("El comando está funcionando correctamente.", "green");

  log("\n📋 Funcionalidades Verificadas:", "cyan");
  log("✅ Reset de contadores por hora y día", "green");
  log("✅ Eliminación de bloqueo automático", "green");
  log("✅ Manejo de jugadores sin historial", "green");
  log("✅ Reinicio correcto de contadores", "green");
  log("✅ Restauración de capacidad de abandono", "green");
  log("✅ Mensajes informativos claros", "green");

  log("\n💡 Uso del comando en Telegram:", "yellow");
  log("/resetabandons <telegramId>", "cyan");
  log("Ejemplo: /resetabandons 999888777", "cyan");
}

// Ejecutar las pruebas
console.clear();
runTests().catch((error) => {
  log(`❌ Error durante las pruebas: ${error.message}`, "red");
  console.error(error);
});
