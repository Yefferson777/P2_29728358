const express = require("express");
const app = express();
const path = require("path");

app.get('/', (rep, res)=>{

	res.sendFile(path.join(__dirname + "/index.html"));
});
app.listen(process.env.PORT || 5555);
