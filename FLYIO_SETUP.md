# Configuración del Bot en Fly.io

## Bot Telegram (bot-telegram)

## 🚀 Deploy Automático con GitHub Actions

El bot está configurado para desplegarse automáticamente en Fly.io cuando se hace push a las ramas `master` o `main` del repositorio.

### Configuración Inicial

1. **Instalar Fly CLI** (si no está instalado):
   ```powershell
   # En PowerShell
   iwr https://fly.io/install.ps1 -useb | iex
   ```
   O visita: https://fly.io/docs/getting-started/installing-flyctl/

2. **Iniciar sesión en Fly.io** (si no has iniciado sesión):
   ```bash
   flyctl auth login
   ```
   Esto abrirá tu navegador para autenticarte.

3. **Generar un Token de Deploy para la Aplicación**:
   ```bash
   flyctl tokens create deploy -a elpatio-bot --json
   ```
   
   **⚠️ IMPORTANTE**: Este comando generará un token completo que incluye el prefijo "FlyV1" y múltiples partes separadas por comas. Debes usar el **token completo**, no solo una parte de él.

4. **Configurar el Secret en GitHub**:
   - Ve a tu repositorio en GitHub: `elpatio-bot-telegram`
   - Haz clic en **Settings** (Configuración)
   - En el menú lateral, haz clic en **Secrets and variables** → **Actions**
   - Haz clic en **New repository secret** (o edita si ya existe)
   - Configura:
     - **Name**: `FLY_API_TOKEN` (exactamente así, sin espacios)
     - **Secret**: Pega el **token completo** que obtuviste en el paso 3
       - Debe incluir el prefijo "FlyV1" y todo el contenido
       - No agregues espacios al inicio o final
       - Copia y pega el token completo tal como se muestra
   - Haz clic en **Add secret** (o **Update secret** si ya existe)

   **🔴 CRÍTICO**: Si solo copias una parte del token (por ejemplo, solo la parte que empieza con `fo1_`), obtendrás un error "unauthorized". Siempre usa el **token completo** generado por `flyctl tokens create deploy`.

5. **Verificar el Workflow**:
   El workflow se encuentra en `.github/workflows/fly-deploy.yml` y se ejecutará automáticamente cuando:
   - Hagas push a `main` o `master`
   - O ejecutes manualmente desde la pestaña **Actions** en GitHub

### Ejemplo de Token Completo

Un token de deploy válido se ve así (este es solo un ejemplo, usa tu propio token):
```
FlyV1 fm2_lJPECAAAAAAAClwExBBHy8MGqQsU+imuGyAObhxkwrVodHRwczovL2FwaS5mbHkuaW8vdjGWAJLOABPmVx8Lk7lodHRwczovL2FwaS5mbHkuaW8vYWFhL3YxxDxPi8LfrUUOG+P9nKFBPXywE6XlmH0tCZjPzKO0YyW1IYueQjE7G0bPqc75j7okmZZ5eeiVztCNpEIE64jETmgaeQa0GjlyZNIG3h+q5AKuNCW4hrNQoN6NYLB7wcaXmMwDLF/aw7Y0zbX1uFX47DppVy+ZJfTIte16opcah0HG34RnpOykbHXueT7jfQ2SlAORgc4Ao3OKHwWRgqdidWlsZGVyH6J3Zx8BxCCHEZrvNeJ5bXLIAwGoaatjVDdUi63rCAk8XRNKcNTuBQ==,fm2_lJPETmgaeQa0GjlyZNIG3h+q5AKuNCW4hrNQoN6NYLB7wcaXmMwDLF/aw7Y0zbX1uFX47DppVy+ZJfTIte16opcah0HG34RnpOykbHXueT7jfcQQk+pqKfMyMEY+vYD3FQBRpMO5aHR0cHM6Ly9hcGkuZmx5LmlvL2FhYS92MZgEks5pZoFjzo7+h4EXzgATHgwKkc4AEx4MDMQQUMdfoEcmelvLsYtbaguYXMQgZcSEbQw2zIX1aWFYRfQCjRRCbR329WGJrOzkRkGvOGU=
```

**Nota**: El token es específico para la aplicación `elpatio-bot`. Si ya lo configuraste en otro repositorio, puedes reutilizarlo, pero asegúrate de usar el token completo.

### Forzar Deploy Manual

#### Opción 1: Desde GitHub (interfaz web)
1. Ve a tu repositorio en GitHub
2. Haz clic en **Actions**
3. Selecciona el workflow "Fly Deploy"
4. Haz clic en **Run workflow**
5. Selecciona la rama y haz clic en **Run workflow**

#### Opción 2: Desde terminal
```bash
cd bot-telegram
flyctl deploy -a elpatio-bot
```

## 🔐 Configuración de Variables de Entorno

Ejecuta estos comandos desde el directorio `bot-telegram`:

```bash
# Variables obligatorias
flyctl secrets set NODE_ENV=production -a elpatio-bot
flyctl secrets set BOT_TOKEN="tu_bot_token_de_telegram" -a elpatio-bot
flyctl secrets set BACKEND_URL="https://elpatio-backend.fly.dev" -a elpatio-bot

# Credenciales del bot para autenticarse en el backend
flyctl secrets set BOT_EMAIL="email_del_bot@example.com" -a elpatio-bot
flyctl secrets set BOT_PASSWORD="password_seguro" -a elpatio-bot

# JWT del bot (si se usa pre-token)
# flyctl secrets set BOT_JWT="token_jwt_si_lo_usas" -a elpatio-bot
```

## Verificar secrets configurados

```bash
flyctl secrets list -a elpatio-bot
```

## Notas importantes

1. **BOT_TOKEN**: Obtén este token de @BotFather en Telegram
2. **BACKEND_URL**: Usa la URL de Fly.io del backend: `https://elpatio-backend.fly.dev`
3. **BOT_EMAIL/PASSWORD**: Estas credenciales deben coincidir con un usuario tipo "bot" en tu backend
4. El bot usa polling por defecto (no webhooks), por lo que no necesita exponer un puerto HTTP

## Verificar que el bot esté corriendo

Después del deploy:

```bash
flyctl logs -a elpatio-bot

# Deberías ver algo como:
# ✅ Bot autenticado en el backend
# 🤖 Bot iniciado correctamente
```

## Verificar que la GitHub Action se Ejecutó Correctamente

### Método 1: Desde GitHub (Recomendado)

1. Ve a tu repositorio en GitHub: `elpatio-bot-telegram`
2. Haz clic en la pestaña **Actions** (arriba del repositorio)
3. Verás una lista de workflows ejecutados:
   - **Verde con ✓**: Deploy exitoso
   - **Amarillo**: Deploy en progreso
   - **Rojo con ✗**: Deploy falló
4. Haz clic en el workflow más reciente para ver:
   - Los pasos ejecutados
   - Los logs de cada paso
   - El tiempo de ejecución
   - Si hubo errores, los detalles

### Método 2: Verificar el Estado en Fly.io

```bash
# Ver el estado de la aplicación
flyctl status -a elpatio-bot

# Ver los logs recientes
flyctl logs -a elpatio-bot

# Ver el historial de deploys
flyctl releases -a elpatio-bot
```

### Método 3: Verificar desde el Dashboard de Fly.io

1. Ve a https://fly.io/dashboard
2. Selecciona la aplicación `elpatio-bot`
3. En la pestaña **Activity** verás:
   - Historial de deploys
   - Estado de cada deploy
   - Tiempo de cada deploy

### Señales de que el Deploy fue Exitoso

- ✅ En GitHub Actions: El workflow muestra estado verde
- ✅ En Fly.io: La máquina está en estado "started"
- ✅ En los logs: Ves mensajes como "Bot iniciado correctamente"
- ✅ El bot responde en Telegram

## Cambiar de polling a webhooks (opcional)

Si en el futuro quieres usar webhooks en lugar de polling:

1. Modifica el código del bot para usar webhooks
2. Actualiza `fly.toml` para agregar `http_service`
3. Configura el webhook de Telegram:
   ```bash
   curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://elpatio-bot.fly.dev/webhook"
   ```
