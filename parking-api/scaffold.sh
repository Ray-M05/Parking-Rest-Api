#!/usr/bin/env bash
# scaffold.sh — crea la estructura hexagonal de todos los módulos del parking-api
# Uso: colócalo en la raíz del proyecto (parking-api/) y ejecútalo:  bash scaffold.sh
set -euo pipefail

# Módulos del proyecto (según la guía). auth y logs se detallan en fases posteriores,
# pero dejamos su esqueleto listo.
MODULES=(users vehicles spots reservations auth logs)

# Subcarpetas por capa (molde hexagonal que se repite en cada módulo)
declare -a DOMAIN_DIRS=(domain/entities domain/value-objects domain/events domain/ports domain/errors)
declare -a APP_DIRS=(application/use-cases application/ports)
declare -a INFRA_DIRS=(infrastructure/persistence infrastructure/mappers)
declare -a PRES_DIRS=(presentation/dtos)

ROOT="src/modules"

echo "Creando estructura hexagonal en ${ROOT}/ ..."

for m in "${MODULES[@]}"; do
  for d in "${DOMAIN_DIRS[@]}" "${APP_DIRS[@]}" "${INFRA_DIRS[@]}" "${PRES_DIRS[@]}"; do
    mkdir -p "${ROOT}/${m}/${d}"
  done
  # .gitkeep para que git registre las carpetas vacías
  find "${ROOT}/${m}" -type d -empty -exec touch {}/.gitkeep \;
done

# Carpeta compartida (Value Objects base, errores base, utilidades del dominio)
mkdir -p src/shared/domain src/shared/application src/shared/infrastructure
find src/shared -type d -empty -exec touch {}/.gitkeep \;

echo ""
echo "Estructura creada."