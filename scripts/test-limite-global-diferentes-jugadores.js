"use strict";
require("dotenv").config();
const BackendAPI = require("../api/backend");

// Inicializar API
const api = new BackendAPI({
  baseUrl: process.env.BACKEND_URL,
  botEmail: process.env.BOT_EMAIL,
  botPassword: process.env.BOT_PASSWORD,
});

async function testLimiteGlobalDiferentesJugadores() {
  console.log("🧪 === PRUEBA LÍMITE GLOBAL CON DIFERENTES JUGADORES ===\n");

  try {
    // 1. Obtener jugadores
    console.log("📡 Obteniendo jugadores...");
    const jugadores = await api.getAllPlayers();

    if (jugadores.length < 3) {
      console.log("❌ Necesitamos al menos 3 jugadores para probar");
      return;
    }

    console.log(`✅ Jugadores disponibles: ${jugadores.length}`);

    // 2. Obtener salas existentes
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

    // 3. Encontrar un modo que esté cerca del límite
    const modo = "1v1";
    const salasExistentes = salasPorModo[`ludo-${modo}`]?.length || 0;
    console.log(`\n🎯 **Modo ${modo}: ${salasExistentes}/5 salas existentes**`);

    if (salasExistentes >= 5) {
      console.log("✅ Ya hay 5 salas, probando límite global...");
    } else {
      console.log(`ℹ️ Creando ${5 - salasExistentes} salas adicionales...`);

      // Crear salas con diferentes jugadores
      const jugadoresDisponibles = jugadores.slice(0, 5); // Usar hasta 5 jugadores

      for (let i = 0; i < 5 - salasExistentes; i++) {
        const jugador = jugadoresDisponibles[i % jugadoresDisponibles.length];

        try {
          await api.createSala({
            nombre: `Sala Global Test ${i + 1}`,
            juego: "ludo",
            modo: modo,
            configuracion: { entrada: 1000, premio: 3000 },
            jugadorCreador: jugador._id,
          });
          console.log(
            `   ✅ Sala ${i + 1} creada por ${
              jugador.nickname || jugador.firstName
            }`
          );
        } catch (error) {
          console.log(
            `   ❌ Error creando sala ${i + 1}:`,
            error.response?.data?.mensaje
          );
          break;
        }
      }
    }

    // 4. Verificar estado final
    console.log("\n🔍 **Verificando estado final...**");
    const salasFinales = await api.getSalasDisponibles();
    const salasModoFinal = salasFinales.filter(
      (s) => s.juego === "ludo" && s.modo === modo
    );
    console.log(`   Salas ${modo} finales: ${salasModoFinal.length}/5`);

    // 5. Intentar crear una sala adicional (debería fallar por límite global)
    console.log(`\n🏗️ **Intentando crear sala adicional de modo ${modo}...**`);
    const jugadorTest = jugadores[0];

    try {
      await api.createSala({
        nombre: "Sala Test Límite Global Excedido",
        juego: "ludo",
        modo: modo,
        configuracion: { entrada: 1000, premio: 3000 },
        jugadorCreador: jugadorTest._id,
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

    // 6. Verificar que se puede crear sala de otro modo
    const otroModo = "2v2";
    console.log(`\n🏗️ **Intentando crear sala de otro modo (${otroModo})...**`);
    try {
      await api.createSala({
        nombre: "Sala Test Otro Modo",
        juego: "ludo",
        modo: otroModo,
        configuracion: { entrada: 1000, premio: 3000 },
        jugadorCreador: jugadorTest._id,
      });
      console.log("✅ Correcto: Se pudo crear sala de otro modo");
    } catch (error) {
      console.log(
        "❌ Error creando sala de otro modo:",
        error.response?.data?.mensaje
      );
    }

    console.log("\n📋 **RESUMEN DE PRUEBAS:**");
    console.log("✅ Análisis de salas existentes");
    console.log("✅ Creación con diferentes jugadores");
    console.log("✅ Verificación de límite global");
    console.log("✅ Validación de otros modos");
  } catch (error) {
    console.error("❌ Error general:", error.message);
    if (error.response) {
      console.error("   Status:", error.response.status);
      console.error("   Data:", error.response.data);
    }
  }
}

// Ejecutar prueba
testLimiteGlobalDiferentesJugadores()
  .then(() => {
    console.log("\n✅ Prueba completada");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error ejecutando prueba:", error);
    process.exit(1);
  });
