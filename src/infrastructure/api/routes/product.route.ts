import express, {Request, Response} from 'express';
import ProductAdmFacadeFactory from '../../../modules/product-adm/factory/facade.factory';

export const productRoute = express.Router();

productRoute.post("/", async (req: Request, res: Response)=>{
    
    try{
        const facade = ProductAdmFacadeFactory.create();
    
        const productInputDto = {
            id: req.body.id,
            name: req.body.name,
            description: req.body.description,
            purchasePrice: req.body.purchasePrice,
            salesPrice: req.body.salesPrice,
            stock: req.body.stock,
        };
    
        await facade.addProduct(productInputDto);
        res.send();
        
    }catch(error){
        res.status(500).send(error);
    }

})