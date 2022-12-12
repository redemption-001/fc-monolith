import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import OrderModel from "./order.model";
import ProductModel from "./product.model";

@Table({
    tableName: 'order_products',
    timestamps: false
})
export default class OrderProductModel extends Model{
    @ForeignKey(()=>OrderModel)
    @PrimaryKey
    @Column({allowNull: false})
    orderId: string;

    @ForeignKey(()=>ProductModel)
    @PrimaryKey
    @Column({allowNull: false})
    productId: string;

    @BelongsTo(()=>OrderModel)
    order: OrderModel;

    @BelongsTo(()=>ProductModel)
    product: ProductModel;
}