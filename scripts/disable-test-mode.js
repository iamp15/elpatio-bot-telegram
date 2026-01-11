"use strict";

const fs = require("fs");
const path = require("path");

function disableTestMode() {
  const envPath = path.join(__dirname, "..", ".env");

  try {
    // Leer el archivo .env
    let envContent = fs.readFileSync(envPath, "utf8");

    // Reemplazar TEST_MODE=true por TEST_MODE=false
    envContent = envContent.replace(/TEST_MODE=true/, "TEST_MODE=false");

    // Si no existe la línea TEST_MODE, agregarla
    if (!envContent.includes("TEST_MODE=")) {
      envContent += "\nTEST_MODE=false";
    }

    // Escribir el archivo actualizado
    fs.writeFileSync(envPath, envContent);

    console.log("✅ Modo TEST desactivado");
    console.log("📝 Archivo .env actualizado correctamente");
  } catch (err) {
    console.error("❌ Error actualizando .env:", err.message);
  }
}

disableTestMode();
