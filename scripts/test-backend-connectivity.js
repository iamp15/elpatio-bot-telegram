"use strict";

require("dotenv").config();
const axios = require("axios");

const BACKEND_URL = process.env.BACKEND_URL;

async function testBackendConnectivity() {
  console.log("🔍 Verificando conectividad con el backend...");
  console.log("📋 URL base:", BACKEND_URL);

  try {
    // 1. Probar conectividad básica
    console.log("\n1️⃣ Probando conectividad básica:");
    try {
      const response = await axios.get(`${BACKEND_URL}/`);
      console.log("✅ Backend responde en la raíz");
      console.log("   Status:", response.status);
    } catch (err) {
      console.log(
        `❌ Error en raíz: ${err.response?.status || err.code} - ${err.message}`
      );
    }

    // 2. Probar endpoint de salud (si existe)
    console.log("\n2️⃣ Probando endpoint de salud:");
    try {
      const response = await axios.get(`${BACKEND_URL}/health`);
      console.log("✅ Endpoint de salud responde");
      console.log("   Status:", response.status);
    } catch (err) {
      console.log(
        `❌ Endpoint de salud: ${err.response?.status || err.code} - ${
          err.message
        }`
      );
    }

    // 3. Probar endpoint de API
    console.log("\n3️⃣ Probando endpoint de API:");
    try {
      const response = await axios.get(`${BACKEND_URL}/api`);
      console.log("✅ Endpoint de API responde");
      console.log("   Status:", response.status);
    } catch (err) {
      console.log(
        `❌ Endpoint de API: ${err.response?.status || err.code} - ${
          err.message
        }`
      );
    }

    // 4. Probar endpoint específico de jugadores
    console.log("\n4️⃣ Probando endpoint de jugadores:");
    try {
      const response = await axios.get(`${BACKEND_URL}/api/jugadores`);
      console.log("✅ Endpoint de jugadores responde");
      console.log("   Status:", response.status);
    } catch (err) {
      console.log(
        `❌ Endpoint de jugadores: ${err.response?.status || err.code} - ${
          err.message
        }`
      );
    }

    // 5. Probar con timeout más largo
    console.log("\n5️⃣ Probando con timeout extendido:");
    try {
      const response = await axios.get(`${BACKEND_URL}/api/jugadores`, {
        timeout: 10000, // 10 segundos
      });
      console.log("✅ Endpoint responde con timeout extendido");
      console.log("   Status:", response.status);
    } catch (err) {
      console.log(
        `❌ Timeout extendido: ${err.response?.status || err.code} - ${
          err.message
        }`
      );
    }
  } catch (err) {
    console.error("❌ Error general:", err.message);
  }
}

testBackendConnectivity();
