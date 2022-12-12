import { Sequelize } from "sequelize-typescript";
import { FindStoreCatalogFacadeInputDto } from "../../store-catalog/facade/store-catalog.facade.interface";
import InvoiceFactory from "../factory/facade.factory";
import InvoiceItemModel from "../repository/invoice-item.model";
import InvoiceModel from "../repository/invoice.model";
import ProductModel from "../repository/product.model";
var Umzug = require("umzug");
import dotenv from "dotenv";
import { Dialect } from "sequelize/types";

describe("Invoice Facade Unit Tests", ()=>{
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
            path: "./seeders",
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
        await createProducts();

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
                    productId: "p01",
                    price: 52.00
                },
                {
                    invoiceId: "i2",
                    productId: "p02",
                    price: 10.52
                }
            ],
            createdAt: new Date(),
            updatedAt: new Date()
        },        
        {
          include: [{ model: InvoiceItemModel }],
        })

        const invoiceFacade = InvoiceFactory.create({
            catalogFacade: MockStoreCatalogFacade()
        });

        const result = await invoiceFacade.find({id: "i1"});

        expect(result.id).toBe("i1");
        expect(result.name).toBe("aaaa ddddd");
        expect(result.document).toBe("77777799");
        expect(result.address.street).toBe("street A");
        expect(result.address.number).toBe("151");
        expect(result.address.complement).toBe("apt. 47");
        expect(result.address.city).toBe("city w");
        expect(result.address.state).toBe("state z");
        expect(result.address.zipCode).toBe("4444-444");
        expect(result.items.length).toBe(2);
        expect(result.items[0].id).toBe("p01");
        expect(result.items[0].name).toBe("product 1");
        expect(result.items[0].price).toEqual(52);
        expect(result.items[1].id).toBe("p02");
        expect(result.items[1].name).toBe("product 2");
        expect(result.items[1].price).toEqual(10.52);
        expect(result.total).toEqual(62.52);
    });

    it("Should create a invoice", async ()=>{
        await createProducts();
        const input = {
            name: "Fulano 1",
            document: "789.789.000-00",
            street: "Street A",
            number: "500",
            complement: "apto. 78",
            city: "City A",
            state: "State B",
            zipCode: "7000-010",
            items: [
                {
                    id: "p01",
                    name: "product A", 
                    price: 52,
                },
                {
                    id: "p02",
                    name: "product 2", 
                    price: 10.52,
                }
            ],
            createdAt: new Date(),
            updatedAt: new Date()       
        }

        const invoiceFacade = InvoiceFactory.create({
            catalogFacade: MockStoreCatalogFacade()
        });

        const result = await invoiceFacade.generate(input);
        expect(result.name).toBe("Fulano 1");
        expect(result.document).toBe("789.789.000-00");
        expect(result.street).toBe("Street A");
        expect(result.number).toBe("500");
        expect(result.complement).toBe("apto. 78");
        expect(result.city).toBe("City A");
        expect(result.state).toBe("State B");
        expect(result.zipCode).toBe("7000-010");
        expect(result.items.length).toBe(2);
        expect(result.items[0].id).toBe("p01");
        expect(result.items[0].name).toBe("product A");
        expect(result.items[0].price).toBe(52);
        expect(result.items[1].id).toBe("p02");
        expect(result.items[1].name).toBe("product 2");
        expect(result.items[1].price).toBe(10.52);
        expect(result.total).toBe(62.52)
    })
})

let product01 = {
    id: "p01",
    name: "product 1",
    description: "product A",
    salesPrice: 52,
    createdAt: new Date(),
    updatedAt: new Date()
};

let product02 = {
    id: "p02",
    name: "product 2",
    description: "product A",
    salesPrice: 10.52,
    createdAt: new Date(),
    updatedAt: new Date()
};

let product05 = {
    id: "p05",
    name: "product 5",
    description: "product x",
    salesPrice: 5.50,
    createdAt: new Date(),
    updatedAt: new Date()
};

const MockStoreCatalogFacade = () =>{
    return {
        find: jest.fn().mockImplementation((id: FindStoreCatalogFacadeInputDto)=>{
            if (id.id == "p01"){                
                return product01;
            }else if (id.id == "p02"){                
                return product02;
            }

            return null;
        }),
        findAll: jest.fn(),
    }
}

async function createProducts() {
    const products = [product01, product02];
    await Promise.all(
        products.map(async product =>{
            await ProductModel.create({
                id: product.id,
                name: product.name,
                price: product.salesPrice,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt
            });
        })
    )
}