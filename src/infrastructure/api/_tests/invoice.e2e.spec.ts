import request from 'supertest';
import {app} from '../express';
import { v4 as uuidv4 } from "uuid";

describe("E2E tests for Checkout", ()=>{

    it("should list a invoice", async ()=>{
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

        const responseCheckout = await request(app)
            .post("/checkout")
            .send(input);

        expect(responseCheckout.status).toBe(200);
        expect(responseCheckout.body.id).toBeDefined();
        expect(responseCheckout.body.invoiceId).toBeDefined();

        const responseInvoice = await request(app)
            .get(`/invoice/${responseCheckout.body.invoiceId}`);

        expect(responseInvoice.status).toBe(200);
        expect(responseInvoice.body.id).toBe(responseCheckout.body.invoiceId);
        expect(responseInvoice.body.name).toBe(client.name);
        expect(responseInvoice.body.document).toBe(client.document);
        expect(responseInvoice.body.address.street).toBe(client.street);
        expect(responseInvoice.body.address.number).toBe(client.number);
        expect(responseInvoice.body.address.complement).toBe(client.complement);
        expect(responseInvoice.body.address.city).toBe(client.city);
        expect(responseInvoice.body.address.state).toBe(client.state);
        expect(responseInvoice.body.address.zipCode).toBe(client.zipCode);
        expect(responseInvoice.body.items).toHaveLength(2);
        expect(responseInvoice.body.items).toContainEqual({
            id: product01.id,
            name: product01.name,
            price: product01.salesPrice,
        });
        expect(responseInvoice.body.items).toContainEqual({
            id: product02.id,
            name: product02.name,
            price: product02.salesPrice,
        });
        expect(responseInvoice.body.total).toBe(163.52);
        expect(responseInvoice.body.createdAt).toBeDefined();
    })

})