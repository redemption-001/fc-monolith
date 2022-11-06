import { BelongsTo, Column, ForeignKey, HasOne, Model, PrimaryKey, Table } from "sequelize-typescript";
import { InvoiceModel } from "./invoice.model";
import { ProductModel } from "./product.model";

@Table({
    tableName: "invoice_items",
    timestamps: false,
})
export class InvoiceItemModel extends Model{
    @ForeignKey(() => InvoiceModel)
    @Column({ allowNull: false , field: "id_invoice"})
    invoiceId: string;

    @ForeignKey(() => ProductModel)
    @Column({ allowNull: false , field: "id_product"})
    productId: string;
    
    @BelongsTo(() => ProductModel)
    product: ProductModel;
}