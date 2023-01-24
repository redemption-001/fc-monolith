import { Sequelize } from "sequelize-typescript";
import PaymentFacadeFactory from "../factory/payment.facade.factory";
import { OrderModel } from "../repository/order.model";
import TransactionModel from "../repository/transaction.model";
var Umzug = require("umzug");
import dotenv from "dotenv";
import { Dialect } from "sequelize/types";
var sequelizeRC = require("../../../../.sequelizerc");

describe("PaymentFacade test", () => {
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
  
  it("should create a transaction", async () => {
    // const repository = new TransactionRepostiory();
    // const usecase = new ProcessPaymentUseCase(repository);
    // const facade = new PaymentFacade(usecase);

    await createOrder();
    const facade = PaymentFacadeFactory.create();

    const input = {
      orderId: "order-1",
      amount: 100,
    };

    const output = await facade.process(input);

    expect(output.transactionId).toBeDefined();
    expect(output.orderId).toBe(input.orderId);
    expect(output.amount).toBe(input.amount);
    expect(output.status).toBe("approved");
  });
});

async function createOrder(){
  await OrderModel.create({
    id: "order-1",
    createdAt: Date,
    updatedAt: Date
  });
}