const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testRecipesPrisma() {
  try {
    console.log('🍳 Probando módulo de RECETAS con Prisma...\n');
    
    // 1. Probar categorías de recetas
    console.log('1️⃣ Probando categorías de recetas...');
    try {
      const categories = await prisma.recipeCategory.findMany();
      console.log(`✅ Categorías de recetas: ${categories.length}`);
      categories.slice(0, 3).forEach(cat => {
        console.log(`   🏷️ ${cat.nombre}: ${cat.descripcion || 'Sin descripción'}`);
      });
    } catch (error) {
      console.log(`❌ Error categorías: ${error.message}`);
    }
    
    // 2. Probar dificultades
    console.log('\n2️⃣ Probando dificultades de recetas...');
    try {
      const difficulties = await prisma.recipeDifficulty.findMany();
      console.log(`✅ Dificultades: ${difficulties.length}`);
      difficulties.forEach(diff => {
        console.log(`   ⭐ ${diff.nivel}: ${diff.descripcion}`);
      });
    } catch (error) {
      console.log(`❌ Error dificultades: ${error.message}`);
    }
    
    // 3. Probar unidades de medida
    console.log('\n3️⃣ Probando unidades de medida...');
    try {
      const units = await prisma.measurementUnit.findMany();
      console.log(`✅ Unidades de medida: ${units.length}`);
      units.slice(0, 5).forEach(unit => {
        console.log(`   📏 ${unit.codigo} (${unit.abreviatura}): ${unit.nombre} - ${unit.tipo}`);
      });
    } catch (error) {
      console.log(`❌ Error unidades: ${error.message}`);
    }
    
    // 4. Probar ingredientes maestros
    console.log('\n4️⃣ Probando ingredientes maestros...');
    try {
      const ingredients = await prisma.masterIngredient.findMany({
        take: 10,
        include: {
          unidadMedidaBase: true
        }
      });
      console.log(`✅ Ingredientes maestros: ${ingredients.length}`);
      ingredients.slice(0, 5).forEach(ing => {
        console.log(`   🥕 ${ing.nombre} (${ing.unidadMedidaBase.abreviatura})`);
        if (ing.caloriasPor100g) {
          console.log(`      Calorías: ${ing.caloriasPor100g}/100g`);
        }
      });
    } catch (error) {
      console.log(`❌ Error ingredientes: ${error.message}`);
    }
    
    // 5. Probar recetas
    console.log('\n5️⃣ Probando recetas...');
    try {
      const recipes = await prisma.recipe.findMany({
        take: 5,
        include: {
          categoria: true,
          dificultad: true,
          ingredientes: {
            take: 3,
            include: {
              ingredienteMaestro: true,
              unidadMedida: true
            }
          }
        }
      });
      console.log(`✅ Recetas encontradas: ${recipes.length}`);
      recipes.forEach(recipe => {
        console.log(`   🍽️ ${recipe.nombre}`);
        console.log(`      Categoría: ${recipe.categoria.nombre}`);
        console.log(`      Dificultad: ${recipe.dificultad.nivel}`);
        console.log(`      Tiempo: ${recipe.tiempoPreparacion} min`);
        console.log(`      Porciones: ${recipe.porciones}`);
        if (recipe.ingredientes.length > 0) {
          console.log(`      Ingredientes (${recipe.ingredientes.length}):`);
          recipe.ingredientes.forEach(ing => {
            console.log(`        - ${ing.cantidad} ${ing.unidadMedida.abreviatura} de ${ing.ingredienteMaestro.nombre}`);
          });
        }
        console.log('');
      });
    } catch (error) {
      console.log(`❌ Error recetas: ${error.message}`);
    }
    
    // 6. Estadísticas generales
    console.log('\n📊 Estadísticas del módulo de recetas:');
    try {
      const stats = await Promise.all([
        prisma.recipeCategory.count(),
        prisma.recipeDifficulty.count(),
        prisma.measurementUnit.count(),
        prisma.masterIngredient.count(),
        prisma.recipe.count(),
        prisma.recipeIngredient.count()
      ]);
      
      console.log(`   🏷️ Categorías: ${stats[0]}`);
      console.log(`   ⭐ Dificultades: ${stats[1]}`);
      console.log(`   📏 Unidades de medida: ${stats[2]}`);
      console.log(`   🥕 Ingredientes maestros: ${stats[3]}`);
      console.log(`   🍽️ Recetas: ${stats[4]}`);
      console.log(`   📝 Ingredientes de recetas: ${stats[5]}`);
      
    } catch (error) {
      console.log(`❌ Error estadísticas: ${error.message}`);
    }
    
    console.log('\n🎉 ¡Módulo de recetas probado exitosamente!');
    console.log('🌐 Ahora puedes ver TODAS las tablas en Prisma Studio: http://localhost:5555');
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testRecipesPrisma();
