import { Router } from "express";
import { helpers, Customer, Checkout } from "commerce-sdk";
import axios from "axios";

import sfccConfig from "../config/sfcc";
import { INSTANCE_URL, SITE_ID } from "../config/auth";

const cartRouter = Router({ mandatory: true, nullable: false });

cartRouter.get("/", async (req, res) => {
  const bearerToken = req.headers.authorization;
  sfccConfig.headers["authorization"] = bearerToken;
  const customerId = req.query.customerId;
  try {
    const client = new Customer.ShopperCustomers(sfccConfig);
    const response = await client.getCustomerBaskets({
      parameters: {
        organizationId: sfccConfig.parameters.organizationId,
        siteId: sfccConfig.parameters.siteId,
        customerId: customerId,
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

cartRouter.get("/:basketId", async (req, res) => {
  const bearerToken = req.headers.authorization;
  sfccConfig.headers["authorization"] = bearerToken;
  try {
    const basket = new Checkout.ShopperBaskets(sfccConfig);
    const response = await basket.getBasket({
      parameters: {
        organizationId: sfccConfig.parameters.organizationId,
        siteId: sfccConfig.parameters.siteId,
        basketId: req.params.basketId,
      },
      headers: sfccConfig.headers,
      body: req.body,
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

cartRouter.post("/", async (req, res) => {
  const bearerToken = req.headers.authorization;
  sfccConfig.headers["authorization"] = bearerToken;
  try {
    const basket = new Checkout.ShopperBaskets(sfccConfig);
    const response = await basket.createBasket({
      parameters: {
        organizationId: sfccConfig.parameters.organizationId,
        siteId: sfccConfig.parameters.siteId,
      },
      headers: sfccConfig.headers,
      body: req.body,
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

cartRouter.patch("/:basketId", async (req, res) => {
  const bearerToken = req.headers.authorization;
  sfccConfig.headers["authorization"] = bearerToken;

  try {
    const basket = new Checkout.ShopperBaskets(sfccConfig);
    const response = await basket.updateBasket({
      parameters: {
        organizationId: sfccConfig.parameters.organizationId,
        siteId: sfccConfig.parameters.siteId,
        basketId: req.params.basketId,
      },
      headers: sfccConfig.headers,
      body: req.body,
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

cartRouter.put("/:basketId/customer", async (req, res) => {
  const bearerToken = req.headers.authorization;
  sfccConfig.headers["authorization"] = bearerToken;

  try {
    const basket = new Checkout.ShopperBaskets(sfccConfig);
    const response = await basket.updateCustomerForBasket({
      parameters: {
        organizationId: sfccConfig.parameters.organizationId,
        siteId: sfccConfig.parameters.siteId,
        basketId: req.params.basketId,
      },
      headers: sfccConfig.headers,
      body: req.body,
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

cartRouter.put("/:basketId/billing_address", async (req, res) => {
  const bearerToken = req.headers.authorization;
  sfccConfig.headers["authorization"] = bearerToken;

  try {
    const basket = new Checkout.ShopperBaskets(sfccConfig);
    const response = await basket.updateBillingAddressForBasket({
      parameters: {
        organizationId: sfccConfig.parameters.organizationId,
        siteId: sfccConfig.parameters.siteId,
        basketId: req.params.basketId,
      },
      headers: sfccConfig.headers,
      body: req.body,
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

cartRouter.post("/:basketId/shipments", async (req, res) => {
  const bearerToken = req.headers.authorization;
  sfccConfig.headers["authorization"] = bearerToken;

  try {
    const basket = new Checkout.ShopperBaskets(sfccConfig);
    const response = await basket.createShipmentForBasket({
      parameters: {
        organizationId: sfccConfig.parameters.organizationId,
        siteId: sfccConfig.parameters.siteId,
        basketId: req.params.basketId,
      },
      headers: sfccConfig.headers,
      body: req.body,
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

cartRouter.post("/:basketId/items", async (req, res) => {
  const bearerToken = req.headers.authorization;
  sfccConfig.headers["authorization"] = bearerToken;

  try {
    const basket = new Checkout.ShopperBaskets(sfccConfig);
    const response = await basket.addItemToBasket({
      parameters: {
        organizationId: sfccConfig.parameters.organizationId,
        siteId: sfccConfig.parameters.siteId,
        basketId: req.params.basketId,
      },
      headers: sfccConfig.headers,
      body: req.body.product,
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
  // try {
  //   const headers = {
  //     Authorization: req.headers.authorization,
  //     "Content-Type": "application/json",
  //   };
  //   const { data } = await axios({
  //     method: "POST",
  //     url: `${INSTANCE_URL}s/${SITE_ID}/dw/shop/v21_3/baskets/${req.params.basketId}/items`,
  //     headers: headers,
  //     data: req.body,
  //   });
  //   res.status(200).send({ success: true, data: data });
  // } catch (err) {
  //   res.status(500).send({ success: false, err });
  // }
});

cartRouter.delete("/:basketId/:productId", async (req, res) => {
  const bearerToken = req.headers.authorization;
  sfccConfig.headers["authorization"] = bearerToken;

  try {
    const basket = new Checkout.ShopperBaskets(sfccConfig);
    const response = await basket.removeItemFromBasket({
      parameters: {
        organizationId: sfccConfig.parameters.organizationId,
        siteId: sfccConfig.parameters.siteId,
        basketId: req.params.basketId,
        itemId: req.params.productId,
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

cartRouter.post("/:basketId/coupons", async (req, res) => {
  const bearerToken = req.headers.authorization;
  sfccConfig.headers["authorization"] = bearerToken;

  try {
    const basket = new Checkout.ShopperBaskets(sfccConfig);
    const response = await basket.addCouponToBasket({
      parameters: {
        organizationId: sfccConfig.parameters.organizationId,
        siteId: sfccConfig.parameters.siteId,
        basketId: req.params.basketId,
      },
      headers: sfccConfig.headers,
      body: req.body,
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

cartRouter.post("/:basketId/gift_certificates", async (req, res) => {
  const bearerToken = req.headers.authorization;
  sfccConfig.headers["authorization"] = bearerToken;

  try {
    const basket = new Checkout.ShopperBaskets(sfccConfig);
    const response = await basket.addGiftCertificateItemToBasket({
      parameters: {
        organizationId: sfccConfig.parameters.organizationId,
        siteId: sfccConfig.parameters.siteId,
        basketId: req.params.basketId,
      },
      headers: sfccConfig.headers,
      body: req.body,
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

cartRouter.post("/:basketId/payment_instruments", async (req, res) => {
  const bearerToken = req.headers.authorization;
  sfccConfig.headers["authorization"] = bearerToken;

  try {
    const basket = new Checkout.ShopperBaskets(sfccConfig);
    const response = await basket.addPaymentInstrumentToBasket({
      parameters: {
        organizationId: sfccConfig.parameters.organizationId,
        siteId: sfccConfig.parameters.siteId,
        basketId: req.params.basketId,
      },
      headers: sfccConfig.headers,
      body: req.body,
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

export default cartRouter;
