import express, {Request, Response} from 'express';
import ClientAdmFacadeFactory from '../../../modules/client-adm/factory/client-adm.facade.factory';

export const clientRoute = express.Router();

clientRoute.post("/", async (req: Request, res: Response)=>{
    
    try{
        const facade = ClientAdmFacadeFactory.create();
    
        const clientInputDto = {
            id: req.body.id,
            name: req.body.name,
            document: req.body.document,
            email: req.body.email,
            street: req.body.street,
            complement: req.body.complement,
            number: req.body.number,
            city: req.body.city,
            state: req.body.state,
            zipCode: req.body.zipCode
        };
    
        const output = await facade.add(clientInputDto);
        res.send(output);
        
    }catch(error){
        res.status(500).send(error);
    }

})