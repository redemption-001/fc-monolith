import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import orderEntity from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import ClientModel from "./client.model";
import OrderProductModel from "./order-product.model";
import OrderModel from "./order.model";
import ProductModel from "./product.model";


export default class CheckoutRepository implements CheckoutGateway {

    async addOrder(order: orderEntity): Promise<void> {
        const client = await ClientModel.findOne({where: {id: order.client.id.id}});
        if(!client){
            ClientModel.create({
                id: order.client.id.id,
                name: order.client.name,
                email: order.client.email,
                address: order.client.address,
                createdAt: Date(),
                updatedAt: Date()
            })
        }

        await Promise.all(
            order.products.map(async p => {
                let product = await ProductModel.findOne({where: {id: p.id.id}})
                if(!product){
                    await ProductModel.create({
                        id: p.id.id,
                        name: p.name,
                        description: p.description,
                        salesPrice: p.salesPrice,
                        createdAt: Date(),
                        updatedAt: Date()
                    })                    
                }
            })
        )

        await OrderModel.create(
            {
                id: order.id.id,
                client_id: order.client.id.id,
                status: order.status,
                total: order.total,
                createdAt: Date(),
                updatedAt: Date()
            },
        );

        await Promise.all(
            order.products.map(async p => {
                await OrderProductModel.create({
                    orderId: order.id.id,
                    productId: p.id.id
                })
            })
        )

    }
    async findOrder(id: string): Promise<orderEntity> {
        const order = await OrderModel.findOne({
            where: { id: id },
            include: [ProductModel, ClientModel],
        })
        return new orderEntity({
            id: new Id(order.id),
            client: new Client({
                id: new Id(order.client.id),
                name: order.client.name,
                email: order.client.email,
                address: order.client.address
            }),
            products: order.products.map(p => {
                return new Product({
                    id: new Id(p.id),
                    name: p.name,
                    description: p.description,
                    salesPrice: p.salesPrice
                })
            })
        })
    }


}