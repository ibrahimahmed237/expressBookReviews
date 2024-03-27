const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const e = require("express");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", async function auth(req, res, next) {
  if (req.session.authorization) {
    let token = req.session.authorization["accessToken"];
    try {
      const decoded = await jwt.verify(token, "access");
      let user = decoded.user;
      if (user) {
        return next();
      } else {
        return res.status(403).json({
          message: "User not authenticated!",
        });
      }
    } catch (err) {
      return res.status(403).json({
        message: "User not authenticated!",
      });
    }
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
