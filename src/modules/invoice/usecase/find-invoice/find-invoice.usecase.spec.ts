import Id from "../../../@shared/domain/value-object/id.value-object"
import Invoice from "../../domain/entity/invoice.entity"
import Product from "../../domain/entity/product.entity";
import Address from "../../domain/value-object/address";
import FindInvoiceUseCase from "./find-invoice.usecase"

describe("Find Invoice usecase tests", () => {

    const invoice = new Invoice({
        id: new Id("1"),
        name: "Fulano Ciclano",
        document: "987.654.321-00",
        address: new Address({
          street: "orange street",
          number: "500",
          complement: "apt. 45",
          city: "City 1",
          state: "State 3",
          zipCode: "4747-200",
        }),
        items: [
                new Product({
                    id: new Id("p1"),
                    name: "product 1",
                    price: 5.50,
                }),
                new Product({
                    id: new Id("p5"),
                    name: "product 5",
                    price: 40.35,
                })
            ]
        ,
        createdAt: new Date(),
        updateAt: new Date()
    });

    const MockInvoiceGateway = () => {
        return {
            find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
            save: jest.fn()
        }
    }

    it("Should return a invoice", async ()=>{
        const invoiceGateway = MockInvoiceGateway();
        const findInvoiceUseCase = new FindInvoiceUseCase(invoiceGateway);
        
        const output = await findInvoiceUseCase.execute({ id: "1"});
        
        expect(output.id).toBe("1");
        expect(output.name).toBe("Fulano Ciclano");
        expect(output.document).toBe("987.654.321-00");
        expect(output.address.street).toBe("orange street");
        expect(output.address.number).toBe("500");
        expect(output.address.complement).toBe("apt. 45");
        expect(output.address.city).toBe("City 1");
        expect(output.address.state).toBe("State 3");
        expect(output.address.zipCode).toBe("4747-200");
        expect(output.items).toHaveLength(2);
        expect(output.items[0].id).toBe("p1");
        expect(output.items[0].name).toBe("product 1");
        expect(output.items[0].price).toBe(5.50);
        expect(output.items[1].id).toBe("p5");
        expect(output.items[1].name).toBe("product 5");
        expect(output.items[1].price).toBe(40.35);
        expect(output.total).toBe(45.85);
        expect(output.createdAt).toStrictEqual(invoice.createdAt);
    })
})