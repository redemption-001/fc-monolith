import AggregateRoot from "../../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../../@shared/domain/entity/base.entity";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Address from "../value-object/address";
import Product from "./product.entity";

type InvoiceProps = {
    id?: Id;
    name: string;
    document: string;
    address: Address;
    items: Product[];
    createdAt?: Date;
    updateAt?: Date;
}

export default class Invoice extends BaseEntity implements AggregateRoot{
    private _name: string;
    private _document: string;
    private _address: Address;
    private _items: Product[];

    constructor(props: InvoiceProps){
        super(props.id, props.createdAt, props.updateAt);
        this._name = props.name;
        this._document = props.document;
        this._address = props.address;
        this._items = props.items;
        this.validate();
    }
    
    get name(): string {
        return this._name;
    }
    
    get document(): string {
        return this._document;
    }

    get address(): Address {
        return this._address;
    }
    
    get items(): Product[] {
        return this._items;
    }

    private validate(){
        if (!this._items || this.items.length<=0){
            throw new Error("Product is required");
        }

        if (!this.address) {
            throw new Error("Address is required");
        }
    }

    total(): number{
        let sum = this.items.reduce((sum, item) => { 
            return sum + item.price
        }, 0);

        return parseFloat(sum.toFixed(2));
    }
}