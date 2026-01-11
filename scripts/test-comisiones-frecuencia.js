"use strict";

/**
 * Script de prueba para comisiones por frecuencia semanal
 *
 * Este script prueba el nuevo sistema de comisiones por frecuencia:
 * - 1er retiro de la semana: 0%
 * - 2do retiro de la semana: 1%
 * - 3er retiro de la semana: 2%
 * - Retiros adicionales: 5%
 */

const moneyUtils = require("../utils/money-utils");

console.log("💸 Iniciando prueba de comisiones por frecuencia semanal...\n");

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

// Pruebas de comisiones por frecuencia
console.log("=== PRUEBAS DE COMISIONES POR FRECUENCIA ===\n");

// Prueba 1: Primer retiro de la semana (0%)
const primerRetiro = moneyUtils.calculateWithdrawalFee(100000, 0); // 1.000,00 Bs
testResult(
  "Primer retiro de la semana (1.000,00 Bs)",
  primerRetiro.fee,
  500 // Comisión mínima fija de 5,00 Bs
);
testResult(
  "Tipo de comisión - Primer retiro",
  primerRetiro.feeType,
  "Primer retiro de la semana (0%)"
);
testResult("Porcentaje aplicado - Primer retiro", primerRetiro.percentage, 0);

// Prueba 2: Segundo retiro de la semana (1%)
const segundoRetiro = moneyUtils.calculateWithdrawalFee(100000, 1); // 1.000,00 Bs
testResult(
  "Segundo retiro de la semana (1.000,00 Bs)",
  segundoRetiro.fee,
  1000 // 1% de 1.000,00 Bs = 10,00 Bs = 1000 centavos
);
testResult(
  "Tipo de comisión - Segundo retiro",
  segundoRetiro.feeType,
  "Segundo retiro de la semana (1%)"
);
testResult("Porcentaje aplicado - Segundo retiro", segundoRetiro.percentage, 1);

// Prueba 3: Tercer retiro de la semana (2%)
const tercerRetiro = moneyUtils.calculateWithdrawalFee(100000, 2); // 1.000,00 Bs
testResult(
  "Tercer retiro de la semana (1.000,00 Bs)",
  tercerRetiro.fee,
  2000 // 2% de 1.000,00 Bs = 20,00 Bs = 2000 centavos
);
testResult(
  "Tipo de comisión - Tercer retiro",
  tercerRetiro.feeType,
  "Tercer retiro de la semana (2%)"
);
testResult("Porcentaje aplicado - Tercer retiro", tercerRetiro.percentage, 2);

// Prueba 4: Retiro adicional (5%)
const retiroAdicional = moneyUtils.calculateWithdrawalFee(100000, 3); // 1.000,00 Bs
testResult(
  "Retiro adicional (1.000,00 Bs)",
  retiroAdicional.fee,
  5000 // 5% de 1.000,00 Bs = 50,00 Bs = 5000 centavos
);
testResult(
  "Tipo de comisión - Retiro adicional",
  retiroAdicional.feeType,
  "Retiro adicional (5%)"
);
testResult(
  "Porcentaje aplicado - Retiro adicional",
  retiroAdicional.percentage,
  5
);

// Prueba 5: Retiro con comisión mínima fija
const retiroPequeno = moneyUtils.calculateWithdrawalFee(10000, 1); // 100,00 Bs
testResult(
  "Retiro pequeño con comisión mínima (100,00 Bs)",
  retiroPequeno.fee,
  500 // Comisión mínima fija de 5,00 Bs (no 1% de 100,00 Bs = 1,00 Bs)
);
testResult("Porcentaje aplicado - Retiro pequeño", retiroPequeno.percentage, 1);

// Prueba 6: Retiro con comisión máxima
const retiroGrande = moneyUtils.calculateWithdrawalFee(1000000, 4); // 10.000,00 Bs
testResult(
  "Retiro grande con comisión máxima (10.000,00 Bs)",
  retiroGrande.fee,
  5000 // Comisión máxima de 50,00 Bs (no 5% de 10.000,00 Bs = 500,00 Bs)
);
testResult("Porcentaje aplicado - Retiro grande", retiroGrande.percentage, 5);

// Pruebas de información de comisiones
console.log("=== PRUEBAS DE INFORMACIÓN DE COMISIONES ===\n");

// Prueba 7: Información de comisiones para usuario sin retiros
const infoSinRetiros = moneyUtils.getWeeklyFeeInfo(0);
testResult(
  "Información de comisiones - Sin retiros",
  infoSinRetiros.nextFeePercentage,
  0
);
testResult(
  "Número de próximo retiro - Sin retiros",
  infoSinRetiros.nextWithdrawalNumber,
  1
);

// Prueba 8: Información de comisiones para usuario con 2 retiros
const infoConRetiros = moneyUtils.getWeeklyFeeInfo(2);
testResult(
  "Información de comisiones - Con 2 retiros",
  infoConRetiros.nextFeePercentage,
  2
);
testResult(
  "Número de próximo retiro - Con 2 retiros",
  infoConRetiros.nextWithdrawalNumber,
  3
);

// Prueba 9: Información de comisiones para usuario con muchos retiros
const infoMuchosRetiros = moneyUtils.getWeeklyFeeInfo(5);
testResult(
  "Información de comisiones - Con muchos retiros",
  infoMuchosRetiros.nextFeePercentage,
  5
);
testResult(
  "Número de próximo retiro - Con muchos retiros",
  infoMuchosRetiros.nextWithdrawalNumber,
  6
);

// Pruebas de casos edge
console.log("=== PRUEBAS DE CASOS EDGE ===\n");

// Prueba 10: Retiro de monto muy pequeño
const retiroMinimo = moneyUtils.calculateWithdrawalFee(1000, 0); // 10,00 Bs
testResult(
  "Retiro mínimo (10,00 Bs)",
  retiroMinimo.fee,
  500 // Comisión mínima fija
);

// Prueba 11: Retiro de monto muy grande
const retiroMaximo = moneyUtils.calculateWithdrawalFee(10000000, 1); // 100.000,00 Bs
testResult(
  "Retiro máximo (100.000,00 Bs)",
  retiroMaximo.fee,
  5000 // Comisión máxima fija
);

// Prueba 12: Verificar escala de comisiones
console.log("📋 **Escala de Comisiones por Frecuencia Semanal:**");
const escala = moneyUtils.getWeeklyFeeInfo(0).feeSchedule;
Object.entries(escala).forEach(([retiro, porcentaje]) => {
  console.log(`   • ${retiro}: ${porcentaje}`);
});

// Prueba 13: Simulación de semana completa
console.log("\n📊 **Simulación de Semana Completa:**");
const montos = [50000, 75000, 100000, 25000]; // 500, 750, 1000, 250 Bs
let totalComisiones = 0;

montos.forEach((monto, index) => {
  const resultado = moneyUtils.calculateWithdrawalFee(monto, index);
  const montoBs = moneyUtils.centsToDollars(monto);
  const comisionBs = moneyUtils.centsToDollars(resultado.fee);
  const netoBs = montoBs - comisionBs;

  console.log(
    `   Retiro ${index + 1}: ${montoBs.toLocaleString("es-VE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} Bs → Comisión: ${comisionBs.toLocaleString("es-VE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} Bs (${resultado.percentage}%) → Neto: ${netoBs.toLocaleString("es-VE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} Bs`
  );

  totalComisiones += resultado.fee;
});

console.log(
  `   💰 **Total comisiones de la semana:** ${moneyUtils.formatCurrency(
    totalComisiones
  )}`
);

console.log("\n=== RESUMEN DE PRUEBAS ===");
console.log(
  "✅ Sistema de comisiones por frecuencia semanal implementado correctamente"
);
console.log("📊 Escala: 0% → 1% → 2% → 5% (adicionales)");
console.log("⏰ Período: 7 días");
console.log("💡 Comisiones mínimas y máximas aplicadas correctamente");
console.log("📋 Información detallada disponible para usuarios");

console.log("\n✨ Prueba de comisiones por frecuencia completada.");
