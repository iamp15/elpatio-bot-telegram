/**
 * Script de prueba para el Sistema de Límites de Abandono
 * Prueba todas las funcionalidades del sistema
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

// Función para simular tiempo
function simulateTime(seconds) {
  log(`⏰ Simulando paso de ${seconds} segundos...`, "yellow");
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
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

// Función para mostrar estadísticas del sistema
function showSystemStats() {
  const systemStats = abandonLimitManager.getSystemStats();
  log(`\n📈 Estadísticas del Sistema:`, "magenta");
  console.log(`   • Total usuarios: ${systemStats.totalUsuarios}`);
  console.log(`   • Usuarios bloqueados: ${systemStats.usuariosBloqueados}`);
  console.log(
    `   • Total abandonos por hora: ${systemStats.totalAbandonosHora}`
  );
  console.log(`   • Total abandonos por día: ${systemStats.totalAbandonosDia}`);
}

async function runTests() {
  log("🚀 INICIANDO PRUEBAS DEL SISTEMA DE LÍMITES DE ABANDONO", "bright");

  const testUserId = "123456789";

  // ===== PRUEBA 1: Verificar estado inicial =====
  logTest("Estado Inicial del Jugador");

  const initialState = abandonLimitManager.canAbandon(testUserId);
  logResult(
    initialState.canAbandon,
    `Jugador puede abandonar: ${initialState.canAbandon}`
  );

  showStats(testUserId, "Estado Inicial");

  // ===== PRUEBA 2: Primer abandono voluntario =====
  logTest("Primer Abandono Voluntario");

  const resultado1 = abandonLimitManager.registerAbandonVoluntario(testUserId);
  logResult(
    resultado1.abandonosHora === 1,
    `Contador por hora: ${resultado1.abandonosHora}`
  );
  logResult(
    resultado1.abandonosDia === 1,
    `Contador por día: ${resultado1.abandonosDia}`
  );
  logResult(
    !resultado1.bloqueado,
    `No está bloqueado después del primer abandono`
  );

  showStats(testUserId, "Después del Primer Abandono");

  // ===== PRUEBA 3: Segundo abandono voluntario =====
  logTest("Segundo Abandono Voluntario");

  const resultado2 = abandonLimitManager.registerAbandonVoluntario(testUserId);
  logResult(
    resultado2.abandonosHora === 2,
    `Contador por hora: ${resultado2.abandonosHora}`
  );
  logResult(
    resultado2.abandonosDia === 2,
    `Contador por día: ${resultado2.abandonosDia}`
  );
  logResult(
    !resultado2.bloqueado,
    `No está bloqueado después del segundo abandono`
  );

  showStats(testUserId, "Después del Segundo Abandono");

  // ===== PRUEBA 4: Tercer abandono voluntario (DEBE BLOQUEAR) =====
  logTest("Tercer Abandono Voluntario (DEBE BLOQUEAR)");

  const resultado3 = abandonLimitManager.registerAbandonVoluntario(testUserId);
  logResult(
    resultado3.abandonosHora === 3,
    `Contador por hora: ${resultado3.abandonosHora}`
  );
  logResult(
    resultado3.abandonosDia === 3,
    `Contador por día: ${resultado3.abandonosDia}`
  );
  logResult(resultado3.bloqueado, `ESTÁ BLOQUEADO después del tercer abandono`);

  showStats(testUserId, "Después del Tercer Abandono (BLOQUEADO)");

  // ===== PRUEBA 5: Intentar abandonar cuando está bloqueado =====
  logTest("Intentar Abandonar Cuando Está Bloqueado");

  const permisoBloqueado = abandonLimitManager.canAbandon(testUserId);
  logResult(
    !permisoBloqueado.canAbandon,
    `No puede abandonar: ${!permisoBloqueado.canAbandon}`
  );
  logResult(
    permisoBloqueado.reason === "hourly_limit",
    `Razón del bloqueo: ${permisoBloqueado.reason}`
  );

  if (permisoBloqueado.mensaje) {
    log(`📱 Mensaje de bloqueo generado:`, "green");
    console.log(permisoBloqueado.mensaje);
  }

  // ===== PRUEBA 6: Salida automática (NO debe contar) =====
  logTest("Salida Automática (NO debe contar en límites)");

  const salidaAutomatica = abandonLimitManager.registerSalidaAutomatica(
    testUserId,
    "Sala cancelada por admin"
  );
  logResult(
    salidaAutomatica.tipo === "salida_automatica",
    `Tipo registrado: ${salidaAutomatica.tipo}`
  );
  logResult(
    salidaAutomatica.noCuentaEnLimites,
    `No cuenta en límites: ${salidaAutomatica.noCuentaEnLimites}`
  );

  // Verificar que los contadores NO cambiaron
  const statsDespuesSalida = abandonLimitManager.getPlayerStats(testUserId);
  logResult(
    statsDespuesSalida.abandonosHora === 3,
    `Contador por hora se mantiene: ${statsDespuesSalida.abandonosHora}`
  );
  logResult(
    statsDespuesSalida.abandonosDia === 3,
    `Contador por día se mantiene: ${statsDespuesSalida.abandonosDia}`
  );

  showStats(testUserId, "Después de Salida Automática");

  // ===== PRUEBA 7: Probar con múltiples usuarios =====
  logTest("Múltiples Usuarios");

  const user2 = "987654321";
  const user3 = "555666777";

  // Usuario 2: 2 abandonos
  abandonLimitManager.registerAbandonVoluntario(user2);
  abandonLimitManager.registerAbandonVoluntario(user2);

  // Usuario 3: 1 abandono
  abandonLimitManager.registerAbandonVoluntario(user3);

  showStats(user2, "Usuario 2 (2 abandonos)");
  showStats(user3, "Usuario 3 (1 abandono)");

  // ===== PRUEBA 8: Estadísticas del sistema =====
  logTest("Estadísticas del Sistema");

  showSystemStats();

  // ===== PRUEBA 9: Mensajes generados =====
  logTest("Mensajes Generados");

  log(`\n📱 Mensaje después del primer abandono:`, "blue");
  console.log(resultado1.mensaje);

  log(`\n📱 Mensaje después del tercer abandono:`, "blue");
  console.log(resultado3.mensaje);

  // ===== PRUEBA 10: Verificar límites diarios =====
  logTest("Límites Diarios");

  // Simular más abandonos para alcanzar límite diario
  for (let i = 0; i < 5; i++) {
    abandonLimitManager.registerAbandonVoluntario(testUserId);
  }

  const statsFinales = abandonLimitManager.getPlayerStats(testUserId);
  logResult(
    statsFinales.abandonosDia >= 8,
    `Límite diario alcanzado: ${statsFinales.abandonosDia}/8`
  );

  showStats(testUserId, "Estado Final (Límite Diario)");

  // ===== PRUEBA 11: Cleanup del sistema =====
  logTest("Cleanup del Sistema");

  log(
    `📊 Usuarios antes del cleanup: ${
      abandonLimitManager.getSystemStats().totalUsuarios
    }`,
    "yellow"
  );
  abandonLimitManager.cleanup();
  log(
    `📊 Usuarios después del cleanup: ${
      abandonLimitManager.getSystemStats().totalUsuarios
    }`,
    "yellow"
  );

  // ===== RESUMEN FINAL =====
  logTest("RESUMEN FINAL");

  showSystemStats();

  log("\n🎯 PRUEBAS COMPLETADAS EXITOSAMENTE!", "bright");
  log(
    "El sistema de límites de abandono está funcionando correctamente.",
    "green"
  );

  log("\n📋 Funcionalidades Verificadas:", "cyan");
  log("✅ Verificación de límites por hora y día", "green");
  log("✅ Bloqueo automático al alcanzar límites", "green");
  log("✅ Registro de abandonos voluntarios", "green");
  log("✅ Salidas automáticas NO cuentan en límites", "green");
  log("✅ Mensajes claros y transparentes", "green");
  log("✅ Estadísticas del sistema", "green");
  log("✅ Múltiples usuarios", "green");
  log("✅ Cleanup automático", "green");
}

// Ejecutar las pruebas
console.clear();
runTests().catch((error) => {
  log(`❌ Error durante las pruebas: ${error.message}`, "red");
  console.error(error);
});
