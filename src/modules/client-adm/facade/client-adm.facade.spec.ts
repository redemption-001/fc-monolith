import { Sequelize } from "sequelize-typescript";
import ClientAdmFacadeFactory from "../factory/client-adm.facade.factory";
import { ClientModel } from "../repository/client.model";
import ClientRepository from "../repository/client.repository";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import ClientAdmFacade from "./client-adm.facade";

describe("ClientAdmFacade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ClientModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a client", async () => {
    const repository = new ClientRepository();
    const addUsecase = new AddClientUseCase(repository);
    const facade = new ClientAdmFacade({
      addUsecase: addUsecase,
      findUsecase: undefined,
    });

    const input = {
      id: "1",
      name: "Client 1",
      document: "11111",
      email: "x@x.com",
      street: "street 1",
      complement: "apto 2",
      number: "500",
      city: "city z",
      state: "state w",
      zipCode: "77777999"
    };

    await facade.add(input);

    const client = await ClientModel.findOne({ where: { id: "1" } });

    expect(client).toBeDefined();
    expect(client.name).toBe(input.name);
    expect(client.document).toBe(input.document);
    expect(client.email).toBe(input.email);
    expect(client.street).toBe(input.street);
    expect(client.complement).toBe(input.complement);
    expect(client.number).toBe(input.number);
    expect(client.city).toBe(input.city);
    expect(client.state).toBe(input.state);
    expect(client.zipCode).toBe(input.zipCode);
  });

  it("should find a client", async () => {
    // const repository = new ClientRepository();
    // const findUsecase = new FindClientUseCase(repository);
    // const addUsecase = new AddClientUseCase(repository);
    // const facade = new ClientAdmFacade({
    //   addUsecase: addUsecase,
    //   findUsecase: findUsecase,
    // });

    const facade = ClientAdmFacadeFactory.create();

    const input = {
      id: "1",
      name: "Client 1",
      document: "11111",
      email: "x@x.com",
      street: "street 1",
      complement: "apto 2",
      number: "500",
      city: "city z",
      state: "state w",
      zipCode: "77777999"
    };

    await facade.add(input);

    const client = await facade.find({ id: "1" });

    expect(client).toBeDefined();
    expect(client.id).toBe(input.id);
    expect(client.name).toBe(input.name);
    expect(client.document).toBe(input.document);
    expect(client.email).toBe(input.email);
    expect(client.street).toBe(input.street);
    expect(client.complement).toBe(input.complement);
    expect(client.number).toBe(input.number);
    expect(client.city).toBe(input.city);
    expect(client.state).toBe(input.state);
    expect(client.zipCode).toBe(input.zipCode);
  });
});
