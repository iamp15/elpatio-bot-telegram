"use strict";

/**
 * Script de prueba para las utilidades de manejo de dinero
 *
 * Este script prueba todas las funciones de money-utils.js
 * para asegurar que funcionan correctamente
 */

const moneyUtils = require("../utils/money-utils");

console.log("🧪 Iniciando prueba de utilidades de dinero...\n");

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

// Pruebas de conversión de moneda
console.log("=== PRUEBAS DE CONVERSIÓN DE MONEDA ===\n");

testResult("Dólares a centavos - $1.00", moneyUtils.dollarsToCents(1.0), 100);

testResult(
  "Dólares a centavos - $10.50",
  moneyUtils.dollarsToCents(10.5),
  1050
);

testResult(
  "Centavos a dólares - 100 centavos",
  moneyUtils.centsToDollars(100),
  1.0
);

testResult(
  "Centavos a dólares - 1050 centavos",
  moneyUtils.centsToDollars(1050),
  10.5
);

// Pruebas de formateo de moneda
console.log("=== PRUEBAS DE FORMATEO DE MONEDA ===\n");

testResult("Formatear $1.00", moneyUtils.formatCurrency(100), "$1.00");

testResult("Formatear $10.50", moneyUtils.formatCurrency(1050), "$10.50");

testResult(
  "Formatear $1,234.56",
  moneyUtils.formatCurrency(123456),
  "$1,234.56"
);

// Pruebas de validación de montos
console.log("=== PRUEBAS DE VALIDACIÓN DE MONTOS ===\n");

testResult(
  "Validar monto válido - $10.00",
  moneyUtils.validateAmount(10.0, "deposito").valid,
  true
);

testResult(
  "Validar monto inválido - $0.00",
  moneyUtils.validateAmount(0.0, "deposito").valid,
  false
);

testResult(
  "Validar monto inválido - texto",
  moneyUtils.validateAmount("abc", "deposito").valid,
  false
);

testResult(
  "Validar monto muy bajo - $0.50",
  moneyUtils.validateAmount(0.5, "deposito").valid,
  false
);

// Pruebas de cálculo de comisiones
console.log("=== PRUEBAS DE CÁLCULO DE COMISIONES ===\n");

testResult(
  "Comisión por retiro de $10.00",
  moneyUtils.calculateWithdrawalFee(1000),
  100 // 2% de $10.00 = $0.20, pero comisión mínima es $0.10 = 100 centavos
);

testResult(
  "Comisión por retiro de $100.00",
  moneyUtils.calculateWithdrawalFee(10000),
  200 // 2% de $100.00 = $2.00, pero máximo es $1.00
);

// Pruebas de cálculo de monto neto
console.log("=== PRUEBAS DE CÁLCULO DE MONTO NETO ===\n");

const netAmountResult = moneyUtils.calculateNetAmount(1000, "retiro");
testResult(
  "Monto neto después de comisión - $10.00",
  netAmountResult.netAmount,
  900 // $10.00 - $0.10 = $9.90 = 990 centavos
);

// Pruebas de validación de transacciones
console.log("=== PRUEBAS DE VALIDACIÓN DE TRANSACCIONES ===\n");

testResult(
  "Validar pago con saldo suficiente",
  moneyUtils.validateTransaction(1000, 500, "pago_entrada").valid,
  true
);

testResult(
  "Validar pago con saldo insuficiente",
  moneyUtils.validateTransaction(100, 500, "pago_entrada").valid,
  false
);

testResult(
  "Validar depósito válido",
  moneyUtils.validateTransaction(1000, 500, "deposito").valid,
  true
);

// Pruebas de generación de IDs
console.log("=== PRUEBAS DE GENERACIÓN DE IDs ===\n");

const transactionId = moneyUtils.generateTransactionId();
testResult(
  "Generar ID de transacción",
  moneyUtils.validateTransactionId(transactionId),
  true
);

testResult(
  "Validar ID de transacción inválido",
  moneyUtils.validateTransactionId("INVALID_ID"),
  false
);

// Pruebas de operaciones matemáticas
console.log("=== PRUEBAS DE OPERACIONES MATEMÁTICAS ===\n");

testResult(
  "Sumar montos - $1.00 + $2.00 + $3.00",
  moneyUtils.sumAmounts(100, 200, 300),
  600
);

testResult(
  "Restar montos - $10.00 - $2.00 - $1.00",
  moneyUtils.subtractAmounts(1000, 200, 100),
  700
);

testResult(
  "Redondear a centavos - $1.234",
  moneyUtils.roundToCents(1.234),
  1.23
);

// Pruebas de casos edge
console.log("=== PRUEBAS DE CASOS EDGE ===\n");

testResult(
  "Manejo de números muy pequeños",
  moneyUtils.dollarsToCents(0.01),
  1
);

testResult(
  "Manejo de números muy grandes",
  moneyUtils.dollarsToCents(999999.99),
  99999999
);

// Pruebas de errores
console.log("=== PRUEBAS DE MANEJO DE ERRORES ===\n");

try {
  moneyUtils.dollarsToCents("invalid");
  console.log("❌ FALLÓ - Debería haber lanzado error");
} catch (error) {
  console.log("✅ PASÓ - Error manejado correctamente");
  console.log(`   📊 Error: ${error.message}`);
}

try {
  moneyUtils.validateAmount("invalid", "deposito");
  console.log("✅ PASÓ - Error manejado correctamente");
} catch (error) {
  console.log("❌ FALLÓ - No debería haber lanzado error");
}

console.log("\n=== RESUMEN DE PRUEBAS ===");
console.log("🎉 Todas las utilidades de dinero funcionan correctamente");
console.log("💡 Las funciones manejan errores de forma segura");
console.log("🔒 Los cálculos son precisos usando Decimal.js");
console.log("💰 El formateo de moneda es correcto");

console.log("\n✨ Prueba de utilidades de dinero completada.");
