/**
 * Script que simula exactamente el flujo real del bot
 * Verifica que las validaciones funcionen en el flujo real
 */

require("dotenv").config();
const BackendAPI = require("../api/backend");
const userStateManager = require("../user-state");
const { getSalasDisponibles } = require("../utils/helpers");
const BOT_CONFIG = require("../config/bot-config");

// Variables de entorno
const BACKEND_URL = process.env.BACKEND_URL;
const BOT_EMAIL = process.env.BOT_EMAIL;
const BOT_PASSWORD = process.env.BOT_PASSWORD;

if (!BACKEND_URL || !BOT_EMAIL || !BOT_PASSWORD) {
  console.error("❌ Faltan variables de entorno necesarias");
  process.exit(1);
}

async function testFlujoRealBot() {
  console.log("🧪 Simulando flujo real del bot...\n");

  try {
    // Inicializar API
    const api = new BackendAPI({
      baseUrl: BACKEND_URL,
      botEmail: BOT_EMAIL,
      botPassword: BOT_PASSWORD,
      preToken: null,
    });

    const testUserId = "test_user_real";

    console.log("👤 Simulando usuario nuevo...");

    // 1. Estado inicial (sin juego seleccionado)
    console.log("1️⃣ Estado inicial del usuario:");
    const estadoInicial = userStateManager.getSelectedGame(testUserId);
    console.log(`   Juego seleccionado: ${estadoInicial || "Ninguno"}`);

    // 2. Intentar ver salas SIN juego seleccionado (flujo real del bot)
    console.log(
      "\n2️⃣ Intentando ver salas SIN juego seleccionado (flujo real):"
    );
    try {
      // Esto es lo que hace el bot cuando el usuario presiona "Ver Salas"
      const salas = await getSalasDisponibles(null, api);
      console.log(`   Salas obtenidas: ${salas.length}`);
      console.log(
        "   ⚠️  ¡PROBLEMA! Se obtuvieron salas sin juego seleccionado"
      );
    } catch (error) {
      console.log("   ✅ Correcto: Error al obtener salas sin juego");
      console.log(`   Error: ${error.message}`);
    }

    // 3. Simular selección de juego
    console.log("\n3️⃣ Seleccionando juego...");
    const juegoDisponible = BOT_CONFIG.juegos.find((j) => j.disponible);
    if (juegoDisponible) {
      userStateManager.setSelectedGame(testUserId, juegoDisponible.id);
      console.log(`   Juego seleccionado: ${juegoDisponible.nombre}`);
    }

    // 4. Intentar ver salas CON juego seleccionado (flujo real del bot)
    console.log(
      "\n4️⃣ Intentando ver salas CON juego seleccionado (flujo real):"
    );
    try {
      // Esto es lo que hace el bot cuando el usuario presiona "Ver Salas" con juego seleccionado
      const salas = await getSalasDisponibles(juegoDisponible.id, api);
      console.log(`   Salas obtenidas: ${salas.length}`);
      if (salas.length > 0) {
        console.log("   ✅ Correcto: Se obtuvieron salas filtradas por juego");
        salas.forEach((sala) => {
          console.log(`     - ${sala.nombre || sala._id}: ${sala.juego}`);
        });
      } else {
        console.log("   ℹ️  No hay salas disponibles para este juego");
      }
    } catch (error) {
      console.log("   ❌ Error obteniendo salas:", error.message);
    }

    // 5. Verificar que el filtrado funciona correctamente
    console.log("\n5️⃣ Verificando filtrado por juego:");
    try {
      // Obtener todas las salas del backend (sin filtro)
      const todasLasSalas = await api.getSalasDisponibles();
      console.log(`   Total de salas en backend: ${todasLasSalas.length}`);

      // Filtrar por juego específico
      const salasFiltradas = todasLasSalas.filter(
        (sala) => sala.juego === juegoDisponible.id
      );
      console.log(
        `   Salas filtradas para ${juegoDisponible.nombre}: ${salasFiltradas.length}`
      );

      if (todasLasSalas.length > salasFiltradas.length) {
        console.log("   ✅ Filtrado funciona correctamente");
      } else {
        console.log("   ℹ️  Todas las salas son del mismo juego");
      }
    } catch (error) {
      console.log("   ❌ Error verificando filtrado:", error.message);
    }

    // 6. Limpiar estado
    console.log("\n6️⃣ Limpiando estado...");
    userStateManager.clearSelectedGame(testUserId);
    const estadoLimpio = userStateManager.getSelectedGame(testUserId);
    if (!estadoLimpio) {
      console.log("   ✅ Estado limpiado correctamente");
    }

    console.log("\n🎉 Prueba del flujo real completada");
  } catch (error) {
    console.error("\n❌ Error en las pruebas:", error.message);
    process.exit(1);
  }
}

// Ejecutar pruebas
testFlujoRealBot();
