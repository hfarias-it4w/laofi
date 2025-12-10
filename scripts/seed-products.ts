import "dotenv/config";
import mongoose from "mongoose";
import { dbConnect } from "../src/lib/mongodb";
import { Product } from "../src/models/Product";

const products = [
  {
    name: "Espresso Clásico",
    price: 1200,
    description: "Shot intenso de espresso preparado con nuestra mezcla signature.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=640&q=80",
  },
  {
    name: "Latte Cremoso",
    price: 1500,
    description: "Doble espresso con leche vaporizada y espuma sedosa.",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=640&q=80",
  },
  {
    name: "Capuccino Vainilla",
    price: 1550,
    description: "Espresso, leche espumada y un toque de vainilla natural.",
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=640&q=80",
  },
  {
    name: "Cortado XL",
    price: 1300,
    description: "Espresso con un toque de leche para un balance perfecto.",
    image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=640&q=80",
  },
  {
    name: "Mocha Chocolate",
    price: 1650,
    description: "Doble espresso con leche, cacao y crema batida ligera.",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=640&q=80",
  },
  {
    name: "Lungo Suave",
    price: 1250,
    description: "Versión extendida de nuestro espresso para una taza más larga.",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=640&q=80",
  },
];

async function seedProducts() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI no está definida. Agregá la cadena de conexión en tu .env.local");
  }

  await dbConnect();

  const operations = products.map(async (product) => {
    const { name, ...rest } = product;
    const result = await Product.findOneAndUpdate(
      { name },
      { name, ...rest },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return result.name;
  });

  const seededNames = await Promise.all(operations);
  const total = await Product.countDocuments();

  console.log("Productos actualizados/agregados:");
  seededNames.forEach((name) => console.log(` • ${name}`));
  console.log(`\nSeeding completo. Productos totales disponibles: ${total}`);
}

seedProducts()
  .catch((error) => {
    console.error("Error al ejecutar el seeder de productos:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
