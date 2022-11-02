import { FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO } from "../usecase/find-invoice/find-invoice.dto";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "../usecase/generate-invoice/generate-invoice.dto";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
import InvoiceFacadeInterface from "./invoice.facade.interface";

export interface InvoiceFacadeProps{
    findInvoiceUsecase: FindInvoiceUseCase;
    generateInvoiceUseCase: GenerateInvoiceUseCase;
}

export default class InvoiceFacade implements InvoiceFacadeInterface{
    private _findInvoiceUsecase: FindInvoiceUseCase;
    private _generateInvoiceUseCase: GenerateInvoiceUseCase;

    constructor(props: InvoiceFacadeProps){
        this._findInvoiceUsecase = props.findInvoiceUsecase;
        this._generateInvoiceUseCase = props.generateInvoiceUseCase;
    }

    async find(input: FindInvoiceUseCaseInputDTO): Promise<FindInvoiceUseCaseOutputDTO> {
        return await this._findInvoiceUsecase.execute(input);
    }

    async generate(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
        return await this._generateInvoiceUseCase.execute(input);        
    }
}