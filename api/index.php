<?php

require 'Slim/Slim.php';

$app = new Slim();
//select all
$app->get('/teas', function () {
            $sql = "SELECT * FROM tea ORDER BY name";
            try {
                $db = getConnection();
                $stmt = $db->query($sql);
                $tea = $stmt->fetchAll(PDO::FETCH_OBJ);
                $db = null;
                echo json_encode($tea);
            } catch (PDOException $e) {
                echo '{"error":{"text":' . $e->getMessage() . '}}';
            }
        });
//select multiple starting from id
$app->get('/teas/:start/:number', function ($start, $number) {
            $sql = "SELECT * FROM tea ORDER BY name LIMIT " . $start . ", " . $number;
            try {
                $db = getConnection();
                $stmt = $db->query($sql);
                $tea = $stmt->fetchAll(PDO::FETCH_OBJ);
                $db = null;
                echo json_encode($tea);
            } catch (PDOException $e) {
                echo '{"error":{"text":' . $e->getMessage() . '}}';
            }
        });
//select by id
$app->get('/teas/:id', function ($id) {
            $sql = "SELECT * FROM tea WHERE id=:id";
            try {
                $db = getConnection();
                $stmt = $db->prepare($sql);
                $stmt->bindParam("id", $id);
                $stmt->execute();
                $tea = $stmt->fetchObject();
                $db = null;
                echo json_encode($tea);
            } catch (PDOException $e) {
                echo '{"error":{"text":' . $e->getMessage() . '}}';
            }
        });
//search by name - didn't try to make this work
$app->get('/teas/search/:query', function ($query) {
            $sql = "SELECT * FROM tea ORDER BY name WHERE name LIKE :query";
            try {
                $db = getConnection();
                $stmt = $db->prepare($sql);
                $query = "%" . $query . "%";
                $stmt->bindParam("query", $query);
                $stmt->execute();
                $tea = $stmt->fetchAll(PDO::FETCH_OBJ);
                $db = null;
                echo '{"tea": ' . json_encode($tea) . '}';
            } catch (PDOException $e) {
                echo '{"error":{"text":' . $e->getMessage() . '}}';
            }
        });
//update
$app->put('/teas/:id', function ($id) {
            $request = Slim::getInstance()->request();
            $tea = json_decode($request->getBody());
            $sql = "UPDATE tea SET name=:name, type=:type, make=:make, description=:description, country=:country, weight=:weight, price=:price WHERE id=:id";
            try {
                $db = getConnection();
                $stmt = $db->prepare($sql);
                $stmt->bindParam("name", $tea->name);
                $stmt->bindParam("type", $tea->type);
                $stmt->bindParam("make", $tea->make);
                $stmt->bindParam("description", $tea->description);
                $stmt->bindParam("country", $tea->country);
                $stmt->bindParam("weight", $tea->weight);
                $stmt->bindParam("price", $tea->price);
                $stmt->bindParam("id", $id);
                $stmt->execute();
                $db = null;
                echo json_encode($tea);
            } catch (PDOException $e) {
                error_log($e->getMessage(), 3, '/var/tmp/php.log');
                echo '{"error":{"text":' . $e->getMessage() . '}}';
            }
        });
//insert
$app->post('/teas', function () {
            $request = Slim::getInstance()->request();
            $tea = json_decode($request->getBody());
            $sql = "INSERT INTO tea (name, type, make, description, country, weight, price) 
            VALUES (:name, :type, :make, :description, :country, :weight, :price)";
            try {
                $db = getConnection();
                $stmt = $db->prepare($sql);
                $stmt->bindParam("name", $tea->name);
                $stmt->bindParam("type", $tea->type);
                $stmt->bindParam("make", $tea->make);
                $stmt->bindParam("description", $tea->description);
                $stmt->bindParam("country", $tea->country);
                $stmt->bindParam("weight", $tea->weight);
                $stmt->bindParam("price", $tea->price);
                $stmt->execute();
                $tea->id = $db->lastInsertId();
                $db = null;
                echo json_encode($tea);
            } catch (PDOException $e) {
                error_log($e->getMessage(), 3, '/var/tmp/php.log');
                echo '{"error":{"text":' . $e->getMessage() . '}}';
            }
        });
//delete
$app->delete('/teas/:id', function ($id) {
            $request = Slim::getInstance()->request();
            $tea = json_decode($request->getBody());
            $sql = "DELETE FROM tea WHERE id=:id";
            try {
                $db = getConnection();
                $stmt = $db->prepare($sql);
                $stmt->bindParam("id", $id);
                $stmt->execute();
                $db = null;
                echo json_encode($tea);
            } catch (PDOException $e) {
                echo '{"error":{"text":' . $e->getMessage() . '}}';
            }
        });

$app->run();

function getConnection() {
    //home localhost conn. details
/*    $dbhost = "127.0.0.1";
    $dbuser = "root";
    $dbpass = "";
    $dbname = "teashop";
    */
      //iadt avaya conn. details
      $dbhost = "daneel";
      $dbuser = "N00114504";
      $dbpass = "N00114504";
      $dbname = "N00114504"; 
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
}

?>