import express, {Request, Response} from 'express';
import CheckoutFacadeFactory from '../../../modules/checkout/factory/checkout-facade.factory';

export const checkoutRoute = express.Router();

checkoutRoute.post("/", async (req: Request, res: Response)=>{
    
    try{
        const facade = CheckoutFacadeFactory.create({});
    
        const checkoutInputDto = {
            clientId: req.body.clientId,
            products: req.body.products
        };
        
        const output = await facade.placeOrder(checkoutInputDto);

        res.send(output);
        
    }catch(error){
        res.status(500).send(error);
    }

})