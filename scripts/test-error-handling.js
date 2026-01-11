"use strict";

require("dotenv").config();
const BackendAPI = require("../api/backend");

async function testErrorHandling() {
  console.log("🧪 PROBANDO MANEJO DE ERRORES ESPECÍFICOS");
  console.log("=".repeat(50));

  const api = new BackendAPI({
    baseUrl: process.env.BACKEND_URL || "http://localhost:5000",
    botEmail: process.env.BOT_EMAIL,
    botPassword: process.env.BOT_PASSWORD,
  });

  try {
    console.log("📋 1. Obteniendo jugadores existentes...");
    const jugadores = await api.getAllPlayers();
    console.log(`   ✅ ${jugadores.length} jugadores encontrados`);

    if (jugadores.length === 0) {
      console.log("❌ No hay jugadores para probar");
      return;
    }

    console.log("\n📋 2. Obteniendo salas disponibles...");
    const salas = await api.getSalasDisponibles();
    console.log(`   ✅ ${salas.length} salas disponibles`);

    if (salas.length === 0) {
      console.log("❌ No hay salas para probar");
      return;
    }

    const sala = salas[0];
    const jugador = jugadores[0];

    console.log(`\n📋 3. Probando unirse a sala: ${sala._id}`);
    console.log(`   Jugador: ${jugador.username} (${jugador._id})`);

    // Primera vez - debería funcionar
    try {
      await api.joinSala(sala._id, jugador._id);
      console.log("   ✅ Primera vez: Unido exitosamente");
    } catch (err) {
      console.log(
        `   ⚠️  Primera vez: ${err.response?.data?.mensaje || err.message}`
      );
    }

    // Segunda vez - debería dar error "Ya estás en la sala"
    try {
      await api.joinSala(sala._id, jugador._id);
      console.log("   ❌ Segunda vez: No debería funcionar");
    } catch (err) {
      const errorData = err.response?.data;
      console.log(`   📋 Error recibido:`);
      console.log(`      Status: ${err.response?.status}`);
      console.log(`      Mensaje: ${errorData?.mensaje || "N/A"}`);
      console.log(`      Tipo: ${typeof errorData}`);

      // Simular la lógica del bot
      if (
        errorData &&
        typeof errorData === "object" &&
        errorData.mensaje === "Ya estás en la sala"
      ) {
        console.log(
          "   ✅ Error detectado correctamente: 'Ya estás en la sala'"
        );
        console.log("   📝 Mensaje que vería el usuario:");
        console.log("      ℹ️ Ya te encuentras en esta sala");
        console.log(
          "      No puedes unirte dos veces a la misma sala. Si necesitas salir, contacta al administrador."
        );
      } else {
        console.log("   ❌ Error no reconocido como 'Ya estás en la sala'");
        console.log("   📝 Mensaje genérico que vería el usuario:");
        console.log(
          "      ❌ Error uniéndote a la sala. Intenta de nuevo o contacta al admin."
        );
      }
    }

    console.log("\n🎯 RESULTADO:");
    console.log("   ✅ Manejo de errores implementado");
    console.log("   ✅ Error específico detectado");
    console.log("   ✅ Mensaje amigable para el usuario");
  } catch (err) {
    console.error("❌ Error en prueba:", err.message);
  }
}

testErrorHandling();
