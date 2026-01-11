"use strict";

require("dotenv").config();
const axios = require("axios");
const https = require("https");

const BOT_TOKEN = process.env.BOT_TOKEN;

async function testTelegramConnection() {
  console.log("🔍 Probando conexión a Telegram...");
  console.log("📋 Bot Token:", BOT_TOKEN ? "Configurado" : "No configurado");

  if (!BOT_TOKEN) {
    console.error("❌ BOT_TOKEN no configurado");
    return;
  }

  try {
    // 1. Probar con configuración por defecto
    console.log("\n1️⃣ Probando con configuración por defecto:");
    try {
      const response = await axios.get(
        `https://api.telegram.org/bot${BOT_TOKEN}/getMe`
      );
      console.log("✅ Conexión exitosa");
      console.log("   Bot:", response.data.result.username);
      console.log("   Nombre:", response.data.result.first_name);
    } catch (err) {
      console.log(`❌ Error: ${err.code || err.message}`);
    }

    // 2. Probar con timeout extendido
    console.log("\n2️⃣ Probando con timeout extendido:");
    try {
      const response = await axios.get(
        `https://api.telegram.org/bot${BOT_TOKEN}/getMe`,
        {
          timeout: 30000, // 30 segundos
        }
      );
      console.log("✅ Conexión exitosa con timeout extendido");
      console.log("   Bot:", response.data.result.username);
    } catch (err) {
      console.log(`❌ Error: ${err.code || err.message}`);
    }

    // 3. Probar con configuración de DNS personalizada
    console.log("\n3️⃣ Probando con DNS personalizado:");
    try {
      const agent = new https.Agent({
        lookup: (hostname, options, callback) => {
          // Forzar uso de DNS de Google
          const dns = require("dns");
          dns.setServers(["8.8.8.8", "8.8.4.4"]);
          dns.lookup(hostname, options, callback);
        },
      });

      const response = await axios.get(
        `https://api.telegram.org/bot${BOT_TOKEN}/getMe`,
        {
          httpsAgent: agent,
          timeout: 15000,
        }
      );
      console.log("✅ Conexión exitosa con DNS personalizado");
      console.log("   Bot:", response.data.result.username);
    } catch (err) {
      console.log(`❌ Error: ${err.code || err.message}`);
    }

    // 4. Probar con proxy (si tienes uno configurado)
    console.log("\n4️⃣ Probando con configuración de proxy:");
    try {
      const response = await axios.get(
        `https://api.telegram.org/bot${BOT_TOKEN}/getMe`,
        {
          proxy: false, // Deshabilitar proxy
          timeout: 15000,
        }
      );
      console.log("✅ Conexión exitosa sin proxy");
      console.log("   Bot:", response.data.result.username);
    } catch (err) {
      console.log(`❌ Error: ${err.code || err.message}`);
    }
  } catch (err) {
    console.error("❌ Error general:", err.message);
  }
}

testTelegramConnection();
