"use strict";

require("dotenv").config();
const BackendAPI = require("../api/backend");

async function testCompleteFlow() {
  console.log("🧪 Probando flujo completo: crear sala y unirse...");

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

    // 1. Crear una sala
    console.log("\n1️⃣ Creando sala...");
    const salaData = {
      juego: "ludo",
      modo: "1v1v1v1",
      configuracion: {
        entrada: 5000,
        premio: 20000,
      },
      cajeroAsignado: "admin",
    };

    const nuevaSala = await api.createSala(salaData);
    const salaId = nuevaSala.sala?._id || nuevaSala._id;
    console.log(`✅ Sala creada: ${salaId}`);

    // 2. Crear un jugador de prueba
    console.log("\n2️⃣ Creando jugador de prueba...");
    const jugadorData = {
      telegramId: "test_user_789",
      username: "test_user_789",
      nickname: "TestPlayer789",
    };

    const jugador = await api.createPlayer(jugadorData);
    const jugadorId = jugador.jugador?._id || jugador._id;
    console.log(`✅ Jugador creado: ${jugadorId}`);

    // 3. Unirse a la sala
    console.log("\n3️⃣ Uniendo jugador a la sala...");
    const joinResult = await api.joinSala(salaId, jugadorId);
    console.log("✅ Jugador unido a la sala");

    // 4. Crear pago de entrada
    console.log("\n4️⃣ Creando pago de entrada...");
    const pagoData = {
      jugador: jugadorId,
      sala: salaId,
      cajero: "admin",
      monto: 5000,
    };

    const pago = await api.createPagoEntrada(pagoData);
    console.log(`✅ Pago creado: ${pago._id || pago.id}`);

    // 5. Verificar que la sala aparece en la lista
    console.log("\n5️⃣ Verificando que la sala aparece en la lista...");
    const salas = await api.getSalasDisponibles();
    const salaEncontrada = salas.find((s) => s._id === salaId);

    if (salaEncontrada) {
      console.log("✅ La sala aparece en la lista de disponibles");
      console.log(`   Estado: ${salaEncontrada.estado}`);
      console.log(`   Jugadores: ${salaEncontrada.jugadores?.length || 0}`);
    } else {
      console.log("❌ La sala no aparece en la lista");
    }

    console.log("\n🎉 ¡Flujo completo exitoso!");
  } catch (err) {
    console.error("❌ Error en el flujo:", err.response?.data || err.message);

    if (err.response?.status) {
      console.error(`   Status: ${err.response.status}`);
    }

    if (err.response?.data) {
      console.error("   Detalles:", err.response.data);
    }
  }
}

testCompleteFlow();
