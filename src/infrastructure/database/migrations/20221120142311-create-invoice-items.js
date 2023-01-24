'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('invoice_items', {
      id_invoice: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        references: { model: 'invoices', key: 'id'}
      },
      id_product: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        references: { model: 'products', key: 'id'}
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('invoice_items');
  }
};