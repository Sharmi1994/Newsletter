const express = require("express");
const app = express();
const request = require("request");
const https = require("https");

const bodyParser = require("body-parser");
const { post } = require("request");
// process data sent in an HTTP request body.
app.use(bodyParser.urlencoded({ extended: true }));
//linking html file to local host
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});
//posting data entered in local host
app.post("/", function (req, res) {
  const firstname = req.body.fname;
  const lastname = req.body.lname;
//matching and storing the data from the localhost with mailchimpAPI format 
//{"email_address":"","email_type":"","status":"subscribed","merge_fields":{}}
  const data = {
    email_address: req.body.email,
    status: "subscribed",
    merge_fields: {
      FNAME: firstname,
      LNAME: lastname,
    }
  };

  //converting to json format becoz mailchimp accept json format
  const JsonData = JSON.stringify(data);
//url to be accessed in mailchimp 'https://${dc}.api.mailchimp.com/3.0/lists/{list_id}/members?
  const url = "https://us14.api.mailchimp.com/3.0/lists/3815a248d8/members";
  //http api authentication format
  const options = {
    method: "POST",
    auth: "sharmila1:47f7d2c4fbb122c7f88c5b0130d421cd-us14",
  };
//http accessing mailchimp server
  const request = https.request(url, options, function (response) {

    if(response.statusCode===200){
        res.sendFile(__dirname + "/success.html");
    }
    else{
        res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });
//https storing the emailrequest in the list
  request.write(JsonData);
  request.end();

});

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(process.env.PORT || 4000, function () {
  console.log("server up and running in 4000");
});

