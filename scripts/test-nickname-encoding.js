"use strict";

require("dotenv").config();
const { validateNickname } = require("../utils/nickname-validator");

function testNicknameEncoding() {
  console.log("🧪 Probando nicknames con caracteres especiales...");

  const testNicknames = [
    "el-niño",
    "niño123",
    "español",
    "cañón",
    "año2024",
    "niño_bueno",
    "español-123",
    "test-ñ-test",
    "normal123",
    "test_normal",
    "test-normal",
    "test123",
    "test@123", // Carácter no permitido
    "test#123", // Carácter no permitido
    "test 123", // Espacio no permitido
  ];

  console.log("\n📋 Resultados de validación:");
  
  testNicknames.forEach((nickname) => {
    const result = validateNickname(nickname);
    const status = result.valid ? "✅" : "❌";
    console.log(`${status} "${nickname}" - ${result.valid ? "Válido" : result.error}`);
  });

  console.log("\n🔍 Análisis:");
  console.log("• Los nicknames con 'ñ' ahora deberían ser válidos");
  console.log("• Los caracteres especiales del español están permitidos");
  console.log("• Solo se permiten letras, números, guiones y guiones bajos");
}

testNicknameEncoding();
