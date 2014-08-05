//Immediate function, called straight away because it's wrapped in (), no name, so doesn't get saved
//to avoid global var Backbone we pass it as a parameter
(function (Backbone, $, _) {
    //Create a constructor function for Tea model which is a subclass of Backbone.Model.
    var Tea = Backbone.Model.extend({
        //these are the default values that are assigned to a newly created Tea object.
        defaults:{
            "id":null,
            "name":"McCabes Special blend",
            "type":"green",
            "make":"McCabes",
            "description":"Very nice green tea, yum.",
            "country":"India",
            "weight":"500g",
            "price":"5.99"
        }
    });
    //Constructor for Tea collection, subclass of Backbone.Collection.
    //Will hold a list of Tea model objects, each representing a row in  the "tea" table in our database.
    var TeaCollection = Backbone.Collection.extend({ 
        //Get JSON data from url (API endpoint) and put the data inside a Tea model object.
        model: Tea,
        url: 'api/teas'
    // url: 'api/index.php/teas'//didn't work at home on xampp without index.php
    });
    //Constructor for Tea table view, subclass of Backbone.View.
    var TeaTableView = Backbone.View.extend({
        //the html tag this view is wrapped in when rendered
        tagName: "tbody",
        //initialize() is called when view is first created, acts like a constructor.
        initialize: function(eventName){            
            //"this.model" is the Model object associated with this View. It is optional, not every View is based on a Model.
            //It is passed in as a parameter when an instance of this View is created.
            //The 3rd parameter "this" is passed to set the function context 
            //to be the View when it's called, otherwise it will refer to "window".
            this.model.on("reset", this.render, this);
            //"this" refers to the current View. Variable "self" stores a reference
            //to "this" to be used when the function is called by the occurance of an "add" event.
            var self = this;
            this.model.on("add", function (tea) {
                //Each time a tea is added create a new TeaTableRowView that renders a <tr> based 
                //on the Tea model for this tea. Append the <tr> to our html table.
                $(self.el).append(new TeaTableRowView({
                    model:tea
                //The "el" property references the DOM element that will  contain this View when it's rendered. 
                //Each View has it, and if not defined, the default is "div".
                }).render().el);
            });
        },
        //render() loops through the all the models inside the model this view is based on (our list of teas),
        //creates a new TeaTableRowView (<tr>) for each tea and appends it to the our html table.
        render: function(eventName){
            //"each" is an underscore.js function, acts ike a for loop.
            _.each(this.model.models, function(tea){
                var teaTableRowView = new TeaTableRowView({
                    model: tea
                });
                //htmlContent contains a <tr> with tea info
                var htmlContent = teaTableRowView.render().el;
                //$(this.el) is a <table> DOM element to which the <tr> is appended.
                $(this.el).append(htmlContent);
            }, this);
            //Allows to say .render().el for instances of this View.
            return this;
        }
    });
    //Defines an html table row <tr> for each tea in our collection.
    var TeaTableRowView = Backbone.View.extend({
        tagName: "tr",
        //A reference to an underscore.js template. It takes a string of html with placeholder tags <% %> 
        //as a parameter.Returns a function that takes JSON data as a parameter and returns the html
        //string with placeholders replaced by corresponding JSON data.
        template: _.template($("#tea-table-row-template").html()),
        initialize:function () {
            //Event listeners. First parameter is the event name, second is the callback function to be executed when event occurs, 
            //third is the context of the callback function (value of "this" while executing, which will refer to this View).
            this.model.on("change", this.render, this);
            this.model.on("destroy", this.close, this);
        },
        render: function(eventName){
            //this.model is a JS object and needs to  be converted into a JSON string (basically wrapped in "" quotes)
            //in order to be passed to the this.template() function.
            var tea = this.model.toJSON();
            var htmlContent = this.template(tea);
            $(this.el).html(htmlContent);
            return this;
        },
        //A cleanup function, when model is destroyed all event listeners are removed from the table row and it is removed from the DOM.
        close:function () {
            //$(this.el) refers to the current <tr>
            $(this.el).off();//unbind all event listeners
            $(this.el).remove();//remove from DOM
        }
    });
    //A View that shows the html form with tea data. 
    //Same form is used for editing and deleting existing items and creating new ones.
    var TeaView = Backbone.View.extend({
        template:_.template($('#tpl-tea-details').html()),
        initialize:function () {
            this.model.on("change", this.render, this);
            this.model.on("destroy", this.close, this);
        },
 
        render:function (eventName) {
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        },
        //Event name followed the DOM element on which the event occurs, and after the ":" the name of the callback function.
        events:{
            "change input":"change",
            "click .save":"saveTea",
            "click .delete":"deleteTea"
        },
        //Called when a value of one of the input fields in the form changes.
        change:function (event) {
            var target = event.target;
            console.log('changing ' + target.id + ' from: ' + target.defaultValue + ' to: ' + target.value);
            // Change your model on the spot. Data both on screen and in model (but not in DB) is changed on the fly w/o pressing "Save".
            var change = {};
            //add a property to change{} object, e.g.: change{"make":"McCabes"} 
            change[target.name] = target.value;
            //update the associated model
            this.model.set(change);
        },
        
        saveTea:function () {
            //Update the the model with the values of the form input fields.
            this.model.set({
                name:$('#name').val(),
                type:$('#type').val(),
                make:$('#make').val(),
                description:$('#description').val(),
                country:$('#country').val(),
                weight:$('#weight').val(),
                price:$('#price').val()
            });
            if (this.model.isNew()) {
                var self = this;
                //If it's a new model, which means a new tea has been added, send a POST request to the server.
                app.teaList.create(this.model, {
                    success:function () {
                        //On success of POST request add "/teas/" followed by the id of the newly created tea to the current url.
                        //Second parameter "false" means do not go to this url, just change it in the address bar.
                        app.navigate('teas/' + self.model.id, false);
                    }
                });
            } else {
                //If it's a not a new tea, which means an existing tea has been edited, send a PUT request to the server.
                this.model.save();
            }
            return false;
        },
 
        deleteTea:function () {
            this.model.destroy({
                success:function () {
                    console.log('Tea deleted successfully');
                    //When model has been destroyed navigate to the home page and show the tea list.
                    app.navigate('');
                },
                error: function(error){
                    console.log('Error while deleting. Error message: '+error.message);
                    app.navigate('');
                }
            });
            return false;
        },
 
        close:function () {
            $(this.el).off();
            $(this.el).remove();
        }
    });
    //A View that just shows the "new tea" button and attaches a click event listener to it to create a new tea.
    //This View has no Model associated with it.
    var HeaderView = Backbone.View.extend({
 
        template:_.template($('#tpl-header').html()),
 
        initialize:function () {
            this.render();
        },
 
        render:function (eventName) {
            $(this.el).html(this.template());
            return this;
        },
 
        events:{
            "click .new":"newTea"
        },
 
        newTea:function (event) {
            //On click of "new" button navigate to "teas/new" (handled in the AppRouter).
            //Second parameter "true" means go to this url, not just change it in the address bar.
            app.navigate("teas/new", true);
            return false;
        }
    });
    //Backbone.Router routes our single-page app using hash tags(#), "simulates" a multi-page structure by changing the url and displaying different content accordingly.
    //Adds # followed by some other string (route) to the url. Each specific value after the # triggers a predefined callback function.
    var AppRouter = Backbone.Router.extend({
        //Each route consists of a value to be added to url preceeded by # and the name of its corresponding callback function.
        routes: {
            "": "list",
            "teas/new" : "newTea",
            "teas/:id": "teaDetails"
        },
        initialize:function () {
            //Display the "new tea" button.
            $('#header').html(new HeaderView().render().el);
        },
        //Kinda like our main program, runs the app.
        //Creates the default location, "home page", that show the table with all the teas in our DB. Triggered by "" route.
        list: function(){
            this.teaList = new TeaCollection();
            //"self" will refer to AppRouter.
            var self = this;
            // Fetch the default set of models for this collection from the server, setting them on the collection when they arrive. (c) http://backbonejs.org/#Collection-fetch
            //Fetches a list of teas from DB and populates html table with them.
            this.teaList.fetch({
                success:function () {
                    //Create html table and populate it with teas.
                    self.teaTableView = new TeaTableView({
                        model:self.teaList
                    });
                    $('#tea-table').html(self.teaTableView.render().el);
                    //If AppRouter has property "requestedId" use it to display details for tea with that id
                    if (self.requestedId) self.teaDetails(self.requestedId);
                }
            });
        },
        //Creates the form to display tea details. Triggered by "teas/:id" route. :id is passed as a parameter to teaDetails(id) and indicated the tea to be displayed.
        teaDetails:function (id) {
            //If Approuter already has a property "teaList" it means our html table is already populated.
            if (this.teaList) {
                //Get the model for tea with this id from teaList collection, 
                //add a property "tea" to AppRouter and store the tea model in it.
                this.tea = this.teaList.get(id);
                //If AppRouter already has a property "teaView" it means a form showing tea details is already being displayed. 
                //Close it (remove its event listeners and remove it from DOM).
                if (this.teaView) this.teaView.close();
                //Create a new form for this tea and populate it with the tea details.
                this.teaView = new TeaView({
                    model:this.tea
                });
                $('#tea-details').html(this.teaView.render().el);
            } else {
                //If Approuter has no property "teaList" it means teas have not been fetched from DB yet.
                //In this case add property "requestedId" to AppRouter and store the reference to the id of the tea the details of which we need to display.
                this.requestedId = id;
                //Then call the list() function, which is a property of AppRouter. It will fetches the tea list from DB and populate the html table.
                this.list();
            }
        },
        //Creates a new tea.
        newTea: function() {
            //If AppRouter already has a property "teaView" it means a form showing tea details is already being displayed. 
            //Close it (remove its event listeners and remove it from DOM).
            if (app.teaView) app.teaView.close();
            //Create a new form for this tea and populate it with the default tea details (defined in Tea object constructor).
            app.teaView = new TeaView({
                model:new Tea()
            });
            //Display tea details form populated it with the default tea details.
            $('#tea-details').html(app.teaView.render().el);
        }
    });
    
    var app = new AppRouter();
    Backbone.history.start();
})(Backbone, $, _);//passing Backbone as a parameter