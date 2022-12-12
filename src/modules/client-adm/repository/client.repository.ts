import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/entity/client.entity";
import clientEntity from "../domain/entity/client.entity";
import Address from "../domain/value-object/address";
import ClientGateway from "../gateway/client.gateway";
import ClientModel from "./client.model";

export default class ClientRepository implements ClientGateway {
  async add(client: clientEntity): Promise<void> {
    await ClientModel.create({
      id: client.id.id,
      name: client.name,
      document: client.document,
      email: client.email,
      street: client.address.street,
      complement: client.address.complement,
      number: client.address.number,
      city: client.address.city,
      state: client.address.state,
      zipCode: client.address.zipCode,      
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    });
  }
  async find(id: string): Promise<clientEntity> {
    const client = await ClientModel.findOne({ where: { id } });

    if (!client) {
      throw new Error("Client not found");
    }

    return new Client({
      id: new Id(client.id),
      name: client.name,
      document: client.document,
      email: client.email,
      address: new Address({
        street: client.street,
        complement: client.complement,
        number: client.number,
        city: client.city,
        state: client.state,
        zipCode: client.zipCode,
      }),
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    });
  }
}
