const fs = require('fs');

class contenedor {
    constructor(path) {
        this.path = path;
    }

    getAll = async () => {
        try {
            const info = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(info);
        } catch (error) {
            console.log(error);
        }
    };

    save = async (prod) => {
        const stock = await this.getAll();

        const producto = prod
        stock.push(producto);
        console.log(stock)

        try {
            await fs.promises.writeFile(this.path, JSON.stringify(stock, null, 2));
        } catch (error) {
            console.log(error);
        }
    };
}

module.exports = contenedor;
