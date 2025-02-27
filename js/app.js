/* global Backbone, Marionette, $, require */

$(function() {

  "use strict";

  var app = new Marionette.Application();

  var loggedInUser = new Backbone.Model();

  // Collection of proposals
  var proposals = new Backbone.Collection();

  // View for the Add Proposal form
  var ProposalForm = Marionette.ItemView.extend({
    template: require("../templates/proposal-form.html"),
    events: {
      "click button": "addProposal"
    },

    addProposal: function() {
      var text = this.$("textarea").val();
      if (text !== "") {
        proposals.add({
          name: text
        });
      }
      this.$("textarea").val("");
    }
  });


  // View for a single proposal (a row in the proposals table)
  var ProposalView = Marionette.ItemView.extend({
    tagName: "tr",
    template: require("../templates/proposal-view.html"),
    events: {
      "click button": "delete"
    },
    delete: function() {
      proposals.remove(this.model);
    }
  });

  // View for ToolBar
  var ToolBarView = Marionette.ItemView.extend({
    tagName: "div",
    id: "toolbar",
    model: loggedInUser,
    template: require("../templates/toolbar-top.html"),
    events: {
      "click #addMotionsButton": function() {
        this.triggerMethod("loadAddMotionsScreen");
      },
      "click #displayMotionsButton": function() {
        this.triggerMethod("loadMotionsScreen");
      },
      "click #voteButton": function() {
        this.triggerMethod("loadVotingScreen");
      },
      "click #logoutButton": function() {
        this.triggerMethod("logout");
      }
    }
  });

  // View for the list of proposals
  var ProposalList = Marionette.CompositeView.extend({
    tagName: "div",
    template: require("../templates/proposal-list.html"),
    childView: ProposalView,
    childViewContainer: ".childViewContainer"
  });

  var LoginForm = Marionette.ItemView.extend({
    template: require("../templates/login-form.html"),
    id: "loginForm",
    events: {
      "click button": "login"
    },
    login: function() {
      this.triggerMethod("login");
    }
  });

  // Overall layout, with top and main regions
  var AppLayout = Marionette.LayoutView.extend({
    el: "#app",
    template: require("../templates/layout.html"),
    childEvents: {
      login: "login",
      loadAddMotionsScreen: "loadAddMotionsScreen",
      loadDisplayMotionsScreen: "loadDisplayMotionsScreen",
      loadVotingScreen: "loadVotingScreen",
      logout: "logout"
    },
    login: function() {
      loggedInUser.set("name", $("#username").val());
      this.loadDisplayMotionsScreen();
    },
    loadDisplayMotionsScreen: function() {
      this.showToolBarView();
      this.top.empty();
      this.main.show(new ProposalList({collection: proposals}));
    },
    loadAddMotionsScreen: function() {
      this.showToolBarView();
      this.top.show(new ProposalForm());
      this.main.show(new ProposalList({collection: proposals}));
    },
    loadVotingScreen: function() {
      this.showToolBarView();
      this.top.empty();
      this.main.show(new ProposalList({collection: proposals}));
    },
    logout: function() {
      this.header.empty();
      this.top.empty();
      this.main.show(new LoginForm());
    },
    showToolBarView: function() {
      this.header.show(new ToolBarView());
    },
    regions: {
      header: "#header",
      top: "#top",
      main: "#main"
    }
  });

  // Initialisation
  app.on("start", function() {
    var appLayout = new AppLayout();
    appLayout.render();
    appLayout.main.show(new LoginForm());
  });
  app.start();
});
