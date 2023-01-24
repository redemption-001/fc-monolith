import request from 'supertest';
import {app} from '../express';

describe("E2E tests for product", ()=>{

    it("should create a product", async ()=>{
        const response = await request(app)
            .post("/products")
            .send({
                name: "Product 1",
                description: "Product 1 description",
                purchasePrice: 100,
                salesPrice: 50,
                stock: 10,
            });

        expect(response.status).toBe(200);
    })

    it("should not create a product", async ()=>{
        const response = await request(app)
            .post("/products")
            .send({
                name: "",
                description: "Product 1 description",
            });

        expect(response.status).toBe(500);
    })
})