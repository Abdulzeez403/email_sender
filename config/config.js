const mysql = require("mysql");

const con =mysql.createConnection({
  host: "localhost",
  user: "sodiq",
  password: "12345"
})

con.connect((err)=>{
  // if(err) throw err;
  console.log('Connected!')

  con.query("CREATE DATABASE mydb",(err, result)=> {
    // if (err) throw err;
    console.log("Database created")});
})

module.exports = con;