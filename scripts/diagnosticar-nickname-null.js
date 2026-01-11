"use strict";

require("dotenv").config();
const BackendAPI = require("../api/backend");

async function diagnosticarNicknameNull() {
  console.log("🔍 DIAGNÓSTICO: Problema con nickname null");
  console.log("=".repeat(50));

  const api = new BackendAPI({
    baseUrl: process.env.BACKEND_URL || "http://localhost:5000",
    botEmail: process.env.BOT_EMAIL,
    botPassword: process.env.BOT_PASSWORD,
  });

  try {
    console.log("📋 Verificando jugadores existentes...");

    // Obtener todos los jugadores
    const jugadores = await api.getAllPlayers();

    console.log(`\n📊 Total de jugadores: ${jugadores.length}`);

    // Analizar nicknames
    const nicknamesNull = jugadores.filter((j) => j.nickname === null);
    const nicknamesUndefined = jugadores.filter(
      (j) => j.nickname === undefined
    );
    const nicknamesVacios = jugadores.filter((j) => j.nickname === "");
    const nicknamesConValor = jugadores.filter(
      (j) => j.nickname && j.nickname !== ""
    );

    console.log(`\n🔍 Análisis de nicknames:`);
    console.log(`   ❌ nickname: null → ${nicknamesNull.length} jugadores`);
    console.log(
      `   ❓ nickname: undefined → ${nicknamesUndefined.length} jugadores`
    );
    console.log(`   ⚠️  nickname: "" → ${nicknamesVacios.length} jugadores`);
    console.log(
      `   ✅ nickname con valor → ${nicknamesConValor.length} jugadores`
    );

    if (nicknamesNull.length > 0) {
      console.log(`\n🚨 PROBLEMA IDENTIFICADO:`);
      console.log(
        `Ya existen ${nicknamesNull.length} jugadores con nickname: null`
      );
      console.log(`Esto causa el error de índice único.`);

      console.log(`\n📝 Jugadores con nickname null:`);
      nicknamesNull.forEach((jugador, index) => {
        console.log(
          `   ${index + 1}. ID: ${jugador._id}, telegramId: ${
            jugador.telegramId
          }, username: ${jugador.username || "N/A"}`
        );
      });
    }

    console.log(`\n💡 SOLUCIONES POSIBLES:`);
    console.log(`1. ELIMINAR jugadores con nickname: null`);
    console.log(`2. ACTUALIZAR jugadores con nickname: null a un valor único`);
    console.log(
      `3. CAMBIAR la lógica del bot para nunca enviar nickname: null`
    );

    console.log(`\n🎯 RECOMENDACIÓN:`);
    console.log(
      `La solución más limpia es eliminar los jugadores con nickname: null`
    );
    console.log(
      `y dejar que el bot los registre de nuevo con la nueva lógica.`
    );
  } catch (err) {
    console.error("❌ Error diagnosticando:", err.message);
  }
}

diagnosticarNicknameNull();
