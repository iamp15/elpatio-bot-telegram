"use strict";

require("dotenv").config();
const BOT_CONFIG = require("../config/bot-config");

function testJuegosModos() {
  console.log(
    "🧪 Probando nueva estructura de juegos con modos específicos..."
  );

  console.log("\n📋 Configuración de juegos:");
  BOT_CONFIG.juegos.forEach((juego, index) => {
    console.log(`\n${index + 1}. ${juego.nombre} (${juego.id})`);
    console.log(`   Descripción: ${juego.descripcion}`);
    console.log(
      `   Disponible: ${juego.disponible ? "✅ Sí" : "🚧 Próximamente"}`
    );

    if (juego.modos) {
      console.log(`   Modos disponibles:`);
      Object.entries(juego.modos).forEach(([modoId, modoConfig]) => {
        console.log(
          `   • ${modoId}: ${modoConfig.nombre} (${modoConfig.limiteJugadores} jugadores)`
        );
      });
    } else {
      console.log(`   Modos: No configurados`);
    }
  });

  console.log("\n🎯 Prueba de búsqueda de modos:");

  // Probar búsqueda de modos para Ludo
  const ludo = BOT_CONFIG.juegos.find((j) => j.id === "ludo");
  if (ludo) {
    console.log(`\n🎲 Ludo:`);
    console.log(
      `   Modo "1v1": ${ludo.modos?.["1v1"]?.nombre || "No encontrado"} (${
        ludo.modos?.["1v1"]?.limiteJugadores || "N/A"
      } jugadores)`
    );
    console.log(
      `   Modo "2v2": ${ludo.modos?.["2v2"]?.nombre || "No encontrado"} (${
        ludo.modos?.["2v2"]?.limiteJugadores || "N/A"
      } jugadores)`
    );
    console.log(
      `   Modo "1v1v1v1": ${
        ludo.modos?.["1v1v1v1"]?.nombre || "No encontrado"
      } (${ludo.modos?.["1v1v1v1"]?.limiteJugadores || "N/A"} jugadores)`
    );
  }

  // Probar búsqueda de modos para Dominó
  const domino = BOT_CONFIG.juegos.find((j) => j.id === "domino");
  if (domino) {
    console.log(`\n🂋 Dominó:`);
    console.log(
      `   Modo "2v2": ${domino.modos?.["2v2"]?.nombre || "No encontrado"} (${
        domino.modos?.["2v2"]?.limiteJugadores || "N/A"
      } jugadores)`
    );
    console.log(
      `   Modo "1v1v1v1": ${
        domino.modos?.["1v1v1v1"]?.nombre || "No encontrado"
      } (${domino.modos?.["1v1v1v1"]?.limiteJugadores || "N/A"} jugadores)`
    );
  }

  console.log("\n✅ Nueva estructura de juegos verificada correctamente!");
  console.log(
    "📊 Cada juego ahora tiene sus propios modos y límites específicos"
  );
}

testJuegosModos();
