@echo off
REM Script para generar todos los diagramas PlantUML a PNG y SVG en Windows
REM Requiere tener PlantUML instalado

echo.
echo 🎨 Generando diagramas UML de CookSync...
echo.

REM Verificar si Java está instalado (necesario para PlantUML)
java -version >nul 2>&1
if errorlevel 1 (
    echo ❌ Java no está instalado. PlantUML requiere Java.
    echo.
    echo Descarga Java desde: https://www.java.com/download/
    echo.
    pause
    exit /b 1
)

REM Verificar si PlantUML está instalado
where plantuml >nul 2>&1
if errorlevel 1 (
    echo ❌ PlantUML no está instalado.
    echo.
    echo Opciones de instalación:
    echo.
    echo 1. Con npm:
    echo    npm install -g node-plantuml
    echo.
    echo 2. Con Chocolatey:
    echo    choco install plantuml
    echo.
    echo 3. Descargar JAR:
    echo    https://plantuml.com/download
    echo    Luego agregar al PATH
    echo.
    pause
    exit /b 1
)

REM Crear directorios de salida
if not exist "output\png" mkdir output\png
if not exist "output\svg" mkdir output\svg

REM Generar PNG
echo 📊 Generando imágenes PNG...
plantuml -tpng -o output/png *.puml

REM Generar SVG
echo 🎨 Generando imágenes SVG...
plantuml -tsvg -o output/svg *.puml

echo.
echo ✅ Diagramas generados exitosamente!
echo.
echo 📁 Ubicación de archivos:
echo    PNG: .\output\png\
echo    SVG: .\output\svg\
echo.
echo 📋 Archivos generados:
dir /b output\png\*.png
echo.

pause
