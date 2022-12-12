

module.exports = app => {
    const Container = require('../productos')

    let prod = new Container('./productos.json')

    app.get("/datos", (req, res, next) => {
        let { min, max, titulo } = req.query;
        res.render("index-pug", req.query)
    })

    app.get("/", async (req, res, next) => {
        const productos = await prod.getAll()
        console.log(productos)
        res.render("index", { productos })
    })

    app.post("/create", async (req, res, next) => {
        let product = req.body
        if (product) {
            await prod.save(product)
            res.redirect("/")
        }
        else { console.log('error') }

    })

}