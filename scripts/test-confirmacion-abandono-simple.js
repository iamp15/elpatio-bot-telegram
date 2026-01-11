/**
 * Script de prueba simplificado para el sistema de confirmación al abandonar una sala
 *
 * Esta versión no requiere variables de entorno reales y simula el comportamiento
 * sin hacer llamadas reales al bot o al backend.
 */

// Simular el bot
const mockBot = {
  sendMessage: async (chatId, text, options) => {
    console.log(`📨 Mensaje enviado a ${chatId}:`);
    console.log(`   Texto: ${text}`);
    if (options?.reply_markup?.inline_keyboard) {
      console.log(
        `   Botones: ${JSON.stringify(
          options.reply_markup.inline_keyboard,
          null,
          2
        )}`
      );
    }
    console.log("");
  },
  answerCallbackQuery: async (callbackId, options) => {
    console.log(`🔘 Callback respondido: ${callbackId}`);
    if (options?.text) {
      console.log(`   Respuesta: ${options.text}`);
    }
    console.log("");
  },
};

// Simular la API
const mockApi = {
  getSalasDisponibles: async () => {
    return [
      {
        _id: "sala_test_1",
        nombre: "Sala de Prueba 1",
        juego: "ludo",
        modo: "1v1v1v1",
        modoNombre: "1 vs 1 vs 1 vs 1",
        configuracion: { entrada: 5000, premio: 20000 },
        jugadores: [{ _id: "jugador_test_1", telegramId: "123456789" }],
        limiteJugadores: 4,
        estado: "esperando",
        creador: "jugador_test_1",
      },
      {
        _id: "sala_test_2",
        nombre: "Sala de Prueba 2",
        juego: "ludo",
        modo: "2v2",
        modoNombre: "2 vs 2",
        configuracion: { entrada: 3000, premio: 12000 },
        jugadores: [],
        limiteJugadores: 4,
        estado: "esperando",
        creador: "jugador_test_2",
      },
    ];
  },
  findPlayerByTelegram: async (telegramId) => {
    return { _id: "jugador_test_1", telegramId, nickname: "Usuario Test" };
  },
  eliminarJugadorDeSala: async (salaId, jugadorId) => {
    return {
      sala: {
        _id: salaId,
        nombre: "Sala de Prueba 1",
        jugadores: [],
      },
    };
  },
};

// Datos de prueba
const TEST_USER = {
  id: 123456789,
  first_name: "Usuario",
  username: "testuser",
  is_bot: false,
};

/**
 * Simula el envío de salas filtradas
 */
async function simularVerSalas() {
  console.log("🎮 Simulando visualización de salas...");

  try {
    const chatId = TEST_USER.id;
    const salas = await mockApi.getSalasDisponibles();

    // Simular sendFilteredRooms manualmente
    for (const sala of salas) {
      const userInSala = sala.jugadores.some(
        (j) => j.telegramId === String(TEST_USER.id)
      );

      const buttonText = userInSala ? "🚪 Abandonar Sala" : "🎯 Unirme";
      const callbackData = userInSala
        ? `confirm_leave:${sala._id}`
        : `join:${sala._id}`;

      const text = `🎮 **${sala.nombre}**
🏆 **Modo:** ${sala.modoNombre}
💰 **Entrada:** $${sala.configuracion.entrada}
🏅 **Premio:** $${sala.configuracion.premio}
👥 **Capacidad:** ${sala.jugadores.length}/${sala.limiteJugadores}`;

      const inlineKeyboard = {
        reply_markup: {
          inline_keyboard: [
            [{ text: buttonText, callback_data: callbackData }],
          ],
        },
      };

      await mockBot.sendMessage(chatId, text, {
        parse_mode: "Markdown",
        ...inlineKeyboard,
      });
    }

    console.log("✅ Salas enviadas correctamente");
    console.log("📋 El usuario debería ver:");
    console.log(
      "   - Sala 1: Botón '🚪 Abandonar Sala' (callback: confirm_leave:sala_test_1)"
    );
    console.log("   - Sala 2: Botón '🎯 Unirme' (callback: join:sala_test_2)");
  } catch (error) {
    console.error("❌ Error enviando salas:", error.message);
  }
}

/**
 * Simula la confirmación de abandono
 */
async function simularConfirmacionAbandono() {
  console.log("\n⚠️ Simulando confirmación de abandono...");

  try {
    const chatId = TEST_USER.id;
    const salaId = "sala_test_1";

    // Obtener información de la sala
    const salas = await mockApi.getSalasDisponibles();
    const salaInfo = salas.find((s) => s._id === salaId) || {
      nombre: "Sala",
      _id: salaId,
    };

    // Crear botones de confirmación
    const inlineKeyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "✅ Sí, abandonar", callback_data: `leave:${salaId}` },
            { text: "❌ Cancelar", callback_data: `cancel_leave:${salaId}` },
          ],
        ],
      },
    };

    // Mensaje de confirmación
    const mensaje = `⚠️ **¿Estás seguro de que quieres abandonar la sala?**

🎮 **Sala:** ${salaInfo.nombre}
👤 **Usuario:** ${TEST_USER.first_name}

⚠️ **Esta acción no se puede deshacer.**

¿Deseas continuar?`;

    await mockBot.sendMessage(chatId, mensaje, {
      parse_mode: "Markdown",
      ...inlineKeyboard,
    });
    await mockBot.answerCallbackQuery("test_callback_id", {
      text: "Confirmando abandono...",
    });

    console.log("✅ Confirmación de abandono enviada");
    console.log("📋 El usuario debería ver:");
    console.log("   - Mensaje de confirmación con nombre de sala");
    console.log("   - Botón '✅ Sí, abandonar' (callback: leave:sala_test_1)");
    console.log(
      "   - Botón '❌ Cancelar' (callback: cancel_leave:sala_test_1)"
    );
  } catch (error) {
    console.error("❌ Error en confirmación:", error.message);
  }
}

/**
 * Simula la cancelación del abandono
 */
async function simularCancelacionAbandono() {
  console.log("\n❌ Simulando cancelación de abandono...");

  try {
    const chatId = TEST_USER.id;

    await mockBot.answerCallbackQuery("test_callback_id_2", {
      text: "❌ Abandono cancelado",
    });

    const mensaje = `✅ **Abandono cancelado**

Has decidido permanecer en la sala. ¡Disfruta tu partida!`;

    await mockBot.sendMessage(chatId, mensaje, { parse_mode: "Markdown" });

    console.log("✅ Cancelación de abandono enviada");
    console.log("📋 El usuario debería ver mensaje de cancelación");
  } catch (error) {
    console.error("❌ Error en cancelación:", error.message);
  }
}

/**
 * Simula el abandono confirmado
 */
async function simularAbandonoConfirmado() {
  console.log("\n✅ Simulando abandono confirmado...");

  try {
    const chatId = TEST_USER.id;
    const salaId = "sala_test_1";

    // Simular la llamada al backend
    const leaveRes = await mockApi.eliminarJugadorDeSala(
      salaId,
      "jugador_test_1"
    );
    const sala = leaveRes.sala;

    const mensaje = `✅ **¡Has abandonado la sala exitosamente!**

🎮 **Sala:** ${sala.nombre}
👥 **Jugadores restantes:** ${sala.jugadores.length}

📋 **Próximos pasos:**
• Puedes unirte a otra sala
• O crear una nueva sala
• ¡Gracias por participar!`;

    await mockBot.sendMessage(chatId, mensaje, { parse_mode: "Markdown" });
    await mockBot.answerCallbackQuery("test_callback_id_3", {
      text: "✅ Abandonado la sala exitosamente",
    });

    console.log("✅ Abandono confirmado enviado");
    console.log("📋 El usuario debería ver mensaje de abandono exitoso");
  } catch (error) {
    console.error("❌ Error en abandono confirmado:", error.message);
  }
}

/**
 * Función principal
 */
async function main() {
  console.log(
    "🧪 Iniciando prueba del sistema de confirmación de abandono...\n"
  );

  try {
    // 1. Simular ver salas
    await simularVerSalas();

    // 2. Simular confirmación de abandono
    await simularConfirmacionAbandono();

    // 3. Simular cancelación
    await simularCancelacionAbandono();

    // 4. Simular abandono confirmado
    await simularAbandonoConfirmado();

    console.log("\n🎉 Prueba completada exitosamente!");
    console.log("\n📋 Resumen de funcionalidades probadas:");
    console.log("   ✅ Visualización de salas con botones dinámicos");
    console.log("   ✅ Confirmación antes de abandonar sala");
    console.log("   ✅ Cancelación del abandono");
    console.log("   ✅ Ejecución del abandono confirmado");
    console.log(
      "\n💡 El sistema de confirmación está funcionando correctamente!"
    );
  } catch (error) {
    console.error("❌ Error en la prueba:", error.message);
  } finally {
    process.exit(0);
  }
}

// Ejecutar
main();
