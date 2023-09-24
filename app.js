import express from "express";
import { manager } from "./ProductManager.js";

const app = express()
const PORT = 8080;
app.use(express.json())

app.get("/api/products", async (req, res) => {
    //console.log(req.query);
    const users = await manager.getProducts(req.query);
    res.json({message: "Products found", users})
})

app.get("/api/products/:id", async (req, res) => {
    console.log(req.params);
    const {id} = req.params
    const user = await manager.getProductById(+id)
    res.json({message: "Product found", user})
})

app.listen(PORT, () => {
    console.log(`Escuchando al servidor ${PORT}`);
})