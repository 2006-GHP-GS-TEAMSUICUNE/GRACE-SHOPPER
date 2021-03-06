"use strict";

const { User, Product, Order, OrderItem, db } = require("../server/db/models/index");
const { userSeed, productSeed, orderSeed, orderItemSeed } = require("../seedFiles"); // goes to seedFiles/index.js
async function seed() {
  await db.sync({ force: true });
  console.log("db synced!");

  const users = await Promise.all([User.bulkCreate(userSeed)]);
  const products = await Promise.all([Product.bulkCreate(productSeed)]);
  const orders = await Promise.all([Order.bulkCreate(orderSeed)]);
  const orderItems = await Promise.all([OrderItem.bulkCreate(orderItemSeed)]);

  console.log(`seeded users`);
  console.log(`seeded products`);
  console.log(`seeded orders`)
  console.log(`seeded orderItems`)
  console.log(`seeded successfully`);
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log("seeding...");
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log("closing db connection");
    await db.close();
    console.log("db connection closed");
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed();
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;
