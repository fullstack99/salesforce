import { Router } from "express";
import { v4 as uuidv4 } from "uuid";

const CONNECTION_LIFETIME = 5 * 60 * 1000;
const HALF_A_MINUTE = 0.5 * 60 * 1000;

const connectionRouter = Router({ mergeParams: true });
const connectionMap = {};

export const configConnectionService = (sock) => {
  const tvToken = sock.handshake.query.token;
  console.log("TV connected: ", tvToken);

  if (connectionMap[tvToken] && connectionMap[tvToken].timeout) {
    clearTimeout(connectionMap[tvToken].timeout);
  }

  connectionMap[tvToken] = {
    socket: sock,
    user: null,
  };
};

connectionRouter.post("/create", (req, res) => {
  const { tvToken } = req.body;

  if (!connectionMap[tvToken]) {
    return res.status(400).send({
      success: false,
      payload: { message: "No tv with such token connected to server" },
    });
  }
  if (connectionMap[tvToken].user) {
    return res
      .status(400)
      .send({
        success: false,
        payload: { message: "Someone already connected to this tv" },
      });
  }
  const connectionToken = uuidv4();

  connectionMap[tvToken].user = connectionToken;

  connectionMap[tvToken].socket.emit("connecting", {
    endDate: Date.now() + CONNECTION_LIFETIME,
    connectionToken: connectionToken,
  });

  console.log("User token on connect", connectionToken);

  connectionMap[tvToken].timeout = setTimeout(
    () => upToDestroy(tvToken),
    CONNECTION_LIFETIME - HALF_A_MINUTE
  );
  return res.status(200).send({
    success: true,
    payload: {
      connectionLifetime: CONNECTION_LIFETIME,
      connectionToken: connectionToken,
    },
  });
});

connectionRouter.post("/navigate", (req, res) => {
  const { userToken, tvToken, path } = req.body;
  if (!connectionMap[tvToken]) {
    return res.status(400).send({
      success: false,
      payload: { message: "No tv with such token connected to server" },
    });
  }

  if (
    !connectionMap[tvToken].user ||
    connectionMap[tvToken].user !== userToken
  ) {
    return res.status(400).send({
      success: false,
      payload: { message: "Someone already connected to this tv" },
    });
  }

  connectionMap[tvToken].socket.emit("navigate", path);

  return res.status(200).send({ success: true });
});

connectionRouter.post("/destroy", (req, res) => {
  const { userToken, tvToken } = req.body;
  if (!connectionMap[tvToken]) {
    return res.status(400).send({
      success: false,
      payload: { message: "No tv with such token connected to server" },
    });
  }

  if (
    !connectionMap[tvToken].user ||
    connectionMap[tvToken].user !== userToken
  ) {
    return res.status(400).send({
      success: false,
      payload: { message: "Someone already connected to this tv" },
    });
  }

  destroyConnection(tvToken, connectionMap[tvToken].socket);
  return res.status(200).send({ success: true });
});

const upToDestroy = (tvToken) => {
  console.log(
    `Going to destroy user session for  ${tvToken} in ${HALF_A_MINUTE}ms`
  );
  connectionMap[tvToken].socket.emit("upToDestroy");
  connectionMap[tvToken].timeout = setTimeout(
    () => destroyConnection(tvToken),
    HALF_A_MINUTE
  );
};

const destroyConnection = (tvToken) => {
  clearTimeout(connectionMap[tvToken].timeout);
  console.log("Destroying user session for ", tvToken);
  connectionMap[tvToken].user = null;
  connectionMap[tvToken].socket.emit("destroy");
};

export default connectionRouter;
