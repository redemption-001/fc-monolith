import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import Transaction from "../domain/transaction";
import { OrderModel } from "./order.model";
import TransactionModel from "./transaction.model";
import TransactionRepostiory from "./transaction.repository";
var Umzug = require("umzug");
import dotenv from "dotenv";
import { Dialect } from "sequelize/types";
var sequelizeRC = require("../../../../.sequelizerc");

describe("TransactionRepository test", () => {
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
          path: sequelizeRC["seeders-path"],
          pattern: /\.js$/
        }
      };

      seeder = new Umzug(seedsConfig);    
      await seeder.up();

      sequelize.addModels([TransactionModel, OrderModel]);
  })

  afterEach(async ()=>{
    await seeder.down();
    await sequelize.close();
  })
  
  it("should save a transaction", async () => {
    await createOrder();

    const transaction = new Transaction({
      id: new Id("1"),
      amount: 100,
      orderId: "o1",
      createdAt: new Date(),
      updatedAt: new Date()
    });
    transaction.approve();

    const repository = new TransactionRepostiory();
    const result = await repository.save(transaction);

    expect(result.id.id).toBe(transaction.id.id);
    expect(result.status).toBe("approved");
    expect(result.amount).toBe(transaction.amount);
    expect(result.orderId).toBe(transaction.orderId);
  });
});

async function createOrder(){
  await OrderModel.create({
    id: "o1",
    createdAt: Date,
    updatedAt: Date
  });
}