# Verificar si Firebase CLI está instalado
if (-not (Get-Command firebase -ErrorAction SilentlyContinue)) {
  Write-Host "Firebase CLI no está instalado. Ejecuta: npm install -g firebase-tools"
  exit 1
}

Write-Host "Compilando proyecto con Vite..."
npm run build

Write-Host "Desplegando a Firebase Hosting desde carpeta dist..."
firebase deploy

Write-Host "¡Despliegue completo!"