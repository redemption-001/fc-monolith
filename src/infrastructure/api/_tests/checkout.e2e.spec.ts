import request from 'supertest';
import {app} from '../express';
import { v4 as uuidv4 } from "uuid";

describe("E2E tests for Checkout", ()=>{

    it("should create a checkout", async ()=>{
        const client = {
            id: uuidv4(),
            name: "Client 1",
            document: "11111",
            email: "x@x.com",
            street: "street 1",
            complement: "apto 2",
            number: "500",
            city: "city z",
            state: "state w",
            zipCode: "77777999"
        }
        const responseClient = await request(app).post("/clients").send(client);
        expect(responseClient.status).toBe(200);

        const product01 = {
            id: uuidv4(),
            name: "product 1",
            description: "product A",
            purchasePrice: 52,
            salesPrice: 53,
            stock: 10
        }        
        const responseProduct01 = await request(app).post("/products").send(product01);
        expect(responseProduct01.status).toBe(200);

        const product02 = {
            id: uuidv4(),
            name: "product 2",
            description: "product A",
            purchasePrice: 100.52,
            salesPrice: 110.52,
            stock: 15
        };
        const responseProduct02 = await request(app).post("/products").send(product02);
        expect(responseProduct02.status).toBe(200);

        const input = {
            clientId: client.id,
            products:[
                { productId: product01.id },
                { productId: product02.id }
            ]
        }

        const response = await request(app)
            .post("/checkout")
            .send(input);

        expect(response.status).toBe(200);
        expect(response.body.id).toBeDefined();
        expect(response.body.invoiceId).toBeDefined();
        expect(response.body.status).toBe("approved");
        expect(response.body.total).toBeCloseTo(163.52);
        expect(response.body.products).toHaveLength(2);
        expect(response.body.products).toStrictEqual(input.products);
    })

    it("should not create a checkout", async ()=>{
        const response = await request(app)
            .post("/checkout")
            .send({
                //id: "1",
                name: "Client 1",
                document: "11111"
            });

        expect(response.status).toBe(500);
    })
})