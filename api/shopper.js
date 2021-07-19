// shopper and User APIs

import { Router } from "express";
import { helpers, Customer } from "commerce-sdk";
import {
  getObjectFromResponse,
  ResponseError,
  ShopperToken,
  stripBearer,
} from "@commerce-apps/core";
import axios from "axios";

import sfccConfig from "../config/sfcc";
import {
  API_CLIENT_ID,
  API_CLIENT_PASSWORD,
  SITE_ID,
  INSTANCE_URL,
  REDIRECT_URL,
  CHANNEL_ID,
} from "../config/auth";

const shopperRouter = Router({ mandatory: true, nullable: false });

shopperRouter.post("/register", async (req, res) => {
  const bearerToken = req.headers.authorization;
  sfccConfig.headers["authorization"] = bearerToken;
  const client = new Customer.ShopperCustomers(sfccConfig);
  try {
    const data = {
      ...req.body,
    };
    data.customer.login = req.body.customer.email;
    const response = await client.registerCustomer({
      sfccConfig,
      body: { ...data },
    });
    res.status(200).send({
      user: response,
      success: true,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      error: err,
    });
  }
});

shopperRouter.post("/login", async (req, res) => {
  const credentials = `${req.body.login}:${req.body.password}`;
  const buff = Buffer.from(credentials);
  const base64data = buff.toString("base64");
  const headers = { Authorization: `Basic ${base64data}` };

  try {
    const client = new Customer.ShopperCustomers(sfccConfig);
    const response = await client.authorizeCustomer(
      {
        parameters: {
          organizationId: sfccConfig.parameters.organizationId,
          siteId: sfccConfig.parameters.siteId,
          clientId: sfccConfig.parameters.clientId,
        },
        headers: headers,
        body: { type: "credentials" },
      },
      true
    );

    if (!response.ok) {
      throw new ResponseError(response);
    }

    const customerInfo = await getObjectFromResponse(response);
    // get the epiration time and session start time
    const shopperToken = new ShopperToken(
      customerInfo,
      stripBearer(response.headers.get("Authorization"))
    );
    const expireAt = shopperToken.decodedToken.exp;
    const sessionStartTime = shopperToken.decodedToken.iat;
    res.status(200).send({
      user: customerInfo,
      expireAt,
      sessionStartTime,
      getAuthToken: response.headers.get("Authorization"),
      success: true,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      error: err,
    });
  }
});

shopperRouter.post("/reset_password", async (req, res) => {
  const bearerToken = req.headers.authorization;
  sfccConfig.headers["authorization"] = bearerToken;

  try {
    const client = new Customer.ShopperCustomers(sfccConfig);
    const response = await client.resetPassword({
      parameters: {
        organizationId: sfccConfig.parameters.organizationId,
        siteId: sfccConfig.parameters.siteId,
      },
      headers: sfccConfig.headers,
      body: { ...req.body },
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

shopperRouter.post("/reset_password_request", async (req, res) => {
  const bearerToken = req.headers.authorization;
  sfccConfig.headers["authorization"] = bearerToken;
  try {
    // const client = new Customer.ShopperCustomers(sfccConfig);
    // const response = await client.getResetPasswordToken({
    //   parameters: {
    //     organizationId: sfccConfig.parameters.organizationId,
    //     siteId: sfccConfig.parameters.siteId,
    //   },
    //   headers: sfccConfig.headers,
    //   body: {
    //     ...req.body,
    //     client_id: API_CLIENT_ID,
    //   },
    // });

    const data = await axios({
      method: "POST",
      url: `${INSTANCE_URL}s/${SITE_ID}/dw/shop/v21_3/customers/password_reset?client_id=${API_CLIENT_ID}`,
      headers: {
        ...sfccConfig.headers,
        "Content-Type": "application/json",
      },
      data: { ...req.body },
    });

    res.status(200).send({
      data: "Please check your email",
      success: true,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      error: err,
    });
  }
});

shopperRouter.post("/update_password", async (req, res) => {
  const bearerToken = req.headers.authorization;
  sfccConfig.headers["authorization"] = bearerToken;

  try {
    const client = new Customer.ShopperCustomers(sfccConfig);
    const response = await client.updateCustomerPassword({
      parameters: {
        organizationId: sfccConfig.parameters.organizationId,
        customerId: sfccConfig.parameters.clientId,
        siteId: sfccConfig.parameters.siteId,
      },
      headers: sfccConfig.headers,
      body: { ...req.body },
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

shopperRouter.post("/oauth2/login", async (req, res) => {
  const credentials = `${req.body.login}:${req.body.password}`;
  const buff = Buffer.from(credentials);
  const base64data = buff.toString("base64");
  const headers = {
    Authorization: `Basic ${base64data}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const client = new Customer.ShopperLogin(sfccConfig);
  try {
    const response = await client.authenticateCustomer({
      parameters: {
        organizationId: sfccConfig.parameters.organizationId,
      },
      headers: headers,
      body: {
        client_id: API_CLIENT_ID,
        response_type: "code",
        redirect_uri: REDIRECT_URL,
        code_challenge: req.body.code_challenge,
        channel_id: CHANNEL_ID,
        scope: "email",
      },
    });
    res.status(200).send({
      data: response,
      success: true,
    });
  } catch (err) {
    console.log("oauth2/login error", err);
    res.status(500).send({
      success: false,
      error: err,
    });
  }
});

shopperRouter.get("/oauth2/authorize", async (req, res) => {
  const bearerToken = { Authorization: req.headers.authorization };
  sfccConfig.headers["authorization"] = bearerToken;
  const client = new Customer.ShopperLogin(sfccConfig);
  try {
    const response = await client.authorizeCustomer({
      parameters: {
        organizationId: sfccConfig.parameters.organizationId,
        redirect_uri: REDIRECT_URL,
        response_type: "code",
        client_id: API_CLIENT_ID,
        code_challenge: req.query.code_challenge,
      },
      headers: sfccConfig.headers,
    });
    res.status(200).send({
      data: response,
      success: true,
    });
  } catch (err) {
    console.log("oauth2/authorize err", err);
    res.status(500).send({
      success: false,
      error: err,
    });
  }
});

shopperRouter.get("/oauth2/userinfo", async (req, res) => {
  const bearerToken = { Authorization: req.headers.authorization };
  sfccConfig.headers["authorization"] = bearerToken;
  const client = new Customer.ShopperLogin(sfccConfig);
  try {
    const response = await client.getUserInfo({
      parameters: {
        organizationId: sfccConfig.parameters.organizationId,
      },
      headers: sfccConfig.headers,
    });
    res.status(200).send({
      data: response,
      success: true,
    });
  } catch (err) {
    console.log("oauth2/userinfo error", err);
    res.status(500).send({
      success: false,
      error: err,
    });
  }
});

shopperRouter.get("/oauth2/logout", async (req, res) => {
  const bearerToken = req.headers.authorization;
  sfccConfig.headers["authorization"] = bearerToken;
  const client = new Customer.ShopperLogin(sfccConfig);
  try {
    const response = await client.logoutCustomer({
      parameters: {
        organizationId: sfccConfig.parameters.organizationId,
        client_id: API_CLIENT_ID,
        refresh_token: req.query.refresh_token,
      },
      headers: sfccConfig.headers,
    });
    res.status(200).send({
      user: response,
      success: true,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      error: err,
    });
  }
});

shopperRouter.post("/logout", async (req, res) => {
  const bearerToken = req.headers.authorization;
  sfccConfig.headers["authorization"] = bearerToken;

  try {
    const client = new Customer.ShopperCustomers(sfccConfig);
    await client.invalidateCustomerAuth({
      headers: sfccConfig.headers,
      parameters: {
        organizationId: sfccConfig.parameters.organizationId,
        siteId: sfccConfig.parameters.siteId,
      },
    });
    res.status(200).send({
      success: true,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      error: err,
    });
  }
});

export default shopperRouter;
