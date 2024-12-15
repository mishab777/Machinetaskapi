import mysql2 from "mysql2"

export const db = mysql2.createConnection({
    host:"localhost",
    user:"root",
    password:"mishabsql25#",
    database:"task_management"
})

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to the database!");
});