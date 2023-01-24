import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutRepository from "./checkout.repository";
import ClientModel from "./client.model";
import OrderProductModel from "./order-product.model";
import OrderModel from "./order.model";
import ProductModel from "./product.model";
var Umzug = require("umzug");
import dotenv from "dotenv";
import { Dialect } from "sequelize/types";
var sequelizeRC = require("../../../../.sequelizerc");

describe("CheckoutRepository test", () => {
    let sequelize: Sequelize;
    let seeder: any;
    dotenv.config();
  
    beforeEach(async ()=>{
        sequelize = new Sequelize({
            dialect: process.env.DB_DIALECT as Dialect,
            storage: process.env.DB_STORAGE,
            logging: false
        })
          
        var seedsConfig = {
          storage: "sequelize",
          storageOptions: {
            sequelize: sequelize,
            modelName: 'SequelizeData'
          },
          migrations: {
            params: [
              sequelize.getQueryInterface(),
              sequelize.constructor
            ],
            path: sequelizeRC["seeders-path"],
            pattern: /\.js$/
          }
        };
  
        seeder = new Umzug(seedsConfig);    
        await seeder.up();

        sequelize.addModels([
            ClientModel,
            OrderModel,
            ProductModel,
            OrderProductModel
        ]);
    })
  
    afterEach(async ()=>{
        await seeder.down();
        await sequelize.close();
    })
    
    it("should create a new order", async () => {
        const repository = new CheckoutRepository()
        const order = new Order({
            id: new Id("1"),
            client: new Client({
                id: new Id("1"),
                name: "Client 0",
                email: "client@user.com",
                address: "some address",
            }),
            products: [
                new Product({
                    id: new Id("1"),
                    name: "Product 1",
                    description: "some description",
                    salesPrice: 40,
                }),
                new Product({
                    id: new Id("2"),
                    name: `Product 2`,
                    description: "some description",
                    salesPrice: 30,
                }),
            ],
            status: "approved"
        })

        await repository.addOrder(order)
        const result = await OrderModel.findOne({
            where: { id: "1" },
            include: [ProductModel, ClientModel],
        })
        expect(result).toBeDefined();
        expect(result.id).toBe(order.id.id);
        expect(result.client.id).toBe(order.client.id.id);
        expect(result.client.name).toBe(order.client.name);
        expect(result.client.email).toBe(order.client.email);
        expect(result.client.address).toBe(order.client.address);
        expect(result.products[0].id).toBe(order.products[0].id.id);
        expect(result.products[0].name).toBe(order.products[0].name);
        expect(result.products[0].salesPrice).toBe(order.products[0].salesPrice);
        expect(result.products[1].id).toBe(order.products[1].id.id);
        expect(result.products[1].name).toBe(order.products[1].name);
        expect(result.products[1].salesPrice).toBe(order.products[1].salesPrice);
        expect(result.total).toBe(70);
    })


    it("should find an order", async () => {
        const repository = new CheckoutRepository()
        const order = new Order({
            id: new Id("2"),
            client: new Client({
                id: new Id("1"),
                name: "Client 0",
                email: "client@user.com",
                address: "some address",
            }),
            products: [
                new Product({
                    id: new Id("1"),
                    name: "Product 1",
                    description: "some description",
                    salesPrice: 40,
                }),
                new Product({
                    id: new Id("2"),
                    name: `Product 2`,
                    description: "some description",
                    salesPrice: 30,
                }),
            ],
            status: "approved"
        })

        await repository.addOrder(order)
        const result = await repository.findOrder("2")

        expect(result).toBeDefined();
        expect(result.id.id).toBe(order.id.id);
        expect(result.client.id.id).toBe(order.client.id.id);
        expect(result.client.name).toBe(order.client.name);
        expect(result.client.email).toBe(order.client.email);
        expect(result.client.address).toBe(order.client.address);
        expect(result.products[0].id.id).toBe(order.products[0].id.id);
        expect(result.products[0].name).toBe(order.products[0].name);
        expect(result.products[0].salesPrice).toBe(order.products[0].salesPrice);
        expect(result.products[1].id.id).toBe(order.products[1].id.id);
        expect(result.products[1].name).toBe(order.products[1].name);
        expect(result.products[1].salesPrice).toBe(order.products[1].salesPrice);
        expect(result.total).toBe(70);
    })
})