"use strict";

require("dotenv").config();
const BackendAPI = require("../api/backend");

async function testObjectIdCompleto() {
  console.log("🎯 Probando con el ObjectId completo del jugador Igor...");

  // Crear instancia de la API
  const api = new BackendAPI({
    baseUrl: process.env.BACKEND_URL || "http://localhost:5000",
    botEmail: process.env.BOT_EMAIL,
    botPassword: process.env.BOT_PASSWORD,
  });

  try {
    const objectIdCompleto = "68a0e03739027a8c8633146c";
    const objectIdTruncado = "146c";

    console.log(`🔍 ObjectId completo: ${objectIdCompleto}`);
    console.log(`🔍 ObjectId truncado: ${objectIdTruncado}`);
    console.log("");

    // Probar con el ObjectId completo
    console.log("📋 Probando con ObjectId completo:");
    try {
      const jugador = await api.findPlayerById(objectIdCompleto);
      if (jugador) {
        console.log(`   ✅ Encontrado:`);
        console.log(`      - _id: ${jugador._id}`);
        console.log(`      - nickname: ${jugador.nickname || "N/A"}`);
        console.log(`      - first_name: ${jugador.first_name || "N/A"}`);
        console.log(`      - username: ${jugador.username || "N/A"}`);
        console.log(`      - telegramId: ${jugador.telegramId || "N/A"}`);

        // Verificar que sea el jugador correcto
        if (jugador.first_name === "Igor" && jugador.username === "iamp15") {
          console.log(`   🎉 ¡Es el jugador correcto!`);
        } else {
          console.log(`   ⚠️  No es el jugador esperado`);
        }
      } else {
        console.log(`   ❌ No encontrado`);
      }
    } catch (err) {
      console.log(`   ❌ Error: ${err.message}`);
      if (err.response) {
        console.log(`      Status: ${err.response.status}`);
        console.log(`      Data: ${JSON.stringify(err.response.data)}`);
      }
    }

    console.log("");
    console.log("📋 Probando con ObjectId truncado (para comparar):");
    try {
      const jugadorTruncado = await api.findPlayerById(objectIdTruncado);
      if (jugadorTruncado) {
        console.log(`   ✅ Encontrado (inesperado)`);
      } else {
        console.log(`   ❌ No encontrado (esperado)`);
      }
    } catch (err) {
      console.log(`   ❌ Error: ${err.message}`);
    }

    console.log("");
    console.log("✅ Prueba completada!");
    console.log("📊 Resumen:");
    console.log("   • ObjectId completo: Debería funcionar");
    console.log("   • ObjectId truncado: Debería fallar");
    console.log(
      "   • El problema original era usar solo los últimos 4 caracteres"
    );
  } catch (err) {
    console.error("❌ Error en la prueba:", err.message);
  }
}

testObjectIdCompleto();
