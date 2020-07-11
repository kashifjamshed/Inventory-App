const { Inventory, validate } = require("../model/inventory");
const express = require("express");
const router = express.Router();

//get a details to specific inventory type
//pass inventory type as parameters
router.get("/:inventoryType", async (req, res) => {
  try {
    const inventory = await Inventory.find({
      inventoryType: req.params.inventoryType,
    });
    if (!inventory.length) {
      res.status(400);
      res.send("Inventory type Not Found");
      return;
    }
    res.send(inventory);
  } catch (error) {
    res.status(400);
    res.send(error.message);
  }
});
//get a details to specific inventory type ans item
//pass inventory type and inventory item as parameters
router.get("/:inventoryType/:inventoryItem", async (req, res) => {
  try {
    const inventory = await Inventory.find({
      inventoryType: req.params.inventoryType,
      inventoryItem: req.params.inventoryItem,
    });
    if (!inventory.length) {
      res.status(400);
      res.send("Inventory item Not Found");
      return;
    }
    res.send(inventory);
  } catch (error) {
    res.status(400);
    res.send(error.message);
  }
});

//it is adding new document in DB if item comes first time and increase its quantity by 1
//also handled case when there is post request again on same type and item which increase its quantit by 1 everytime
router.post("/", async (req, res) => {
  const validation = validate(req.body);
  if (validation.error) {
    res.status(400);
    res.send(validation.error.details[0].message);
    return;
  }

  let inventory = await Inventory.find({
    inventoryType: req.body.inventoryType,
    inventoryItem: req.body.inventoryItem,
  });

  if (!inventory.length) {
    inventory = new Inventory({
      inventoryType: req.body.inventoryType,
      inventoryItem: req.body.inventoryItem,
      itemQuantity: 1,
      itemAddedDate: req.date,
    });
    inventory = await inventory.save();
    res.send(inventory);
  } else {
    const quantity = inventory[0].itemQuantity;
    inventory = await Inventory.findOneAndUpdate(
      {
        inventoryType: req.body.inventoryType,
        inventoryItem: req.body.inventoryItem,
      },
      {
        itemQuantity: quantity + 1,
      },
      { new: true }
    );
    res.send(inventory);
  }
});

//it is decreasing quantity of removed item by 1 everytime and
//also handled underflow case when item quantity is zero and client tried to delete
router.delete("/:inventoryType/:inventoryItem", async (req, res) => {
  try {
    let inventory = await Inventory.find({
      inventoryType: req.params.inventoryType,
      inventoryItem: req.params.inventoryItem,
    });
    if (!inventory.length) {
      res.status(400);
      res.send("Inventory item Not Found");
      return;
    }
    const quantity = inventory[0].itemQuantity;
    if (quantity) {
      inventory = await Inventory.findOneAndUpdate(
        {
          inventoryType: req.params.inventoryType,
          inventoryItem: req.params.inventoryItem,
        },
        {
          itemRemovedDate: req.date,
          itemQuantity: quantity - 1,
        },
        { new: true }
      );
      res.send(inventory);
    } else {
      res.status(400);
      res.send("Item Quantity is zero and hence can not be removed");
    }
  } catch (error) {
    res.send("ERROR:" + error.message);
  }
});

//activity tracker which gives all details like added date removed date and current quantity
//of a specific item
router.get(
  "/trackermechanism/:inventoryType/:inventoryItem",
  async (req, res) => {
    try {
      const inventory = await Inventory.find({
        inventoryType: req.params.inventoryType,
        inventoryItem: req.params.inventoryItem,
      });
      if (!inventory.length) {
        res.status(400);
        res.send("Inventory item Not Found");
        return;
      }
      res.send(inventory);
    } catch (error) {
      res.status(400);
      res.send(error.message);
    }
  }
);

module.exports = router;
