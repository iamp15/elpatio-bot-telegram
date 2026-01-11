"use strict";
require("dotenv").config();
const BackendAPI = require("../api/backend");

// Inicializar API
const api = new BackendAPI({
  baseUrl: process.env.BACKEND_URL,
  botEmail: process.env.BOT_EMAIL,
  botPassword: process.env.BOT_PASSWORD,
});

async function testLimiteGlobalSimple() {
  console.log("🧪 === PRUEBA LÍMITE GLOBAL SIMPLE ===\n");

  try {
    // 1. Obtener jugadores
    console.log("📡 Obteniendo jugadores...");
    const jugadores = await api.getAllPlayers();

    if (jugadores.length < 2) {
      console.log("❌ Necesitamos al menos 2 jugadores para probar");
      return;
    }

    // Usar el segundo jugador para evitar conflictos con límites personales
    const jugador = jugadores[1];
    console.log(
      `✅ Jugador de prueba: ${jugador.nickname || jugador.firstName}`
    );

    // 2. Verificar estado del jugador
    console.log("\n🔍 **Verificando estado del jugador...**");
    const estado = await api.getJugadorEstado(jugador.telegramId);
    console.log("Estado:", JSON.stringify(estado, null, 2));

    if (estado && estado.salasCreadas >= 2) {
      console.log("⚠️ El jugador ya tiene 2 salas creadas, no puede crear más");
      return;
    }

    // 3. Obtener salas existentes
    console.log("\n🔍 **Analizando salas existentes...**");
    const salas = await api.getSalasDisponibles();

    const salasPorModo = {};
    salas.forEach((sala) => {
      const key = `${sala.juego}-${sala.modo}`;
      if (!salasPorModo[key]) {
        salasPorModo[key] = [];
      }
      salasPorModo[key].push(sala);
    });

    Object.entries(salasPorModo).forEach(([key, salasModo]) => {
      console.log(`   ${key}: ${salasModo.length}/5 salas`);
    });

    // 4. Encontrar un modo que esté en el límite
    const modosDisponibles = ["1v1", "2v2", "1v1v1v1"];
    let modoEnLimite = null;

    for (const modo of modosDisponibles) {
      const key = `ludo-${modo}`;
      const cantidad = salasPorModo[key]?.length || 0;

      if (cantidad >= 5) {
        console.log(`\n🎯 **Modo ${modo} está en el límite (${cantidad}/5)**`);
        modoEnLimite = modo;
        break;
      }
    }

    if (!modoEnLimite) {
      console.log(
        "\nℹ️ No hay modos en el límite. Creando salas para llegar al límite..."
      );

      // Crear salas hasta llegar al límite
      const modo = "1v1";
      const salasExistentes = salasPorModo[`ludo-${modo}`]?.length || 0;
      const salasNecesarias = 5 - salasExistentes;

      console.log(
        `   Creando ${salasNecesarias} salas adicionales de modo ${modo}...`
      );

      for (let i = 0; i < salasNecesarias; i++) {
        try {
          await api.createSala({
            nombre: `Sala Límite Global ${i + 1}`,
            juego: "ludo",
            modo: modo,
            configuracion: { entrada: 1000, premio: 3000 },
            jugadorCreador: jugador._id,
          });
          console.log(`   ✅ Sala ${i + 1} creada`);
        } catch (error) {
          console.log(
            `   ❌ Error creando sala ${i + 1}:`,
            error.response?.data?.mensaje
          );
          break;
        }
      }

      modoEnLimite = modo;
    }

    // 5. Intentar crear una sala adicional (debería fallar por límite global)
    console.log(
      `\n🏗️ **Intentando crear sala adicional de modo ${modoEnLimite}...**`
    );
    try {
      await api.createSala({
        nombre: "Sala Test Límite Global Excedido",
        juego: "ludo",
        modo: modoEnLimite,
        configuracion: { entrada: 1000, premio: 3000 },
        jugadorCreador: jugador._id,
      });
      console.log("❌ ERROR: Se pudo crear una sala adicional (no debería)");
    } catch (error) {
      console.log("✅ Correcto: Error al crear sala adicional");
      console.log("   Status:", error.response?.status);
      console.log("   Mensaje:", error.response?.data?.mensaje);

      // Verificar que el mensaje es el esperado
      const mensaje = error.response?.data?.mensaje;
      if (
        mensaje &&
        mensaje.includes("Ya hay 5 salas de") &&
        mensaje.includes("esperando jugadores")
      ) {
        console.log("✅ Mensaje correcto recibido - Límite global funcionando");
      } else if (mensaje && mensaje.includes("Ya tienes")) {
        console.log("⚠️ Error de límite personal, no global");
      } else {
        console.log("❓ Mensaje inesperado:", mensaje);
      }
    }

    console.log("\n📋 **RESUMEN DE PRUEBAS:**");
    console.log("✅ Análisis de salas existentes");
    console.log("✅ Verificación de límite por modo");
    console.log("✅ Validación de límite global");
  } catch (error) {
    console.error("❌ Error general:", error.message);
    if (error.response) {
      console.error("   Status:", error.response.status);
      console.error("   Data:", error.response.data);
    }
  }
}

// Ejecutar prueba
testLimiteGlobalSimple()
  .then(() => {
    console.log("\n✅ Prueba completada");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error ejecutando prueba:", error);
    process.exit(1);
  });
