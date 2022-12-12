import { Column, HasOne, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    tableName: "orders",
    timestamps: false
})
export class OrderModel extends Model{
    @PrimaryKey
    @Column({ allowNull: false })
    id: string;

    @Column({ allowNull: false, field: 'created_at'})
    createdAt: Date;
  
    @Column({ allowNull: false, field: 'updated_at'})
    updatedAt: Date;
}