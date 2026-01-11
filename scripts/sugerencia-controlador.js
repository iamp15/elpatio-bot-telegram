"use strict";

console.log("🔧 Sugerencias para mejorar el controlador:");

console.log("\n📋 Función actual:");
console.log(`
exports.obtenerJugadorPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const jugador = await Jugador.findById(id);
    if (!jugador)
      return res.status(404).json({ message: "Jugador no encontrado" });
    res.json(jugador);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el jugador" });
  }
};
`);

console.log("\n✅ Función mejorada:");
console.log(`
exports.obtenerJugadorPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validar que el ID sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        message: "ID inválido", 
        details: "El ID debe ser un ObjectId válido de MongoDB (24 caracteres hexadecimales)" 
      });
    }
    
    const jugador = await Jugador.findById(id);
    if (!jugador) {
      return res.status(404).json({ message: "Jugador no encontrado" });
    }
    
    res.json(jugador);
  } catch (error) {
    console.error("Error en obtenerJugadorPorId:", error);
    res.status(500).json({ 
      message: "Error al obtener el jugador",
      details: error.message 
    });
  }
};
`);

console.log("\n🎯 Beneficios de la mejora:");
console.log("   • Valida ObjectIds antes de hacer la consulta");
console.log("   • Devuelve errores más descriptivos");
console.log("   • Evita errores 500 por ObjectIds inválidos");
console.log("   • Facilita el debugging");

console.log("\n📝 Para implementar:");
console.log("   1. Importar mongoose en tu controlador");
console.log("   2. Reemplazar la función actual con la mejorada");
console.log(
  "   3. Probar con el ID '146c' para ver el error 400 en lugar de 500"
);
