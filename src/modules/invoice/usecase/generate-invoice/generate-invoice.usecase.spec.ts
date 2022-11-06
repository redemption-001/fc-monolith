import Id from "../../../@shared/domain/value-object/id.value-object";
import { FindStoreCatalogFacadeInputDto } from "../../../store-catalog/facade/store-catalog.facade.interface";
import ProductStoreCatalog from "../../../store-catalog/domain/product.entity";
import Invoice from "../../domain/entity/invoice.entity";
import Product from "../../domain/entity/product.entity";
import Address from "../../domain/value-object/address";
import { GenerateInvoiceUseCaseInputDto } from "./generate-invoice.dto";
import GenerateInvoiceUseCase from "./generate-invoice.usecase";

describe("Generate Invoice Use Case Tests", ()=>{    

    it("Should generate a invoice", async ()=>{
        const invoiceRepository = MockInvoiceGateway();
        const mockCatalogFacade = MockStoreCatalogFacade();
        const generateUseCase = new GenerateInvoiceUseCase(invoiceRepository, mockCatalogFacade);

        const input = {
            name: "Fulano 1",
            document: "789.789.000-00",
            street: "Street A",
            number: "500",
            complement: "apto. 78",
            city: "City A",
            state: "State B",
            zipCode: "7000-010",
            items: [
                {
                    id: "p01",
                    name: "product A", 
                    price: 52,
                },
                {
                    id: "p05",
                    name: "product x", 
                    price: 10.15,
                }
            ]        
        }

        const result = await generateUseCase.execute(input);

        expect(result.id).not.toBeNull();
        expect(result.name).toBe("Fulano 1");
        expect(result.document).toBe("789.789.000-00");
        expect(result.street).toBe("Street A");
        expect(result.number).toBe("500");
        expect(result.complement).toBe("apto. 78");
        expect(result.city).toBe("City A");
        expect(result.state).toBe("State B");
        expect(result.zipCode).toBe("7000-010");
        expect(result.items).toHaveLength(2);
        expect(result.items[0].id).toBe("p01");
        expect(result.items[0].name).toBe("product A");
        expect(result.items[0].price).toBe(52);
        expect(result.items[1].id).toBe("p05");
        expect(result.items[1].name).toBe("product x");
        expect(result.items[1].price).toBe(10.15);
        expect(result.total).toBe(62.15);
    })

    it("Should not generate a invoice without a valid product", async ()=>{
        const invoiceRepository = MockInvoiceGateway();
        const mockCatalogFacade = MockStoreCatalogFacade();
        const generateUseCase = new GenerateInvoiceUseCase(invoiceRepository, mockCatalogFacade);

        let input: GenerateInvoiceUseCaseInputDto = {
            name: "Fulano 1",
            document: "789.789.000-00",
            street: "Street A",
            number: "500",
            complement: "apto. 78",
            city: "City A",
            state: "State B",
            zipCode: "7000-010",
            items: null
        }

        expect(async ()=>{
            await generateUseCase.execute(input);
        }).rejects.toThrow("Product is required");

        input = {
            name: "Fulano 1",
            document: "789.789.000-00",
            street: "Street A",
            number: "500",
            complement: "apto. 78",
            city: "City A",
            state: "State B",
            zipCode: "7000-010",
            items: [
                {
                    id: "p01",
                    name: "product A", 
                    price: 52,
                },
                {
                    id: "p05",
                    name: "product x", 
                    price: 10.15,
                },
                {
                    id: "p07",
                    name: "product w", 
                    price: 22.24,
                }
            ] 
        }

        expect(async ()=>{
            await generateUseCase.execute(input);
        }).rejects.toThrow("Product p07 - product w not found");
    })
})

const invoice = new Invoice({
    id: new Id("1"),
    name: "Fulano 1",
    document: "789.789.000-00",
    address: new Address({
      street: "Street A",
      number: "500",
      complement: "apt. 78",
      city: "City A",
      state: "State B",
      zipCode: "7000-010",
    }),
    items: [
        new Product({
            id: new Id("p01"),
            name: "product A", 
            price: 52,
        }),
        new Product({
            id: new Id("p05"),
            name: "product x", 
            price: 10.15,
        }),
        new Product({
            id: new Id("p07"),
            name: "product w", 
            price: 22.24,
        })
    ],
    createdAt: new Date(),
    updateAt: new Date()
})

const MockInvoiceGateway = () =>{
    return {
        find: jest.fn(),
        save: jest.fn().mockReturnValue(Promise.resolve(invoice))
    }
}

let product01 = new ProductStoreCatalog({
    id: new Id("p01"),
    name: "product 1",
    description: "product A",
    salesPrice: 52,
});

let product05 = new ProductStoreCatalog({
    id: new Id("p05"),
    name: "product 2",
    description: "product x",
    salesPrice: 10.15,
});

const MockStoreCatalogFacade = () =>{
    return {
        find: jest.fn().mockImplementation((id: FindStoreCatalogFacadeInputDto)=>{
            if (id.id == "p01"){                
                return product01;
            }else if (id.id == "p05"){                
                return product05;
            }

            return null;
        }),
        findAll: jest.fn(),
    }
}