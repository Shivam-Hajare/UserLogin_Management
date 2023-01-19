const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require("ejs");



const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use("/assets", express.static("assets"));

const connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "root",
	database: "user_db"
});
connection.connect(function (error) {
	if (error) console.log(error);
	else console.log("connected to DB..");
});

//Home Login page
app.get('/', (req, res) => {
	res.render('index.ejs', {
		errorMsg: ""
	})
});
app.post("/", (request, response) => {
	let username = request.body.username;
	let password = request.body.userpassward;



	// check input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM login_user WHERE user_Eid = ? AND user_passward = ?', [username, password], function (error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If account exists
			if (results.length > 0) {
				// // Authenticate the user

				response.redirect('/userManagement');
			}
			else {
				response.render('index.ejs', {
					errorMsg: "Incorrect LoginID / Password"
				})
			}
			response.end();
		});
	} else {
		response.render('index.ejs', {
			errorMsg: "Please enter Username and Password!"
		})
	}
});

//User Management Home page
app.get('/userManagement', (req, res) => {

	connection.query('SELECT * FROM login_user', function (err, rows) {
		if (err) throw err;
		else {
			res.render('UserManagement.ejs', {
				rows: rows,
			})
		}
	})
});

//res for adding user page
app.get("/userManagement/addUserPage", (req, res) => {
	res.render('addUserPage.ejs', {
		errorMsg: ""
	})
})
app.get("/userManagement/addUserPage/add", (req, res) => {

});
app.post("/userManagement/addUserPage/add", (req, res) => {

	const EmailID = req.body.userEmailID;
	const userName = req.body.username;
	const password = req.body.userpassward;



	if (userName && password && EmailID) {

		connection.query('INSERT INTO login_user SET user_Eid =?,user_name=?,user_passward=?', [EmailID, userName, password], function (error, results) {
			if (error) throw error
			else {
				res.redirect("/userManagement")
			}
		})
	} else {
		res.render('addUserPage.ejs', {
			errorMsg: "Please enter Username and Password!"
		})
	}


});

app.get("/editUserPage/:userEmailID", (req, res) => {

	connection.query('SELECT * FROM login_user where user_Eid=?', [req.params.userEmailID], function (err, rows) {
		if (err) throw err;
		else {
			res.render('editUserPage.ejs', {
				rows: rows,
			})
		}
	})
})
app.post("/editUserpage/:userEmailID", (req, res) => {
	let EmailID = req.params.userEmailID;
	let userName = req.body.username;
	let password = req.body.userpassward;

	connection.query('Update login_user set user_name=?,user_passward=? where user_Eid=?', [userName, password, EmailID], function (err, rows) {
		if (err) throw err;
		else {
			res.redirect("/userManagement")
		}
	})

})

app.get("/viewUserPage/:userEmailID", (req, res) => {

	connection.query('SELECT * FROM login_user where user_Eid=?', [req.params.userEmailID], function (err, rows) {
		if (err) throw err;
		else {
			res.render('viewUserPage.ejs', {
				rows: rows,
			})
		}
	})

})
app.get("/deleteUserPage/:userEmailID", (req, res) => {
	connection.query('DELETE FROM login_user  where user_Eid=?', [req.params.userEmailID], function (err, rows) {
		if (err) throw err;
		else {
			res.redirect("/userManagement")
		}
	})


})


app.listen(3000, (err) => {
	if (err) {
		throw err;
	}
	else {
		console.log("server is running on port 3000");
	}
});
