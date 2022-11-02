import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import Invoice from "../../domain/entity/invoice.entity";
import ProductEntity from "../../domain/entity/product.entity";
import Address from "../../domain/value-object/address";
import InvoiceGateway from "../../gateway/invoice.gateway.interface";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generate-invoice.dto";

export default class GenerateInvoiceUseCase implements UseCaseInterface{
    private _repository: InvoiceGateway;
    private _catalogFacade : StoreCatalogFacadeInterface;

    constructor(repository: InvoiceGateway, catalogFacade: StoreCatalogFacadeInterface){
        this._repository = repository;
        this._catalogFacade = catalogFacade;
    }

    async execute(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
        await this.validateProducts(input);

        const invoice = new Invoice({
            name: input.name,
            document: input.document,
            address: new Address(
                {
                    street: input.street,
                    number: input.number,
                    complement: input.complement,
                    city: input.city,
                    state: input.state,
                    zipCode: input.zipCode
                }
            ),
            items: input.items.map(item =>{
                return new ProductEntity({
                    id: new Id(item.id),
                    name: item.name,
                    price: item.price
                })
            }), 
            createdAt: new Date(),
            updateAt: new Date()
        })

        await this._repository.save(invoice);

        return this.outputMapper(invoice);
    }

    private async validateProducts(input: GenerateInvoiceUseCaseInputDto) {
        if(!input.items || input.items.length==0){
            throw new Error("Product is required");
        }        
        await Promise.all(
            input.items.map(async item => {
                let product = await this._catalogFacade.find({id: item.id});
                            
                if(!product){
                    throw new Error(`Product ${item.id} - ${item.name} not found`);
                }
            }) 
        )
    }

    private outputMapper(invoice: Invoice): GenerateInvoiceUseCaseOutputDto{
        return {
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zipCode: invoice.address.zipCode,
            items: invoice.items.map((item)=>{
                return {
                    id: item.id.id,
                    name: item.name,
                    price: item.price
                }
            }),
            total: invoice.total()
          }
    }
}