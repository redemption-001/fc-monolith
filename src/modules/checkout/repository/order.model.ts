import { Table, Model, PrimaryKey, Column, ForeignKey, BelongsTo, BelongsToMany, HasMany } from "sequelize-typescript";
import ClientModel from "./client.model";
import OrderProductModel from "./order-product.model";
import ProductModel from "./product.model";

@Table({
    tableName: "orders",
    timestamps: false,
})
export default class OrderModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    id: string;

    @ForeignKey(() => ClientModel)
    @Column({ allowNull: false })
    client_id: string

    @BelongsTo(() => ClientModel)
    client: ClientModel;

    @BelongsToMany(() => ProductModel, {through: {model: () =>OrderProductModel}})
    products: ProductModel[];

    @Column({ allowNull: false })
    status: string;

    @Column({ allowNull: false })
    total: number;

    @Column({ allowNull: false, field: 'created_at'})
    createdAt: Date;
  
    @Column({ allowNull: false, field: 'updated_at'})
    updatedAt: Date;
}