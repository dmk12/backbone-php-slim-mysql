<!DOCTYPE html>
<html>
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <name><h1>Tea Emporium</h1></name>
    <title>Tea Emporium</title>
    <link rel="stylesheet" type="text/css" href="css/teashop.css">
</head>
<body>

    <header id="header">
    </header>

    <div id="tea-details">
    </div>

    <div id="tea-list">
        <table id="tea-table">
            <thead>
            <th>Id</th>
            <th>Name</th>
            <th>Type</th>
            <th>Make</th>
            <th>Description</th>
            <th>Country</th>                    
            <th>Weight</th>
            <th>Price</th>
            </thead>
        </table>
    </div>


    <footer><h6>&copy; Tea Emporium Ltd, <script>document.write(new Date().getFullYear());</script>.</h6></footer>

    <!-- Templates -->

    <!-- View all -->    
    <script type="text/template" id="tea-table-row-template">
    <td><%= id %></td>
    <td><a class="tea-link" href='#teas/<%= id %>'><%= name %></a></td>
    <td><%= type %></td>
    <td><%= make %></td>
    <td><%= description %></td>
    <td><%= country %></td>
    <td><%= weight %></td>
    <td><%= price %></td>
</script>

<!-- Create new -->
<script type="text/template" id="tpl-header">
    <button class="new">New Tea</button>
</script>

<!-- Update -->
<script type="text/template" id="tpl-tea-details">
    <div class="form-left-col">
        <label>Id:</label>
        <input type="text" id="teaId" name="id" value="<%= id %>" disabled /><br>
        <label>Name:</label>
        <input type="text" id="name" name="name" value="<%= name %>" required/><br>
        <label>Type:</label>
        <input type="text" id="type" name="type" value="<%= type %>"/><br>
        <label>Make:</label>
        <input type="text" id="make" name="make" value="<%= make %>"/><br>
        <label>Description:</label>
        <input type="text" id="description" name="description"  value="<%= description %>"/><br>
        <label>Country:</label>
        <input type="text" id="country" name="country"  value="<%= country %>"/><br>
        <label>Weight:</label>
        <input type="text" id="weight" name="weight"  value="<%= weight %>"/><br>
        <label>Price:</label>
        <input type="text" id="price" name="price"  value="<%= price %>"/><br>

        <button class="save">Save</button>               
        <% if(id != null) {%>
        <button class="delete">Delete</button>
        <%}%>

    </div>
</script>

<script src="js/jquery-1.10.2.min.js"></script>
<script src="js/underscore-min.js"></script>
<script src="js/backbone-min.js"></script>
<script src="js/teashop.js"></script>
</body>
</html>
