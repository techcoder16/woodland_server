import express = require('express');
import http = require('http');
import router from "./routes/index";
import path from 'path'
import cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5002;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.get("/", (req:any, res:any) => {
    return res.json({ message: "It's working ..." });
  });
  

  
  app.use(router);
  
  app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
