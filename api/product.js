import { Router } from "express";
import { helpers, Customer } from "commerce-sdk";
import axios from "axios";

import sfccConfig from "../config/sfcc";
import { SITE_ID, INSTANCE_URL } from "../config/auth";

const productRouter = Router({ mandatory: true, nullable: false });

productRouter.get("/:itemId", async (req, res) => {
  const bearerToken = req.headers.authorization;
  sfccConfig.headers["authorization"] = bearerToken;
  const { customerId, listId } = req.query;

  try {
    const client = new Customer.ShopperCustomers(sfccConfig);
    const response = await client.getCustomerProductListItem({
      parameters: {
        organizationId: sfccConfig.parameters.organizationId,
        siteId: sfccConfig.parameters.siteId,
        customerId: customerId,
        listId: listId,
        itemId: req.params.itemId,
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

productRouter.post("/", async (req, res) => {
  const bearerToken = req.headers.authorization;
  sfccConfig.headers["authorization"] = bearerToken;
  const { customerId, listId } = req.body.customerInfo;

  try {
    const client = new Customer.ShopperCustomers(sfccConfig);
    const response = await client.createCustomerProductListItem({
      parameters: {
        organizationId: sfccConfig.parameters.organizationId,
        siteId: sfccConfig.parameters.siteId,
        customerId: customerId,
        listId: listId,
      },
      headers: sfccConfig.headers,
      body: req.body.product,
    });
    res.status(200).send({
      data: response,
      success: true,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      error: err,
    });
  }
});

productRouter.put("/:itemId", async (req, res) => {
  const bearerToken = req.headers.authorization;
  sfccConfig.headers["authorization"] = bearerToken;
  const { customerId, listId } = req.body;

  try {
    const client = new Customer.ShopperCustomers(sfccConfig);
    const response = await client.updateCustomerProductListItem({
      parameters: {
        organizationId: sfccConfig.parameters.organizationId,
        siteId: sfccConfig.parameters.siteId,
        customerId: customerId,
        listId: listId,
        itemId: req.params.itemId,
      },
      headers: sfccConfig.headers,
      body: { ...req.body.product },
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

productRouter.delete("/:itemId", async (req, res) => {
  const bearerToken = req.headers.authorization;
  sfccConfig.headers["authorization"] = bearerToken;
  const { customerId, listId } = req.query;

  try {
    const client = new Customer.ShopperCustomers(sfccConfig);
    const response = await client.deleteCustomerProductListItem({
      parameters: {
        organizationId: sfccConfig.parameters.organizationId,
        siteId: sfccConfig.parameters.siteId,
        customerId: customerId,
        listId: listId,
        itemId: req.params.itemId,
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

productRouter.get("/:pId/variations", async (req, res) => {
  const bearerToken = req.headers.authorization;
  sfccConfig.headers["authorization"] = bearerToken;
  try {
    const { data } = await axios({
      method: "GET",
      url: `${INSTANCE_URL}s/${SITE_ID}/dw/shop/v21_3/products/${req.params.pId}/variations`,
      headers: {
        ...sfccConfig.headers,
        "Content-Type": "application/json",
      },
    });

    res.status(200).send({
      data: data,
      success: true,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      error: err,
    });
  }
});

productRouter.get("/:pId/prices", async (req, res) => {
  const bearerToken = req.headers.authorization;
  sfccConfig.headers["authorization"] = bearerToken;
  try {
    const { data } = await axios({
      method: "GET",
      url: `${INSTANCE_URL}s/${SITE_ID}/dw/shop/v21_3/products/${req.params.pId}/prices`,
      headers: {
        ...sfccConfig.headers,
        "Content-Type": "application/json",
      },
    });

    res.status(200).send({
      data: data,
      success: true,
    });
  } catch (err) {
    console.warn(err);
    res.status(500).send({
      success: false,
      error: err,
    });
  }
});

export default productRouter;
