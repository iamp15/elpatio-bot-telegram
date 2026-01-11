"use strict";

require("dotenv").config();
const BackendAPI = require("../api/backend");

async function testBusquedaJugadores() {
  console.log("🧪 Probando búsqueda de jugadores por ID...");

  // Crear instancia de la API
  const api = new BackendAPI({
    baseUrl: process.env.BACKEND_URL || "http://localhost:5000",
    botEmail: process.env.BOT_EMAIL,
    botPassword: process.env.BOT_PASSWORD,
  });

  try {
    // Simular datos de una sala con jugadores
    const salaPrueba = {
      _id: "1474",
      juego: "ludo",
      modo: "1v1v1v1",
      configuracion: { entrada: 5000, premio: 20000 },
      jugadores: [
        "146c", // Jugador con first_name: "Igor", username: "iamp15"
        { nickname: "Carlos", username: "carlos123", first_name: "Carlos" },
        { first_name: "Ana", username: "ana_gamer" },
        "507f1f77bcf86cd799439011", // Jugador que no existe
      ],
    };

    console.log("\n📋 Probando diferentes tipos de jugadores:\n");

    for (let i = 0; i < salaPrueba.jugadores.length; i++) {
      const jugador = salaPrueba.jugadores[i];
      console.log(`${i + 1}. Jugador: ${JSON.stringify(jugador)}`);

      let nombreMostrado;

      // Aplicar la nueva lógica
      if (typeof jugador === "object" && jugador !== null) {
        nombreMostrado =
          jugador.nickname ||
          jugador.first_name ||
          jugador.username ||
          "Jugador";
        console.log(`   Tipo: Objeto completo`);
        console.log(`   Resultado: ${nombreMostrado}`);
      } else if (typeof jugador === "string") {
        console.log(`   Tipo: ID (${jugador})`);
        console.log(`   Buscando en backend...`);

        try {
          const jugadorCompleto = await api.findPlayerById(jugador);
          if (jugadorCompleto) {
            nombreMostrado =
              jugadorCompleto.nickname ||
              jugadorCompleto.first_name ||
              jugadorCompleto.username ||
              "Jugador";
            console.log(`   ✅ Encontrado: ${nombreMostrado}`);
            console.log(
              `   Datos: nickname=${jugadorCompleto.nickname}, first_name=${jugadorCompleto.first_name}, username=${jugadorCompleto.username}`
            );
          } else {
            nombreMostrado = "Jugador";
            console.log(
              `   ❌ No encontrado, usando fallback: ${nombreMostrado}`
            );
          }
        } catch (err) {
          nombreMostrado = "Jugador";
          console.log(`   ❌ Error buscando: ${err.message}`);
          console.log(`   Usando fallback: ${nombreMostrado}`);
        }
      } else {
        nombreMostrado = "Jugador";
        console.log(`   Tipo: Desconocido`);
        console.log(`   Resultado: ${nombreMostrado}`);
      }

      console.log("");
    }

    console.log("✅ Prueba de búsqueda de jugadores completada!");
    console.log("📊 Resumen:");
    console.log(
      "   • Jugadores con objetos completos: Se muestran directamente"
    );
    console.log("   • Jugadores con IDs: Se buscan en el backend");
    console.log("   • Fallback: 'Jugador' si no se encuentra información");
  } catch (err) {
    console.error("❌ Error en la prueba:", err.message);
  }
}

testBusquedaJugadores();
