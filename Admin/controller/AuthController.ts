import prisma from "../config/db.config";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


require("dotenv").config();

class AuthController {
  static async getLogin(req: any, res: any) {
    const { email, password } = req.body;
    try {
      let getEmail = null;
      let isMatch = false;

      if (email && password) {
        getEmail = await prisma.user.findFirst({
          where: {
            email: email,
          },
        });
        if (getEmail && getEmail.password) {
          isMatch = bcrypt.compareSync(password, getEmail.password);
        }
      } 

      console.log(isMatch);

      if (isMatch && getEmail) {
        const user = {
          name: getEmail.name,
          email: getEmail.email,
   
        };

          console.log(user)
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_CODE);

        return res.status(200).send({
          message: "Login Successfull!",
          data: { success: true },
          accessToken: accessToken,
          user: user,
        });
      } else {
        return res.status(401).send({ message: "Login Failed!", error: "" });
      }
    } catch (err) {
      console.log(err);
      return res.status(401).send({ message: err.message, error: err });
    }
  }

  static async testToken(req: any, res: any) {
    return res.status(200).json({ message: "Token is valid" });
  }
}

export default AuthController;
