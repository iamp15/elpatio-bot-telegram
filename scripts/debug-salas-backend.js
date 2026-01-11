"use strict";
require("dotenv").config();
const BackendAPI = require("../api/backend");

// Inicializar API
const api = new BackendAPI({
  baseUrl: process.env.BACKEND_URL,
  botEmail: process.env.BOT_EMAIL,
  botPassword: process.env.BOT_PASSWORD,
});

async function debugSalasBackend() {
  console.log("🔍 === DEBUG SALAS DEL BACKEND ===\n");

  try {
    console.log("📡 Obteniendo salas del backend...");
    const salas = await api.getSalasDisponibles();

    console.log(`✅ Se obtuvieron ${salas.length} salas del backend\n`);

    if (salas.length === 0) {
      console.log("❌ No hay salas en el backend");
      return;
    }

    // Mostrar estructura de cada sala
    salas.forEach((sala, index) => {
      console.log(`🏠 **Sala ${index + 1}:**`);
      console.log(`   ID: ${sala._id}`);
      console.log(`   Nombre: ${sala.nombre || "Sin nombre"}`);
      console.log(`   Juego: ${sala.juego}`);
      console.log(`   Modo: ${sala.modo}`);
      console.log(`   Creador: ${sala.creador || "NO TIENE CAMPO CREADOR"}`);
      console.log(`   Jugadores: ${sala.jugadores?.length || 0}`);
      console.log(`   Configuración: ${JSON.stringify(sala.configuracion)}`);
      console.log(`   Estado: ${sala.estado}`);
      console.log(`   Campos disponibles: ${Object.keys(sala).join(", ")}`);
      console.log("");
    });

    // Verificar si alguna sala tiene creador
    const salasConCreador = salas.filter((sala) => sala.creador);
    console.log(`📊 **Resumen:**`);
    console.log(`   • Total de salas: ${salas.length}`);
    console.log(`   • Salas con campo creador: ${salasConCreador.length}`);
    console.log(
      `   • Salas sin campo creador: ${salas.length - salasConCreador.length}`
    );

    if (salasConCreador.length === 0) {
      console.log("\n❌ **PROBLEMA IDENTIFICADO:**");
      console.log("   Las salas del backend NO tienen el campo 'creador'");
      console.log(
        "   Esto explica por qué no se muestra el creador en Telegram"
      );
      console.log("\n💡 **Solución:**");
      console.log(
        "   El backend debe agregar el campo 'creador' al crear salas"
      );
      console.log("   O modificar el esquema de Sala para incluir este campo");
    } else {
      console.log(
        "\n✅ Las salas tienen campo creador, el problema está en otro lado"
      );
    }
  } catch (error) {
    console.error("❌ Error obteniendo salas:", error.message);
    if (error.response) {
      console.error("   Status:", error.response.status);
      console.error("   Data:", error.response.data);
    }
  }
}

// Ejecutar debug
debugSalasBackend()
  .then(() => {
    console.log("\n✅ Debug completado");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error en debug:", error);
    process.exit(1);
  });
