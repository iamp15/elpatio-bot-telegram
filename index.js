"use strict";

// IMPORTANTE: Leer BACKEND_URL ANTES de cargar dotenv para que las variables del proceso tengan prioridad
// Guardar las variables de entorno del proceso antes de que dotenv las sobrescriba
const PROCESS_BACKEND_URL = process.env.BACKEND_URL;
const PROCESS_BOT_EMAIL = process.env.BOT_EMAIL;
const PROCESS_BOT_PASSWORD = process.env.BOT_PASSWORD;

// Cargar dotenv (cargará el archivo .env del bot)
require("dotenv").config();

// Restaurar las variables del proceso si existen (tienen prioridad sobre el .env)
// Esto permite que el script dev-local.js sobrescriba BACKEND_URL
if (PROCESS_BACKEND_URL) {
  process.env.BACKEND_URL = PROCESS_BACKEND_URL;
}
if (PROCESS_BOT_EMAIL) {
  process.env.BOT_EMAIL = PROCESS_BOT_EMAIL;
}
if (PROCESS_BOT_PASSWORD) {
  process.env.BOT_PASSWORD = PROCESS_BOT_PASSWORD;
}

const TelegramBot = require("node-telegram-bot-api");
const BackendAPI = require("./api/backend");

// Obtener versión del bot desde package.json
const packageJson = require("./package.json");
const BOT_VERSION = packageJson.version;

// Importar módulos
const commands = require("./handlers/commands");
const { handleCallbackQuery } = require("./handlers/callbacks");
const { handleTextMessage } = require("./handlers/messages");

// Importar módulos de WebSocket
const BotWebSocketClient = require("./websocket/websocket-client");
const NotificationHandler = require("./websocket/notification-handler");
const PollingFallback = require("./websocket/polling-fallback");

// Variables de entorno
// Ahora process.env.BACKEND_URL tiene la prioridad correcta
const BOT_TOKEN = process.env.BOT_TOKEN;
let BACKEND_URL = process.env.BACKEND_URL;
const BOT_EMAIL = process.env.BOT_EMAIL;
const BOT_PASSWORD = process.env.BOT_PASSWORD;
const PRE_TOKEN = process.env.BOT_JWT || null;

// Debug: mostrar qué URL está usando el bot
console.log(`🔍 [DEBUG] BACKEND_URL recibida: ${BACKEND_URL}`);

// Normalizar BACKEND_URL: reemplazar localhost por 127.0.0.1 para evitar problemas con IPv6
if (BACKEND_URL && BACKEND_URL.includes('localhost')) {
  BACKEND_URL = BACKEND_URL.replace('localhost', '127.0.0.1');
  console.log(`🔍 [DEBUG] BACKEND_URL normalizada: ${BACKEND_URL}`);
}

if (!BOT_TOKEN || !BACKEND_URL) {
  console.error("Faltan variables de entorno. Revisa .env");
  process.exit(1);
}

// Inicializar bot y API
const bot = new TelegramBot(BOT_TOKEN, {
  polling: {
    interval: 300,
    autoStart: true,
    params: {
      timeout: 10,
    },
  },
  request: {
    timeout: 30000,
    proxy: false,
    // Configuración de DNS personalizada
    httpsAgent: new (require("https").Agent)({
      keepAlive: true,
      timeout: 30000,
    }),
  },
});

const api = new BackendAPI({
  baseUrl: BACKEND_URL,
  botEmail: BOT_EMAIL,
  botPassword: BOT_PASSWORD,
  preToken: PRE_TOKEN,
});

// Variables para WebSocket y polling de respaldo
let wsClient = null;
let notificationHandler = null;
let pollingFallback = null;

// Mostrar versión del bot al inicio
console.log(`🚀 Iniciando Bot de Telegram El Patio - Versión ${BOT_VERSION}`);

// Login al backend (obtiene el JWT) al iniciar
// Agregar retry con delay para esperar a que el backend esté listo
(async () => {
  const maxRetries = 5;
  const retryDelay = 3000; // 3 segundos entre intentos
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await api.ensureAuth();
      console.log("✅ Bot autenticado en el backend");

      // Mostrar información del token
      const tokenInfo = api.getTokenInfo();
      if (tokenInfo.expiresAt) {
        console.log(
          `📅 Token válido hasta: ${tokenInfo.expiresAt.toLocaleString("es-ES")}`
        );
      }

      // Inicializar WebSocket y sistema de notificaciones
      await initWebSocketSystem();
      break; // Salir del loop si fue exitoso
    } catch (err) {
      if (attempt < maxRetries) {
        console.log(`⚠️  Intento ${attempt}/${maxRetries} fallido. Reintentando en ${retryDelay/1000}s...`);
        console.log(`   Error: ${err.message}`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      } else {
        console.error("❌ Error autenticando el bot en backend después de", maxRetries, "intentos:", err.message);
        console.error(
          "⚠️  El bot continuará funcionando pero algunas funciones pueden fallar"
        );
      }
    }
  }
})();

/**
 * Inicializar sistema WebSocket y polling de respaldo
 */
async function initWebSocketSystem() {
  try {
    console.log("🔌 Inicializando sistema WebSocket...");

    // Crear instancia del cliente WebSocket
    wsClient = new BotWebSocketClient(BACKEND_URL, api);

    // Crear gestor de notificaciones
    notificationHandler = new NotificationHandler(bot, api, wsClient);

    // Crear sistema de polling de respaldo
    pollingFallback = new PollingFallback(api, notificationHandler);

    // Configurar listeners del cliente WebSocket
    wsClient.on("connected", () => {
      console.log("✅ WebSocket conectado - deteniendo polling de respaldo");
      pollingFallback.stop();
    });

    wsClient.on("disconnected", (reason) => {
      console.log(
        `⚠️ WebSocket desconectado: ${reason} - iniciando polling de respaldo`
      );
      pollingFallback.start();
    });

    wsClient.on("notificacion", async (data) => {
      await notificationHandler.handleNotificacion(data);
    });

    wsClient.on("error", (error) => {
      console.error("❌ Error en WebSocket:", error.message);
    });

    wsClient.on("max-reconnect-attempts-reached", () => {
      console.error("❌ Máximo de intentos de reconexión alcanzado");
      console.log("⚠️ Activando solo modo polling de respaldo");
      pollingFallback.start();
    });

    // Conectar WebSocket
    await wsClient.connect();
  } catch (error) {
    console.error("❌ Error inicializando sistema WebSocket:", error.message);
    console.log("⚠️ Activando modo polling de respaldo");

    // Si falla la conexión WebSocket, activar polling de respaldo
    if (!notificationHandler || !pollingFallback) {
      notificationHandler = new NotificationHandler(bot, api, null);
      pollingFallback = new PollingFallback(api, notificationHandler);
    }

    pollingFallback.start();
  }
}

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM recibido, cerrando conexiones...");
  if (wsClient) {
    wsClient.disconnect();
  }
  if (pollingFallback) {
    pollingFallback.stop();
  }
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 SIGINT recibido, cerrando conexiones...");
  if (wsClient) {
    wsClient.disconnect();
  }
  if (pollingFallback) {
    pollingFallback.stop();
  }
  process.exit(0);
});

// Monitor de estado del token (verifica cada 5 minutos)
setInterval(async () => {
  try {
    const tokenInfo = api.getTokenInfo();

    if (tokenInfo.willExpireSoon) {
      console.log(
        `⚠️ Token expirará pronto (${Math.round(
          tokenInfo.timeUntilExpiry / 60000
        )} minutos)`
      );
      console.log("🔄 Renovando token automáticamente...");
      await api.refreshToken();
    }
  } catch (error) {
    console.error("❌ Error en monitor de token:", error.message);
  }
}, 5 * 60 * 1000); // 5 minutos

// Manejo de errores global para evitar crashes
process.on("uncaughtException", (err) => {
  console.error("❌ Error no capturado:", err.message);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Promesa rechazada no manejada:", reason);
});

// Manejo específico de errores de polling del bot
bot.on("polling_error", (error) => {
  console.error("❌ Error de polling:", error.message);

  // Si es un error de DNS, intentar reconectar después de un delay
  if (
    error.message.includes("ENOTFOUND") ||
    error.message.includes("getaddrinfo")
  ) {
    console.log(
      "🔄 Error de DNS detectado, intentando reconectar en 30 segundos..."
    );
    setTimeout(() => {
      console.log("🔄 Reiniciando polling...");
      bot.stopPolling().then(() => {
        setTimeout(() => {
          bot.startPolling();
        }, 5000);
      });
    }, 30000);
  }
});

bot.on("error", (error) => {
  console.error("❌ Error del bot:", error.message);
});

// === COMANDOS ===
bot.onText(/\/start/, (msg) => commands.handleStart(bot, api, msg));
bot.onText(/\/juegos/, (msg) => commands.handleJuegos(bot, api, msg));
bot.onText(/\/salas/, (msg) => commands.handleSalas(bot, api, msg));
bot.onText(/\/ayuda/, (msg) => commands.handleAyuda(bot, api, msg));
bot.onText(/\/mijuego/, (msg) => commands.handleMiJuego(bot, api, msg));
bot.onText(/\/cambiarjuego/, (msg) =>
  commands.handleCambiarJuego(bot, api, msg)
);
bot.onText(/\/crearsala/, (msg) => commands.handleCrearSala(bot, api, msg));
bot.onText(/\/miperfil/, (msg) => commands.handleMiPerfil(bot, api, msg));

// === COMANDOS DE NOTIFICACIONES ===
bot.onText(/\/notificaciones/, (msg) =>
  commands.handleNotificaciones(bot, api, msg)
);
bot.onText(/\/eliminar_notificacion (.+)/, (msg, match) =>
  commands.handleEliminarNotificacion(bot, api, msg, match)
);

bot.onText(/\/stats/, (msg) => commands.handleStats(bot, api, msg));
bot.onText(/\/token/, (msg) => commands.handleToken(bot, api, msg));
bot.onText(/\/setwelcome/, (msg) => commands.handleSetWelcome(bot, api, msg));
bot.onText(/\/setupmeta/, (msg) => commands.handleSetupMeta(bot, api, msg));
bot.onText(/\/cleanup/, (msg) => commands.handleCleanup(bot, api, msg));
bot.onText(/\/restore/, (msg) => commands.handleRestore(bot, api, msg));

// === COMANDOS DE ADMINISTRACIÓN DE LÍMITES DE ABANDONO ===
bot.onText(/\/abandonlimits/, (msg) =>
  commands.handleAbandonLimits(bot, api, msg)
);
bot.onText(/\/abandonsystem/, (msg) =>
  commands.handleAbandonSystem(bot, api, msg)
);
bot.onText(/\/checkabandons/, (msg) =>
  commands.handleCheckAbandons(bot, api, msg)
);
bot.onText(/\/resetabandons/, (msg) =>
  commands.handleResetAbandons(bot, api, msg)
);
bot.onText(/\/debug-webapp/, (msg) =>
  commands.handleDebugWebapp(bot, api, msg)
);

// === COMANDOS DE CONSULTA DE CONFIGURACIÓN DE PRECIOS ===
bot.onText(/\/verprecios/, (msg) => commands.handleVerPrecios(bot, msg));
bot.onText(/\/verhistorial/, (msg) => commands.handleVerHistorial(bot, msg));
bot.onText(/\/vercachestats/, (msg) => commands.handleVerCacheStats(bot, msg));
bot.onText(/\/limpiarcache/, (msg) => commands.handleLimpiarCache(bot, msg));
bot.onText(/\/ayudaprecios/, (msg) => commands.handleAyudaPrecios(bot, msg));

// === CALLBACK QUERIES ===
bot.on("callback_query", (callbackQuery) =>
  handleCallbackQuery(bot, api, callbackQuery)
);

// === MENSAJES DE TEXTO ===
bot.on("message", (msg) => handleTextMessage(bot, api, msg));
