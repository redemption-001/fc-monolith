import AddClientUseCase from "./add-client.usecase";

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn(),
  };
};

describe("Add Client Usecase unit test", () => {
  it("should add a client", async () => {
    const repository = MockRepository();
    const usecase = new AddClientUseCase(repository);

    const input = {
      name: "Client 1",
      document: "1111111",
      email: "x@x.com",
      street: "street 1",
      complement: "apto 2",
      number: "500",
      city: "city z",
      state: "state w",
      zipCode: "77777999"
    };

    const result = await usecase.execute(input);

    expect(repository.add).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toEqual(input.name);
    expect(result.document).toEqual(input.document);
    expect(result.email).toEqual(input.email);
    expect(result.street).toEqual(input.street);
    expect(result.complement).toEqual(input.complement);
    expect(result.number).toEqual(input.number);
    expect(result.city).toEqual(input.city);
    expect(result.state).toEqual(input.state);
    expect(result.zipCode).toEqual(input.zipCode);
  });
});
