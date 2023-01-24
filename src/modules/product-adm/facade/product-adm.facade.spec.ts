import { Sequelize } from "sequelize-typescript";
import ProductAdmFacadeFactory from "../factory/facade.factory";
import { ProductModel } from "../repository/product.model";
var Umzug = require("umzug");
import dotenv from "dotenv";
import { Dialect } from "sequelize/types";
var sequelizeRC = require("../../../../.sequelizerc");

describe("ProductAdmFacade test", () => {
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

    sequelize.addModels([ProductModel]);
  })

  afterEach(async ()=>{
    await seeder.down();
    await sequelize.close();
  })
  
  it("should create a product", async () => {
    // const productRepository = new ProductRepository();
    // const addProductUseCase = new AddProductUseCase(productRepository);
    // const productFacade = new ProductAdmFacade({
    //   addUseCase: addProductUseCase,
    //   stockUseCase: undefined,
    // });

    const productFacade = ProductAdmFacadeFactory.create();

    const input = {
      id: "1",
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 10,
      salesPrice: 50,
      stock: 10,
    };

    await productFacade.addProduct(input);

    const product = await ProductModel.findOne({ where: { id: "1" } });
    expect(product).toBeDefined();
    expect(product.id).toBe(input.id);
    expect(product.name).toBe(input.name);
    expect(product.description).toBe(input.description);
    expect(product.purchasePrice).toBe(input.purchasePrice);
    expect(product.salesPrice).toBe(input.salesPrice);
    expect(product.stock).toBe(input.stock);
  });

  it("should check product stock", async () => {
    const productFacade = ProductAdmFacadeFactory.create();
    const input = {
      id: "1",
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 10,
      salesPrice: 50,
      stock: 10,
    };
    await productFacade.addProduct(input);

    const result = await productFacade.checkStock({ productId: "1" });

    expect(result.productId).toBe(input.id);
    expect(result.stock).toBe(input.stock);
  });
});
