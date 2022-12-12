import { Sequelize } from "sequelize-typescript"
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../../client-adm/domain/entity/client.entity";
import Address from "../../client-adm/domain/value-object/address";
import ClientModel from "../../client-adm/repository/client.model";
import { ProductModel as ProductAdmModel} from "../../product-adm/repository/product.model";
import ProductModel from "../../store-catalog/repository/product.model";
import { OrderModel as OrderTransactionModel } from "../../payment/repository/order.model";
import TransactionModel from "../../payment/repository/transaction.model";
import InvoiceModel from "../../invoice/repository/invoice.model";
import InvoiceItemModel from "../../invoice/repository/invoice-item.model";
import ProductInvoiceModel from "../../invoice/repository/product.model";
import ClientCheckoutModel from "../repository/client.model";
import OrderModel from "../repository/order.model";
import OrderProductModel from "../repository/order-product.model";
import ProductCheckoutModel from "../repository/product.model";
import CheckoutFacadeFactory from "../factory/checkout-facade.factory";
var Umzug = require("umzug");
import dotenv from "dotenv";
import { Dialect } from "sequelize/types";

describe("Checkout Facade Tests", ()=>{
    let sequelize: Sequelize;
    let seeder: any;
    dotenv.config();
    
    beforeEach(async ()=>{
        sequelize = new Sequelize({
            dialect: process.env.DB_DIALECT as Dialect,
            storage: process.env.DB_STORAGE,
            logging: false,
        })
          
        var seedsConfig = {
            storage: "sequelize",
            storageOptions: {
              sequelize: sequelize,
              modelName: 'SequelizeData' // Or whatever you want to name the seeder storage table
            },
            migrations: {
              params: [
                sequelize.getQueryInterface(),
                sequelize.constructor
              ],
              path: "./seeders", // path to folder containing seeds
              pattern: /\.js$/
            }
          };

        seeder = new Umzug(seedsConfig);    
        await seeder.up();

        sequelize.addModels([
            ClientModel, 
            ProductAdmModel, 
            ProductModel, 
            ClientCheckoutModel, OrderModel, ProductCheckoutModel, OrderProductModel,
            OrderTransactionModel, TransactionModel,
            InvoiceModel, InvoiceItemModel, ProductInvoiceModel
        ]);

    })

    afterEach(async ()=>{
        await seeder.down();
        await sequelize.close();
    })
    
    it("Should place a order", async ()=>{
        await createClient();
        await createProducts();

        const checkoutFacade = CheckoutFacadeFactory.create({});

        const input = {
            clientId: "c1",
            products:[
                { productId: "p01" },
                { productId: "p02" },
                { productId: "p05" }
            ]
        }
        const response = await checkoutFacade.placeOrder(input);
        expect(response.id).toBeDefined();
        expect(response.invoiceId).toBeDefined();
        expect(response.status).toBe("approved");
        expect(response.total).toEqual(115.02);
        expect(response.products).toHaveLength(3);
        expect(response.products).toStrictEqual(input.products);
    })
})

const clientA = new Client({
    id: new Id("c1"),
    name: "client A",
    email: "john.doe@z.com",
    document: "x",
    address: new Address({
        street: "street a",
        number: "500",
        city: "city w",
        complement: "apto 1",
        state: "state q",
        zipCode: "zzzz-www"
    })
})

async function createClient(){
    await ClientModel.create({
        id: clientA.id.id,
        name: clientA.name,
        email: clientA.email,
        document: clientA.document,
        street: clientA.address.street,
        number: clientA.address.number,
        city: clientA.address.city,
        complement: clientA.address.complement,
        state: clientA.address.state,
        zipCode: clientA.address.zipCode,
        createdAt: Date(),
        updatedAt: Date()
    })
}

let product01 = {
    id: "p01",
    name: "product 1",
    description: "product A",
    purchasePrice: 52,
    salesPrice: 53,
    stock: 10
};

let product02 = {
    id: "p02",
    name: "product 2",
    description: "product A",
    purchasePrice: 10.52,
    salesPrice: 11.52,
    stock: 15
};

let product05 = {
    id: "p05",
    name: "product 5",
    description: "product x",
    purchasePrice: 5.50,
    salesPrice: 50.50,
    stock: 20
};

async function createProducts() {
    const products = [product01, product02, product05];
    await Promise.all(
        products.map(async product =>{
            await ProductAdmModel.create({
                id: product.id,
                name: product.name,
                description: product.description,
                purchasePrice: product.purchasePrice,
                salesPrice: product.salesPrice,
                stock: product.stock,
                createdAt: Date(),
                updatedAt: Date()
            });
        })
    )
}