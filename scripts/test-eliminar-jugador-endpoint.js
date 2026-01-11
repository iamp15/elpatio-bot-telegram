/**
 * Script para probar el endpoint de eliminar jugador de sala
 * Verifica que el backend API funcione correctamente
 */

require("dotenv").config();
const BackendAPI = require("../api/backend");

// Variables de entorno
const BACKEND_URL = process.env.BACKEND_URL;
const BOT_EMAIL = process.env.BOT_EMAIL;
const BOT_PASSWORD = process.env.BOT_PASSWORD;

if (!BACKEND_URL || !BOT_EMAIL || !BOT_PASSWORD) {
  console.error("❌ Faltan variables de entorno necesarias");
  process.exit(1);
}

async function testEliminarJugadorEndpoint() {
  console.log("🧪 Probando endpoint de eliminar jugador de sala...\n");

  try {
    // Inicializar API
    const api = new BackendAPI({
      baseUrl: BACKEND_URL,
      botEmail: BOT_EMAIL,
      botPassword: BOT_PASSWORD,
      preToken: null,
    });

    // Obtener salas disponibles
    console.log("1️⃣ Obteniendo salas disponibles...");
    const salas = await api.getSalasDisponibles();
    console.log(`   Salas encontradas: ${salas.length}`);

    if (salas.length === 0) {
      console.log("   ℹ️  No hay salas disponibles para probar");
      return;
    }

    // Buscar una sala con jugadores
    const salaConJugadores = salas.find(
      (sala) => sala.jugadores && sala.jugadores.length > 0
    );

    if (!salaConJugadores) {
      console.log("   ℹ️  No hay salas con jugadores para probar");
      return;
    }

    console.log(
      `2️⃣ Usando sala: ${salaConJugadores.nombre || salaConJugadores._id}`
    );
    console.log(`   ID de la sala: ${salaConJugadores._id}`);
    console.log(`   Jugadores actuales: ${salaConJugadores.jugadores.length}`);

    // Mostrar información de los jugadores
    console.log("\n3️⃣ Información de jugadores en la sala:");
    for (let i = 0; i < salaConJugadores.jugadores.length; i++) {
      const jugador = salaConJugadores.jugadores[i];

      if (typeof jugador === "string") {
        // Es solo un ID, buscar la información
        console.log(`   Jugador ${i + 1}: ID ${jugador}`);
        try {
          const jugadorInfo = await api.findPlayerById(jugador);
          if (jugadorInfo) {
            console.log(
              `     Nombre: ${
                jugadorInfo.nickname ||
                jugadorInfo.firstName ||
                jugadorInfo.username
              }`
            );
            console.log(`     Telegram ID: ${jugadorInfo.telegramId}`);
          }
        } catch (err) {
          console.log(`     ❌ Error obteniendo información: ${err.message}`);
        }
      } else if (typeof jugador === "object" && jugador !== null) {
        console.log(`   Jugador ${i + 1}:`);
        console.log(`     ID: ${jugador._id}`);
        console.log(
          `     Nombre: ${
            jugador.nickname || jugador.firstName || jugador.username
          }`
        );
        console.log(`     Telegram ID: ${jugador.telegramId}`);
      }
    }

    // Probar el endpoint de eliminar jugador
    console.log("\n4️⃣ Probando endpoint de eliminar jugador...");

    // Tomar el primer jugador para la prueba
    const jugadorAEliminar = salaConJugadores.jugadores[0];
    let jugadorId = null;

    if (typeof jugadorAEliminar === "string") {
      jugadorId = jugadorAEliminar;
    } else if (
      typeof jugadorAEliminar === "object" &&
      jugadorAEliminar !== null
    ) {
      jugadorId = jugadorAEliminar._id;
    }

    if (!jugadorId) {
      console.log("   ❌ No se pudo obtener el ID del jugador");
      return;
    }

    console.log(`   Jugador a eliminar: ${jugadorId}`);

    try {
      // Intentar eliminar el jugador
      const resultado = await api.eliminarJugadorDeSala(
        salaConJugadores._id,
        jugadorId
      );
      console.log("   ✅ Jugador eliminado exitosamente");
      console.log(`   Resultado:`, resultado);

      // Verificar que el jugador fue eliminado
      console.log("\n5️⃣ Verificando que el jugador fue eliminado...");
      const salasActualizadas = await api.getSalasDisponibles();
      const salaActualizada = salasActualizadas.find(
        (s) => s._id === salaConJugadores._id
      );

      if (salaActualizada) {
        console.log(
          `   Jugadores después de eliminar: ${salaActualizada.jugadores.length}`
        );
        if (
          salaActualizada.jugadores.length < salaConJugadores.jugadores.length
        ) {
          console.log("   ✅ Verificación exitosa: El jugador fue eliminado");
        } else {
          console.log("   ⚠️  El número de jugadores no cambió");
        }
      } else {
        console.log("   ❌ No se pudo encontrar la sala actualizada");
      }
    } catch (error) {
      console.log("   ❌ Error eliminando jugador:");
      console.log(`   Mensaje: ${error.message}`);

      if (error.response && error.response.data) {
        console.log(`   Respuesta del backend:`, error.response.data);
      }
    }

    console.log("\n🎉 Prueba del endpoint de eliminar jugador completada");
  } catch (error) {
    console.error("\n❌ Error en las pruebas:", error.message);
    process.exit(1);
  }
}

// Ejecutar pruebas
testEliminarJugadorEndpoint();
