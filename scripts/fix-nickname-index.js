"use strict";

console.log("🔧 SOLUCIÓN PARA EL ERROR DE NICKNAME DUPLICADO");
console.log("=".repeat(60));

console.log("\n❌ PROBLEMA:");
console.log("El índice único en 'nickname' no permite valores null duplicados");
console.log(
  "Error: E11000 duplicate key error collection: elpatio.jugadores index: nickname_1"
);

console.log("\n✅ SOLUCIÓN:");
console.log("Actualizar el esquema del jugador en el backend:");

console.log(
  "\n📝 En el archivo del modelo Jugador (probablemente models/Jugador.js):"
);
console.log("Cambiar el índice de nickname de:");
console.log("nickname: { type: String, unique: true, sparse: true }");
console.log("A:");
console.log(
  "nickname: { type: String, unique: true, sparse: true, index: { unique: true, sparse: true } }"
);

console.log("\n🔍 O alternativamente, crear el índice manualmente:");
console.log("// En el archivo de configuración de la base de datos");
console.log("await Jugador.collection.createIndex(");
console.log("  { nickname: 1 },");
console.log(
  "  { unique: true, sparse: true, collation: { locale: 'es', strength: 2 } }"
);
console.log(");");

console.log("\n📋 EXPLICACIÓN:");
console.log("- sparse: true → Permite valores null duplicados");
console.log("- unique: true → Mantiene la unicidad para valores no-null");
console.log(
  "- collation → Mantiene la comparación case-insensitive en español"
);

console.log("\n🚀 PASOS:");
console.log("1. Actualizar el esquema en el backend");
console.log("2. Reiniciar el servidor backend");
console.log("3. Eliminar jugadores existentes");
console.log("4. Probar registro de nuevos jugadores");

console.log("\n💡 ALTERNATIVA TEMPORAL:");
console.log("Si no puedes modificar el backend ahora, puedes:");
console.log("- Asignar un nickname temporal único basado en telegramId");
console.log("- O usar firstName como nickname por defecto");

console.log("\n" + "=".repeat(60));
