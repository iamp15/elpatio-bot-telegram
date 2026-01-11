/**
 * Script para arreglar las credenciales del bot
 * Ejecuta: node fix-credentials.js
 */

require("dotenv").config();
const axios = require("axios");

const BACKEND_URL = process.env.BACKEND_URL;
const BOT_EMAIL = process.env.BOT_EMAIL;
const BOT_PASSWORD = process.env.BOT_PASSWORD;

async function fixCredentials() {
  console.log("🔧 Arreglando credenciales del bot");
  console.log("=".repeat(50));

  console.log("📋 Información actual:");
  console.log(`   Email: ${BOT_EMAIL}`);
  console.log(
    `   Contraseña: ${BOT_PASSWORD ? "***configurada***" : "❌ NO CONFIGURADA"}`
  );
  console.log(`   Backend: ${BACKEND_URL}`);
  console.log();

  console.log("❌ PROBLEMA IDENTIFICADO:");
  console.log("   El backend responde: 'Contraseña incorrecta'");
  console.log(
    "   Esto significa que las credenciales del bot no coinciden con las del backend."
  );
  console.log();

  console.log("🔧 SOLUCIONES POSIBLES:");
  console.log();
  console.log("1️⃣ Verificar en el backend:");
  console.log("   - Abre tu backend y verifica que existe un usuario con:");
  console.log(`     Email: ${BOT_EMAIL}`);
  console.log("   - Verifica que la contraseña coincida con la del .env");
  console.log("   - Asegúrate de que el usuario tenga permisos de admin");
  console.log();

  console.log("2️⃣ Crear/actualizar usuario bot en el backend:");
  console.log("   Si el usuario no existe, créalo con estos datos:");
  console.log(`   - Email: ${BOT_EMAIL}`);
  console.log(`   - Contraseña: ${BOT_PASSWORD}`);
  console.log("   - Rol: admin");
  console.log();

  console.log("3️⃣ Actualizar .env:");
  console.log(
    "   Si necesitas cambiar las credenciales, edita el archivo .env:"
  );
  console.log("   BOT_EMAIL=nuevo_email@ejemplo.com");
  console.log("   BOT_PASSWORD=nueva_contraseña");
  console.log();

  console.log("4️⃣ Probar con credenciales alternativas:");
  console.log("   ¿Quieres probar con credenciales diferentes?");
  console.log("   Edita este script y cambia las credenciales de prueba.");
  console.log();

  // Opción para probar credenciales alternativas
  console.log("🧪 PRUEBA RÁPIDA:");
  console.log("   ¿Tienes otras credenciales de admin que funcionen?");
  console.log("   Puedes probarlas aquí temporalmente:");

  // Comentado para seguridad - descomenta y cambia si necesitas probar
  /*
  const testEmail = "admin@ejemplo.com";
  const testPassword = "admin123";
  
  try {
    const testLogin = await axios.post(`${BACKEND_URL}/api/admin/login`, {
      email: testEmail,
      password: testPassword,
    });
    console.log("✅ Credenciales de prueba funcionan!");
  } catch (err) {
    console.log("❌ Credenciales de prueba también fallan");
  }
  */

  console.log();
  console.log("📝 PRÓXIMOS PASOS:");
  console.log("   1. Verifica las credenciales en tu backend");
  console.log("   2. Actualiza el .env si es necesario");
  console.log("   3. Ejecuta: node debug-auth.js");
  console.log("   4. Si funciona, ejecuta: node test-player-registration.js");
  console.log();
  console.log("💡 CONSEJO:");
  console.log("   Si no recuerdas la contraseña del bot, puedes:");
  console.log("   - Resetear la contraseña desde el backend");
  console.log("   - Crear un nuevo usuario bot");
  console.log("   - Usar credenciales de admin existentes temporalmente");
}

fixCredentials().catch(console.error);

