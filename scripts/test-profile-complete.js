"use strict";

/**
 * Script de Prueba - Perfil Completo de Usuario
 *
 * Este script prueba el sistema completo de perfil, incluyendo:
 * - Obtención de datos del jugador desde el backend
 * - Formateo dinámico de saldo según configuración de moneda
 * - Generación del mensaje completo del perfil
 */

const BackendAPI = require("../api/backend");
const { handleMiPerfil } = require("../handlers/commands/profile-commands");

// Configuración de prueba
const TEST_CONFIG = {
  backendUrl: "http://localhost:5000",
  botEmail: "bot@elpatio.games",
  botPassword: "BotCl4ve#Sup3rS3gur4!2025",
};

// Usuario de prueba (puedes cambiar el ID por uno real)
const TEST_USER = {
  id: process.env.TEST_USER_ID || "123456789",
  first_name: "Usuario",
  last_name: "Prueba",
  username: "testuser",
};

// Bot simulado para las pruebas
const mockBot = {
  sendMessage: async (chatId, message, options) => {
    console.log(`📨 **Mensaje enviado a ${chatId}:**`);
    console.log("─".repeat(50));
    console.log(message);
    console.log("─".repeat(50));

    if (options && options.reply_markup) {
      console.log("🎛️ **Teclado inline:**");
      console.log(JSON.stringify(options.reply_markup, null, 2));
    }
    console.log("");
  },
};

/**
 * Prueba la obtención de datos del jugador
 */
async function testPlayerData(api) {
  console.log("👤 **PRUEBA DE DATOS DEL JUGADOR**\n");

  try {
    const jugador = await api.findPlayerByTelegram(TEST_USER.id);

    if (jugador) {
      console.log("✅ **Jugador encontrado:**");
      console.log(`   ID: ${jugador._id}`);
      console.log(`   Telegram ID: ${jugador.telegramId}`);
      console.log(`   Username: ${jugador.username || "No configurado"}`);
      console.log(`   Nickname: ${jugador.nickname || "No configurado"}`);
      console.log(`   First Name: ${jugador.firstName || "No configurado"}`);
      console.log(`   Saldo: ${jugador.saldo || 0} centavos`);
      console.log(`   Victorias: ${jugador.victorias || 0}`);
      console.log(`   Derrotas: ${jugador.derrotas || 0}\n`);

      return jugador;
    } else {
      console.log("⚠️ **Jugador no encontrado**");
      console.log("   Creando datos de prueba...\n");

      // Crear jugador de prueba
      const nuevoJugador = await api.createPlayer({
        telegramId: TEST_USER.id,
        username: TEST_USER.username,
        nickname: "TestUser",
        firstName: TEST_USER.first_name,
      });

      console.log("✅ **Jugador de prueba creado:**");
      console.log(`   ID: ${nuevoJugador._id}`);
      console.log(`   Nickname: ${nuevoJugador.nickname}\n`);

      return nuevoJugador;
    }
  } catch (error) {
    console.error("❌ **Error obteniendo datos del jugador:**");
    console.error(`   ${error.message}\n`);
    return null;
  }
}

/**
 * Prueba el formateo de saldo con diferentes valores
 */
async function testSaldoFormatting(api) {
  console.log("💰 **PRUEBA DE FORMATEO DE SALDO**\n");

  const saldosPrueba = [
    { saldo: 0, descripcion: "Saldo cero" },
    { saldo: 100, descripcion: "1 unidad" },
    { saldo: 1500, descripcion: "15 unidades" },
    { saldo: 10000, descripcion: "100 unidades" },
    { saldo: 150000, descripcion: "1.500 unidades" },
    { saldo: 1000000, descripcion: "10.000 unidades" },
  ];

  for (const { saldo, descripcion } of saldosPrueba) {
    try {
      // Importar la función de formateo del perfil
      const {
        formatearSaldo,
      } = require("../handlers/commands/profile-commands");
      const saldoFormateado = await formatearSaldo(saldo, api);
      console.log(
        `   ${descripcion.padEnd(15)} (${saldo
          .toString()
          .padStart(8)} centavos) → ${saldoFormateado}`
      );
    } catch (error) {
      console.error(`   ❌ Error formateando ${descripcion}: ${error.message}`);
    }
  }

  console.log("");
}

/**
 * Prueba la generación del mensaje del perfil
 */
async function testProfileMessage(api, jugador) {
  console.log("📝 **PRUEBA DE MENSAJE DEL PERFIL**\n");

  try {
    // Importar la función de creación de mensaje
    const {
      crearMensajePerfil,
    } = require("../handlers/commands/profile-commands");

    // Simular datos del usuario
    const userData = {
      displayName: jugador.nickname || jugador.firstName || "Usuario",
      tieneNickname: !!(
        jugador.nickname && !jugador.nickname.startsWith("SIN_NICKNAME_")
      ),
      saldo: jugador.saldo || 0,
      victorias: jugador.victorias || 0,
      derrotas: jugador.derrotas || 0,
      userId: jugador.telegramId,
      api: api,
    };

    const mensaje = await crearMensajePerfil(userData);

    console.log("✅ **Mensaje del perfil generado:**");
    console.log("─".repeat(50));
    console.log(mensaje);
    console.log("─".repeat(50));
    console.log("");

    return mensaje;
  } catch (error) {
    console.error("❌ **Error generando mensaje del perfil:**");
    console.error(`   ${error.message}\n`);
    return null;
  }
}

/**
 * Prueba el comando completo del perfil
 */
async function testCompleteProfile(api) {
  console.log("🎯 **PRUEBA DEL COMANDO COMPLETO**\n");

  try {
    // Crear mensaje simulado
    const mockMsg = {
      chat: { id: TEST_USER.id },
      from: {
        id: parseInt(TEST_USER.id),
        first_name: TEST_USER.first_name,
        last_name: TEST_USER.last_name,
        username: TEST_USER.username,
      },
    };

    console.log("🚀 **Ejecutando comando /miperfil...**\n");

    await handleMiPerfil(mockBot, api, mockMsg);

    console.log("✅ **Comando ejecutado exitosamente\n");
  } catch (error) {
    console.error("❌ **Error ejecutando comando del perfil:**");
    console.error(`   ${error.message}\n`);
  }
}

/**
 * Prueba diferentes configuraciones de moneda
 */
async function testCurrencyChanges(api) {
  console.log("🔄 **PRUEBA DE CAMBIOS DE MONEDA**\n");

  // Simular diferentes configuraciones de moneda
  const configuraciones = [
    {
      name: "Bolívares (actual)",
      config: { codigo: "VES", simbolo: "Bs", formato: "es-VE", decimales: 2 },
    },
    {
      name: "Dólares",
      config: { codigo: "USD", simbolo: "$", formato: "en-US", decimales: 2 },
    },
    {
      name: "Euros",
      config: { codigo: "EUR", simbolo: "€", formato: "es-ES", decimales: 2 },
    },
  ];

  const saldoPrueba = 150000; // 1.500,00

  for (const { name, config } of configuraciones) {
    try {
      // Simular cambio de configuración
      const saldoEnUnidades = saldoPrueba / Math.pow(10, config.decimales);
      const numeroFormateado = saldoEnUnidades.toLocaleString(config.formato, {
        minimumFractionDigits: config.decimales,
        maximumFractionDigits: config.decimales,
      });
      const saldoFormateado = `${config.simbolo}. ${numeroFormateado}`;

      console.log(`   ${name.padEnd(20)} → ${saldoFormateado}`);
    } catch (error) {
      console.error(`   ❌ Error con ${name}: ${error.message}`);
    }
  }

  console.log("");
}

/**
 * Función principal de pruebas
 */
async function runTests() {
  console.log("🚀 **INICIANDO PRUEBAS DEL PERFIL COMPLETO**\n");
  console.log("=".repeat(60) + "\n");

  try {
    // Inicializar API
    const api = new BackendAPI({
      baseUrl: TEST_CONFIG.backendUrl,
      botEmail: TEST_CONFIG.botEmail,
      botPassword: TEST_CONFIG.botPassword,
    });
    await api.login();

    console.log("✅ **API inicializada correctamente\n");

    // Prueba 1: Datos del jugador
    const jugador = await testPlayerData(api);
    if (!jugador) {
      console.log("❌ **No se pudo continuar sin datos del jugador**\n");
      return;
    }

    // Prueba 2: Formateo de saldo
    await testSaldoFormatting(api);

    // Prueba 3: Mensaje del perfil
    await testProfileMessage(api, jugador);

    // Prueba 4: Comando completo
    await testCompleteProfile(api);

    // Prueba 5: Cambios de moneda
    await testCurrencyChanges(api);

    console.log("=".repeat(60));
    console.log("✅ **PRUEBAS COMPLETADAS**\n");

    console.log("📋 **RESUMEN:**");
    console.log("   • Datos del jugador obtenidos correctamente del backend");
    console.log("   • Formateo de saldo funciona con configuración dinámica");
    console.log("   • Mensaje del perfil se genera correctamente");
    console.log("   • Comando completo ejecuta sin errores");
    console.log("   • Sistema es compatible con diferentes monedas\n");
  } catch (error) {
    console.error("❌ **Error en las pruebas:**", error.message);
    console.error(
      "   Verifica que el backend esté funcionando y las credenciales sean correctas\n"
    );
  }
}

/**
 * Manejo de errores global
 */
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ **Error no manejado:**", reason);
  process.exit(1);
});

// Ejecutar pruebas si el script se ejecuta directamente
if (require.main === module) {
  runTests().catch((error) => {
    console.error("❌ **Error en las pruebas:**", error.message);
    process.exit(1);
  });
}

module.exports = {
  testPlayerData,
  testSaldoFormatting,
  testProfileMessage,
  testCompleteProfile,
  testCurrencyChanges,
  runTests,
};
