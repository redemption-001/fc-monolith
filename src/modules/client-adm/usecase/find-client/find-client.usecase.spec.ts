import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/entity/client.entity";
import Address from "../../domain/value-object/address";
import FindClientUseCase from "./find-client.usecase";

const client = new Client({
  id: new Id("1"),
  name: "Client 1",
  document: "111111",
  email: "x@x.com",
  address: new Address({
    street: "street 1",
    complement: "apto 2",
    number: "500",
    city: "city z",
    state: "state w",
    zipCode: "77777999" 
  })
});

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(client)),
  };
};

describe("Find Client Usecase unit test", () => {
  it("should find a client", async () => {
    const repository = MockRepository();
    const usecase = new FindClientUseCase(repository);

    const input = {
      id: "1",
    };

    const result = await usecase.execute(input);

    expect(repository.find).toHaveBeenCalled();
    expect(result.id).toEqual(input.id);
    expect(result.name).toEqual(client.name);
    expect(result.document).toEqual(client.document);
    expect(result.email).toEqual(client.email);
    expect(result.street).toBe(client.address.street);
    expect(result.complement).toBe(client.address.complement);
    expect(result.number).toBe(client.address.number);
    expect(result.city).toBe(client.address.city);
    expect(result.state).toBe(client.address.state);
    expect(result.zipCode).toBe(client.address.zipCode);
    expect(result.createdAt).toEqual(client.createdAt);
    expect(result.updatedAt).toEqual(client.updatedAt);
  });
});
