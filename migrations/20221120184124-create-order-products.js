'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_products', {
      orderId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        references: { model: 'orders', key: 'id'}
      },
      productId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        references: { model: 'products', key: 'id'}
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('order_products');
  }
};