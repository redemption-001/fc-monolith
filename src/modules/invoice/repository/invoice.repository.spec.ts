import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/entity/invoice.entity";
import Product from "../domain/entity/product.entity";
import Address from "../domain/value-object/address";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceModel from "./invoice.model";
import InvoiceRepository from "./invoice.repository";
import ProductModel from "./product.model";
var Umzug = require("umzug");
import dotenv from "dotenv";
import { Dialect } from "sequelize/types";
var sequelizeRC = require("../../../../.sequelizerc");

describe("Invoice Repository Unit Tests", ()=>{
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

        sequelize.addModels([ProductModel, InvoiceItemModel, InvoiceModel]);
    })
  
    afterEach(async ()=>{
        await seeder.down();
        await sequelize.close();
    })
    
    it("Should list a invoice", async ()=>{
        await ProductModel.create({
            id: "p1",
            name: "product 1",
            price: 77.78,
            createdAt: Date(),
            updatedAt: Date()
        });
        
        await ProductModel.create({
            id: "p2",
            name: "product 2",
            price: 2.02,
            createdAt: Date(),
            updatedAt: Date()
        });

        const today = new Date();
        await InvoiceModel.create({
            id: "i1",
            name: "aaaa ddddd",
            document: "77777799",
            street: "street A",
            number: "151",
            complement: "apt. 47",
            city: "city w",
            state: "state z",
            zipCode: "4444-444",
            items: [
                {
                    invoiceId: "i1",
                    productId: "p1",
                    price: 77.78
                },
                {
                    invoiceId: "i2",
                    productId: "p2",
                    price: 2.02
                }
            ],
            createdAt: today,
            updatedAt: today,
        },
        {
          include: [{ model: InvoiceItemModel }],
        })
        
        const repository = new InvoiceRepository();
        const result = await repository.find("i1");

        expect(result.id.id).toBe("i1");
        expect(result.name).toBe("aaaa ddddd");
        expect(result.document).toBe("77777799");
        expect(result.address.street).toBe("street A");
        expect(result.address.number).toBe("151");
        expect(result.address.complement).toBe("apt. 47");
        expect(result.address.city).toBe("city w");
        expect(result.address.state).toBe("state z");
        expect(result.address.zipCode).toBe("4444-444");
        expect(result.items.length).toBe(2);
        expect(result.items[0].id.id).toBe("p1");
        expect(result.items[0].name).toBe("product 1");
        expect(result.items[0].price).toBe(77.78);
        expect(result.items[1].id.id).toBe("p2");
        expect(result.items[1].name).toBe("product 2");
        expect(result.items[1].price).toBe(2.02);
        expect(result.createdAt).toStrictEqual(today);
        expect(result.updatedAt).toStrictEqual(today);
        expect(result.total()).toEqual(79.80);
    });

    it("Should save a invoice", async ()=>{
        await ProductModel.create({
            id: "p2",
            name: "product 2",
            price: 2.02,
            createdAt: Date(),
            updatedAt: Date()
        });
    
        await ProductModel.create({
            id: "p3",
            name: "product 3",
            price: 1.50,
            createdAt: Date(),
            updatedAt: Date()
        });

        const repository = new InvoiceRepository();

        const invoice = new Invoice({
            name: "zzzzzzz qqqq",
            document: "11122233399",
            address: new Address({
                street: "street A",
                number: "151",
                complement: "apt. 47",
                city: "city w",
                state: "state z",
                zipCode: "4444-444",
            }),
            items: [
                new Product({
                    id: new Id("p2"),
                    name: "product 2",
                    price: 2.02
                }),
                new Product({
                    id: new Id("p3"),
                    name: "product 3",
                    price: 1.50
                })
            ], 
            createdAt: new Date(),
            updateAt: new Date()
        })
        await repository.save(invoice);

        const invoiceResult = await InvoiceModel.findOne({
            where: {id: invoice.id.id},
            include: [
                {
                    model: InvoiceItemModel,
                    include: [ProductModel]
                }
            ]
        });

        expect(invoiceResult.id).toBe(invoice.id.id);
        expect(invoiceResult.name).toBe("zzzzzzz qqqq");
        expect(invoiceResult.document).toBe("11122233399");
        expect(invoiceResult.street).toBe("street A");
        expect(invoiceResult.number).toBe("151");
        expect(invoiceResult.complement).toBe("apt. 47");
        expect(invoiceResult.city).toBe("city w");
        expect(invoiceResult.state).toBe("state z");
        expect(invoiceResult.zipCode).toBe("4444-444");
        expect(invoiceResult.items.length).toBe(2);
        expect(invoiceResult.items[0].product.id).toBe("p2");
        expect(invoiceResult.items[0].product.name).toBe("product 2");
        expect(invoiceResult.items[0].product.price).toBe(2.02);
        expect(invoiceResult.items[1].product.id).toBe("p3");
        expect(invoiceResult.items[1].product.name).toBe("product 3");
        expect(invoiceResult.items[1].product.price).toBe(1.50);
        expect(invoiceResult.createdAt).toStrictEqual(invoice.createdAt);
    })
    
    it("Should not save a invoice if item does not exist", async ()=>{
        const products = await ProductModel.findAll();
        expect(products).toHaveLength(0);

        await ProductModel.create({
            id: "p2",
            name: "product 2",
            price: 2.02,
            createdAt: Date(),
            updatedAt: Date()
        });

        const repository = new InvoiceRepository();

        const invoice = new Invoice({
            name: "zzzzzzz qqqq",
            document: "11122233399",
            address: new Address({
                street: "street A",
                number: "151",
                complement: "apt. 47",
                city: "city w",
                state: "state z",
                zipCode: "4444-444",
            }),
            items: [
                new Product({
                    id: new Id("p2"),
                    name: "product 2",
                    price: 2.02
                }),
                new Product({
                    id: new Id("p3"),
                    name: "product 3",
                    price: 1.50
                })
            ],
            createdAt: new Date(),
            updateAt: new Date()
        })

        expect(async ()=>{
            await repository.save(invoice);
        }).rejects.toThrow("Product p3 - product 3 does not exist");

        const allInvoices = await InvoiceModel.findAll();
        expect(allInvoices).toHaveLength(0);
    })
})