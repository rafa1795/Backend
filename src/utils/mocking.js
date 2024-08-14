const { faker } = require('@faker-js/faker');

function generateMockProducts(count = 100) {
    const products = [];
    for (let i = 0; i < count; i++) {
        const product = {
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price(),
            category: faker.commerce.department(),
            stock: faker.random.number({ min: 1, max: 100 }),
            code: faker.random.uuid(),
            img: faker.image.imageUrl(),
            status: true
        };
        products.push(product);
    }
    return products;
}

module.exports = { generateMockProducts };
