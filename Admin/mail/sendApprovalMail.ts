
import transporter = require("./transporter");
import path = require("path");
import ejs = require("ejs");
 const sendApprovalMail = async  ({ name, email,activationToken }) =>{
    const requiredPath = path.join(__dirname, "../email-templates/activation-mail.ejs");

    const data = await ejs.renderFile(requiredPath, {
      name: name,
      activationToken: activationToken
    });

    
  
    var mainOptions = {
      from: '"Bandwidth" abbasi.work22@gmail.com',
      to: email,
      subject: "Account Verified",
      html: data,
    };
  
     transporter.sendMail(mainOptions);

}


export default  sendApprovalMail;

