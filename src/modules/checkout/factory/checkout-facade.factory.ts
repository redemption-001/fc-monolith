import ClientAdmFacadeInterface from "../../client-adm/facade/client-adm.facade.interface";
import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory";
import InvoiceFacadeInterface from "../../invoice/facade/invoice.facade.interface";
import InvoiceFactory from "../../invoice/factory/facade.factory";
import PaymentFacadeInterface from "../../payment/facade/facade.interface";
import PaymentFacadeFactory from "../../payment/factory/payment.facade.factory";
import ProductAdmFacadeInterface from "../../product-adm/facade/product-adm.facade.interface";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import StoreCatalogFacade from "../../store-catalog/facade/store-catalog.facade";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
import CheckoutFacade from "../facade/checkout.facade";
import CheckoutGateway from "../gateway/checkout.gateway";
import CheckoutRepository from "../repository/checkout.repository";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";

type CheckoutFacadeFactoryProps = {
    clientFacade?: ClientAdmFacadeInterface, 
    productFacade?: ProductAdmFacadeInterface, 
    catalogFacade?: StoreCatalogFacade, 
    repository?: CheckoutGateway, 
    invoiceFacade?: InvoiceFacadeInterface, 
    paymentFacade?: PaymentFacadeInterface,
    placeOrder?: PlaceOrderUseCase
}
export default class CheckoutFacadeFactory{
    static create(props: CheckoutFacadeFactoryProps){
        const clientFacade = props.clientFacade || ClientAdmFacadeFactory.create();
        const productFacade = props.productFacade || ProductAdmFacadeFactory.create();
        const catalogFacade = props.catalogFacade || StoreCatalogFacadeFactory.create(); 
        const repository = props.repository || new CheckoutRepository();
        const invoiceFacade = props.invoiceFacade || InvoiceFactory.create({});
        const paymentFacade = props.paymentFacade || PaymentFacadeFactory.create();
        const placeOrder = props.placeOrder || new PlaceOrderUseCase(clientFacade, productFacade, catalogFacade, repository, invoiceFacade, paymentFacade)

        return new CheckoutFacade({
            placeOrder: placeOrder
        })
    }
}