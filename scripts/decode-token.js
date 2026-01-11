"use strict";

require("dotenv").config();

function decodeToken() {
  const token = process.env.BOT_JWT;

  if (!token) {
    console.error("❌ No hay token configurado");
    return;
  }

  try {
    // Decodificar el token (sin verificar la firma)
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    const payload = JSON.parse(jsonPayload);

    console.log("🔍 Token decodificado:");
    console.log("   ID:", payload.id);
    console.log("   Email:", payload.email);
    console.log("   Rol:", payload.rol);
    console.log(
      "   IAT (creado):",
      new Date(payload.iat * 1000).toLocaleString()
    );
    console.log(
      "   EXP (expira):",
      new Date(payload.exp * 1000).toLocaleString()
    );

    // Verificar si el token ha expirado
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      console.log("❌ Token expirado");
    } else {
      console.log("✅ Token válido");
    }
  } catch (err) {
    console.error("❌ Error decodificando token:", err.message);
  }
}

decodeToken();
