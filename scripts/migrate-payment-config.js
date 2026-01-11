/**
 * Script de Migración de Configuración de Pagos
 *
 * Este script migra la configuración local de pagos al backend
 * para que el bot pueda usar la nueva arquitectura de configuración
 */

require("dotenv").config();
const fs = require("fs").promises;
const path = require("path");

// Configuración del backend
const BACKEND_URL = process.env.BACKEND_URL;
const BOT_EMAIL = process.env.BOT_EMAIL;
const BOT_PASSWORD = process.env.BOT_PASSWORD;

if (!BACKEND_URL || !BOT_EMAIL || !BOT_PASSWORD) {
  console.error("❌ Faltan variables de entorno necesarias:");
  console.error("   - BACKEND_URL");
  console.error("   - BOT_EMAIL");
  console.error("   - BOT_PASSWORD");
  process.exit(1);
}

/**
 * Lee la configuración local actual
 */
async function readLocalConfig() {
  try {
    const configPath = path.join(__dirname, "../config/payment-config.js");
    const configContent = await fs.readFile(configPath, "utf8");

    // Extraer solo el objeto PAYMENT_CONFIG del archivo
    const configMatch = configContent.match(
      /const PAYMENT_CONFIG = ({[\s\S]*});/
    );
    if (!configMatch) {
      throw new Error("No se pudo parsear la configuración local");
    }

    // Evaluar el objeto de configuración de forma segura
    const configString = configMatch[1];
    // Reemplazar funciones por strings para evitar errores de evaluación
    const safeConfigString = configString.replace(
      /\([^)]*\)\s*=>\s*`[^`]*`/g,
      '""'
    );

    return eval(`(${safeConfigString})`);
  } catch (error) {
    console.error("❌ Error leyendo configuración local:", error.message);
    throw error;
  }
}

/**
 * Convierte la configuración local al formato del backend
 */
function convertToBackendFormat(localConfig) {
  const backendConfig = {
    currency: localConfig.moneda?.codigo || "VES",
    prices: {},
    limits: {},
    commissions: {
      withdrawal: {
        frequency: "weekly",
        rates: [0, 1, 2, 5],
      },
    },
  };

  // Convertir precios
  if (localConfig.precios) {
    for (const [juego, modos] of Object.entries(localConfig.precios)) {
      backendConfig.prices[juego] = {};
      for (const [modo, datos] of Object.entries(modos)) {
        // Si datos es un objeto con entrada, usar entrada, sino usar el valor directo
        backendConfig.prices[juego][modo] =
          typeof datos === "object" && datos.entrada ? datos.entrada : datos;
      }
    }
  }

  // Convertir límites
  if (localConfig.limites) {
    for (const [tipo, datos] of Object.entries(localConfig.limites)) {
      for (const [campo, valor] of Object.entries(datos)) {
        const key = `${campo}${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`;
        backendConfig.limits[key] = valor;
      }
    }
  }

  // Convertir comisiones
  if (localConfig.comisiones && localConfig.comisiones.retiro) {
    const retiro = localConfig.comisiones.retiro;

    if (retiro.frecuencia_semanal) {
      const frec = retiro.frecuencia_semanal;
      backendConfig.commissions.withdrawal.rates = [
        frec.primera_vez || 0,
        frec.segunda_vez || 1,
        frec.tercera_vez || 2,
        frec.adicional || 5,
      ];
    }
  }

  return backendConfig;
}

/**
 * Muestra la configuración que se va a migrar
 */
function displayMigrationInfo(localConfig, backendConfig) {
  console.log("\n📋 **CONFIGURACIÓN A MIGRAR**\n");

  console.log("💰 **Moneda:**", backendConfig.currency);

  console.log("\n🎮 **Precios por Juego:**");
  for (const [juego, modos] of Object.entries(backendConfig.prices)) {
    console.log(`  ${juego.toUpperCase()}:`);
    for (const [modo, precio] of Object.entries(modos)) {
      console.log(`    ${modo}: ${(precio / 100).toLocaleString("es-VE")} Bs`);
    }
  }

  console.log("\n📏 **Límites:**");
  for (const [tipo, valor] of Object.entries(backendConfig.limits)) {
    console.log(`  ${tipo}: ${(valor / 100).toLocaleString("es-VE")} Bs`);
  }

  console.log("\n💸 **Comisiones de Retiro:**");
  console.log(
    `  Frecuencia: ${backendConfig.commissions.withdrawal.frequency}`
  );
  console.log(
    `  Tasas: ${backendConfig.commissions.withdrawal.rates.join("%, ")}%`
  );
}

/**
 * Ejecuta la migración
 */
async function runMigration() {
  console.log("🚀 **INICIANDO MIGRACIÓN DE CONFIGURACIÓN DE PAGOS**\n");

  try {
    // 1. Leer configuración local
    console.log("📖 Leyendo configuración local...");
    const localConfig = await readLocalConfig();
    console.log("✅ Configuración local leída correctamente");

    // 2. Convertir al formato del backend
    console.log("\n🔄 Convirtiendo formato...");
    const backendConfig = convertToBackendFormat(localConfig);
    console.log("✅ Formato convertido correctamente");

    // 3. Mostrar información de migración
    displayMigrationInfo(localConfig, backendConfig);

    // 4. Crear archivo de migración
    const migrationPath = path.join(
      __dirname,
      "../config/migration-backup.json"
    );
    const migrationData = {
      timestamp: new Date().toISOString(),
      originalConfig: localConfig,
      backendConfig: backendConfig,
      notes: "Migración automática de configuración local a backend",
    };

    await fs.writeFile(migrationPath, JSON.stringify(migrationData, null, 2));
    console.log(`\n💾 Backup de migración guardado en: ${migrationPath}`);

    // 5. Instrucciones para el usuario
    console.log("\n📝 **INSTRUCCIONES PARA COMPLETAR LA MIGRACIÓN:**\n");
    console.log("1. Asegúrate de que el backend esté ejecutándose");
    console.log(
      "2. Verifica que los endpoints de configuración estén disponibles:"
    );
    console.log("   - GET /api/payment-config");
    console.log("   - PUT /api/payment-config");
    console.log("   - GET /api/payment-config/audit");
    console.log(
      "3. Usa el dashboard web de administración para cargar esta configuración"
    );
    console.log("4. O usa la API directamente con los datos del backup");
    console.log(
      "5. Una vez cargada en el backend, el bot usará la nueva configuración"
    );

    console.log("\n🔧 **DATOS PARA CARGAR EN EL BACKEND:**");
    console.log(JSON.stringify(backendConfig, null, 2));

    console.log("\n✅ **MIGRACIÓN PREPARADA EXITOSAMENTE**");
    console.log(
      "   La configuración está lista para ser cargada en el backend"
    );
  } catch (error) {
    console.error("\n❌ **ERROR EN LA MIGRACIÓN:**", error.message);
    process.exit(1);
  }
}

// Ejecutar migración si se llama directamente
if (require.main === module) {
  runMigration();
}

module.exports = {
  readLocalConfig,
  convertToBackendFormat,
  runMigration,
};
