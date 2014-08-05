//immidiate function, called straight away, no name, so doesn't get saved
//to avoid global var Backbone we pass it as a parameter
(function (Backbone, $, _) {
    //local variables
    var Tea = Backbone.Model.extend({
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
    
    var TeaCollection = Backbone.Collection.extend({
        model: Tea,
        //  url: 'api/teas'
        url: 'api/index.php/teas'
    });
    
    /*var teas = new TeaCollection();
    //gets JSON from url and puts the data inside Tea collection
    //in newer version no need for "reset: true", and a new method "sync" is introduced
    teas.fetch({reset: true});*/
    
    var TeaTableView = Backbone.View.extend({
        tagName: "tbody",
        initialize: function(eventName){
            //the 3rd parameter "this" is passed to set the function context to be the View when it's called, otherwise it will refer to "window".
            this.model.on("reset", this.render, this);
            var self = this;
            this.model.on("add", function (tea) {
                $(self.el).append(new TeaTableRowView({
                    model:tea
                }).render().el);
            });
        },
        render: function(eventName){
            //"each" is like a for loop
            _.each(this.model.models, function(tea){
                var teaTableRowView = new TeaTableRowView({
                    model: tea
                });
                var htmlContent = teaTableRowView.render().el;
                $(this.el).append(htmlContent);
            }, this);
            return this;
        }
    });
    
    var TeaTableRowView = Backbone.View.extend({
        tagName: "tr",
        template: _.template($("#tea-table-row-template").html()),
        initialize:function () {
            this.model.on("change", this.render, this);
            this.model.on("destroy", this.close, this);
        },
        render: function(eventName){
            var tea = this.model.toJSON();
            var htmlContent = this.template(tea);
            $(this.el).html(htmlContent);
            return this;
        },
 
        close:function () {
            $(this.el).off();
            $(this.el).remove();
        }
    });

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
 
        events:{
            "change input":"change",
            "click .save":"saveTea",
            "click .delete":"deleteTea"
        },
 
        change:function (event) {
            var target = event.target;
            console.log('changing ' + target.id + ' from: ' + target.defaultValue + ' to: ' + target.value);
        // You could change your model on the spot, like this:
        /* var change = {};
            change[target.name] = target.value;
            this.model.set(change);*/
        },
 
        saveTea:function () {
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
                app.teaList.create(this.model, {
                    success:function () {
                        app.navigate('teas/' + self.model.id, false);
                    }
                });
            } else {
                this.model.save();
            }
            return false;
        },
 
        deleteTea:function () {
            this.model.destroy({
                success:function () {
                    console.log('Tea deleted successfully');
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
            app.navigate("teas/new", true);
            return false;
        }
    });
    
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
            app.navigate("teas/new", true);
            return false;
        }
    });
    var AppRouter = Backbone.Router.extend({
        routes: {
            "": "list",
            "teas/new" : "newTea",
            "teas/:id":"teaDetails"
        },
        initialize:function () {
            $('#header').html(new HeaderView().render().el);
        },
        list: function(){
            //kinda like our main program, runs the app
            this.teaList = new TeaCollection();
            var self = this;
            this.teaList.fetch({
                success:function () {
                    self.teaTableView = new TeaTableView({
                        model:self.teaList
                    });
                    $('#tea-table').html(self.teaTableView.render().el);
                    if (self.requestedId) self.teaDetails(self.requestedId);
                }
            });
        },
 
        teaDetails:function (id) {
            if (this.teaList) {
                this.tea = this.teaList.get(id);
                if (this.teaView) this.teaView.close();
                this.teaView = new TeaView({
                    model:this.tea
                });
                $('#tea-details').html(this.teaView.render().el);
            } else {
                this.requestedId = id;
                this.list();
            }
        },
        
        newTea: function() {
            console.log('MyRouter newTea');
            if (app.teaView) app.teaView.close();
            app.teaView = new TeaView({
                model:new Tea()
            });
            $('#tea-details').html(app.teaView.render().el);
        }
    });
    
    var app = new AppRouter();
    Backbone.history.start();
})(Backbone, $, _);//passing Backbone as a parameter