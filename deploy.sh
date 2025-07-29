#!/bin/bash

# 💡 Verifica si tienes Firebase CLI instalado
if ! command -v firebase &> /dev/null; then
  echo "⚠️ Firebase CLI no está instalado. Instálalo con 'npm install -g firebase-tools'"
  exit 1
fi

echo "📦 Compilando proyecto con Vite..."
npm run build

echo "🚀 Desplegando a Firebase Hosting desde carpeta dist..."
firebase deploy

echo "✅ ¡Despliegue completo!"