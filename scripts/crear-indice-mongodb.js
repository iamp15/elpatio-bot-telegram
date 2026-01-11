"use strict";

console.log("🗄️ COMANDOS PARA CREAR ÍNDICE EN MONGODB ATLAS");
console.log("=".repeat(60));

console.log("\n📋 PASO 1: ELIMINAR ÍNDICE ACTUAL");
console.log("En MongoDB Atlas:");
console.log("1. Ve a tu cluster");
console.log("2. Click en 'Browse Collections'");
console.log("3. Selecciona la base de datos 'elpatio'");
console.log("4. Selecciona la colección 'jugadores'");
console.log("5. Ve a la pestaña 'Indexes'");
console.log("6. Encuentra el índice 'nickname_1'");
console.log("7. Click en el ícono de basura para eliminarlo");

console.log("\n🔧 PASO 2: CREAR NUEVO ÍNDICE");
console.log(
  "En MongoDB Atlas, ve a la pestaña 'Indexes' y click en 'Create Index'"
);
console.log("O usa el comando en la consola de MongoDB:");

console.log("\n📝 COMANDO COMPLETO:");
console.log("```javascript");
console.log("db.jugadores.createIndex(");
console.log('  { "nickname": 1 },');
console.log("  {");
console.log('    "unique": true,');
console.log('    "sparse": true,');
console.log('    "collation": {');
console.log('      "locale": "es",');
console.log('      "caseLevel": false,');
console.log('      "caseFirst": "off",');
console.log('      "strength": 2,');
console.log('      "numericOrdering": false,');
console.log('      "alternate": "non-ignorable",');
console.log('      "maxVariable": "punct",');
console.log('      "normalization": false,');
console.log('      "backwards": false');
console.log("    },");
console.log('    "name": "nickname_1"');
console.log("  }");
console.log(")");
console.log("```");

console.log("\n🧪 PASO 3: VERIFICAR EL ÍNDICE");
console.log("Para verificar que se creó correctamente:");
console.log("```javascript");
console.log("db.jugadores.getIndexes()");
console.log("```");

console.log("\n✅ RESULTADO ESPERADO:");
console.log("Deberías ver algo como:");
console.log("```json");
console.log("{");
console.log('  "v": 2,');
console.log('  "key": { "nickname": 1 },');
console.log('  "name": "nickname_1",');
console.log('  "unique": true,');
console.log('  "sparse": true,');
console.log('  "collation": {');
console.log('    "locale": "es",');
console.log('    "caseLevel": false,');
console.log('    "caseFirst": "off",');
console.log('    "strength": 2,');
console.log('    "numericOrdering": false,');
console.log('    "alternate": "non-ignorable",');
console.log('    "maxVariable": "punct",');
console.log('    "normalization": false,');
console.log('    "backwards": false');
console.log("  }");
console.log("}");
console.log("```");

console.log("\n🎯 PASO 4: PROBAR EL ÍNDICE");
console.log("Para probar que funciona:");
console.log("```javascript");
console.log("// Esto debería funcionar (múltiples null)");
console.log('db.jugadores.insertOne({ telegramId: "123", nickname: null })');
console.log('db.jugadores.insertOne({ telegramId: "456", nickname: null })');
console.log("");
console.log("// Esto debería fallar (nickname duplicado)");
console.log('db.jugadores.insertOne({ telegramId: "789", nickname: "test" })');
console.log('db.jugadores.insertOne({ telegramId: "999", nickname: "test" })');
console.log("```");

console.log("\n📋 EXPLICACIÓN DE PARÁMETROS:");
console.log("✅ unique: true → Mantiene unicidad para valores no-null");
console.log("✅ sparse: true → Solo indexa documentos con el campo presente");
console.log("✅ collation → Comparación case-insensitive en español");
console.log('✅ name: "nickname_1" → Mantiene el mismo nombre del índice');

console.log("\n⚠️  IMPORTANTE:");
console.log("- El índice se creará en segundo plano");
console.log(
  "- Puede tomar unos minutos dependiendo del tamaño de la colección"
);
console.log(
  "- No afectará las operaciones de lectura/escritura durante la creación"
);

console.log("\n" + "=".repeat(60));
