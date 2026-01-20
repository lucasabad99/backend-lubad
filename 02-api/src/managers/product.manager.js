import fs from "fs";

class ProductManager {
    constructor(path){
        this.path = path;
    }

    async getProducts(){
        try {
            if(!fs.existsSync(this.path)) return [];
            const data = await fs.promises.readFile(this.path, "utf-8")
            return JSON.parse(data);
        }   catch (error) {
            console.error("Error reading products:", error);
        }
    }

   
async getById(id){
  try {
    const products = await this.getProducts();
    const pid = Number(id);               
    const product = products.find((p) => p.id === pid);
    if(!product) throw new Error("Product not found");
    return product;
  } catch (error) {
    throw error;
  }
}


async add(body) {
  try {
    const products = await this.getProducts();
    const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const product = {
      id: newId,
      title: body.title,
      description: body.description,
      code: body.code,
      price: Number(body.price),
      status: body.status === undefined ? true : Boolean(body.status),
      stock: Number(body.stock),
      category: body.category,
      thumbnails: Array.isArray(body.thumbnails) ? body.thumbnails : []
    };
    products.push(product);
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    return product;
  } catch (error) {
    throw new Error("Error creating product: " + error.message);
  }
}



async update(id, body) {
  try {
    const products = await this.getProducts();
    const pid = Number(id);
    const index = products.findIndex((p) => p.id === pid);
    if (index === -1) throw new Error("Product not found");
    // No permitir cambiar el id
    const { id: _ignored, ...updates } = body;
    products[index] = { ...products[index], ...updates };
    // Persistir cambios
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[index];
  } catch (error) {
    throw new Error(error);
  }
}

    
async delete(id) {
  try {
    const products = await this.getProducts();
    const pid = Number(id);
    const index = products.findIndex((p) => p.id === pid);
    if (index === -1) throw new Error("Product not found");
    const [removed] = products.splice(index, 1);
    // Persistir cambios
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    return removed;
  } catch (error) {
    throw new Error(error);
  }
}
}

export const Manager = new ProductManager('./products.json');
