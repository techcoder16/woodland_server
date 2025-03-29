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
  static async updateMetaData(req:any,res:any)
    {
      try {
        let { first_name, last_name, email, phone_number } = req.body;
          phone_number = parseFloat(phone_number);
        
        
        // Ensure the required fields are provided
        if (  !first_name || !last_name || !email || phone_number === undefined) {
          return res.status(400).json({ message: "Missing required fields" });
        }
        
        const updatedUser = await prisma.user.update({
          where: { email },
          data: { first_name, last_name, phone_number }
        });
        
        res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
      } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ message: "An error occurred while updating the profile", error: error.message });
      }

    }
  static async updatePassword(req:any,res:any)
  {
    try {
      const { email, currentPassword, newPassword } = req.body;
      
      // Ensure required fields are provided
      if (!email || !currentPassword || !newPassword) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Fetch the user by id
      const user = await prisma.user.findUnique({ where: { email } });
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if the current password matches
      const isMatch = await bcrypt.compare(currentPassword, user.password || '');
      if (!isMatch) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }
      
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Update the user's password in the database
      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword }
      });
      
      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Password update error:", error);
      res.status(500).json({ message: "An error occurred while updating the password", error: error.message });
    }

  }
}

export default AuthController;
