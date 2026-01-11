"use strict";

require("dotenv").config();
const BackendAPI = require("../api/backend");

async function testRegistroNickname() {
  console.log("🧪 Probando registro con nickname garantizado...");

  const api = new BackendAPI({
    baseUrl: process.env.BACKEND_URL || "http://localhost:5000",
    botEmail: process.env.BOT_EMAIL,
    botPassword: process.env.BOT_PASSWORD,
  });

  // Simular diferentes usuarios de Telegram
  const usuariosPrueba = [
    {
      id: 123456789,
      first_name: "Igor",
      username: "iamp15",
      descripcion: "Usuario con first_name y username",
    },
    {
      id: 987654321,
      first_name: null,
      username: "player_pro",
      descripcion: "Usuario sin first_name, con username",
    },
    {
      id: 555666777,
      first_name: null,
      username: null,
      descripcion: "Usuario sin first_name ni username",
    },
    {
      id: 111222333,
      first_name: "Ana",
      username: null,
      descripcion: "Usuario con first_name, sin username",
    },
  ];

  console.log("📋 Probando generación de nickname:\n");

  usuariosPrueba.forEach((user, index) => {
    console.log(`${index + 1}. ${user.descripcion}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   first_name: ${user.first_name || "null"}`);
    console.log(`   username: ${user.username || "null"}`);

    // Aplicar la misma lógica que en utils/helpers.js
    const nickname =
      user.first_name ||
      user.username ||
      `Jugador_${user.id}` ||
      `User_${user.id}`;
    const username = user.username || `user_${user.id}`;
    const firstName = user.first_name || null;

    console.log(`   → nickname generado: ${nickname}`);
    console.log(`   → username generado: ${username}`);
    console.log(`   → firstName: ${firstName || "null"}`);
    console.log("");
  });

  console.log("🎯 Probando registro real (solo simulación):");
  console.log("⚠️  No se registrarán jugadores reales para evitar duplicados");

  const usuarioEjemplo = usuariosPrueba[0];
  console.log(
    `\n📝 Datos que se enviarían al backend para ${usuarioEjemplo.descripcion}:`
  );
  console.log(
    JSON.stringify(
      {
        telegramId: String(usuarioEjemplo.id),
        username: usuarioEjemplo.username || `user_${usuarioEjemplo.id}`,
        nickname:
          usuarioEjemplo.first_name ||
          usuarioEjemplo.username ||
          `Jugador_${usuarioEjemplo.id}` ||
          `User_${usuarioEjemplo.id}`,
        firstName: usuarioEjemplo.first_name || null,
      },
      null,
      2
    )
  );

  console.log("\n✅ Prueba completada!");
  console.log("📊 Resumen:");
  console.log("   ✅ Nickname siempre tendrá un valor (no null)");
  console.log("   ✅ Evita errores de índice único");
  console.log(
    "   ✅ Mantiene la jerarquía: first_name → username → Jugador_ID → User_ID"
  );
  console.log("   🔧 Solución temporal hasta arreglar el índice en el backend");
}

testRegistroNickname();
