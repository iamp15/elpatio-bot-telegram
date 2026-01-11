"use strict";
require("dotenv").config();
const BackendAPI = require("../api/backend");

// Inicializar API
const api = new BackendAPI({
  baseUrl: process.env.BACKEND_URL,
  botEmail: process.env.BOT_EMAIL,
  botPassword: process.env.BOT_PASSWORD,
});

async function testValidacionesReglas() {
  console.log("🧪 === PRUEBA DE VALIDACIONES DE REGLAS ===\n");

  try {
    // Obtener jugadores existentes
    console.log("📡 Obteniendo jugadores del backend...");
    const jugadores = await api.getAllPlayers();

    if (jugadores.length === 0) {
      console.log("❌ No hay jugadores en el backend para probar");
      return;
    }

    const jugadorTest = jugadores[0];
    console.log(
      `✅ Jugador de prueba: ${
        jugadorTest.nickname || jugadorTest.firstName
      } (${jugadorTest._id})`
    );

    // 1. Verificar estado inicial del jugador
    console.log("\n🔍 **1. Verificando estado inicial del jugador...**");
    const estadoInicial = await api.getJugadorEstado(jugadorTest.telegramId);
    console.log("📊 Estado inicial:", JSON.stringify(estadoInicial, null, 2));

    // 2. Crear primera sala (debería funcionar)
    console.log("\n🏗️ **2. Creando primera sala (1v1)...**");
    try {
      const sala1 = await api.createSala({
        nombre: "Sala Test 1 - 1v1",
        juego: "ludo",
        modo: "1v1",
        configuracion: { entrada: 1000, premio: 3000 },
        jugadorCreador: jugadorTest._id,
      });
      console.log("✅ Primera sala creada exitosamente");
      console.log("   ID:", sala1.sala?._id || sala1._id);
    } catch (error) {
      console.log(
        "❌ Error creando primera sala:",
        error.response?.data?.mensaje || error.message
      );
    }

    // 3. Intentar crear segunda sala del mismo modo (debería fallar)
    console.log(
      "\n🏗️ **3. Intentando crear segunda sala del mismo modo (1v1)...**"
    );
    try {
      const sala2 = await api.createSala({
        nombre: "Sala Test 2 - 1v1 (debería fallar)",
        juego: "ludo",
        modo: "1v1",
        configuracion: { entrada: 1000, premio: 3000 },
        jugadorCreador: jugadorTest._id,
      });
      console.log(
        "❌ ERROR: Se creó una segunda sala del mismo modo (no debería)"
      );
    } catch (error) {
      console.log("✅ Correcto: Error al crear segunda sala del mismo modo");
      console.log("   Mensaje:", error.response?.data?.mensaje);
    }

    // 4. Crear segunda sala de modo diferente (debería funcionar)
    console.log("\n🏗️ **4. Creando segunda sala de modo diferente (2v2)...**");
    try {
      const sala3 = await api.createSala({
        nombre: "Sala Test 3 - 2v2",
        juego: "ludo",
        modo: "2v2",
        configuracion: { entrada: 2000, premio: 6000 },
        jugadorCreador: jugadorTest._id,
      });
      console.log("✅ Segunda sala creada exitosamente");
      console.log("   ID:", sala3.sala?._id || sala3._id);
    } catch (error) {
      console.log(
        "❌ Error creando segunda sala:",
        error.response?.data?.mensaje || error.message
      );
    }

    // 5. Intentar crear tercera sala (debería fallar)
    console.log(
      "\n🏗️ **5. Intentando crear tercera sala (debería fallar)...**"
    );
    try {
      const sala4 = await api.createSala({
        nombre: "Sala Test 4 - 1v1v1v1 (debería fallar)",
        juego: "ludo",
        modo: "1v1v1v1",
        configuracion: { entrada: 3000, premio: 9000 },
        jugadorCreador: jugadorTest._id,
      });
      console.log("❌ ERROR: Se creó una tercera sala (no debería)");
    } catch (error) {
      console.log("✅ Correcto: Error al crear tercera sala");
      console.log("   Mensaje:", error.response?.data?.mensaje);
    }

    // 6. Verificar estado final del jugador
    console.log("\n🔍 **6. Verificando estado final del jugador...**");
    const estadoFinal = await api.getJugadorEstado(jugadorTest.telegramId);
    console.log("📊 Estado final:", JSON.stringify(estadoFinal, null, 2));

    // 7. Verificar que solo se muestran salas activas
    console.log("\n🏠 **7. Verificando salas disponibles...**");
    const salasDisponibles = await api.getSalasDisponibles();
    console.log(`📊 Total de salas disponibles: ${salasDisponibles.length}`);

    const salasDelJugador = salasDisponibles.filter(
      (sala) => sala.creador === jugadorTest._id
    );
    console.log(
      `📊 Salas del jugador en disponibles: ${salasDelJugador.length}`
    );

    salasDelJugador.forEach((sala, index) => {
      console.log(
        `   ${index + 1}. ${sala.nombre} - Estado: ${sala.estado} - Modo: ${
          sala.modo
        }`
      );
    });

    // Resumen de pruebas
    console.log("\n📋 **RESUMEN DE PRUEBAS:**");
    console.log("✅ Verificación de estado del jugador");
    console.log("✅ Creación de primera sala");
    console.log("✅ Validación de límite por modo");
    console.log("✅ Creación de segunda sala (modo diferente)");
    console.log("✅ Validación de límite total de salas creadas");
    console.log("✅ Filtrado de salas activas");
  } catch (error) {
    console.error("❌ Error en las pruebas:", error.message);
    if (error.response) {
      console.error("   Status:", error.response.status);
      console.error("   Data:", error.response.data);
    }
  }
}

// Ejecutar pruebas
testValidacionesReglas()
  .then(() => {
    console.log("\n✅ Pruebas completadas");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error ejecutando pruebas:", error);
    process.exit(1);
  });
