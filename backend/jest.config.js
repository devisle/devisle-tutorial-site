const dotenv = require("dotenv");
const tsJest = require("ts-jest/jest-preset");
const jestMongo = require("@shelf/jest-mongodb/jest-preset");
dotenv.config();
/**
 * For multiple presets, ...spread them into this final object
 */
module.exports =  {
  ...tsJest,
  ...jestMongo,
  globals: {
    name: "DevIsle tutorial site",
    testEnvironment: "node",
    reporters: ["default", "jest-junit"],
    __SPECIFIC__MONGO_DB_NAME__: process.env.DB_URL,
    __SPECIFIC__MONGO_URI__: process.env.DB_NAME
  }
};

