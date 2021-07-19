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
import { INSTANCE_URL, SITE_ID, API_CLIENT_ID } from "../config/auth";

const sessionRouter = Router({ mergeParams: true });

sessionRouter.get("/", (req, res) => {
  helpers
    .getShopperToken(sfccConfig, { type: "guest" })
    .then((shopperToken) => {
      try {
        // Add the token to the client configuration
        console.log(shopperToken);
        const bearerToken = shopperToken.getBearerHeader();
        sfccConfig.headers["authorization"] = bearerToken; // jwt bearer for active session
        const authToken = shopperToken.getAuthToken(); // auth and bearer are the same
        const customerInfo = shopperToken.getCustomerInfo();
        const expireAt = shopperToken.decodedToken.exp;
        const sessionStartTime = shopperToken.decodedToken.iat;
        res.status(200).send({ authToken, customerInfo, bearerToken, expireAt, sessionStartTime });
      } catch (e) {
        console.log(e);
        res.sendStatus(500);
      }
    })
    .catch((e) => {
      console.log(e);
      res.sendStatus(500);
    });
});

sessionRouter.get("/refresh", async (req, res) => {
  try {
    const headers = { Authorization: req.headers.authorization };
    const client = new Customer.ShopperCustomers(sfccConfig);

    const response = await client.authorizeCustomer(
      { headers: headers, body: { type: "refresh" } },
      true
    );
    if (!response.ok) {
      throw new ResponseError(response);
    }
    const customerInfo = await getObjectFromResponse(response);
    const shopperToken = new ShopperToken(
        customerInfo,
        stripBearer(response.headers.get("Authorization"))
      );
    console.log(shopperToken);
    const expireAt = shopperToken.decodedToken.exp;
    const sessionStartTime = shopperToken.decodedToken.iat;
    res.status(200).send({
      success: true,
      customerInfo,
      refreshToken: stripBearer(response.headers.get("Authorization"),
      expireAt,
      sessionStartTime
      ),
    });
  } catch (err) {
    res.status(err.status).send({ success: false, statusText: err.statusText, error: err });
  }
});

sessionRouter.get("/cookie", async (req, res) => {
  try {
    const headers = {
      Authorization: req.headers.authorization,
      "Content-Type": "application/json",
    };
    const response = await axios({
      method: "POST",
      url: `${INSTANCE_URL}s/${SITE_ID}/dw/shop/v21_3/sessions`,
      headers: headers,
      data: {},
    });
    res.setHeader("Set-Cookie", response.headers["set-cookie"]);
    res.status(200).send({ success: true });
  } catch (err) {
    res.status(500).send({ success: false, err });
  }
});

export default sessionRouter;
