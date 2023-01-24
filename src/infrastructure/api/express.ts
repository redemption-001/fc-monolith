import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { Dialect } from "sequelize/types";
import ClientModel from "../../modules/client-adm/repository/client.model";
import { ProductModel as ProductAdmModel} from "../../modules/product-adm/repository/product.model";
import ProductModel from "../../modules/store-catalog/repository/product.model";
import { OrderModel as OrderTransactionModel } from "../../modules/payment/repository/order.model";
import TransactionModel from "../../modules/payment/repository/transaction.model";
import InvoiceModel from "../../modules/invoice/repository/invoice.model";
import InvoiceItemModel from "../../modules/invoice/repository/invoice-item.model";
import ProductInvoiceModel from "../../modules/invoice/repository/product.model";
import ClientCheckoutModel from "../../modules/checkout/repository/client.model";
import OrderModel from "../../modules/checkout/repository/order.model";
import OrderProductModel from "../../modules/checkout/repository/order-product.model";
import ProductCheckoutModel from "../../modules/checkout/repository/product.model";
import { productRoute } from "./routes/product.route";
import { clientRoute } from "./routes/client.route";
import { checkoutRoute } from "./routes/checkout.route";
import { invoiceRoute } from "./routes/invoice.route";
import dotenv from "dotenv";

export const app: Express = express();
app.use(express.json());
app.use("/products", productRoute);
app.use("/clients", clientRoute);
app.use("/checkout", checkoutRoute);
app.use("/invoice", invoiceRoute);

export let sequelize: Sequelize;

async function setUpDB() {
    dotenv.config();
    
    sequelize = new Sequelize({
        dialect: process.env.DB_DIALECT as Dialect,
        storage: process.env.DB_STORAGE,
        logging: false,
    })

    sequelize.addModels([
        ClientModel, 
        ProductAdmModel, 
        ProductModel, 
        ClientCheckoutModel, OrderModel, ProductCheckoutModel, OrderProductModel,
        OrderTransactionModel, TransactionModel,
        InvoiceModel, InvoiceItemModel, ProductInvoiceModel
    ]);
}

setUpDB();