#!/usr/bin/env node

/**
 * Script para probar el bot con la mini app de depósitos
 */

const { getWebAppUrl } = require("../config/webapp-config.js");

console.log("🤖 Prueba del Bot con Mini App de Depósitos\n");

try {
  // Obtener la URL de depósitos
  const depositoUrl = getWebAppUrl("DEPOSITO");

  console.log("✅ Configuración del Bot:");
  console.log(`   URL de Mini App: ${depositoUrl}\n`);

  // Verificar que la URL sea HTTPS
  if (depositoUrl.startsWith("https://")) {
    console.log("✅ La URL usa HTTPS (requerido para Telegram)");
  } else {
    console.log("❌ La URL NO usa HTTPS (requerido para Telegram)");
  }

  // Verificar que termine con /
  if (depositoUrl.endsWith("/")) {
    console.log("✅ La URL termina con / (correcto)");
  } else {
    console.log("⚠️  La URL NO termina con / (puede causar problemas)");
  }

  console.log("\n📱 Para probar el bot:");
  console.log("   1. Inicia el bot: npm run dev");
  console.log("   2. Abre Telegram y busca tu bot");
  console.log("   3. Usa el comando /start");
  console.log('   4. Ve a "Mi Perfil"');
  console.log('   5. Haz clic en "Depositar"');
  console.log("   6. Verifica que se abra la Mini App correctamente");

  console.log("\n🔗 URL de la Mini App:");
  console.log(`   ${depositoUrl}`);

  console.log("\n💡 Si la Mini App no se abre:");
  console.log("   - Verifica que el bot esté ejecutándose");
  console.log("   - Verifica que la URL sea accesible desde el navegador");
  console.log("   - Verifica que no haya errores en la consola del bot");
} catch (error) {
  console.error("❌ Error en la configuración:", error.message);
  process.exit(1);
}
