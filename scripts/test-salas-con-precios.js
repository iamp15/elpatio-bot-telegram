// Script para probar sendFilteredRooms con precios del backend
console.log('🏠 Probando salas con precios del backend...\n');

// Mock del bot
const mockBot = {
  sendMessage: async (chatId, message, options = {}) => {
    console.log(`📱 MENSAJE ENVIADO A ${chatId}:`);
    console.log('─'.repeat(50));
    console.log(message);
    if (options.parse_mode) {
      console.log(`📝 Modo de parseo: ${options.parse_mode}`);
    }
    if (options.reply_markup) {
      console.log(`🔘 Botones: ${JSON.stringify(options.reply_markup)}`);
    }
    console.log('─'.repeat(50));
    return { message_id: 1 };
  }
};

// Salas de prueba con diferentes modos
const salasPrueba = [
  {
    _id: "sala1",
    nombre: "Sala Ludo 1v1",
    juego: "ludo",
    modo: "1v1",
    jugadores: ["jugador1", "jugador2"],
    creador: "creador1",
    configuracion: {
      entrada: 0, // Este valor será reemplazado por el del backend
      premio: 0   // Este valor será calculado automáticamente
    }
  },
  {
    _id: "sala2", 
    nombre: "Sala Ludo 1v1v1v1",
    juego: "ludo",
    modo: "1v1v1v1",
    jugadores: ["jugador1"],
    creador: "creador2",
    configuracion: {
      entrada: 0,
      premio: 0
    }
  },
  {
    _id: "sala3",
    nombre: "Sala Dominó 2v2", 
    juego: "domino",
    modo: "2v2",
    jugadores: ["jugador1", "jugador2", "jugador3"],
    creador: "creador3",
    configuracion: {
      entrada: 0,
      premio: 0
    }
  }
];

async function testSalasConPrecios() {
  try {
    console.log('🔧 Configurando variables de entorno...');
    process.env.ADMIN_ID = '123456789';
    process.env.BACKEND_URL = 'http://localhost:5000';
    process.env.BOT_EMAIL = 'bot@elpatio.games';
    process.env.BOT_PASSWORD = 'BotCl4ve#Sup3rS3gur4!2025';
    
    console.log('📋 Importando dependencias...');
    const BackendAPI = require('../api/backend');
    const { sendFilteredRooms } = require('../utils/helpers');
    
    // Crear instancia de la API del backend
    const api = new BackendAPI({
      baseUrl: process.env.BACKEND_URL,
      botEmail: process.env.BOT_EMAIL,
      botPassword: process.env.BOT_PASSWORD,
    });
    
    console.log('✅ API configurada');
    
    // Probar con salas de Ludo
    console.log('\n🎲 Probando salas de Ludo...');
    await sendFilteredRooms(
      mockBot,
      123456789,
      salasPrueba.filter(s => s.juego === 'ludo'),
      'ludo',
      '🎲 Ludo',
      api
    );
    
    // Probar con salas de Dominó
    console.log('\n🂋 Probando salas de Dominó...');
    await sendFilteredRooms(
      mockBot,
      123456789,
      salasPrueba.filter(s => s.juego === 'domino'),
      'domino',
      '🂋 Dominó',
      api
    );
    
    console.log('\n✅ Prueba completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('📍 Stack trace:', error.stack);
  }
}

// Ejecutar la prueba
testSalasConPrecios();
