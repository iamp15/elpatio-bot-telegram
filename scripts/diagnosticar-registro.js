"use strict";

require("dotenv").config();
const BackendAPI = require("../api/backend");

async function diagnosticarRegistro() {
  console.log("🔍 DIAGNOSTICANDO PROCESO DE REGISTRO");
  console.log("=".repeat(50));

  const api = new BackendAPI({
    baseUrl: process.env.BACKEND_URL || "http://localhost:5000",
    botEmail: process.env.BOT_EMAIL,
    botPassword: process.env.BOT_PASSWORD,
  });

  try {
    console.log("📋 1. Verificando jugadores existentes...");
    const jugadores = await api.getAllPlayers();

    if (jugadores.length === 0) {
      console.log("❌ No hay jugadores para diagnosticar");
      return;
    }

    console.log(`\n📊 Total de jugadores: ${jugadores.length}`);

    jugadores.forEach((jugador, index) => {
      console.log(`\n${index + 1}. Jugador:`);
      console.log(`   ID: ${jugador._id}`);
      console.log(`   telegramId: ${jugador.telegramId}`);
      console.log(`   nickname: ${jugador.nickname || "N/A"}`);
      console.log(`   firstName: ${jugador.firstName || "N/A"}`);
      console.log(`   username: ${jugador.username || "N/A"}`);

      // Verificar si tiene firstName
      if (!jugador.firstName) {
        console.log(`   ⚠️  PROBLEMA: No tiene firstName configurado`);
      } else {
        console.log(`   ✅ Tiene firstName: ${jugador.firstName}`);
      }
    });

    console.log("\n📋 2. Simulando registro de un nuevo jugador...");

    // Simular datos de Telegram
    const userSimulado = {
      id: 999999999,
      first_name: "Usuario_Prueba",
      username: "usuario_prueba",
    };

    console.log(`   Datos simulados:`);
    console.log(`   - telegramId: ${userSimulado.id}`);
    console.log(`   - firstName: ${userSimulado.first_name}`);
    console.log(`   - username: ${userSimulado.username}`);

    // Verificar si ya existe
    const jugadorExistente = await api.findPlayerByTelegram(
      String(userSimulado.id)
    );
    if (jugadorExistente) {
      console.log(`   ⚠️  El jugador ya existe, eliminando para la prueba...`);
      // No podemos eliminar desde aquí, pero podemos mostrar qué pasaría
      console.log(
        `   📝 Para probar, necesitarías eliminar el jugador ${jugadorExistente._id} del backend`
      );
    } else {
      console.log(`   ✅ El jugador no existe, podemos probar el registro`);

      // Simular el proceso de registro
      const nickname = `SIN_NICKNAME_${userSimulado.id}`;
      const username = userSimulado.username || `user_${userSimulado.id}`;
      const firstName = userSimulado.first_name || null;

      console.log(`   📝 Datos que se enviarían al backend:`);
      console.log(`   - telegramId: ${userSimulado.id}`);
      console.log(`   - username: ${username}`);
      console.log(`   - nickname: ${nickname}`);
      console.log(`   - firstName: ${firstName}`);

      try {
        const nuevoJugador = await api.createPlayer({
          telegramId: String(userSimulado.id),
          username,
          nickname,
          firstName,
        });

        console.log(`   ✅ Jugador creado exitosamente:`);
        console.log(`   - ID: ${nuevoJugador._id || nuevoJugador.id}`);
        console.log(`   - firstName: ${nuevoJugador.firstName || "N/A"}`);

        // Limpiar el jugador de prueba
        console.log(`   🧹 Limpiando jugador de prueba...`);
        // Aquí podrías agregar lógica para eliminar el jugador de prueba
      } catch (err) {
        console.log(`   ❌ Error creando jugador: ${err.message}`);
      }
    }

    console.log("\n📋 3. Análisis del problema:");
    console.log("   🔍 Posibles causas:");
    console.log(
      "   1. Los jugadores se registraron antes de implementar firstName"
    );
    console.log("   2. El backend no está guardando el campo firstName");
    console.log("   3. El campo firstName no está en el esquema del backend");
    console.log("   4. Hay un problema en la lógica de registro");

    console.log("\n💡 SOLUCIONES:");
    console.log("   1. Actualizar jugadores existentes con su firstName");
    console.log("   2. Verificar que el backend acepte el campo firstName");
    console.log("   3. Probar con nuevos registros");
  } catch (err) {
    console.error("❌ Error en diagnóstico:", err.message);
  }
}

diagnosticarRegistro();
