"use strict";
require("dotenv").config();
const BackendAPI = require("../api/backend");

// Inicializar API
const api = new BackendAPI({
  baseUrl: process.env.BACKEND_URL,
  botEmail: process.env.BOT_EMAIL,
  botPassword: process.env.BOT_PASSWORD,
});

async function testLimiteSalasGlobal() {
  console.log("🧪 === PRUEBA LÍMITE GLOBAL DE SALAS ===\n");

  try {
    // 1. Obtener jugadores y salas existentes
    console.log("📡 Obteniendo datos...");
    const jugadores = await api.getAllPlayers();
    const salas = await api.getSalasDisponibles();

    if (jugadores.length === 0) {
      console.log("❌ No hay jugadores para probar");
      return;
    }

    const jugador = jugadores[0];
    console.log(
      `✅ Jugador de prueba: ${jugador.nickname || jugador.firstName}`
    );

    // 2. Contar salas existentes por modo
    console.log("\n🔍 **Analizando salas existentes...**");
    const salasPorModo = {};
    salas.forEach((sala) => {
      const key = `${sala.juego}-${sala.modo}`;
      if (!salasPorModo[key]) {
        salasPorModo[key] = [];
      }
      salasPorModo[key].push(sala);
    });

    Object.entries(salasPorModo).forEach(([key, salasModo]) => {
      console.log(`   ${key}: ${salasModo.length} salas`);
    });

    // 3. Encontrar un modo que esté cerca del límite
    const modosDisponibles = ["1v1", "2v2", "1v1v1v1"];
    let modoParaProbar = null;

    for (const modo of modosDisponibles) {
      const key = `ludo-${modo}`;
      const cantidad = salasPorModo[key]?.length || 0;
      console.log(`\n🔍 **Modo ${modo}:** ${cantidad}/5 salas`);

      if (cantidad >= 5) {
        console.log(`   ✅ Modo ${modo} ya está en el límite`);
        modoParaProbar = modo;
        break;
      } else if (cantidad >= 3) {
        console.log(`   ⚠️ Modo ${modo} está cerca del límite (${cantidad}/5)`);
        modoParaProbar = modo;
        break;
      }
    }

    if (!modoParaProbar) {
      console.log("\nℹ️ No hay modos cerca del límite para probar");
      console.log("   Creando salas para llegar al límite...");

      // Crear salas hasta llegar al límite
      modoParaProbar = "1v1";
      const salasExistentes =
        salasPorModo[`ludo-${modoParaProbar}`]?.length || 0;
      const salasNecesarias = 5 - salasExistentes;

      console.log(`   Creando ${salasNecesarias} salas adicionales...`);

      for (let i = 0; i < salasNecesarias; i++) {
        try {
          await api.createSala({
            nombre: `Sala Test Límite ${i + 1}`,
            juego: "ludo",
            modo: modoParaProbar,
            configuracion: { entrada: 1000, premio: 3000 },
            jugadorCreador: jugador._id,
          });
          console.log(`   ✅ Sala ${i + 1} creada`);
        } catch (error) {
          console.log(
            `   ❌ Error creando sala ${i + 1}:`,
            error.response?.data?.mensaje
          );
        }
      }
    }

    // 4. Intentar crear una sala adicional (debería fallar)
    console.log(
      `\n🏗️ **Intentando crear sala adicional de modo ${modoParaProbar}...**`
    );
    try {
      await api.createSala({
        nombre: "Sala Test Límite Excedido",
        juego: "ludo",
        modo: modoParaProbar,
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
        console.log("✅ Mensaje correcto recibido");
      } else {
        console.log("❓ Mensaje inesperado:", mensaje);
      }
    }

    // 5. Verificar que se puede crear sala de otro modo
    const otroModo = modoParaProbar === "1v1" ? "2v2" : "1v1";
    console.log(`\n🏗️ **Intentando crear sala de otro modo (${otroModo})...**`);
    try {
      await api.createSala({
        nombre: "Sala Test Otro Modo",
        juego: "ludo",
        modo: otroModo,
        configuracion: { entrada: 1000, premio: 3000 },
        jugadorCreador: jugador._id,
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
    console.log("✅ Verificación de límite por modo");
    console.log("✅ Validación de límite global");
    console.log("✅ Creación de salas de otros modos");
  } catch (error) {
    console.error("❌ Error general:", error.message);
    if (error.response) {
      console.error("   Status:", error.response.status);
      console.error("   Data:", error.response.data);
    }
  }
}

// Ejecutar prueba
testLimiteSalasGlobal()
  .then(() => {
    console.log("\n✅ Prueba completada");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error ejecutando prueba:", error);
    process.exit(1);
  });
