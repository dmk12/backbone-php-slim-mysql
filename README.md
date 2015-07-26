backbone-php-slim-mysql
=======================

Backbone.js with PHP Slim framework &amp; MySQL

Run a MySQL database management tool and webserver of your choice (if working locally, it will most likely be XAMPP/MAMP/WAMP). Create a sample database  `teashop` with 5 entries using the `sql/tea.sql` file. Import it in if using XAMPP etc. 

In the `getConnection()` in `api/index.php` change the connection details to match your host, user, password and database name. The default is:

	$dbhost = "127.0.0.1";
	$dbuser = "root";
	$dbpass = "";
	$dbname = "teashop";


Access the app through a browser by pointing to the web server's URL, for example:
`http://localhost[:yourportnum]/your/folder/path`.

You should see a table with data and be able to perform CRUD operations - add, edit and delete entries.
