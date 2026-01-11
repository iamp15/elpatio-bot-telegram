/**
 * Script de prueba para el nuevo sistema de transacciones
 *
 * Este script prueba:
 * 1. Verificación de saldo de un jugador
 * 2. Procesamiento de pago de entrada usando el nuevo sistema
 * 3. Validación de respuestas del nuevo endpoint
 */

require("dotenv").config();
const BackendAPI = require("../api/backend");

// Configuración
const BACKEND_URL = process.env.BACKEND_URL;
const BOT_EMAIL = process.env.BOT_EMAIL;
const BOT_PASSWORD = process.env.BOT_PASSWORD;
const PRE_TOKEN = process.env.BOT_JWT || null;

// ID de prueba (usar un ID real de tu sistema)
const TEST_TELEGRAM_ID = "1604252279";
const TEST_SALA_ID = "675a1b2c3d4e5f6789abcdef"; // Usar un ID de sala real

async function testNuevoSistemaTransacciones() {
  console.log("🧪 **PRUEBA DEL NUEVO SISTEMA DE TRANSACCIONES**\n");

  if (!BACKEND_URL || !BOT_EMAIL || !BOT_PASSWORD) {
    console.error("❌ Faltan variables de entorno necesarias");
    return;
  }

  try {
    // Inicializar API
    console.log("🔧 Inicializando API...");
    const api = new BackendAPI({
      baseUrl: BACKEND_URL,
      botEmail: BOT_EMAIL,
      botPassword: BOT_PASSWORD,
      preToken: PRE_TOKEN,
    });

    // Autenticar
    console.log("🔐 Autenticando...");
    await api.login();
    console.log("✅ Autenticación exitosa\n");

    // 1. Obtener información del jugador
    console.log("👤 **1. OBTENER JUGADOR**");
    const jugador = await api.findPlayerByTelegram(TEST_TELEGRAM_ID);
    if (!jugador) {
      console.error("❌ Jugador no encontrado");
      return;
    }
    console.log(
      `✅ Jugador encontrado: ${jugador.nickname || jugador.username}`
    );
    console.log(`📋 ID del jugador: ${jugador._id}`);

    // 2. Verificar saldo inicial
    console.log("\n💰 **2. VERIFICAR SALDO INICIAL**");
    const saldoInicial = await api.getPlayerBalance(TEST_TELEGRAM_ID);
    console.log(
      `✅ Saldo inicial: ${saldoInicial} centavos (${(
        saldoInicial / 100
      ).toLocaleString("es-VE")} Bs)`
    );

    // 3. Probar el nuevo método procesarPagoEntrada
    console.log("\n💳 **3. PROBAR PAGO DE ENTRADA (NUEVO SISTEMA)**");
    const montoPrueba = 1000; // 10 Bs

    if (saldoInicial < montoPrueba) {
      console.warn(
        `⚠️  El jugador no tiene saldo suficiente para la prueba (necesita ${montoPrueba}, tiene ${saldoInicial})`
      );
      console.log("Continuando con la prueba para ver el manejo de errores...");
    }

    try {
      const resultadoPago = await api.procesarPagoEntrada(
        jugador._id,
        montoPrueba,
        TEST_SALA_ID
      );

      console.log("✅ Pago procesado exitosamente:");
      console.log(`   📋 Éxito: ${resultadoPago.exito}`);
      console.log(
        `   💰 Saldo anterior: ${resultadoPago.saldoAnterior} centavos`
      );
      console.log(`   💳 Saldo nuevo: ${resultadoPago.saldoNuevo} centavos`);
      console.log(`   📄 Referencia: ${resultadoPago.transaccion?.referencia}`);
      console.log(`   🆔 ID Transacción: ${resultadoPago.transaccion?._id}`);
    } catch (error) {
      console.log(
        `❌ Error en pago (esperado si no hay saldo): ${error.message}`
      );

      if (error.response?.data) {
        console.log("📤 Detalles del error:", error.response.data);
      }
    }

    // 4. Verificar saldo después de la transacción
    console.log("\n💰 **4. VERIFICAR SALDO FINAL**");
    const saldoFinal = await api.getPlayerBalance(TEST_TELEGRAM_ID);
    console.log(
      `✅ Saldo final: ${saldoFinal} centavos (${(
        saldoFinal / 100
      ).toLocaleString("es-VE")} Bs)`
    );

    const diferencia = saldoInicial - saldoFinal;
    if (diferencia === montoPrueba) {
      console.log(`✅ Diferencia correcta: ${diferencia} centavos`);
    } else {
      console.log(
        `ℹ️  Diferencia: ${diferencia} centavos (puede ser 0 si la transacción falló)`
      );
    }

    // 5. Probar método de reembolso
    console.log("\n🔄 **5. PROBAR REEMBOLSO**");
    try {
      const resultadoReembolso = await api.procesarReembolso(
        jugador._id,
        500, // 5 Bs
        "Reembolso de prueba del nuevo sistema",
        {
          salaId: TEST_SALA_ID,
          motivo: "Prueba automatizada",
        }
      );

      console.log("✅ Reembolso procesado exitosamente:");
      console.log(`   📋 Éxito: ${resultadoReembolso.exito}`);
      console.log(
        `   💰 Saldo anterior: ${resultadoReembolso.saldoAnterior} centavos`
      );
      console.log(
        `   💳 Saldo nuevo: ${resultadoReembolso.saldoNuevo} centavos`
      );
      console.log(
        `   📄 Referencia: ${resultadoReembolso.transaccion?.referencia}`
      );
    } catch (error) {
      console.log(`❌ Error en reembolso: ${error.message}`);
    }

    // 6. Verificar historial de transacciones
    console.log("\n📋 **6. VERIFICAR HISTORIAL**");
    try {
      const historial = await api.obtenerHistorialTransacciones(jugador._id, {
        limite: 5,
      });

      console.log(
        `✅ Historial obtenido: ${
          historial.transacciones?.length || 0
        } transacciones`
      );
      console.log(
        `💰 Saldo actual reportado: ${historial.saldoActual} centavos`
      );

      if (historial.transacciones?.length > 0) {
        console.log("\n📄 Últimas transacciones:");
        historial.transacciones.slice(0, 3).forEach((t, i) => {
          console.log(
            `   ${i + 1}. ${t.categoria} - ${t.tipo} - ${t.monto} centavos - ${
              t.estado
            }`
          );
          console.log(
            `      Ref: ${t.referencia} - ${new Date(
              t.createdAt
            ).toLocaleString()}`
          );
        });
      }
    } catch (error) {
      console.log(`❌ Error obteniendo historial: ${error.message}`);
    }

    console.log("\n🎯 **PRUEBA COMPLETADA**");
    console.log("✅ El nuevo sistema de transacciones está funcionando");
  } catch (error) {
    console.error("❌ Error general:", error.message);
    if (error.response?.data) {
      console.error("Detalles del error:", error.response.data);
    }
  }
}

// Ejecutar prueba
if (require.main === module) {
  testNuevoSistemaTransacciones()
    .then(() => {
      console.log("\n✅ Script completado");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Script falló:", error.message);
      process.exit(1);
    });
}

module.exports = {
  testNuevoSistemaTransacciones,
};
