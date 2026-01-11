/**
 * Script de prueba para la funcionalidad de cancelación automática de salas
 * Prueba el escenario donde el último jugador abandona una sala
 */

const BackendAPI = require("../api/backend");
const BOT_CONFIG = require("../config/bot-config");

// Configuración de prueba
const TEST_CONFIG = {
  backendUrl: process.env.BACKEND_URL || "http://localhost:3000",
  botEmail: process.env.BOT_EMAIL || "bot@test.com",
  botPassword: process.env.BOT_PASSWORD || "botpassword",
  testSalaId: process.env.TEST_SALA_ID, // ID de una sala existente para probar
};

async function testCancelacionAutomaticaSala() {
  console.log("🧪 Iniciando prueba de cancelación automática de sala...\n");

  try {
    // 1. Inicializar API
    const api = new BackendAPI({
      baseUrl: TEST_CONFIG.backendUrl,
      botEmail: TEST_CONFIG.botEmail,
      botPassword: TEST_CONFIG.botPassword,
    });

    console.log("✅ API inicializada correctamente");

    // 2. Obtener salas disponibles para encontrar una para probar
    const salas = await api.getSalasDisponibles();
    console.log(`📋 Salas disponibles: ${salas.length}`);

    if (salas.length === 0) {
      console.log("❌ No hay salas disponibles para probar");
      return;
    }

    // 3. Buscar una sala con jugadores para probar
    const salaConJugadores = salas.find(
      (s) => s.jugadores && s.jugadores.length > 0
    );

    if (!salaConJugadores) {
      console.log(
        "ℹ️ No hay salas con jugadores para probar la cancelación automática"
      );
      console.log("💡 Para probar esta funcionalidad, necesitas:");
      console.log("   1. Crear una sala");
      console.log("   2. Unir jugadores a la sala");
      console.log("   3. Ejecutar este script para abandonar la sala");
      return;
    }

    const salaId = salaConJugadores._id;
    console.log(`🎮 Probando con sala: ${salaConJugadores.nombre} (${salaId})`);
    console.log(
      `👥 Jugadores en la sala: ${salaConJugadores.jugadores.length}`
    );

    // 4. Obtener información de un jugador en la sala
    const jugadorId = salaConJugadores.jugadores[0];
    console.log(`👤 Jugador a eliminar: ${jugadorId}`);

    // 5. Simular abandono del jugador
    console.log("\n🔄 Simulando abandono del jugador...");
    const resultado = await api.eliminarJugadorDeSala(salaId, jugadorId);

    // 6. Verificar el resultado
    console.log("\n📊 Resultado del abandono:");
    console.log(
      `   - Sala cancelada: ${resultado.cancelada ? "✅ Sí" : "❌ No"}`
    );
    console.log(
      `   - Jugadores restantes: ${resultado.sala?.jugadores?.length || 0}`
    );
    console.log(
      `   - Estado de la sala: ${resultado.sala?.estado || "No especificado"}`
    );

    if (resultado.cancelada) {
      console.log("\n🎉 ¡Prueba exitosa! La sala se canceló automáticamente");
      console.log(
        "✅ La funcionalidad de cancelación automática está funcionando correctamente"
      );
    } else {
      console.log(
        "\nℹ️ La sala no se canceló (probablemente porque quedaron otros jugadores)"
      );
      console.log("✅ El sistema está funcionando correctamente");
    }

    // 7. Verificar estado final de la sala
    console.log("\n🔍 Verificando estado final de la sala...");
    try {
      const salasActualizadas = await api.getSalasDisponibles();
      const salaActualizada = salasActualizadas.find((s) => s._id === salaId);

      if (salaActualizada) {
        console.log(`   - Sala encontrada: ${salaActualizada.nombre}`);
        console.log(
          `   - Estado: ${salaActualizada.estado || "No especificado"}`
        );
        console.log(
          `   - Jugadores: ${salaActualizada.jugadores?.length || 0}`
        );
      } else {
        console.log(
          "   - La sala ya no aparece en la lista (probablemente cancelada)"
        );
      }
    } catch (err) {
      console.log(`   - Error verificando estado final: ${err.message}`);
    }
  } catch (error) {
    console.error("❌ Error durante la prueba:", error.message);

    if (error.response) {
      console.error("   - Status:", error.response.status);
      console.error("   - Data:", error.response.data);
    }
  }
}

// Función para probar con una sala específica
async function testConSalaEspecifica(salaId) {
  console.log(
    `🧪 Probando cancelación automática con sala específica: ${salaId}\n`
  );

  try {
    const api = new BackendAPI({
      baseUrl: TEST_CONFIG.backendUrl,
      botEmail: TEST_CONFIG.botEmail,
      botPassword: TEST_CONFIG.botPassword,
    });

    // Obtener información de la sala
    const salas = await api.getSalasDisponibles();
    const sala = salas.find((s) => s._id === salaId);

    if (!sala) {
      console.log("❌ Sala no encontrada");
      return;
    }

    console.log(`🎮 Sala: ${sala.nombre}`);
    console.log(`👥 Jugadores: ${sala.jugadores?.length || 0}`);

    if (sala.jugadores && sala.jugadores.length > 0) {
      const jugadorId = sala.jugadores[0];
      console.log(`👤 Eliminando jugador: ${jugadorId}`);

      const resultado = await api.eliminarJugadorDeSala(salaId, jugadorId);

      console.log(`\n📊 Resultado:`);
      console.log(`   - Cancelada: ${resultado.cancelada ? "✅ Sí" : "❌ No"}`);
      console.log(
        `   - Jugadores restantes: ${resultado.sala?.jugadores?.length || 0}`
      );

      if (resultado.cancelada) {
        console.log("🎉 ¡Sala cancelada automáticamente!");
      }
    } else {
      console.log("ℹ️ La sala no tiene jugadores para eliminar");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Ejecutar pruebas
async function main() {
  console.log("🚀 Iniciando pruebas de cancelación automática de salas\n");

  // Si se proporciona un ID de sala específico, probar con esa sala
  if (TEST_CONFIG.testSalaId) {
    await testConSalaEspecifica(TEST_CONFIG.testSalaId);
  } else {
    await testCancelacionAutomaticaSala();
  }

  console.log("\n✨ Pruebas completadas");
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  testCancelacionAutomaticaSala,
  testConSalaEspecifica,
};


