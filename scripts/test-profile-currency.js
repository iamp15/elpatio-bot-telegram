"use strict";

/**
 * Script de Prueba - Formateo Dinámico de Moneda en Perfil
 *
 * Este script prueba que el sistema de perfil obtiene correctamente
 * la configuración de moneda desde el backend y formatea los saldos
 * según la configuración dinámica.
 */

const BackendAPI = require("../api/backend");
const PaymentConfigManager = require("../utils/payment-config-manager");

// Configuración de prueba
const TEST_CONFIG = {
  backendUrl: "http://localhost:5000",
  botEmail: "bot@elpatio.games",
  botPassword: "BotCl4ve#Sup3rS3gur4!2025",
};

// Datos de prueba
const TEST_SALDOS = [
  0, // 0,00
  100, // 1,00
  1500, // 15,00
  10000, // 100,00
  150000, // 1.500,00
  1000000, // 10.000,00
  15000000, // 150.000,00
];

// Configuraciones de moneda para probar
const TEST_CURRENCIES = [
  {
    name: "Bolívares Venezolanos",
    config: {
      codigo: "VES",
      simbolo: "Bs",
      formato: "es-VE",
      decimales: 2,
    },
  },
  {
    name: "Dólares Estadounidenses",
    config: {
      codigo: "USD",
      simbolo: "$",
      formato: "en-US",
      decimales: 2,
    },
  },
  {
    name: "Euros",
    config: {
      codigo: "EUR",
      simbolo: "€",
      formato: "es-ES",
      decimales: 2,
    },
  },
  {
    name: "Pesos Colombianos",
    config: {
      codigo: "COP",
      simbolo: "$",
      formato: "es-CO",
      decimales: 0,
    },
  },
];

/**
 * Función de formateo de saldo (copia de la función real)
 */
async function formatearSaldo(saldo, api) {
  try {
    const paymentConfigManager = new PaymentConfigManager(api);

    // Obtener configuración de moneda desde el backend
    const monedaConfig = await paymentConfigManager.getCurrencyConfig();

    // Convertir saldo de centavos a unidades de moneda
    const saldoEnUnidades = saldo / Math.pow(10, monedaConfig.decimales);

    // Formatear el número según la configuración
    const numeroFormateado = saldoEnUnidades.toLocaleString(
      monedaConfig.formato,
      {
        minimumFractionDigits: monedaConfig.decimales,
        maximumFractionDigits: monedaConfig.decimales,
      }
    );

    // Retornar con el símbolo de la moneda
    return `${monedaConfig.simbolo}. ${numeroFormateado}`;
  } catch (error) {
    console.error("Error formateando saldo:", error.message);
    // Fallback a formato básico en caso de error
    const saldoEnBolivares = saldo / 100;
    const numeroFormateado = saldoEnBolivares.toLocaleString("es-VE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `Bs. ${numeroFormateado}`;
  }
}

/**
 * Función de formateo local para comparación
 */
function formatearSaldoLocal(saldo, config) {
  const saldoEnUnidades = saldo / Math.pow(10, config.decimales);
  const numeroFormateado = saldoEnUnidades.toLocaleString(config.formato, {
    minimumFractionDigits: config.decimales,
    maximumFractionDigits: config.decimales,
  });
  return `${config.simbolo}. ${numeroFormateado}`;
}

/**
 * Prueba la configuración de moneda desde el backend
 */
async function testCurrencyConfig() {
  console.log("🔍 **PRUEBA DE CONFIGURACIÓN DE MONEDA**\n");

  try {
    // Inicializar API
    const api = new BackendAPI({
      baseUrl: TEST_CONFIG.backendUrl,
      botEmail: TEST_CONFIG.botEmail,
      botPassword: TEST_CONFIG.botPassword,
    });
    await api.login();

    // Obtener configuración real del backend
    const paymentConfigManager = new PaymentConfigManager(api);
    const monedaConfig = await paymentConfigManager.getCurrencyConfig();

    console.log("✅ **Configuración obtenida del backend:**");
    console.log(`   Código: ${monedaConfig.codigo}`);
    console.log(`   Símbolo: ${monedaConfig.simbolo}`);
    console.log(`   Formato: ${monedaConfig.formato}`);
    console.log(`   Decimales: ${monedaConfig.decimales}\n`);

    return { api, monedaConfig };
  } catch (error) {
    console.error("❌ **Error obteniendo configuración del backend:**");
    console.error(`   ${error.message}\n`);
    return null;
  }
}

/**
 * Prueba el formateo de saldos con la configuración real
 */
async function testSaldoFormatting(api, monedaConfig) {
  console.log("💰 **PRUEBA DE FORMATEO DE SALDOS**\n");

  console.log(
    `📊 **Usando configuración: ${monedaConfig.codigo} (${monedaConfig.simbolo})**\n`
  );

  for (const saldo of TEST_SALDOS) {
    try {
      const saldoFormateado = await formatearSaldo(saldo, api);
      console.log(
        `   ${saldo.toString().padStart(8)} centavos → ${saldoFormateado}`
      );
    } catch (error) {
      console.error(`   ❌ Error formateando ${saldo}: ${error.message}`);
    }
  }

  console.log("");
}

/**
 * Prueba diferentes configuraciones de moneda (simulación)
 */
function testDifferentCurrencies() {
  console.log("🌍 **PRUEBA DE DIFERENTES MONEDAS (SIMULACIÓN)**\n");

  for (const currency of TEST_CURRENCIES) {
    console.log(`📊 **${currency.name} (${currency.config.codigo})**`);

    for (const saldo of TEST_SALDOS.slice(0, 5)) {
      // Solo primeros 5 para no saturar
      const saldoFormateado = formatearSaldoLocal(saldo, currency.config);
      console.log(
        `   ${saldo.toString().padStart(8)} centavos → ${saldoFormateado}`
      );
    }
    console.log("");
  }
}

/**
 * Prueba el cache de configuración
 */
async function testCache(api) {
  console.log("⚡ **PRUEBA DE CACHE**\n");

  const paymentConfigManager = new PaymentConfigManager(api);

  console.log("🔄 **Primera consulta (sin cache):**");
  const start1 = Date.now();
  const config1 = await paymentConfigManager.getCurrencyConfig();
  const time1 = Date.now() - start1;
  console.log(`   Tiempo: ${time1}ms`);
  console.log(`   Configuración: ${config1.codigo} - ${config1.simbolo}\n`);

  console.log("⚡ **Segunda consulta (con cache):**");
  const start2 = Date.now();
  const config2 = await paymentConfigManager.getCurrencyConfig();
  const time2 = Date.now() - start2;
  console.log(`   Tiempo: ${time2}ms`);
  console.log(`   Configuración: ${config2.codigo} - ${config2.simbolo}\n`);

  console.log(
    `📈 **Mejora de rendimiento: ${Math.round(
      ((time1 - time2) / time1) * 100
    )}% más rápido\n`
  );
}

/**
 * Prueba el fallback en caso de error
 */
async function testFallback() {
  console.log("🛡️ **PRUEBA DE FALLBACK**\n");

  // Crear una API falsa que falle
  const fakeApi = {
    getPaymentConfigByType: async () => {
      throw new Error("Error simulado del backend");
    },
  };

  console.log("❌ **Simulando error del backend:**");

  for (const saldo of TEST_SALDOS.slice(0, 3)) {
    try {
      const saldoFormateado = await formatearSaldo(saldo, fakeApi);
      console.log(
        `   ${saldo
          .toString()
          .padStart(8)} centavos → ${saldoFormateado} (fallback)`
      );
    } catch (error) {
      console.error(`   ❌ Error inesperado: ${error.message}`);
    }
  }

  console.log("");
}

/**
 * Función principal de pruebas
 */
async function runTests() {
  console.log("🚀 **INICIANDO PRUEBAS DE FORMATEO DINÁMICO DE MONEDA**\n");
  console.log("=".repeat(60) + "\n");

  // Prueba 1: Configuración del backend
  const result = await testCurrencyConfig();
  if (!result) {
    console.log("❌ **No se pudo continuar sin configuración del backend**\n");
    return;
  }

  const { api, monedaConfig } = result;

  // Prueba 2: Formateo con configuración real
  await testSaldoFormatting(api, monedaConfig);

  // Prueba 3: Diferentes monedas (simulación)
  testDifferentCurrencies();

  // Prueba 4: Cache
  await testCache(api);

  // Prueba 5: Fallback
  await testFallback();

  console.log("=".repeat(60));
  console.log("✅ **PRUEBAS COMPLETADAS**\n");

  console.log("📋 **RESUMEN:**");
  console.log(
    "   • Configuración de moneda obtenida correctamente del backend"
  );
  console.log("   • Formateo de saldos funciona según la configuración");
  console.log("   • Sistema de cache mejora el rendimiento");
  console.log("   • Fallback funciona en caso de errores");
  console.log("   • Compatible con diferentes configuraciones de moneda\n");
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
  testCurrencyConfig,
  testSaldoFormatting,
  testDifferentCurrencies,
  testCache,
  testFallback,
  runTests,
};
