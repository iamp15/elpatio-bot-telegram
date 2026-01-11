#!/bin/bash

# Script de pruebas con cURL para el endpoint updateConfig
# Uso: ./scripts/curl-tests.sh

# Configuración
BASE_URL="http://localhost:5000/api"
BOT_EMAIL="bot@elpatio.com"
BOT_PASSWORD="tu_password"

echo "🚀 Iniciando pruebas con cURL..."

# 1. Obtener token de autenticación
echo "🔐 Obteniendo token de autenticación..."
TOKEN=$(curl -s -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${BOT_EMAIL}\",\"password\":\"${BOT_PASSWORD}\"}" \
  | jq -r '.token')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Error: No se pudo obtener el token"
  exit 1
fi

echo "✅ Token obtenido: ${TOKEN:0:20}..."

# 2. Actualizar precio Ludo 1v1
echo "🧪 Probando actualización de precio Ludo 1v1..."
curl -X POST "${BASE_URL}/payment-config" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "configType": "precios",
    "configKey": "ludo.1v1",
    "configValue": 70000
  }' | jq '.'

# 3. Actualizar límite de depósito
echo "🧪 Probando actualización de límite de depósito..."
curl -X POST "${BASE_URL}/payment-config" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "configType": "limites",
    "configKey": "maxDeposit",
    "configValue": 15000000
  }' | jq '.'

# 4. Actualizar comisiones de retiro
echo "🧪 Probando actualización de comisiones..."
curl -X POST "${BASE_URL}/payment-config" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "configType": "comisiones",
    "configKey": "withdrawal.rates",
    "configValue": [0, 1, 3, 7]
  }' | jq '.'

# 5. Verificar configuración actual
echo "🔍 Verificando configuración actual..."
curl -X GET "${BASE_URL}/payment-config" \
  -H "Authorization: Bearer ${TOKEN}" | jq '.'

# 6. Ver historial de auditoría
echo "📋 Verificando historial de auditoría..."
curl -X GET "${BASE_URL}/payment-config/audit" \
  -H "Authorization: Bearer ${TOKEN}" | jq '.'

# 7. Probar error sin autenticación
echo "🚨 Probando error sin autenticación..."
curl -X POST "${BASE_URL}/payment-config" \
  -H "Content-Type: application/json" \
  -d '{
    "configType": "precios",
    "configKey": "ludo.1v1",
    "configValue": 70000
  }' | jq '.'

# 8. Probar error con parámetros faltantes
echo "🚨 Probando error con parámetros faltantes..."
curl -X POST "${BASE_URL}/payment-config" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "configType": "precios",
    "configKey": "ludo.1v1"
  }' | jq '.'

echo "✅ Pruebas completadas"
