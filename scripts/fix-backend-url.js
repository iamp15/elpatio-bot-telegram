"use strict";

const fs = require("fs");
const path = require("path");

function fixBackendUrl() {
  const envPath = path.join(__dirname, "..", ".env");

  try {
    // Leer el archivo .env
    let envContent = fs.readFileSync(envPath, "utf8");

    // Reemplazar la línea BACKEND_URL
    envContent = envContent.replace(
      /BACKEND_URL=.*/,
      "BACKEND_URL=http://localhost:5000/api"
    );

    // Escribir el archivo corregido
    fs.writeFileSync(envPath, envContent);

    console.log("✅ BACKEND_URL corregida a: http://localhost:5000/api");
    console.log("📝 Archivo .env actualizado correctamente");
  } catch (err) {
    console.error("❌ Error corrigiendo BACKEND_URL:", err.message);
  }
}

fixBackendUrl();
