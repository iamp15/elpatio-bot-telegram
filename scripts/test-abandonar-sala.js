/**
 * Script para probar la funcionalidad de abandonar sala
 * Verifica que el botón "Abandonar Sala" aparezca cuando el usuario está en la sala
 */

require("dotenv").config();
const BackendAPI = require("../api/backend");
const { sendFilteredRooms } = require("../utils/helpers");

// Variables de entorno
const BACKEND_URL = process.env.BACKEND_URL;
const BOT_EMAIL = process.env.BOT_EMAIL;
const BOT_PASSWORD = process.env.BOT_PASSWORD;

if (!BACKEND_URL || !BOT_EMAIL || !BOT_PASSWORD) {
  console.error("❌ Faltan variables de entorno necesarias");
  process.exit(1);
}

async function testAbandonarSala() {
  console.log("🧪 Probando funcionalidad de abandonar sala...\n");

  try {
    // Inicializar API
    const api = new BackendAPI({
      baseUrl: BACKEND_URL,
      botEmail: BOT_EMAIL,
      botPassword: BOT_PASSWORD,
      preToken: null,
    });

    // Simular usuario
    const mockUser = {
      id: "123456789",
      first_name: "Usuario",
      username: "testuser",
    };

    // Obtener salas disponibles
    console.log("1️⃣ Obteniendo salas disponibles...");
    const salas = await api.getSalasDisponibles();
    console.log(`   Salas encontradas: ${salas.length}`);

    if (salas.length === 0) {
      console.log("   ℹ️  No hay salas disponibles para probar");
      return;
    }

    // Mostrar información de las salas
    console.log("\n2️⃣ Información de las salas:");
    salas.forEach((sala, index) => {
      console.log(`   Sala ${index + 1}:`);
      console.log(`     ID: ${sala._id}`);
      console.log(`     Nombre: ${sala.nombre || "Sin nombre"}`);
      console.log(`     Juego: ${sala.juego}`);
      console.log(`     Jugadores: ${sala.jugadores?.length || 0}`);

      if (sala.jugadores && sala.jugadores.length > 0) {
        console.log(`     Lista de jugadores:`);
        sala.jugadores.forEach((jugador, jIndex) => {
          if (typeof jugador === "object" && jugador !== null) {
            console.log(
              `       ${jIndex + 1}. ID: ${jugador._id}, Telegram: ${
                jugador.telegramId
              }, Nombre: ${
                jugador.nickname || jugador.firstName || jugador.username
              }`
            );
          } else {
            console.log(`       ${jIndex + 1}. ID: ${jugador}`);
          }
        });
      }
    });

    // Probar la función sendFilteredRooms con usuario simulado
    console.log("\n3️⃣ Probando sendFilteredRooms con usuario simulado...");

    // Crear un bot mock para la prueba
    const mockBot = {
      sendMessage: async (chatId, text, options) => {
        console.log(`   📨 Mensaje enviado a ${chatId}:`);
        console.log(`   Texto: ${text}`);
        if (
          options &&
          options.reply_markup &&
          options.reply_markup.inline_keyboard
        ) {
          console.log(`   Botones:`);
          options.reply_markup.inline_keyboard.forEach((row, rowIndex) => {
            row.forEach((button, buttonIndex) => {
              console.log(
                `     ${rowIndex + 1}.${buttonIndex + 1}. ${button.text} (${
                  button.callback_data
                })`
              );
            });
          });
        }
        return { message_id: 1 };
      },
    };

    // Probar con diferentes juegos
    const juegosDisponibles = ["ludo", "domino", "damas"];

    for (const juego of juegosDisponibles) {
      console.log(`\n4️⃣ Probando con juego: ${juego}`);

      try {
        await sendFilteredRooms(
          mockBot,
          123456789, // chatId simulado
          salas,
          juego,
          `🎮 ${juego.charAt(0).toUpperCase() + juego.slice(1)}`,
          api,
          mockUser
        );
      } catch (error) {
        console.log(`   ❌ Error con juego ${juego}: ${error.message}`);
      }
    }

    // Probar con un usuario que está en una sala específica
    console.log("\n5️⃣ Probando con usuario en sala específica...");

    // Buscar una sala con jugadores
    const salaConJugadores = salas.find(
      (sala) => sala.jugadores && sala.jugadores.length > 0
    );

    if (salaConJugadores) {
      console.log(
        `   Usando sala: ${salaConJugadores.nombre || salaConJugadores._id}`
      );

      // Obtener el primer jugador de la sala
      const primerJugador = salaConJugadores.jugadores[0];
      let jugadorInfo = null;

      if (typeof primerJugador === "string") {
        // Es solo un ID, buscar la información
        jugadorInfo = await api.findPlayerById(primerJugador);
      } else if (typeof primerJugador === "object" && primerJugador !== null) {
        jugadorInfo = primerJugador;
      }

      if (jugadorInfo) {
        console.log(
          `   Jugador encontrado: ${
            jugadorInfo.nickname ||
            jugadorInfo.firstName ||
            jugadorInfo.username
          }`
        );
        console.log(`   Telegram ID: ${jugadorInfo.telegramId}`);

        // Crear un usuario mock que está en la sala
        const usuarioEnSala = {
          id: jugadorInfo.telegramId || "123456789",
          first_name: jugadorInfo.firstName || "Usuario",
          username: jugadorInfo.username || "testuser",
        };

        console.log(`   Probando con usuario que está en la sala...`);

        await sendFilteredRooms(
          mockBot,
          123456789,
          [salaConJugadores], // Solo esta sala
          salaConJugadores.juego,
          `🎮 ${
            salaConJugadores.juego.charAt(0).toUpperCase() +
            salaConJugadores.juego.slice(1)
          }`,
          api,
          usuarioEnSala
        );
      } else {
        console.log("   ❌ No se pudo obtener información del jugador");
      }
    } else {
      console.log("   ℹ️  No hay salas con jugadores para probar");
    }

    console.log("\n🎉 Prueba de funcionalidad de abandonar sala completada");
  } catch (error) {
    console.error("\n❌ Error en las pruebas:", error.message);
    process.exit(1);
  }
}

// Ejecutar pruebas
testAbandonarSala();
