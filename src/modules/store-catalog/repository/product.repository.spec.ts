import { Sequelize } from "sequelize-typescript";
import ProductModel from "./product.model";
import ProductRepository from "./product.repository";
var Umzug = require("umzug");
import dotenv from "dotenv";
import { Dialect } from "sequelize/types";

describe("ProductRepository test", () => {
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
  
  it("should find all products", async () => {
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

    const productRepository = new ProductRepository();
    const products = await productRepository.findAll();

    expect(products.length).toBe(2);
    expect(products[0].id.id).toBe("1");
    expect(products[0].name).toBe("Product 1");
    expect(products[0].description).toBe("Description 1");
    expect(products[0].salesPrice).toBe(100);
    expect(products[1].id.id).toBe("2");
    expect(products[1].name).toBe("Product 2");
    expect(products[1].description).toBe("Description 2");
    expect(products[1].salesPrice).toBe(200);
  });

  it("should find a product", async () => {
    await ProductModel.create({
      id: "1",
      name: "Product 1",
      description: "Description 1",
      salesPrice: 100,
      createdAt: Date(),
      updatedAt: Date()
    });

    const productRepository = new ProductRepository();
    const product = await productRepository.find("1");

    expect(product.id.id).toBe("1");
    expect(product.name).toBe("Product 1");
    expect(product.description).toBe("Description 1");
    expect(product.salesPrice).toBe(100);
  });
});
