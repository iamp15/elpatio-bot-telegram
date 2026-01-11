/**
 * Script para probar el flujo completo de selección de juego
 * Verifica que las validaciones funcionen correctamente
 */

require("dotenv").config();
const BackendAPI = require("../api/backend");
const userStateManager = require("../user-state");
const BOT_CONFIG = require("../config/bot-config");

// Variables de entorno
const BACKEND_URL = process.env.BACKEND_URL;
const BOT_EMAIL = process.env.BOT_EMAIL;
const BOT_PASSWORD = process.env.BOT_PASSWORD;

if (!BACKEND_URL || !BOT_EMAIL || !BOT_PASSWORD) {
  console.error("❌ Faltan variables de entorno necesarias");
  process.exit(1);
}

async function testFlujoSeleccionJuego() {
  console.log("🧪 Probando flujo completo de selección de juego...\n");

  try {
    // Inicializar API
    const api = new BackendAPI({
      baseUrl: BACKEND_URL,
      botEmail: BOT_EMAIL,
      botPassword: BOT_PASSWORD,
      preToken: null,
    });

    // Simular diferentes IDs de usuario para pruebas
    const testUsers = [
      { id: "test_user_1", name: "Usuario 1" },
      { id: "test_user_2", name: "Usuario 2" },
      { id: "test_user_3", name: "Usuario 3" },
    ];

    for (const user of testUsers) {
      console.log(`\n👤 Probando con ${user.name} (ID: ${user.id})`);

      // 1. Verificar estado inicial (sin juego seleccionado)
      console.log("1️⃣ Verificando estado inicial...");
      const estadoInicial = userStateManager.getSelectedGame(user.id);
      console.log(`   Juego seleccionado: ${estadoInicial || "Ninguno"}`);

      if (estadoInicial) {
        console.log(
          "   ⚠️  ¡PROBLEMA! Usuario ya tiene juego seleccionado sin haberlo elegido"
        );
      } else {
        console.log("   ✅ Estado inicial correcto");
      }

      // 2. Intentar ver salas sin juego seleccionado
      console.log("2️⃣ Probando ver salas sin juego seleccionado...");
      try {
        const salas = await api.getSalasDisponibles();
        console.log(`   Salas disponibles: ${salas.length}`);
        console.log(
          "   ⚠️  ¡PROBLEMA! Se pudieron obtener salas sin juego seleccionado"
        );
      } catch (error) {
        console.log(
          "   ✅ Correcto: No se pueden obtener salas sin juego seleccionado"
        );
      }

      // 3. Seleccionar un juego
      console.log("3️⃣ Seleccionando juego...");
      const juegoDisponible = BOT_CONFIG.juegos.find((j) => j.disponible);
      if (juegoDisponible) {
        userStateManager.setSelectedGame(user.id, juegoDisponible.id);
        console.log(`   Juego seleccionado: ${juegoDisponible.nombre}`);

        // Verificar que se guardó correctamente
        const juegoGuardado = userStateManager.getSelectedGame(user.id);
        if (juegoGuardado === juegoDisponible.id) {
          console.log("   ✅ Juego guardado correctamente");
        } else {
          console.log("   ❌ Error: Juego no se guardó correctamente");
        }
      } else {
        console.log("   ❌ No hay juegos disponibles para probar");
        continue;
      }

      // 4. Verificar que ahora sí puede ver salas
      console.log("4️⃣ Probando ver salas con juego seleccionado...");
      try {
        const salas = await api.getSalasDisponibles();
        console.log(`   Salas disponibles: ${salas.length}`);
        console.log(
          "   ✅ Correcto: Se pueden obtener salas con juego seleccionado"
        );
      } catch (error) {
        console.log("   ❌ Error obteniendo salas:", error.message);
      }

      // 5. Limpiar estado para siguiente prueba
      console.log("5️⃣ Limpiando estado...");
      userStateManager.clearSelectedGame(user.id);
      const estadoLimpio = userStateManager.getSelectedGame(user.id);
      if (!estadoLimpio) {
        console.log("   ✅ Estado limpiado correctamente");
      } else {
        console.log("   ❌ Error: Estado no se limpió correctamente");
      }
    }

    // 6. Verificar configuración de juegos
    console.log("\n🎮 Verificando configuración de juegos...");
    console.log(`   Total de juegos configurados: ${BOT_CONFIG.juegos.length}`);
    console.log(
      `   Juegos disponibles: ${
        BOT_CONFIG.juegos.filter((j) => j.disponible).length
      }`
    );

    BOT_CONFIG.juegos.forEach((juego) => {
      console.log(
        `   - ${juego.nombre}: ${
          juego.disponible ? "✅ Disponible" : "❌ No disponible"
        }`
      );
    });

    // 7. Verificar mensajes de configuración
    console.log("\n📝 Verificando mensajes de configuración...");
    const mensajeNoJuego = BOT_CONFIG.messages.noJuegoSeleccionado;
    console.log(`   Mensaje cuando no hay juego: "${mensajeNoJuego}"`);

    if (
      mensajeNoJuego &&
      mensajeNoJuego.includes("Primero debes seleccionar")
    ) {
      console.log("   ✅ Mensaje correcto");
    } else {
      console.log("   ⚠️  Mensaje podría mejorarse");
    }

    console.log("\n🎉 Pruebas completadas");
  } catch (error) {
    console.error("\n❌ Error en las pruebas:", error.message);
    process.exit(1);
  }
}

// Ejecutar pruebas
testFlujoSeleccionJuego();
