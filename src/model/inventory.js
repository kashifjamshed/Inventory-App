const mongoose = require("mongoose");
const joi = require("joi");

//creating mongoose schema and model
const Inventory = mongoose.model(
  "Inventory",
  new mongoose.Schema({
    inventoryType: { type: String, required: true },
    inventoryItem: { type: String, required: true },
    itemQuantity: { type: Number },
    itemAddedDate: { type: String },
    itemRemovedDate: { type: String },
  })
);

//validate function for request body
const validateInventoryItem = (item) => {
  const schema = {
    inventoryType: joi.string().required(),
    inventoryItem: joi.string().required(),
    itemQuantity: joi.number(),
    itemAddedDate: joi.string(),
    itemRemoveDate: joi.string(),
  };
  return joi.validate(item, schema);
};

module.exports.Inventory = Inventory;
module.exports.validate = validateInventoryItem;
