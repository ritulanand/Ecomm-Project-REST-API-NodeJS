import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
  //1. read the token
  console.log("authorization", req.headers);
  const token = req.headers["authorization"];
  console.log("token", token);

  //2 if no tokem return error
  if (!token) {
    return res.status(401).send("Unauthorized");
  }
  // 3 check if token is valid
  try {
    const payload = jwt.verify(token, "D2cVZgKZ3eJTvCAr1Na3v9JRZ66JYz3C");
    console.log("taken verify", payload);
    req.userID = payload.userID;
  } catch (err) {
    // 4.return errror
    console.log("err", err);
    return res.status(401).send("unauthorized");
  }
  // 5. call next middlware
  next();
};

export default jwtAuth;
