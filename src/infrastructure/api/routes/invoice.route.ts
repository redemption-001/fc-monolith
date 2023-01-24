import express, {Request, Response} from 'express';
import CheckoutFacadeFactory from '../../../modules/checkout/factory/checkout-facade.factory';
import InvoiceFactory from '../../../modules/invoice/factory/facade.factory';

export const invoiceRoute = express.Router();

invoiceRoute.get("/:id", async (req: Request, res: Response)=>{
    
    try{
        const facade = InvoiceFactory.create({});
    
        const invoiceInputDto = {
            id: req.params.id
        };
        
        const output = await facade.find(invoiceInputDto);
        res.send(output);
        
    }catch(error){
        res.status(500).send(error);
    }

})