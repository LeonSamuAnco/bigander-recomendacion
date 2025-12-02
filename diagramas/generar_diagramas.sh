#!/bin/bash

# Script para generar todos los diagramas PlantUML a PNG y SVG
# Requiere tener PlantUML instalado

echo "🎨 Generando diagramas UML de CookSync..."
echo ""

# Verificar si PlantUML está instalado
if ! command -v plantuml &> /dev/null
then
    echo "❌ PlantUML no está instalado."
    echo ""
    echo "Opciones de instalación:"
    echo ""
    echo "1. Con Homebrew (Mac):"
    echo "   brew install plantuml"
    echo ""
    echo "2. Con apt (Linux):"
    echo "   sudo apt-get install plantuml"
    echo ""
    echo "3. Con npm (Windows/Mac/Linux):"
    echo "   npm install -g node-plantuml"
    echo ""
    echo "4. Descargar JAR:"
    echo "   https://plantuml.com/download"
    echo ""
    exit 1
fi

# Crear directorio de salida
mkdir -p output/png
mkdir -p output/svg

# Generar PNG
echo "📊 Generando imágenes PNG..."
plantuml -tpng -o output/png *.puml

# Generar SVG
echo "🎨 Generando imágenes SVG..."
plantuml -tsvg -o output/svg *.puml

echo ""
echo "✅ Diagramas generados exitosamente!"
echo ""
echo "📁 Ubicación de archivos:"
echo "   PNG: ./output/png/"
echo "   SVG: ./output/svg/"
echo ""
echo "📋 Archivos generados:"
ls -1 output/png/*.png | sed 's/.*\//   - /'
echo ""
