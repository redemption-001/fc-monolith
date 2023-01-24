import request from 'supertest';
import {app} from '../express';
import { v4 as uuidv4 } from "uuid";

describe("E2E tests for Customer", ()=>{

    it("should create a client", async ()=>{
        const response = await request(app)
            .post("/clients")
            .send({
                //id: uuidv4(),
                name: "Client 1",
                document: "11111",
                email: "x@x.com",
                street: "street 1",
                complement: "apto 2",
                number: "500",
                city: "city z",
                state: "state w",
                zipCode: "77777999"
            });

        expect(response.status).toBe(200);
    })

    it("should not create a client", async ()=>{
        const response = await request(app)
            .post("/clients")
            .send({
                //id: "1",
                name: "Client 1",
                document: "11111"
            });

        expect(response.status).toBe(500);
    })
})