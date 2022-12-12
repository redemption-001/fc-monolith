import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import CheckoutFacadeInterface, { PlaceOrderFacadeInputDto, PlaceOrderFacadeOutputDto } from "./checkout.facade.interface";

export interface UseCaseProps{
    placeOrder: UseCaseInterface;
}

export default class CheckoutFacade implements CheckoutFacadeInterface{
    private _placeOrder: UseCaseInterface;

    constructor(usecaseProps: UseCaseProps){
        this._placeOrder = usecaseProps.placeOrder;
    }

    async placeOrder(input: PlaceOrderFacadeInputDto): Promise<PlaceOrderFacadeOutputDto> {
        return await this._placeOrder.execute(input);
    }

}