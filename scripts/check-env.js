/**
 * Script mejorado para verificar la configuración del archivo .env
 * Ejecuta: node scripts/check-env.js
 */

const {
  showEnvironmentStatus,
  isEnvironmentValid,
} = require("../config/env-config");

console.log("🔍 **VERIFICADOR DE CONFIGURACIÓN DEL ENTORNO**\n");
console.log("=".repeat(60) + "\n");

// Mostrar estado del entorno
const { errors, warnings } = showEnvironmentStatus();

// Mostrar instrucciones adicionales
if (errors.length > 0) {
  console.log("\n📋 **SOLUCIÓN DE PROBLEMAS:**");
  console.log(
    "   1. Verifica que el archivo .env existe en la raíz del proyecto"
  );
  console.log(
    "   2. Asegúrate de que todas las variables requeridas estén configuradas"
  );
  console.log("   3. Verifica que los valores sean correctos");
  console.log("   4. Ejecuta este script nuevamente para verificar");

  console.log("\n📝 **Ejemplo de archivo .env válido:**");
  console.log(`
BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
BACKEND_URL=http://localhost:5000
BOT_EMAIL=bot@elpatio.com
BOT_PASSWORD=tu_password_seguro
ADMIN_ID=123456789
TEST_MODE=false
MODE=development
  `);
}

if (warnings.length > 0) {
  console.log("\n⚠️ **RECOMENDACIONES:**");
  console.log("   • Las advertencias no impiden el funcionamiento del bot");
  console.log(
    "   • Considera ajustar los valores para optimizar el rendimiento"
  );
}

console.log("\n" + "=".repeat(60));

// Código de salida
if (errors.length === 0) {
  console.log("✅ **Verificación completada exitosamente**");
  process.exit(0);
} else {
  console.log(
    "❌ **Verificación falló - Corrige los errores antes de continuar**"
  );
  process.exit(1);
}
