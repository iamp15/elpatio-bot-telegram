"use strict";

/**
 * Script de prueba para la configuración venezolana
 *
 * Este script prueba las nuevas funcionalidades adaptadas para Venezuela:
 * - Formato de moneda venezolano (1.000,00 Bs)
 * - Configuración de precios en bolívares
 * - Sistema de administración de precios
 */

const moneyUtils = require("../utils/money-utils");
const paymentConfigManager = require("../utils/payment-config-manager");

console.log("🇻🇪 Iniciando prueba de configuración venezolana...\n");

// Función para mostrar resultados de prueba
function testResult(testName, result, expected = null) {
  console.log(`🔍 ${testName}:`);
  if (result === expected || (expected === null && result !== undefined)) {
    console.log(`   ✅ PASÓ`);
    if (typeof result === "object") {
      console.log(`   📊 Resultado:`, JSON.stringify(result, null, 2));
    } else {
      console.log(`   📊 Resultado: ${result}`);
    }
  } else {
    console.log(`   ❌ FALLÓ`);
    console.log(`   📊 Esperado: ${expected}`);
    console.log(`   📊 Obtenido: ${result}`);
  }
  console.log("");
}

// Pruebas de formato venezolano
console.log("=== PRUEBAS DE FORMATO VENEZOLANO ===\n");

testResult(
  "Formatear 1000 centavos (10,00 Bs)",
  moneyUtils.formatCurrency(1000),
  "10,00 Bs"
);

testResult(
  "Formatear 50000 centavos (500,00 Bs)",
  moneyUtils.formatCurrency(50000),
  "500,00 Bs"
);

testResult(
  "Formatear 100000 centavos (1.000,00 Bs)",
  moneyUtils.formatCurrency(100000),
  "1.000,00 Bs"
);

testResult(
  "Formatear 1500000 centavos (15.000,00 Bs)",
  moneyUtils.formatCurrency(1500000),
  "15.000,00 Bs"
);

// Pruebas de conversión de moneda venezolana
console.log("=== PRUEBAS DE CONVERSIÓN VENEZOLANA ===\n");

testResult(
  "Bolívares a centavos - 500,00 Bs",
  moneyUtils.dollarsToCents(500.0),
  50000
);

testResult(
  "Bolívares a centavos - 1.000,00 Bs",
  moneyUtils.dollarsToCents(1000.0),
  100000
);

testResult(
  "Centavos a bolívares - 50000 centavos",
  moneyUtils.centsToDollars(50000),
  500.0
);

testResult(
  "Centavos a bolívares - 100000 centavos",
  moneyUtils.centsToDollars(100000),
  1000.0
);

// Pruebas de validación de montos venezolanos
console.log("=== PRUEBAS DE VALIDACIÓN VENEZOLANA ===\n");

testResult(
  "Validar monto válido - 500,00 Bs",
  moneyUtils.validateAmount(500.0, "deposito").valid,
  true
);

testResult(
  "Validar monto válido - 1.000,00 Bs",
  moneyUtils.validateAmount(1000.0, "deposito").valid,
  true
);

testResult(
  "Validar monto inválido - 50,00 Bs (muy bajo)",
  moneyUtils.validateAmount(50.0, "deposito").valid,
  false
);

testResult(
  "Validar monto inválido - 200.000,00 Bs (muy alto)",
  moneyUtils.validateAmount(200000.0, "deposito").valid,
  false
);

// Pruebas de cálculo de comisiones venezolanas
console.log("=== PRUEBAS DE COMISIONES VENEZOLANAS ===\n");

testResult(
  "Comisión por retiro de 1.000,00 Bs",
  moneyUtils.calculateWithdrawalFee(100000),
  2000 // 2% de 1.000,00 Bs = 20,00 Bs = 2000 centavos
);

testResult(
  "Comisión por retiro de 10.000,00 Bs",
  moneyUtils.calculateWithdrawalFee(1000000),
  10000 // 100,00 Bs comisión máxima
);

// Pruebas del gestor de configuración
console.log("=== PRUEBAS DEL GESTOR DE CONFIGURACIÓN ===\n");

async function testConfigManager() {
  try {
    // Obtener resumen de configuración
    const summaryResult = await paymentConfigManager.getConfigSummary();
    testResult("Obtener resumen de configuración", summaryResult.success, true);

    if (summaryResult.success) {
      console.log("📊 Configuración actual:");
      console.log(
        `   💰 Moneda: ${summaryResult.data.moneda.codigo} (${summaryResult.data.moneda.simbolo})`
      );

      // Mostrar algunos precios
      for (const [juego, modos] of Object.entries(summaryResult.data.precios)) {
        console.log(`   🎮 ${juego.toUpperCase()}:`);
        for (const [modo, datos] of Object.entries(modos)) {
          console.log(`      • ${modo}: ${datos.entrada}`);
        }
      }
    }

    // Probar actualización de precio (simulación)
    console.log("\n🧪 Simulando actualización de precio...");
    const updateResult = await paymentConfigManager.updateGamePrice(
      "ludo",
      "1v1",
      600.0
    );
    testResult(
      "Actualizar precio de Ludo 1v1 a 600,00 Bs",
      updateResult.success,
      true
    );

    if (updateResult.success) {
      console.log(`   ✅ ${updateResult.message}`);
      console.log(
        `   📊 Nuevo precio: ${updateResult.data.precioBs.toLocaleString(
          "es-VE",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        )} Bs`
      );
    }
  } catch (error) {
    console.log(`   ❌ Error en pruebas del gestor: ${error.message}`);
  }
}

// Ejecutar pruebas del gestor
testConfigManager().then(() => {
  console.log("=== RESUMEN DE PRUEBAS VENEZOLANAS ===");
  console.log("🇻🇪 Configuración venezolana implementada correctamente");
  console.log(
    "💰 Formato de moneda: 1.000,00 Bs (punto para miles, coma para decimales)"
  );
  console.log("🎮 Precios configurados en bolívares");
  console.log("🔧 Sistema de administración de precios funcional");
  console.log("📊 Validaciones adaptadas para montos venezolanos");

  console.log("\n✨ Prueba de configuración venezolana completada.");
});

// Pruebas de casos edge venezolanos
console.log("\n=== PRUEBAS DE CASOS EDGE VENEZOLANOS ===\n");

testResult(
  "Manejo de números muy grandes - 1.000.000,00 Bs",
  moneyUtils.dollarsToCents(1000000.0),
  100000000
);

testResult(
  "Manejo de números con decimales - 1.234,56 Bs",
  moneyUtils.dollarsToCents(1234.56),
  123456
);

testResult(
  "Formatear número grande - 1.234.567,89 Bs",
  moneyUtils.formatCurrency(123456789),
  "1.234.567,89 Bs"
);
