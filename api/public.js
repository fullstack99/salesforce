import { Router } from "express";
import { helpers, Customer } from "commerce-sdk";
import sfccConfig from "../config/sfcc";

const publicRouter = Router({ mandatory: true, nullable: false });

publicRouter.get("/:listId", async (req, res) => {
  const bearerToken = req.headers.authorization;
  sfccConfig.headers["authorization"] = bearerToken;
  const listId = req.params.listId;

  try {
    const client = new Customer.ShopperCustomers(sfccConfig);
    const response = await client.getPublicProductList({
      parameters: {
        organizationId: sfccConfig.parameters.organizationId,
        siteId: sfccConfig.parameters.siteId,
        listId: listId,
      },
    });
    res.status(200).send({
      data: response,
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      error: err,
    });
  }
});

publicRouter.get("/:listId/items/:itemId", async (req, res) => {
  const bearerToken = req.headers.authorization;
  sfccConfig.headers["authorization"] = bearerToken;
  try {
    const client = new Customer.ShopperCustomers(sfccConfig);
    const response = await client.getProductListItem({
      parameters: {
        organizationId: sfccConfig.parameters.organizationId,
        siteId: sfccConfig.parameters.siteId,
        customerId: customerId,
        listId: req.params.listId,
        itemId: req.params.itemId,
      },
      headers: sfccConfig.headers,
      body: { ...req.body.wishInfo },
    });
    res.status(200).send({
      data: response,
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      error: err,
    });
  }
});

export default publicRouter;
