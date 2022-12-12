import { Sequelize } from "sequelize-typescript";
import StoreCatalogFacadeFactory from "../factory/facade.factory";
import ProductModel from "../repository/product.model";
var Umzug = require("umzug");
import dotenv from "dotenv";
import { Dialect } from "sequelize/types";

describe("StoreCatalogFacade test", () => {
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

      sequelize.addModels([ProductModel]);
  })

  afterEach(async ()=>{
    await seeder.down();
    await sequelize.close();
  })
  
  it("should find a product", async () => {
    const facade = StoreCatalogFacadeFactory.create();
    await ProductModel.create({
      id: "1",
      name: "Product 1",
      description: "Description 1",
      salesPrice: 100,
      createdAt: Date(),
      updatedAt: Date()
    });

    const result = await facade.find({ id: "1" });

    expect(result.id).toBe("1");
    expect(result.name).toBe("Product 1");
    expect(result.description).toBe("Description 1");
    expect(result.salesPrice).toBe(100);
  });

  it("should find all products", async () => {
    const facade = StoreCatalogFacadeFactory.create();
    await ProductModel.create({
      id: "1",
      name: "Product 1",
      description: "Description 1",
      salesPrice: 100,
      createdAt: Date(),
      updatedAt: Date()
    });
    await ProductModel.create({
      id: "2",
      name: "Product 2",
      description: "Description 2",
      salesPrice: 200,
      createdAt: Date(),
      updatedAt: Date()
    });

    const result = await facade.findAll();

    expect(result.products.length).toBe(2);
    expect(result.products[0].id).toBe("1");
    expect(result.products[0].name).toBe("Product 1");
    expect(result.products[0].description).toBe("Description 1");
    expect(result.products[0].salesPrice).toBe(100);
    expect(result.products[1].id).toBe("2");
    expect(result.products[1].name).toBe("Product 2");
    expect(result.products[1].description).toBe("Description 2");
    expect(result.products[1].salesPrice).toBe(200);
  });
});
