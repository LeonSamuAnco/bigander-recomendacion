const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const CATEGORY_LAPTOPS = 55;
const CATEGORY_ACCESORIOS = 56;
const VENDOR_ID = 1;

// Lista completa extraída del SQL del usuario
const laptopNames = [
    "HP Pavilion 15", "Lenovo IdeaPad 3", "Dell XPS 13", "MacBook Air M1", "Asus ROG Strix G15",
    "Acer Nitro 5", "MSI Raider GE76", "HP Victus 16", "Lenovo Legion 5", "Dell Inspiron 15",
    "Asus Vivobook 15", "MacBook Pro 14", "Razer Blade 15", "Microsoft Surface Laptop 4", "Samsung Galaxy Book2",
    "LG Gram 17", "Acer Swift 3", "Huawei MateBook D15", "Alienware m15 R7", "Gigabyte Aero 16",
    "HP Omen 16", "Lenovo ThinkPad X1 Carbon", "Dell G15", "Asus ZenBook 14", "MacBook Pro 16 M3",
    "MSI Katana GF66", "Acer Predator Helios 300", "HP Spectre x360", "Lenovo Yoga 7i", "Dell Latitude 5420",
    "Asus TUF Gaming F15", "Apple MacBook Air M2", "Razer Blade 14", "Microsoft Surface Pro 9", "Samsung Galaxy Book3 Ultra",
    "HP Envy 13", "Lenovo ThinkBook 15", "Dell Alienware x14", "Asus ROG Zephyrus G14", "Acer Aspire 5",
    "MSI Stealth 15M", "HP Chromebook 14", "Lenovo IdeaPad Gaming 3", "Dell Vostro 3510", "Asus ExpertBook B9",
    "MacBook Pro 13 M2", "Toshiba Dynabook", "Huawei MateBook X Pro", "Gigabyte G5", "Razer Book 13"
];

const accesorioNames = [
    "Cargador Samsung 25W", "Cable Lightning Apple 1m", "Funda Silicona iPhone 13", "Audífonos JBL Tune 510BT", "Powerbank Xiaomi 10000mAh",
    "Mica Vidrio Templado S23", "Cargador Anker Nano 20W", "Cable USB-C Baseus 2m", "Funda Spigen Rugged Armor S22", "Audífonos Sony WH-1000XM4",
    "Soporte Auto Magnético Ugreen", "Adaptador Jack 3.5mm Apple", "Cargador Inalámbrico Samsung", "Funda Nillkin CamShield Xiaomi 12", "AirPods Pro 2da Gen",
    "Cable Ugreen USB-C a Lightning", "Powerbank Anker 20000mAh", "Funda Transparente iPhone 14 Pro", "Soporte Escritorio Baseus", "Galaxy Buds 2 Pro",
    "Mica Hidrogel Universal", "Cargador Huawei SuperCharge 66W", "Funda Cuero Apple iPhone 13", "Cable Xiaomi USB-C 1m", "Trípode Selfie Stick Xiaomi",
    "Adaptador OTG USB-C Samsung", "Funda Spigen Liquid Air Pixel 7", "Audífonos JBL Wave 100", "Cargador Auto Baseus 30W", "Powerbank Baseus MagSafe 6000mAh",
    "Funda Samsung Silicone Cover S23", "Cable Anker PowerLine III", "Mica Cámara iPhone 14", "Audífonos Sony LinkBuds S", "Soporte Anillo Genérico",
    "Cargador Pared Ugreen 65W GaN", "Funda Rugerizada Xiaomi Redmi Note 12", "Cable Audio Auxiliar Ugreen", "Powerbank Samsung 10000mAh Wireless", "AirTags Apple (Paquete de 1)",
    "Funda Apple Clear Case iPhone 11", "Adaptador Samsung USB-C a Jack", "Cargador Motorola TurboPower 30W", "Funda Nillkin Frosted S21 FE", "Audífonos Huawei FreeBuds 5i",
    "Cable Baseus 3 en 1", "Soporte Auto Gravedad Ugreen", "Mica Privacidad iPhone 13", "Funda Spigen Tough Armor iPhone 14", "Cargador Auto Anker 24W"
];

// Helpers para generar datos variados
function getRandomPrice(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateLaptopDesc(name) {
    const rams = ['8GB', '16GB', '32GB'];
    const storages = ['256GB SSD', '512GB SSD', '1TB SSD'];
    const cpus = ['Intel Core i5', 'Intel Core i7', 'AMD Ryzen 5', 'AMD Ryzen 7', 'Apple M1', 'Apple M2'];

    let cpu = cpus[Math.floor(Math.random() * cpus.length)];
    if (name.includes('Apple') || name.includes('MacBook')) cpu = name.includes('M1') ? 'Apple M1' : (name.includes('M2') ? 'Apple M2' : 'Apple M3');

    const ram = rams[Math.floor(Math.random() * rams.length)];
    const storage = storages[Math.floor(Math.random() * storages.length)];

    return `Laptop potente ${name}. Procesador ${cpu}, memoria RAM de ${ram} y almacenamiento de ${storage}. Ideal para trabajo y productividad.`;
}

function generateAccesorioDesc(name) {
    let type = 'Accesorio';
    if (name.includes('Cargador')) type = 'Cargador';
    if (name.includes('Cable')) type = 'Cable';
    if (name.includes('Funda')) type = 'Funda';
    if (name.includes('Audífonos') || name.includes('AirPods') || name.includes('Buds')) type = 'Audífonos';

    let conn = '';
    if (type === 'Audífonos') conn = Math.random() > 0.3 ? 'Bluetooth' : 'Jack 3.5mm';
    if (type === 'Cable' || type === 'Cargador') conn = name.includes('iPhone') || name.includes('Lightning') ? 'Lightning' : 'USB-C';

    return `${type} de alta calidad. ${name}. ${conn ? 'Conectividad: ' + conn + '.' : ''} Garantía de fabrica.`;
}

async function main() {
    console.log('🌱 Iniciando seed masivo de 100 productos...');

    try {
        // Asegurar categorias
        await prisma.productCategory.upsert({
            where: { nombre: 'Laptops y Cómputo' },
            update: { id: CATEGORY_LAPTOPS },
            create: { id: CATEGORY_LAPTOPS, nombre: 'Laptops y Cómputo', descripcion: 'Laptops' },
        }).catch(e => console.log('Cat Laptops ok'));

        await prisma.productCategory.upsert({
            where: { nombre: 'Accesorios y Periféricos' },
            update: { id: CATEGORY_ACCESORIOS },
            create: { id: CATEGORY_ACCESORIOS, nombre: 'Accesorios y Periféricos', descripcion: 'Accesorios' },
        }).catch(e => console.log('Cat Accesorios ok'));

        // Limpiar anteriores
        await prisma.product.deleteMany({ where: { categoriaId: { in: [CATEGORY_LAPTOPS, CATEGORY_ACCESORIOS] } } });

        // Insertar Laptops
        for (const name of laptopNames) {
            await prisma.product.create({
                data: {
                    nombre: name,
                    descripcion: generateLaptopDesc(name),
                    precio: getRandomPrice(450, 2500),
                    stock: getRandomPrice(5, 50),
                    categoriaId: CATEGORY_LAPTOPS,
                    vendedorId: VENDOR_ID,
                    imagenUrl: `https://placehold.co/600x400/2b6cb0/ffffff?text=${encodeURIComponent(name.split(' ').slice(0, 2).join('+'))}`,
                    sku: `LAP-${Math.floor(Math.random() * 99999)}`,
                    esActivo: true
                }
            });
        }

        // Insertar Accesorios
        for (const name of accesorioNames) {
            await prisma.product.create({
                data: {
                    nombre: name,
                    descripcion: generateAccesorioDesc(name),
                    precio: getRandomPrice(10, 150),
                    stock: getRandomPrice(20, 100),
                    categoriaId: CATEGORY_ACCESORIOS,
                    vendedorId: VENDOR_ID,
                    imagenUrl: `https://placehold.co/400x400/6b46c1/ffffff?text=${encodeURIComponent(name.split(' ').slice(1, 3).join('+'))}`,
                    sku: `ACC-${Math.floor(Math.random() * 99999)}`,
                    esActivo: true
                }
            });
        }

        console.log(`✅ Seed masivo completado: ${laptopNames.length} laptops y ${accesorioNames.length} accesorios.`);

    } catch (e) {
        console.error('Error seed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
