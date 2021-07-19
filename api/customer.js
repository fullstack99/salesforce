// shopper and User APIs

import { Router } from "express";
import { Customer } from "commerce-sdk";
import sfccConfig from "../config/sfcc";
import axios from "axios";
import { INSTANCE_URL, SITE_ID } from "../config/auth";

const customerRouter = Router({ mandatory: true, nullable: false });

customerRouter.get("/:listId/members/:memberId", async (req, res) => {
  const bearerToken = req.headers.authorization;
  sfccConfig.headers["authorization"] = bearerToken;
  const client = new Customer.Customers(sfccConfig);
  try {
    const response = await client.getCustomerFromCustomerList({
      parameters: {
        organizationId: sfccConfig.parameters.organizationId,
        listId: req.params.listId,
        customerNo: req.params.memberId,
      },
      headers: sfccConfig.headers,
    });
    // const headers = {
    //   Authorization: req.headers.authorization,
    //   "Content-Type": "application/json",
    // };
    // const response = await axios({
    //   method: "GET",
    //   url: `${INSTANCE_URL}s/${SITE_ID}/dw/data/v21_3/sites/${SITE_ID}/customer_groups/${req.params.listId}/members/${req.params.memberId}`,
    //   headers: headers,
    // });
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

customerRouter.put("/:listId/members/:memberId", async (req, res) => {
  const bearerToken = req.headers.authorization;
  sfccConfig.headers["authorization"] = bearerToken;
  const client = new Customer.Customers(sfccConfig);
  try {
    const response = await client.updateCustomerInCustomerList({
      parameters: {
        organizationId: sfccConfig.parameters.organizationId,
        listId: req.params.listId,
        customerNo: req.params.memberId,
      },
      headers: sfccConfig.headers,
      body: req.body,
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

customerRouter.delete("/:listId/members/:memberId", async (req, res) => {
  const bearerToken = req.headers.authorization;
  sfccConfig.headers["authorization"] = bearerToken;
  const client = new Customer.Customers(sfccConfig);
  try {
    const response = await client.deleteCustomerFromCustomerList({
      parameters: {
        organizationId: sfccConfig.parameters.organizationId,
        listId: req.params.listId,
        customerNo: req.params.memberId,
      },
      headers: sfccConfig.headers,
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

export default customerRouter;
