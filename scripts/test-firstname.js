"use strict";

require("dotenv").config();
const BackendAPI = require("../api/backend");

async function testFirstName() {
  console.log("🧪 Probando la nueva funcionalidad firstName...");

  // Crear instancia de la API
  const api = new BackendAPI({
    baseUrl: process.env.BACKEND_URL || "http://localhost:5000",
    botEmail: process.env.BOT_EMAIL,
    botPassword: process.env.BOT_PASSWORD,
  });

  try {
    console.log("📋 Probando jerarquía de nombres actualizada:\n");

    // Simular diferentes escenarios de jugadores
    const jugadoresPrueba = [
      {
        descripcion: "Jugador con nickname (prioridad más alta)",
        jugador: {
          nickname: "Carlos",
          firstName: "Carlos Real",
          username: "carlos123",
        },
        esperado: "Carlos",
      },
      {
        descripcion: "Jugador sin nickname, con firstName",
        jugador: {
          nickname: null,
          firstName: "Igor",
          username: "iamp15",
        },
        esperado: "Igor",
      },
      {
        descripcion: "Jugador sin nickname ni firstName, con username",
        jugador: {
          nickname: null,
          firstName: null,
          username: "maria_win",
        },
        esperado: "maria_win",
      },
      {
        descripcion: "Jugador con todos los campos (firstName tiene prioridad)",
        jugador: {
          nickname: null,
          firstName: "Ana",
          username: "ana_gamer",
        },
        esperado: "Ana",
      },
    ];

    jugadoresPrueba.forEach((caso, index) => {
      console.log(`${index + 1}. ${caso.descripcion}`);

      // Aplicar la nueva jerarquía
      const nombreMostrado =
        caso.jugador.nickname ||
        caso.jugador.firstName ||
        caso.jugador.username ||
        "Jugador";

      const resultado = nombreMostrado === caso.esperado ? "✅" : "❌";
      console.log(`   Entrada: ${JSON.stringify(caso.jugador)}`);
      console.log(`   Resultado: ${nombreMostrado} ${resultado}`);
      console.log(`   Esperado: ${caso.esperado}`);
      console.log("");
    });

    console.log("🎯 Probando con el jugador real (ObjectId completo):");
    const objectIdCompleto = "68a0e03739027a8c8633146c";

    try {
      const jugador = await api.findPlayerById(objectIdCompleto);
      if (jugador) {
        console.log("   ✅ Jugador encontrado:");
        console.log(`      nickname: ${jugador.nickname || "N/A"}`);
        console.log(`      firstName: ${jugador.firstName || "N/A"}`);
        console.log(`      username: ${jugador.username || "N/A"}`);

        const nombreMostrado =
          jugador.nickname ||
          jugador.firstName ||
          jugador.username ||
          "Jugador";

        console.log(`      Nombre a mostrar: ${nombreMostrado}`);

        if (jugador.firstName) {
          console.log("   🎉 ¡El campo firstName ya está disponible!");
        } else {
          console.log(
            "   ℹ️  El campo firstName aún no está en la base de datos"
          );
          console.log(
            "   📝 Necesitas registrar un nuevo jugador o actualizar el existente"
          );
        }
      } else {
        console.log("   ❌ Jugador no encontrado");
      }
    } catch (err) {
      console.log(`   ❌ Error: ${err.message}`);
    }

    console.log("\n✅ Prueba completada!");
    console.log("📊 Jerarquía unificada implementada:");
    console.log("   1. nickname (prioridad más alta)");
    console.log("   2. firstName (nombre de Telegram)");
    console.log("   3. username");
    console.log("   4. 'Jugador' (fallback)");
  } catch (err) {
    console.error("❌ Error en la prueba:", err.message);
  }
}

testFirstName();
