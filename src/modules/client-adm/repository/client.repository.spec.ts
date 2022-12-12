import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/entity/client.entity";
import Address from "../domain/value-object/address";
import ClientModel from "./client.model";
import ClientRepository from "./client.repository";
var Umzug = require("umzug");
import dotenv from "dotenv";
import { Dialect } from "sequelize/types";

describe("ClientRepository test", () => {

  let sequelize: Sequelize;
  let seeder: any;
  dotenv.config();

  beforeEach(async ()=>{
      sequelize = new Sequelize({
          dialect: process.env.DB_DIALECT as Dialect,
          storage: process.env.DB_STORAGE,
          logging: false
      })
        
      var seedsConfig = {
        storage: "sequelize",
        storageOptions: {
          sequelize: sequelize,
          modelName: 'SequelizeData'
        },
        migrations: {
          params: [
            sequelize.getQueryInterface(),
            sequelize.constructor
          ],
          path: "./seeders",
          pattern: /\.js$/
        }
      };

      seeder = new Umzug(seedsConfig);    
      await seeder.up();

      sequelize.addModels([ClientModel]);
  })

  afterEach(async ()=>{
    await seeder.down();
    await sequelize.close();
  })

  it("should create a client", async () => {
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
        zipCode: "77777999",
      })
    });

    const repository = new ClientRepository();
    await repository.add(client);

    const clientDb = await ClientModel.findOne({ where: { id: "1" } });

    expect(clientDb).toBeDefined();
    expect(clientDb.id).toBe(client.id.id);
    expect(clientDb.name).toBe(client.name);
    expect(clientDb.document).toBe(client.document);
    expect(clientDb.email).toBe(client.email);
    expect(clientDb.street).toBe(client.address.street);
    expect(clientDb.complement).toBe(client.address.complement);
    expect(clientDb.number).toBe(client.address.number);
    expect(clientDb.city).toBe(client.address.city);
    expect(clientDb.state).toBe(client.address.state);
    expect(clientDb.zipCode).toBe(client.address.zipCode);
    expect(clientDb.createdAt).toStrictEqual(client.createdAt);
    expect(clientDb.updatedAt).toStrictEqual(client.updatedAt);
  });

  it("should find a client", async () => {
    const client = await ClientModel.create({
      id: "1",
      name: "Client 1",
      document: "777777999",
      email: "x@x.com",
      street: "street 1",
      complement: "apto 2",
      number: "500",
      city: "city z",
      state: "state w",
      zipCode: "77777999",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const repository = new ClientRepository();
    const result = await repository.find(client.id);

    expect(result.id.id).toEqual(client.id);
    expect(result.name).toEqual(client.name);
    expect(result.document).toEqual(client.document);
    expect(result.email).toEqual(client.email);
    expect(result.address.street).toBe(client.street);
    expect(result.address.complement).toBe(client.complement);
    expect(result.address.number).toBe(client.number);
    expect(result.address.city).toBe(client.city);
    expect(result.address.state).toBe(client.state);
    expect(result.address.zipCode).toBe(client.zipCode);
    expect(result.createdAt).toStrictEqual(client.createdAt);
    expect(result.updatedAt).toStrictEqual(client.updatedAt);
  });
});
