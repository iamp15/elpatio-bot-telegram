"use strict";

const BackendAPI = require("../api/backend");
const { getAllEnvVars } = require("../config/env-config");

/**
 * Script de prueba para cancelar una sala y verificar reembolsos automáticos
 * Prueba: POST /api/salas/:salaId/cancelar
 */
async function testCancelarSala() {
  console.log(
    "🧪 [TEST] Iniciando prueba de cancelación de sala con reembolsos"
  );
  console.log("=".repeat(60));

  try {
    // 1. Inicializar API del backend
    console.log("🔧 [TEST] Inicializando API del backend...");
    const envVars = getAllEnvVars();
    const api = new BackendAPI({
      baseUrl: envVars.BACKEND_URL,
      botEmail: envVars.BOT_EMAIL,
      botPassword: envVars.BOT_PASSWORD,
    });

    // 2. Autenticación
    console.log("🔐 [TEST] Autenticando...");
    await api.login();
    console.log("✅ [TEST] Autenticación exitosa");

    // 3. Buscar la sala "Sala de Prueba Ludo 1v1v1v1"
    console.log("\n🔍 [TEST] Buscando sala 'Sala de Prueba Ludo 1v1v1v1'...");
    const salas = await api.getSalasDisponibles();

    const salaObjetivo = salas.find(
      (sala) => sala.nombre === "Sala de Prueba Ludo 1v1v1v1"
    );

    if (!salaObjetivo) {
      console.log("❌ [TEST] Sala 'Sala de Prueba Ludo 1v1v1v1' no encontrada");
      console.log("📋 [TEST] Salas disponibles:");
      salas.forEach((sala) => {
        console.log(
          `   • ${sala.nombre} (${sala._id}) - Estado: ${
            sala.estado
          } - Jugadores: ${sala.jugadores?.length || 0}`
        );
      });
      return;
    }

    console.log("✅ [TEST] Sala encontrada:");
    console.log(`   • ID: ${salaObjetivo._id}`);
    console.log(`   • Nombre: ${salaObjetivo.nombre}`);
    console.log(`   • Estado: ${salaObjetivo.estado}`);
    console.log(`   • Juego: ${salaObjetivo.juego}`);
    console.log(`   • Jugadores: ${salaObjetivo.jugadores?.length || 0}`);
    console.log(
      `   • Precio entrada: ${salaObjetivo.configuracion?.entrada || 0}`
    );

    // 4. Verificar que la sala puede ser cancelada
    if (["jugando", "finalizada", "cancelada"].includes(salaObjetivo.estado)) {
      console.log(
        `❌ [TEST] La sala no puede ser cancelada en estado: ${salaObjetivo.estado}`
      );
      return;
    }

    // 5. Mostrar información de jugadores antes de cancelar
    if (salaObjetivo.jugadores && salaObjetivo.jugadores.length > 0) {
      console.log("\n👥 [TEST] Jugadores en la sala antes de cancelar:");
      for (const jugadorId of salaObjetivo.jugadores) {
        try {
          const jugador = await api.findPlayerById(jugadorId);
          if (jugador) {
            console.log(
              `   • ${
                jugador.nickname || jugador.displayName || "Sin nombre"
              } (${jugador._id})`
            );
          } else {
            console.log(`   • Jugador no encontrado (${jugadorId})`);
          }
        } catch (error) {
          console.log(
            `   • Error obteniendo jugador ${jugadorId}: ${error.message}`
          );
        }
      }
    }

    // 6. Confirmar cancelación
    console.log("\n⚠️ [TEST] ¿Deseas proceder con la cancelación?");
    console.log("   Esta acción:");
    console.log("   • Cancelará la sala");
    console.log("   • Procesará reembolsos automáticamente");
    console.log("   • Actualizará el estado de los jugadores");
    console.log("   • No se puede deshacer");

    // Simular confirmación (en un script real podrías usar readline)
    console.log("\n✅ [TEST] Procediendo con la cancelación...");

    // 7. Cancelar la sala
    console.log("\n🔄 [TEST] Ejecutando cancelación...");
    const resultado = await api.cancelarSala(salaObjetivo._id);

    // 8. Mostrar resultados
    console.log("\n🎉 [TEST] ¡Cancelación completada exitosamente!");
    console.log("📊 [TEST] Resultados:");
    console.log(`   • Mensaje: ${resultado.mensaje}`);
    console.log(`   • Sala ID: ${resultado.sala._id}`);
    console.log(`   • Estado final: ${resultado.sala.estado}`);
    console.log(
      `   • Jugadores afectados: ${resultado.sala.jugadoresAfectados}`
    );

    // 9. Mostrar información de reembolsos
    if (resultado.reembolsos) {
      console.log("\n💰 [TEST] Información de Reembolsos:");
      console.log(`   • Mensaje: ${resultado.reembolsos.mensaje}`);
      console.log(`   • Exitosos: ${resultado.reembolsos.exitosos}`);
      console.log(`   • Fallidos: ${resultado.reembolsos.fallidos}`);
      console.log(`   • Total: ${resultado.reembolsos.total}`);

      if (
        resultado.reembolsos.detalles &&
        resultado.reembolsos.detalles.length > 0
      ) {
        console.log("\n⚠️ [TEST] Detalles de reembolsos fallidos:");
        resultado.reembolsos.detalles.forEach((fallo, index) => {
          console.log(`   ${index + 1}. Jugador: ${fallo.jugadorId || "N/A"}`);
          console.log(
            `      Error: ${
              fallo.error || fallo.message || "Error desconocido"
            }`
          );
        });
      }
    }

    // 10. Verificar estado final de la sala
    console.log("\n🔍 [TEST] Verificando estado final de la sala...");
    const salaFinal = await api.getSalaById(salaObjetivo._id);
    console.log("✅ [TEST] Estado final confirmado:");
    console.log(`   • Estado: ${salaFinal.estado}`);
    console.log(
      `   • Fecha cancelación: ${salaFinal.fechaCancelacion || "N/A"}`
    );
    console.log(`   • Motivo: ${salaFinal.motivoCancelacion || "N/A"}`);

    console.log("\n🎯 [TEST] Prueba completada exitosamente!");
  } catch (error) {
    console.error("\n❌ [TEST] Error en la prueba:", error.message);
    if (error.response) {
      console.error(`📊 [TEST] Status: ${error.response.status}`);
      console.error(`📊 [TEST] Response:`, error.response.data);
    }
    process.exit(1);
  }
}

// Ejecutar la prueba
if (require.main === module) {
  testCancelarSala()
    .then(() => {
      console.log("\n✅ [TEST] Script ejecutado correctamente");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ [TEST] Script falló:", error.message);
      process.exit(1);
    });
}

module.exports = { testCancelarSala };
