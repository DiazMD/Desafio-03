import fs from "fs";

class ProductManager {
    constructor(){
        this.path= "Products.json"
    }

    async getProducts(queryObj=""){
        console.log("QueryObj", queryObj);
        const {limit} = queryObj
        try {
            if(fs.existsSync(this.path)){
                const productsFile = await fs.promises.readFile(this.path, "utf-8")
                const productsData = JSON.parse(productsFile)
                return limit ? productsData.slice(0, limit) : productsData;
            } else {
                return []
            }
        }
        catch (error) {
            return error
        }
    }

    async getProductById(id){
        const products = await this.getProducts()
        const product = products.find (p => p.id === id)
        return product
            ? product
            : `Error: Element ID ${id} not found`
    }

    async addProduct(product){
        try {
            const products = await this.getProducts()
            const codeExists = products.some(p => p.code === product.code)

            //Validacion de datos
            if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock){
                return console.log("Error: Todos los parametros deben ser completados");
            }  
            //Validacion de no repeticion
            if (codeExists) {
                return  console.log(`Error: El objeto "${product.title}" ya se encuentra en la lista, no puedes volver a agregarlo.`);
            }
            //Generacion ID autoincrementable
            let id
            if (!products.length) {
                id = 1
            } else {
                id = products[products.length-1].id+1
            }
            products.push({id, ...product})
            await fs.promises.writeFile(this.path, JSON.stringify(products))
        }
        catch (error) {
            return error
        }
    }

    async updateProduct(id, mod){
        const products = await this.getProducts()
        const productIndex = products.findIndex(p => p.id === id)

        if(productIndex === -1) {
            return console.log(`Error: Element ID ${id} not found`);
        }

        products[productIndex][mod.field] = mod.value;
        await fs.promises.writeFile(this.path, JSON.stringify(products))
    }
    
    async deleteProduct(id){
        try {
            const products = await this.getProducts()
            const newArrayProducts = products.filter(p => p.id !== id)
            await fs.promises.writeFile(this.path, JSON.stringify(newArrayProducts))
        }
        catch (error) {
            error
        }
    }
}



const product1 = {
    title: "Sillon",
    description: "Cuero",
    price: 49000,
    thumbnail: "https://img.com",
    code: "3578",
    stock: 12
}

const product2 = {
    title: "Silla",
    description: "Madera",
    price: 4000,
    thumbnail: "https://img.com",
    code: "12346",
    stock: 8
}

const product3 = {
    title: "Banqueta",
    description: "Plastico",
    price: 2500,
    thumbnail: "https://img.com",
    code: "12347",
    stock: 8
}

const product4 = {
    title: "Banqueta",
    description: "Plastico",
    price: 2500,
}

const mod1 = {
    field: "title",
    value: "Ropero"
}

const mod2 = {
    field: "price",
    value: 17000
}

/*async function test(){
    const manager1 = new ProductManager()
    await manager1.addProduct(product3)
    const showProducts = await manager1.getProducts()
    //await manager1.deleteProduct(2)
    //await manager1.getElementById(3)
    //console.log(showProducts);

    //Ejemplo actualizacion de producto ID // Modificacion
    //await manager1.updateProduct(1, mod2)

    //console.log(showProducts);
}

test();*/

export const manager = new ProductManager()