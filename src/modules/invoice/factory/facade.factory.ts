import StoreCatalogFacadeInterface from "../../store-catalog/facade/store-catalog.facade.interface";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
import InvoiceFacade from "../facade/invoice.facade";
import InvoiceGateway from "../gateway/invoice.gateway.interface";
import InvoiceRepository from "../repository/invoice.repository";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";

type InvoiceFactoryProps = {
    repository?: InvoiceGateway,
    catalogFacade?: StoreCatalogFacadeInterface,
    findInvoiceUseCase?: FindInvoiceUseCase,
    generateInvoiceUseCase?: GenerateInvoiceUseCase
}

export default class InvoiceFactory {

    static create(props: InvoiceFactoryProps): InvoiceFacade{
        const invoiceGateway = props.repository || new InvoiceRepository();
        const catalogFacade = props.catalogFacade || StoreCatalogFacadeFactory.create();
        const findInvoiceUseCase = props.findInvoiceUseCase || new FindInvoiceUseCase(invoiceGateway);
        const generateInvoiceUseCase = props.generateInvoiceUseCase || new GenerateInvoiceUseCase(invoiceGateway, catalogFacade);

        return new InvoiceFacade({
            findInvoiceUsecase: findInvoiceUseCase, 
            generateInvoiceUseCase: generateInvoiceUseCase
        });
    }
    
}