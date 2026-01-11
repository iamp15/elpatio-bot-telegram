"use strict";

require("dotenv").config();
const BackendAPI = require("../api/backend");

async function testCreateSala() {
  console.log("🧪 Probando creación de sala...");

  const api = new BackendAPI({
    baseUrl: process.env.BACKEND_URL,
    botEmail: process.env.BOT_EMAIL,
    botPassword: process.env.BOT_PASSWORD,
    preToken: process.env.BOT_JWT || null,
  });

  try {
    // Autenticar
    await api.ensureAuth();
    console.log("✅ Autenticación exitosa");

    // Probar diferentes valores para modo según el esquema
    const modos = ["1v1", "2v2", "1v1v1v1"];

    for (const modo of modos) {
      console.log(`\n🔄 Probando modo: "${modo}"`);

      const salaData = {
        juego: "ludo",
        modo: modo,
        configuracion: {
          entrada: 5000,
          premio: 20000,
        },
        cajeroAsignado: "admin",
      };

      try {
        const nuevaSala = await api.createSala(salaData);
        console.log(`✅ Éxito con modo: "${modo}"`);
        console.log(`   ID: ${nuevaSala._id || nuevaSala.id}`);

        // Si funciona, usar este modo en el bot
        console.log(`\n🎯 Modo válido encontrado: "${modo}"`);
        console.log("   Actualiza el bot para usar este valor");
        return;
      } catch (err) {
        console.log(`❌ Falló con modo: "${modo}"`);
        if (err.response?.data?.error) {
          console.log(`   Error: ${err.response.data.error}`);
        }
      }
    }

    console.log("\n❌ Ningún modo funcionó. Revisa el esquema del backend.");
  } catch (err) {
    console.error("❌ Error general:", err.message);
  }
}

testCreateSala();
