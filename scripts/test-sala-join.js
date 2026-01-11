"use strict";

require("dotenv").config();
const BackendAPI = require("../api/backend");

async function testSalaJoin() {
  console.log("🧪 Probando crear sala y unirse (sin pagos)...");

  const api = new BackendAPI({
    baseUrl: process.env.BACKEND_URL,
    botEmail: process.env.BOT_EMAIL,
    botPassword: process.env.BOT_PASSWORD,
    preToken: process.env.BOT_JWT || null,
  });

  try {
    // Autenticar
    await api.ensureAuth();
    console.log("✅ Autenticación exitosa");

    // 1. Crear una sala (sin cajero)
    console.log("\n1️⃣ Creando sala...");
    const salaData = {
      juego: "ludo",
      modo: "1v1v1v1",
      configuracion: {
        entrada: 5000,
        premio: 20000,
      },
      // Sin cajero por ahora
    };

    const nuevaSala = await api.createSala(salaData);
    const salaId = nuevaSala.sala?._id || nuevaSala._id;
    console.log(`✅ Sala creada: ${salaId}`);

    // 2. Crear un jugador de prueba
    console.log("\n2️⃣ Creando jugador de prueba...");
    const jugadorData = {
      telegramId: "test_user_999",
      username: "test_user_999",
      nickname: "TestPlayer999",
    };

    const jugador = await api.createPlayer(jugadorData);
    const jugadorId = jugador.jugador?._id || jugador._id;
    console.log(`✅ Jugador creado: ${jugadorId}`);

    // 3. Unirse a la sala
    console.log("\n3️⃣ Uniendo jugador a la sala...");
    const joinResult = await api.joinSala(salaId, jugadorId);
    console.log("✅ Jugador unido a la sala");

    // 4. Verificar que la sala aparece en la lista
    console.log("\n4️⃣ Verificando que la sala aparece en la lista...");
    const salas = await api.getSalasDisponibles();
    const salaEncontrada = salas.find((s) => s._id === salaId);

    if (salaEncontrada) {
      console.log("✅ La sala aparece en la lista de disponibles");
      console.log(`   Estado: ${salaEncontrada.estado}`);
      console.log(`   Jugadores: ${salaEncontrada.jugadores?.length || 0}`);
      console.log(`   Modo: ${salaEncontrada.modo}`);
      console.log(`   Entrada: $${salaEncontrada.configuracion?.entrada}`);
      console.log(`   Premio: $${salaEncontrada.configuracion?.premio}`);
    } else {
      console.log("❌ La sala no aparece en la lista");
    }

    console.log(
      "\n🎉 ¡Prueba exitosa! La sala se puede crear y unirse sin problemas."
    );
  } catch (err) {
    console.error("❌ Error en la prueba:", err.response?.data || err.message);

    if (err.response?.status) {
      console.error(`   Status: ${err.response.status}`);
    }

    if (err.response?.data) {
      console.error("   Detalles:", err.response.data);
    }
  }
}

testSalaJoin();
