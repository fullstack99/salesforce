import { Router } from "express";
import { helpers, Customer } from "commerce-sdk";
import sfccConfig from "../config/sfcc";

const wishlistRouter = Router({ mandatory: true, nullable: false });

wishlistRouter.get("/:customerId", async (req, res) => {
  const bearerToken = req.headers.authorization;
  sfccConfig.headers["authorization"] = bearerToken;
  const customerId = req.params.customerId;

  try {
    const client = new Customer.ShopperCustomers(sfccConfig);
    const response = await client.getCustomerProductLists({
      parameters: {
        organizationId: sfccConfig.parameters.organizationId,
        siteId: sfccConfig.parameters.siteId,
        customerId: customerId,
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

wishlistRouter.post("/", async (req, res) => {
  const bearerToken = req.headers.authorization;
  sfccConfig.headers["authorization"] = bearerToken;
  const customerId = req.body.customerId;
  try {
    const client = new Customer.ShopperCustomers(sfccConfig);
    const response = await client.createCustomerProductList({
      parameters: {
        organizationId: sfccConfig.parameters.organizationId,
        siteId: sfccConfig.parameters.siteId,
        customerId: customerId,
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

wishlistRouter.get("/:listId", async (req, res) => {
  const bearerToken = req.headers.authorization;
  sfccConfig.headers["authorization"] = bearerToken;
  const { customerId } = req.query;

  try {
    const client = new Customer.ShopperCustomers(sfccConfig);
    const response = await client.getCustomerProductList({
      parameters: {
        organizationId: sfccConfig.parameters.organizationId,
        siteId: sfccConfig.parameters.siteId,
        customerId: customerId,
        listId: req.params.listId,
      },
      headers: sfccConfig.headers,
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

wishlistRouter.put("/:listId", async (req, res) => {
  const bearerToken = req.headers.authorization;
  sfccConfig.headers["authorization"] = bearerToken;
  const customerId = req.body.customerId;

  try {
    const client = new Customer.ShopperCustomers(sfccConfig);
    const response = await client.updateCustomerProductList({
      parameters: {
        organizationId: sfccConfig.parameters.organizationId,
        siteId: sfccConfig.parameters.siteId,
        customerId: customerId,
        listId: req.params.listId,
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

wishlistRouter.delete("/:listId", async (req, res) => {
  const bearerToken = req.headers.authorization;
  sfccConfig.headers["authorization"] = bearerToken;
  const { customerId } = req.body;

  try {
    const client = new Customer.ShopperCustomers(sfccConfig);
    const response = await client.deleteCustomerProductList({
      parameters: {
        organizationId: sfccConfig.parameters.organizationId,
        siteId: sfccConfig.parameters.siteId,
        customerId: customerId,
        listId: req.params.listId,
      },
      headers: sfccConfig.headers,
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

export default wishlistRouter;
