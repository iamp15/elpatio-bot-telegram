# Configuración de Variables de Entorno para el Bot en Fly.io

## Bot Telegram (bot-telegram)

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
