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

3. **Obtener el Token de Fly.io**:
   ```bash
   flyctl auth token
   ```
   O usa el comando recomendado (más reciente):
   ```bash
   flyctl tokens create deployer
   ```
   Copia el token que se muestra (formato: `fo1_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)
   
   **Nota**: El token es el mismo para todas tus aplicaciones de Fly.io. Si ya lo configuraste en otro repositorio, puedes reutilizarlo.

4. **Configurar el Secret en GitHub**:
   - Ve a tu repositorio en GitHub: `elpatio-bot-telegram`
   - Haz clic en **Settings** (Configuración)
   - En el menú lateral, haz clic en **Secrets and variables** → **Actions**
   - Haz clic en **New repository secret**
   - Configura:
     - **Name**: `FLY_API_TOKEN`
     - **Secret**: Pega el token que copiaste
   - Haz clic en **Add secret**

5. **Verificar el Workflow**:
   El workflow se encuentra en `.github/workflows/fly-deploy.yml` y se ejecutará automáticamente cuando:
   - Hagas push a `main` o `master`
   - O ejecutes manualmente desde la pestaña **Actions** en GitHub

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
flyctl deploy
```

### Monitoreo de Deploys

Puedes ver el progreso del deploy en:
1. **GitHub**: Pestaña **Actions** → selecciona el workflow en ejecución
2. **Fly.io Dashboard**: https://fly.io/dashboard
3. **Logs en tiempo real** (desde tu terminal):
   ```bash
   flyctl logs -a elpatio-bot
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

## Cambiar de polling a webhooks (opcional)

Si en el futuro quieres usar webhooks en lugar de polling:

1. Modifica el código del bot para usar webhooks
2. Actualiza `fly.toml` para agregar `http_service`
3. Configura el webhook de Telegram:
   ```bash
   curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://elpatio-bot.fly.dev/webhook"
   ```
