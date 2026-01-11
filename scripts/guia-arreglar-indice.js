"use strict";

console.log("🔧 GUÍA COMPLETA: Arreglar Índice de Nickname en el Backend");
console.log("=".repeat(70));

console.log("\n📁 PASO 1: LOCALIZAR EL ARCHIVO");
console.log("Busca el archivo del modelo Jugador:");
console.log("   📂 elpatio-backend/");
console.log("   📂 models/");
console.log("   📄 Jugador.js (o jugador.js)");

console.log("\n🔍 PASO 2: IDENTIFICAR EL ESQUEMA ACTUAL");
console.log("En el archivo Jugador.js, busca algo como:");
console.log("```javascript");
console.log("const jugadorSchema = new mongoose.Schema({");
console.log("  nickname: {");
console.log("    type: String,");
console.log("    unique: true,  // ← ESTE ES EL PROBLEMA");
console.log("    sparse: true");
console.log("  },");
console.log("  // ... otros campos");
console.log("});");
console.log("```");

console.log("\n⚠️  PROBLEMA ACTUAL:");
console.log("- unique: true → No permite valores null duplicados");
console.log("- sparse: true → Existe pero no está configurado correctamente");

console.log("\n✅ PASO 3: SOLUCIÓN - ACTUALIZAR EL ESQUEMA");
console.log("Cambia el campo nickname a:");
console.log("```javascript");
console.log("nickname: {");
console.log("  type: String,");
console.log("  unique: true,");
console.log("  sparse: true,");
console.log("  index: {");
console.log("    unique: true,");
console.log("    sparse: true,");
console.log("    collation: {");
console.log("      locale: 'es',");
console.log("      strength: 2");
console.log("    }");
console.log("  }");
console.log("},");
console.log("```");

console.log("\n🔧 PASO 4: ALTERNATIVA - CREAR ÍNDICE MANUALMENTE");
console.log(
  "Si prefieres crear el índice manualmente, añade esto al final del archivo:"
);
console.log("```javascript");
console.log("// Crear índice sparse para nickname");
console.log("jugadorSchema.index(");
console.log("  { nickname: 1 },");
console.log("  {");
console.log("    unique: true,");
console.log("    sparse: true,");
console.log("    collation: {");
console.log("      locale: 'es',");
console.log("      strength: 2");
console.log("    }");
console.log("  }");
console.log(");");
console.log("```");

console.log("\n🗄️  PASO 5: ELIMINAR ÍNDICE ANTIGUO (OPCIONAL)");
console.log("Si quieres ser más explícito, elimina el índice antiguo:");
console.log("```javascript");
console.log("// Eliminar índice antiguo si existe");
console.log("jugadorSchema.index({ nickname: 1 }, { background: true });");
console.log("```");

console.log("\n🚀 PASO 6: REINICIAR EL SERVIDOR");
console.log("1. Guarda el archivo Jugador.js");
console.log("2. Detén el servidor backend (Ctrl+C)");
console.log("3. Reinicia el servidor: npm start o node server.js");

console.log("\n🧪 PASO 7: VERIFICAR EL CAMBIO");
console.log("1. Conecta a MongoDB Compass o shell");
console.log("2. Ve a la colección 'jugadores'");
console.log("3. Ve a la pestaña 'Indexes'");
console.log("4. Verifica que el índice nickname tenga 'sparse: true'");

console.log("\n📋 EXPLICACIÓN TÉCNICA:");
console.log("✅ sparse: true → Solo indexa documentos que tengan el campo");
console.log("✅ unique: true → Mantiene unicidad para valores no-null");
console.log("✅ collation → Comparación case-insensitive en español");
console.log("✅ Resultado → Permite múltiples documentos con nickname: null");

console.log("\n⚠️  CONSIDERACIONES:");
console.log(
  "- Los documentos existentes con nickname: null seguirán funcionando"
);
console.log("- Nuevos documentos con nickname: null se podrán crear");
console.log("- La unicidad se mantiene para nicknames no-null");
console.log("- El índice se recreará automáticamente al reiniciar");

console.log("\n🎯 RESULTADO ESPERADO:");
console.log("✅ No más errores E11000 duplicate key error");
console.log("✅ Múltiples jugadores pueden tener nickname: null");
console.log("✅ Nicknames únicos siguen siendo únicos");
console.log("✅ El bot puede registrar jugadores sin problemas");

console.log("\n" + "=".repeat(70));
