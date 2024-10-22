import jwt from "jsonwebtoken";

require("dotenv").config();

function authenticateToken(req:any, res:any, next:any) {
    const authHeader = req.headers['authorization']

    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
  
      
    jwt.verify(token, process.env.ACCESS_TOKEN_CODE, (err:any, user:any) => {
        
        if (err) return res.sendStatus(403)
      req.user = user
      next();


    });

  }

  export default authenticateToken;


  