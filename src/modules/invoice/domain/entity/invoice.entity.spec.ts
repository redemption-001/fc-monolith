import Id from "../../../@shared/domain/value-object/id.value-object"
import Address from "../value-object/address"
import Invoice from "./invoice.entity"
import Product from "./product.entity"

describe("Invoice Entity Unit Tests", ()=>{
    it("Should create a invoice entity", ()=>{
        const today = new Date();
        const invoice = new Invoice({
            name: "Jane Doe",
            document: "77774444",
            address: new Address({
                street: "street A",
                number: "151",
                complement: "apt. 47",
                city: "city w",
                state: "state z",
                zipCode: "4444-444",
            }),
            items: [
                new Product({
                    id: new Id("p1"),
                    name: "product 1",
                    price: 77.78
                }),
                new Product({
                    id: new Id("p2"),
                    name: "product 2",
                    price: 2.02
                })
            ],
            createdAt: today
        });

        expect(invoice.id.id).not.toBeNull();
        expect(invoice.name).toBe("Jane Doe");
        expect(invoice.document).toBe("77774444");
        expect(invoice.address.street).toBe("street A");
        expect(invoice.address.number).toBe("151");
        expect(invoice.address.complement).toBe("apt. 47");
        expect(invoice.address.city).toBe("city w");
        expect(invoice.address.state).toBe("state z");
        expect(invoice.address.zipCode).toBe("4444-444");
        expect(invoice.items.length).toBe(2);
        expect(invoice.items[0].id.id).toBe("p1");
        expect(invoice.items[0].name).toBe("product 1");
        expect(invoice.items[0].price).toBe(77.78);
        expect(invoice.items[1].id.id).toBe("p2");
        expect(invoice.items[1].name).toBe("product 2");
        expect(invoice.items[1].price).toBe(2.02);
        expect(invoice.total()).toBe(79.8)
        expect(invoice.createdAt).toStrictEqual(today);
    });

    it("Should not create a invoice entity", ()=>{
        const today = new Date();

        expect(()=>{
            const invoice = new Invoice({
                name: "Jane Doe",
                document: "77774444",
                address: new Address({
                    street: "street A",
                    number: "151",
                    complement: "apt. 47",
                    city: "city w",
                    state: "state z",
                    zipCode: "4444-444",
                }),
                items: null,
                createdAt: today
            });            
        }).toThrow("Product is required");

        expect(()=>{
            const invoice = new Invoice({
                name: "Jane Doe",
                document: "77774444",
                address: null,
                items: [
                    new Product({
                        id: new Id("p1"),
                        name: "product 1",
                        price: 77.78
                    }),
                    new Product({
                        id: new Id("p2"),
                        name: "product 2",
                        price: 2.02
                    })
                ],
                createdAt: today
            });            
        }).toThrow("Address is required");
    });
})