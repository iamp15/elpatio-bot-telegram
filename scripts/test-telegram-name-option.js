"use strict";

require("dotenv").config();
const { validateNickname } = require("../utils/nickname-validator");

function testTelegramNameOption() {
  console.log("🧪 Probando la opción de usar nombre de Telegram...");

  const testCases = [
    "-no",
    "-NO",
    " -no ",
    "-no\n",
    "el-niño",
    "normal123",
    "test@123",
  ];

  console.log("\n📋 Resultados de validación:");

  testCases.forEach((input) => {
    const result = validateNickname(input);
    const status = result.valid ? "✅" : "❌";

    if (result.useTelegramName) {
      console.log(`${status} "${input}" - Usar nombre de Telegram`);
    } else if (result.valid) {
      console.log(`${status} "${input}" - Nickname válido: ${result.nickname}`);
    } else {
      console.log(`${status} "${input}" - ${result.error}`);
    }
  });

  console.log("\n🔍 Análisis:");
  console.log("• '-no' debería activar la opción de usar nombre de Telegram");
  console.log("• Los nicknames normales deberían seguir funcionando");
  console.log("• Los caracteres inválidos deberían ser rechazados");
}

testTelegramNameOption();
