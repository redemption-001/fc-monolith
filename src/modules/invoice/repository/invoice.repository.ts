import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/entity/invoice.entity";
import Product from "../domain/entity/product.entity";
import Address from "../domain/value-object/address";
import InvoiceGateway from "../gateway/invoice.gateway.interface";
import { InvoiceItemModel } from "./invoice-item.model";
import { InvoiceModel } from "./invoice.model";
import { ProductModel } from "./product.model";

export default class InvoiceRepository implements InvoiceGateway{
    async find(id: string): Promise<Invoice> {
        const invoice = await InvoiceModel.findOne({
            where: {id: id},
            include: [
                {
                    model: InvoiceItemModel,
                    include: [ProductModel]
                }
            ]
        });

        if (!invoice) {
            throw new Error(`Invoice with id ${id} not found`);
        }

        return new Invoice({
            id: new Id(invoice.id),
            name: invoice.name,
            document: invoice.document,
            address: new Address({
                street: invoice.street,
                number: invoice.number,
                complement: invoice.complement,
                city: invoice.city,
                state: invoice.state,
                zipCode: invoice.zipCode
            }),
            items: invoice.items.map(item =>{
                return new Product({
                    id: new Id(item.productId),
                    name: item.product.name,
                    price: item.product.price
                })
            }),
            createdAt: invoice.createdAt,
            updateAt: invoice.updatedAt
        });
    }

    async save(invoice: Invoice): Promise<void> {
        await this.validateProducts(invoice.items);

        await InvoiceModel.create({
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zipCode: invoice.address.zipCode,
            items: invoice.items.map(item =>{
                return {
                    invoiceId: invoice.id.id,
                    productId: item.id.id,
                    price: item.price
                }
            }),
            createdAt: invoice.createdAt || new Date(),
            updatedAt: invoice.updatedAt || new Date(),
        },
        {
          include: [{ model: InvoiceItemModel }],
        })
    }

    private async validateProducts(products: Product[]){
        await Promise.all(
            products.map( async product => {
                let productExists = await ProductModel.findOne({ where: {id : product.id.id}});

                if(!productExists){                    
                    throw new Error(`Product ${product.id.id} - ${product.name} does not exist`);
                }
            })
        );
    }

}