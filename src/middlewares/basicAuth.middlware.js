import UserModel from "../features/user/user.model.js";

const basicAuthorizer = (req, res, next) => {
  // 1. check if authorization header is empty
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).send("No authorization details found");
  }
  console.log("authheader", authHeader);

  //2.extract credentails.  [Basic qwqweweqweqweqwe]
  const base64Credentails = authHeader.replace("Basic ", "");
  console.log("base64", base64Credentails);
  // 3. decode credentails
  const decodedCreds = Buffer.from(base64Credentails, "base64").toString(
    "utf8"
  );
  console.log("decoded", decodedCreds); // [username: password]
  const creds = decodedCreds.split(":");
  const user = UserModel.getAll().find(
    (u) => u.email == creds[0] && u.password == creds[1]
  );
  if (user) {
    next();
  } else {
    return res.status(401).send("Incorrrect credentaisl");
  }
};

export default basicAuthorizer;
