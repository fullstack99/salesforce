import { Router } from "express";
import sessionRouter from "./session";
import shopperRouter from "./shopper";
import wishlistRouter from "./wishlist";
import cartRouter from "./cart";
import productRouter from "./product";
import customerRouter from "./customer";
import connectionRouter from "./connection";
import publicRouter from "./public";

const apiRouter = Router();

apiRouter.use("/session", sessionRouter);
apiRouter.use("/shopper", shopperRouter);
apiRouter.use("/wishlist", wishlistRouter);
apiRouter.use("/baskets", cartRouter);
apiRouter.use("/product", productRouter);
apiRouter.use("/customer", customerRouter);
apiRouter.use("/connection", connectionRouter);
apiRouter.use("/public", publicRouter);

export default apiRouter;
