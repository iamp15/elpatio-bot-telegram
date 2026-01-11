"use strict";

require("dotenv").config();

// Simular la configuración de roles del backend
const configRoles = {
  niveles: {
    jugador: 0,
    cajero: 1,
    bot: 2,
    sistema: 2.5,
    admin: 3,
    superadmin: 4,
  },
};

// Simular la lógica exacta del middleware
const verificarMinimo = (rolMinimo) => {
  return (req, res, next) => {
    const rolUsuario = req.user?.rol;
    const nivelUsuario = configRoles.niveles[rolUsuario];
    const nivelRequerido = configRoles.niveles[rolMinimo];

    console.log("🔍 Middleware debug:");
    console.log("   rolUsuario:", rolUsuario);
    console.log("   nivelUsuario:", nivelUsuario);
    console.log("   rolMinimo:", rolMinimo);
    console.log("   nivelRequerido:", nivelRequerido);
    console.log(
      "   nivelUsuario >= nivelRequerido:",
      nivelUsuario >= nivelRequerido
    );

    if (nivelUsuario === undefined || nivelUsuario < nivelRequerido) {
      console.log("❌ Acceso denegado");
      return res.status(403).json({ mensaje: "Acceso denegado" });
    }

    console.log("✅ Acceso permitido");
    next();
  };
};

function testMiddlewareLogic() {
  console.log("🧪 Probando lógica del middleware...");

  // Decodificar el token
  const token = process.env.BOT_JWT;
  if (!token) {
    console.error("❌ No hay token configurado");
    return;
  }

  try {
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
    console.log("   Payload completo:", payload);
    console.log("   Rol:", payload.rol);
    console.log("   Email:", payload.email);

    // Simular req.user
    const req = {
      user: {
        id: payload.id,
        email: payload.email,
        rol: payload.rol,
      },
    };

    // Simular res y next
    const res = {
      status: (code) => ({
        json: (data) => {
          console.log(`❌ Status ${code}:`, data);
          return res;
        },
      }),
    };

    const next = () => {
      console.log("✅ Next() llamado - Acceso permitido");
    };

    // Probar el middleware con rol "bot"
    console.log("\n🧪 Probando verificarMinimo('bot'):");
    const middleware = verificarMinimo("bot");
    middleware(req, res, next);

    // Probar con otros roles para comparar
    console.log("\n🧪 Probando verificarMinimo('admin'):");
    const middlewareAdmin = verificarMinimo("admin");
    middlewareAdmin(req, res, next);

    console.log("\n🧪 Probando verificarMinimo('jugador'):");
    const middlewareJugador = verificarMinimo("jugador");
    middlewareJugador(req, res, next);
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

testMiddlewareLogic();
