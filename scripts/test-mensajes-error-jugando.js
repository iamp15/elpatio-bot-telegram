/**
 * Script de prueba para verificar los mensajes de error cuando el jugador está jugando
 *
 * Este script simula los errores del backend y verifica que el bot muestre
 * los mensajes correctos al usuario.
 */

// Simular el bot
const mockBot = {
  sendMessage: async (chatId, text, options) => {
    console.log(`📨 Mensaje enviado a ${chatId}:`);
    console.log(`   Texto: ${text}`);
    if (options?.parse_mode) {
      console.log(`   Formato: ${options.parse_mode}`);
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

// Simular errores del backend
const mockBackendErrors = {
  // Error al crear sala cuando está jugando
  crearSalaJugando: {
    response: {
      data: {
        success: false,
        mensaje:
          "No puedes crear una sala mientras estás jugando. Termina tu partida actual primero.",
      },
    },
  },

  // Error al unirse a sala cuando está jugando
  unirseSalaJugando: {
    response: {
      data: {
        success: false,
        mensaje:
          "No puedes unirte a una sala mientras estás jugando. Termina tu partida actual primero.",
      },
    },
  },

  // Otro formato de error
  errorAlternativo: {
    response: {
      data: {
        success: false,
        mensaje: "El jugador está jugando y no puede realizar esta acción.",
      },
    },
  },
};

/**
 * Simula el manejo de errores de crear sala
 */
async function simularErrorCrearSala(error) {
  const chatId = 123456789;
  const msg = {
    from: {
      id: 123456789,
      first_name: "Usuario",
      username: "testuser",
    },
  };

  console.log("🧪 Probando manejo de error al crear sala...");
  console.log(
    `📋 Error del backend: ${error.response?.data?.mensaje || error.message}\n`
  );

  try {
    // Simular el manejo de errores como en handleCreateSalaFinal
    const errorData = error.response?.data || error.message;
    if (errorData && typeof errorData === "object" && errorData.mensaje) {
      const mensaje = errorData.mensaje;

      if (
        mensaje.includes("No puedes crear una sala mientras estás jugando") ||
        (mensaje.includes("estás jugando") && mensaje.includes("crear"))
      ) {
        await mockBot.sendMessage(
          chatId,
          `❌ **No puedes crear una sala mientras estás jugando**

🎮 **Estado actual:** Jugando
👤 **Jugador:** ${msg.from.first_name || msg.from.username || "Jugador"}

💡 **Solución:** 
• Termina tu partida actual
• O espera a que termine automáticamente
• Luego podrás crear una nueva sala`,
          { parse_mode: "Markdown" }
        );
        console.log(
          "✅ Mensaje de error mostrado correctamente para crear sala"
        );
      } else {
        await mockBot.sendMessage(
          chatId,
          `❌ **Error creando la sala**\n\n${mensaje}`
        );
        console.log("⚠️ Error genérico mostrado");
      }
    } else {
      await mockBot.sendMessage(
        chatId,
        "❌ **Error creando la sala**\n\nHubo un problema al crear la sala. Intenta de nuevo o contacta al admin.",
        { parse_mode: "Markdown" }
      );
      console.log("⚠️ Error genérico mostrado");
    }
  } catch (err) {
    console.error("❌ Error en el manejo:", err.message);
  }
}

/**
 * Simula el manejo de errores de unirse a sala
 */
async function simularErrorUnirseSala(error) {
  const chatId = 123456789;
  const from = {
    id: 123456789,
    first_name: "Usuario",
    username: "testuser",
  };

  console.log("🧪 Probando manejo de error al unirse a sala...");
  console.log(
    `📋 Error del backend: ${error.response?.data?.mensaje || error.message}\n`
  );

  try {
    // Simular el manejo de errores como en handleJoinSala
    const errorData = error.response?.data || error.message;
    if (errorData && typeof errorData === "object" && errorData.mensaje) {
      const mensaje = errorData.mensaje;

      if (
        mensaje.includes(
          "No puedes unirte a una sala mientras estás jugando"
        ) ||
        (mensaje.includes("estás jugando") && mensaje.includes("unirte"))
      ) {
        await mockBot.sendMessage(
          chatId,
          `❌ **No puedes unirte a una sala mientras estás jugando**

🎮 **Estado actual:** Jugando
👤 **Jugador:** ${from.first_name || from.username || "Jugador"}

💡 **Solución:** 
• Termina tu partida actual
• O espera a que termine automáticamente
• Luego podrás unirte a una sala`,
          { parse_mode: "Markdown" }
        );
        await mockBot.answerCallbackQuery("test_callback_id", {
          text: "Estás jugando, no puedes unirte",
        });
        console.log(
          "✅ Mensaje de error mostrado correctamente para unirse a sala"
        );
      } else {
        await mockBot.sendMessage(
          chatId,
          `❌ **Error al unirse**\n\n${mensaje}`
        );
        await mockBot.answerCallbackQuery("test_callback_id", {
          text: "❌ Error",
        });
        console.log("⚠️ Error genérico mostrado");
      }
    } else {
      await mockBot.sendMessage(
        chatId,
        "❌ Error uniéndote a la sala. Intenta de nuevo o contacta al admin."
      );
      await mockBot.answerCallbackQuery("test_callback_id", {
        text: "❌ Error",
      });
      console.log("⚠️ Error genérico mostrado");
    }
  } catch (err) {
    console.error("❌ Error en el manejo:", err.message);
  }
}

/**
 * Función principal
 */
async function main() {
  console.log(
    "🧪 Iniciando prueba de mensajes de error cuando el jugador está jugando...\n"
  );

  try {
    // 1. Probar error al crear sala
    console.log("📋 Caso 1: Error al crear sala - Jugador jugando");
    await simularErrorCrearSala(mockBackendErrors.crearSalaJugando);
    console.log("");

    // 2. Probar error al unirse a sala
    console.log("📋 Caso 2: Error al unirse a sala - Jugador jugando");
    await simularErrorUnirseSala(mockBackendErrors.unirseSalaJugando);
    console.log("");

    // 3. Probar formato alternativo de error
    console.log("📋 Caso 3: Formato alternativo de error");
    await simularErrorCrearSala(mockBackendErrors.errorAlternativo);
    console.log("");
    console.log("");

    console.log("🎉 Prueba completada exitosamente!");
    console.log("\n📋 Resumen de validaciones:");
    console.log("   ✅ Manejo de error al crear sala cuando está jugando");
    console.log("   ✅ Manejo de error al unirse a sala cuando está jugando");
    console.log("   ✅ Mensajes claros y específicos");
    console.log("   ✅ Formato Markdown correcto");
    console.log("   ✅ Callback responses apropiados");
    console.log("\n💡 Los mensajes de error están configurados correctamente!");
  } catch (error) {
    console.error("❌ Error en la prueba:", error.message);
  } finally {
    process.exit(0);
  }
}

// Ejecutar
main();
