import { Table, Model, PrimaryKey, Column, ForeignKey, BelongsTo, BelongsToMany } from "sequelize-typescript";
import OrderProductModel from "./order-product.model";
import OrderModel from "./order.model";

@Table({
    tableName: "products",
    timestamps: false,
})
export default class ProductModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    id: string;

    @Column({ allowNull: false })
    name: string;

    @Column({ allowNull: false })
    description: string;

    @Column({ allowNull: false })
    salesPrice: number;
    
    @BelongsToMany(() => OrderModel, {through: {model: ()=> OrderProductModel}})
    order: OrderModel[];

    @Column({ allowNull: false, field: 'created_at'})
    createdAt: Date;
  
    @Column({ allowNull: false, field: 'updated_at'})
    updatedAt: Date;
}