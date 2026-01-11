# Scripts de Prueba - Perfil de Usuario 🧪

Este directorio contiene scripts para probar el sistema de perfil de usuario y verificar que el formateo dinámico de moneda funciona correctamente.

## 📋 Scripts Disponibles

### 1. **test-profile-setup.js**

Script de configuración que verifica el entorno y archivos necesarios.

```bash
npm run test:setup
# o
node scripts/test-profile-setup.js
```

**Funciones:**

- Verifica variables de entorno
- Comprueba que los archivos necesarios existan
- Muestra comandos disponibles
- Crea archivo `.env.example`

### 2. **test-profile-currency.js**

Prueba específica del formateo dinámico de moneda.

```bash
npm run test:currency
# o
node scripts/test-profile-currency.js
```

**Pruebas incluidas:**

- Configuración de moneda desde el backend
- Formateo de saldos con diferentes valores
- Sistema de cache
- Fallback en caso de errores
- Simulación de diferentes monedas

### 3. **test-profile-complete.js**

Prueba completa del sistema de perfil.

```bash
npm run test:profile
# o
node scripts/test-profile-complete.js
```

**Pruebas incluidas:**

- Obtención de datos del jugador
- Formateo de saldo
- Generación del mensaje del perfil
- Ejecución del comando completo
- Simulación de cambios de moneda

## 🔧 Configuración

### Variables de Entorno Requeridas

```env
# Backend
BACKEND_URL=http://localhost:3000/api

# Credenciales del Bot
BOT_EMAIL=bot@elpatio.com
BOT_PASSWORD=botpassword
```

### Variables de Entorno Opcionales

```env
# Usuario de prueba específico
TEST_USER_ID=123456789

# Modo de prueba
TEST_MODE=false
```

## 🚀 Uso

### 1. Configuración Inicial

```bash
# Verificar configuración
npm run test:setup
```

### 2. Pruebas Básicas

```bash
# Probar formateo de moneda
npm run test:currency

# Probar perfil completo
npm run test:profile
```

### 3. Pruebas con Configuración Específica

```bash
# Con usuario específico
TEST_USER_ID=123456789 npm run test:profile

# Con backend específico
BACKEND_URL=http://mi-backend.com/api npm run test:currency
```

## 📊 Ejemplo de Salida

### Prueba de Formateo de Moneda

```
🚀 **INICIANDO PRUEBAS DE FORMATEO DINÁMICO DE MONEDA**

============================================================

🔍 **PRUEBA DE CONFIGURACIÓN DE MONEDA**

✅ **Configuración obtenida del backend:**
   Código: VES
   Símbolo: Bs
   Formato: es-VE
   Decimales: 2

💰 **PRUEBA DE FORMATEO DE SALDOS**

📊 **Usando configuración: VES (Bs)**

        0 centavos → Bs. 0,00
      100 centavos → Bs. 1,00
     1500 centavos → Bs. 15,00
    10000 centavos → Bs. 100,00
   150000 centavos → Bs. 1.500,00
  1000000 centavos → Bs. 10.000,00
 15000000 centavos → Bs. 150.000,00

🌍 **PRUEBA DE DIFERENTES MONEDAS (SIMULACIÓN)**

📊 **Bolívares Venezolanos (VES)**
        0 centavos → Bs. 0,00
      100 centavos → Bs. 1,00
     1500 centavos → Bs. 15,00
    10000 centavos → Bs. 100,00
   150000 centavos → Bs. 1.500,00

📊 **Dólares Estadounidenses (USD)**
        0 centavos → $. 0.00
      100 centavos → $. 1.00
     1500 centavos → $. 15.00
    10000 centavos → $. 100.00
   150000 centavos → $. 1,500.00

⚡ **PRUEBA DE CACHE**

🔄 **Primera consulta (sin cache):**
   Tiempo: 245ms
   Configuración: VES - Bs

⚡ **Segunda consulta (con cache):**
   Tiempo: 2ms
   Configuración: VES - Bs

📈 **Mejora de rendimiento: 99% más rápido**

🛡️ **PRUEBA DE FALLBACK**

❌ **Simulando error del backend:**
        0 centavos → Bs. 0,00 (fallback)
      100 centavos → Bs. 1,00 (fallback)
     1500 centavos → Bs. 15,00 (fallback)

============================================================
✅ **PRUEBAS COMPLETADAS**

📋 **RESUMEN:**
   • Configuración de moneda obtenida correctamente del backend
   • Formateo de saldos funciona según la configuración
   • Sistema de cache mejora el rendimiento
   • Fallback funciona en caso de errores
   • Compatible con diferentes configuraciones de moneda
```

## 🔍 Debugging

### Errores Comunes

1. **Error de autenticación**

   ```
   ❌ Error obteniendo configuración del backend:
      Error de autenticación
   ```

   **Solución:** Verificar credenciales del bot

2. **Backend no disponible**

   ```
   ❌ Error obteniendo configuración del backend:
      connect ECONNREFUSED
   ```

   **Solución:** Verificar que el backend esté funcionando

3. **Configuración de moneda no encontrada**
   ```
   ❌ Error obteniendo configuración del backend:
      Respuesta inválida para moneda
   ```
   **Solución:** Verificar que exista configuración de moneda en el backend

### Logs Útiles

```bash
# Ver logs detallados
DEBUG=* npm run test:currency

# Ver solo errores
npm run test:currency 2>&1 | grep "❌"
```

## 📝 Notas de Desarrollo

### Estructura de Archivos

```
scripts/
├── test-profile-setup.js      # Configuración
├── test-profile-currency.js   # Pruebas de moneda
├── test-profile-complete.js   # Pruebas completas
└── README.md                  # Esta documentación
```

### Dependencias

Los scripts utilizan los siguientes módulos del proyecto:

- `api/backend.js` - Cliente del backend
- `utils/payment-config-manager.js` - Gestor de configuración
- `handlers/commands/profile-commands.js` - Comandos del perfil

### Extensibilidad

Para agregar nuevas pruebas:

1. Crear nuevo archivo en `scripts/`
2. Agregar script en `package.json`
3. Documentar en este README
4. Actualizar `test-profile-setup.js` si es necesario

## 🎯 Casos de Prueba Cubiertos

- ✅ Configuración de moneda desde backend
- ✅ Formateo con diferentes valores de saldo
- ✅ Sistema de cache
- ✅ Fallback en errores
- ✅ Diferentes configuraciones de moneda
- ✅ Obtención de datos del jugador
- ✅ Generación de mensaje del perfil
- ✅ Ejecución del comando completo
