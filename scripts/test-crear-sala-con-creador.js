"use strict";
require("dotenv").config();
const BackendAPI = require("../api/backend");

// Inicializar API
const api = new BackendAPI({
  baseUrl: process.env.BACKEND_URL,
  botEmail: process.env.BOT_EMAIL,
  botPassword: process.env.BOT_PASSWORD,
});

async function testCrearSalaConCreador() {
  console.log("🧪 === PRUEBA CREAR SALA CON CREADOR ===\n");

  try {
    // Primero obtener un jugador existente para usarlo como creador
    console.log("📡 Obteniendo jugadores del backend...");
    const jugadores = await api.getAllPlayers();

    if (jugadores.length === 0) {
      console.log("❌ No hay jugadores en el backend para usar como creador");
      return;
    }

    const jugadorCreador = jugadores[0];
    console.log(
      `✅ Jugador creador seleccionado: ${
        jugadorCreador.nickname || jugadorCreador.firstName
      } (${jugadorCreador._id})`
    );

    // Crear una nueva sala con el campo creador
    console.log("\n🏗️ Creando nueva sala con campo creador...");
    const salaData = {
      nombre: "Sala de Prueba con Creador",
      juego: "ludo",
      modo: "1v1",
      configuracion: {
        entrada: 1000,
        premio: 3000,
      },
      jugadorCreador: jugadorCreador._id, // Campo creador
    };

    console.log(
      "📤 Enviando datos de sala:",
      JSON.stringify(salaData, null, 2)
    );

    const salaCreada = await api.createSala(salaData);
    console.log("✅ Sala creada exitosamente!");
    console.log(
      "📋 Datos de la sala creada:",
      JSON.stringify(salaCreada, null, 2)
    );

    // Verificar que la sala tiene el campo creador
    if (salaCreada.creador) {
      console.log("\n🎉 **¡ÉXITO!** La sala tiene el campo creador:");
      console.log(`   Creador ID: ${salaCreada.creador}`);

      // Obtener información del creador
      const creadorInfo = await api.findPlayerById(salaCreada.creador);
      console.log(
        `   Creador Nombre: ${
          creadorInfo.nickname || creadorInfo.firstName || creadorInfo.username
        }`
      );
    } else {
      console.log("\n❌ **PROBLEMA:** La sala NO tiene el campo creador");
      console.log("   Campos disponibles:", Object.keys(salaCreada));
    }

    // Ahora obtener todas las salas para verificar
    console.log("\n📡 Obteniendo todas las salas para verificar...");
    const todasLasSalas = await api.getSalasDisponibles();

    console.log(`\n📊 **Resumen de salas:**`);
    console.log(`   • Total de salas: ${todasLasSalas.length}`);

    const salasConCreador = todasLasSalas.filter((sala) => sala.creador);
    console.log(`   • Salas con campo creador: ${salasConCreador.length}`);
    console.log(
      `   • Salas sin campo creador: ${
        todasLasSalas.length - salasConCreador.length
      }`
    );

    // Mostrar las salas con creador
    if (salasConCreador.length > 0) {
      console.log("\n🏠 **Salas con creador:**");
      salasConCreador.forEach((sala, index) => {
        console.log(
          `   ${index + 1}. ${sala.nombre} - Creador: ${sala.creador}`
        );
      });
    }
  } catch (error) {
    console.error("❌ Error en la prueba:", error.message);
    if (error.response) {
      console.error("   Status:", error.response.status);
      console.error("   Data:", error.response.data);
    }
  }
}

// Ejecutar prueba
testCrearSalaConCreador()
  .then(() => {
    console.log("\n✅ Prueba completada");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error en prueba:", error);
    process.exit(1);
  });
