"use strict";

var App = window.App = {};

App.Like = Backbone.Model.extend({
  initialize: function(options) {
    this.checkin_id = options.checkin_id;
  },

  urlRoot: function() {
    return "/checkins/" + this.get('checkin_id') + "/likes"
  }
})
App.Checkin = Backbone.Model.extend({
  urlRoot: "/checkins",
  
  liked: function(id) {
    return _.include(this.get('likes'), id.toString());
  }
});
App.CheckinCollection = Backbone.Collection.extend({
  model: App.Checkin,
  url: "/checkins"
});

App.Place = Backbone.Model.extend({
  urlRoot: "/places"
});
App.PlaceCollection = Backbone.Collection.extend({
  model: App.Place,
  url: "/places"
});

App.User = Backbone.Model.extend({
  urlRoot: "/users"
});
App.UserCollection = Backbone.Collection.extend({
  model: App.User,
  url: "/users"
});

//-----------------------------------------------------------------------------

App.CheckinListView = Backbone.View.extend({

  initialize: function(options) {
    this.page = options.page || 1;
    this.loading = false;
    this.parent = options.parent;
  },
  
  render: function() {
    var self = this;

    this.collection.bind("add", this.showCheckin, this);
    this.collection.bind("reset", this.reset, this);

    return this;
  },

  scrolling: function() {
    var $body = $("body");
    var bodyHeight = $body.height(),
        scrollTop = $body.scrollTop(),
        windowHeight = $(window).height();

    //log("bodyHeight = " + bodyHeight + ", scrollTop = " + scrollTop + ", windowHeight = " + windowHeight);

    if (!this.loading && ((scrollTop + windowHeight) / bodyHeight) > 0.9) {
      this.loading = true;
      setTimeout(_.bind(this.loadMoreCheckins, this), 100);
    }
  },

  reset: function() {
    this.parent.contentLoaded();
    this.showCheckins();
  },

  addCheckin: function(checkin, prepend) {
    if (prepend)
      this.$el.prepend( new App.CheckinView({model: checkin}).render().el);
    else
      this.$el.append( new App.CheckinView({model: checkin}).render().el);

    this.$el.find(".timeago").timeago();
  },

  showCheckin: function(checkin) {
    this.addCheckin(checkin, false);
  },

  showCheckins: function() {
    this.collection.forEach( function(checkin) {
      this.showCheckin(checkin);
    }, this);
  },

  loadMoreCheckins: function() {
    var self = this;

    this.collection.fetch({
      add: true,
      data: {
        page: self.page+1
      },
      success: function() {
        self.page += 1;
        self.loading = false;
      },
      error: function() {

      }
    });
  }

});

App.CheckinView = Backbone.View.extend({
  className: "checkin-item",

  render: function() {
    var template = templater.load("#tpl-checkin-view");
    this.$el.html( template(this.model.toJSON()) );

    this.$like = this.$('.like').hide();
    this.$unlike = this.$('.unlike').hide();

    if (this.model.liked(Happy.Camper.id)) {
      this.$unlike.show();
    } else {
      this.$like.show();
    }

    return this;
  },

  events: {
    "click .like": 'like',
    "click .unlike": 'unlike'
  },

  like: function() {
    var self = this;
    var like = new App.Like({
      checkin_id: this.model.id
    });
    like.save({}, {
      success: function() {
        self.$like.hide();
        self.$unlike.show();
      }
    });
    return false;
  },

  unlike: function() {
    var self = this;
    var like = new App.Like({
      id: 1,
      checkin_id: this.model.id
    });
    like.destroy({
      success: function() {
        self.$like.show();
        self.$unlike.hide();
      }
    });
    return false;
  }

});

//-----------------------------------------------------------------------------

App.PlaceListView = Backbone.View.extend({

  initialize: function(options) {
    this.page = options.page || 1;
    this.loading = false;
    this.parent = options.parent;
  },

  render: function() {
    var self = this;

    this.collection.bind("add", this.showPlace, this);
    this.collection.bind("reset", this.reset, this);

    return this;
  },

  reset: function() {
    this.parent.contentLoaded();
    this.showPlaces();
  },

  showPlace: function(place) {
    this.$el.append( new App.PlaceView({model: place}).render().el);
  },

  showPlaces: function() {
    this.$el.append( new App.TopPlacesView({collection: this.collection}).render().el);
  }

});

App.TopPlacesView = Backbone.View.extend({
  render: function() {
    var template = templater.load('#tpl-top-places-view');
    this.$el.html( template(this.collection) );
    return this;
  }
});

App.PlaceView = Backbone.View.extend({
  className: "place-item",

  render: function() {
    var template = templater.load('#tpl-place-view');
    this.$el.html( template(this.model.toJSON()) );
    return this;
  }
});

App.PlaceShowView = Backbone.View.extend({
  className: 'place',

  render: function() {
    var template = templater.load('#tpl-place-show-view');
    this.$el.html( template(this.model.toJSON()) );
    this.$el.find(".timeago").timeago();
    return this;
  }
});

//-----------------------------------------------------------------------------

App.UserListView = Backbone.View.extend({

  initialize: function(options) {
    this.page = options.page || 1;
    this.loading = false;
    this.parent = options.parent;
  },

  render: function() {
    var self = this;

    this.collection.bind("add", this.showUser, this);
    this.collection.bind("reset", this.reset, this);

    return this;
  },

  reset: function() {
    this.parent.contentLoaded();
    this.showUsers();
  },

  showUser: function(user) {
    this.$el.append( new App.UserView({model: user}).render().el);
  },

  showUsers: function() {
    this.$el.append( new App.TopUserView({collection: this.collection}).render().el);
  },

});

App.TopUserView = Backbone.View.extend({

  render: function() {
    var template = templater.load('#tpl-top-users-view');
    this.$el.html( template(this.collection) );
    return this;
  }
})

App.UserShowView = Backbone.View.extend({
  className: 'user',

  render: function() {
    var template = templater.load('#tpl-user-show-view');
    this.$el.html( template(this.model.toJSON()) );
    this.$el.find(".timeago").timeago();
    return this;
  }
});

App.UserView = Backbone.View.extend({
  className: "user-item",

  render: function() {
    var template = templater.load('#tpl-user-view');
    this.$el.html( template(this.model.toJSON()) );
    return this;
  }
});

//-----------------------------------------------------------------------------

App.CheckMeInView = Backbone.View.extend({

  initialize: function(options) {
    this.parent = options.parent;
  },

  render: function() {
    this.$form = this.$("form");
    this.$description = this.$("#checkin_description");
    return this;
  },

  show: function() {
    this.$el.slideDown();
    this.$description.focus();
  },

  hide: function() {
    var self = this;
    this.$el.slideUp(300, function() {
      self.$('#checkin_place_id').addClass('active')[0].selectedIndex = 0;
      self.$('#place_name').removeClass('active');
    });
  },

  events: {
    "click .close-checkin": "hide",
    "submit form": "checkin",
    "change #checkin_place_id": "switchPlace"
  },

  switchPlace: function() {
    var place = this.$('#checkin_place_id');

    if (place[0].selectedIndex == (place[0].options.length -1)) {
      this.$('#checkin_place_id, #place_name').toggleClass('active');
    }

  },

  checkin: function() {
    var self = this;

    var checkin = new App.Checkin();
    var attrs = {
      user_id: Happy.Camper.id,
      place_id: $('#checkin_place_id').val(),
      description: $('#checkin_description').val(),
      place_name: $('#place_name').val()
    };

    checkin.save(attrs, {
      success: function() {
        self.hide();
        self.$form.get(0).reset();

        self.parent.checkedIn(checkin);
      },
      error: function(e) {
        log(e);
      }
    });

    return false;

  }

});

//-----------------------------------------------------------------------------


App.Router = Backbone.Router.extend({

  initialize: function(options) {
    var self = this;
    this.$content = $("#content");
    this.currentView = null;
    this.currentMenu = null;
    this.checkedIn = function(){};

    this.navItems = {
      checkins: $(".nav-checkins"),
      places: $(".nav-places"),
      users: $(".nav-users"),
      me: $(".nav-me")
    };

    // hook the scroll
    $(window).scroll(function() {
      if (self.currentView && self.currentView.scrolling)
        self.currentView.scrolling();
    });

    // hook the checkmein view
    this.checkMeInView = new App.CheckMeInView({ el: $("#checkmein"), parent: this }).render();

    $("a.show-checkin").click(function() {
      self.checkMeIn();
      return false;
    });

  },

  routes: {
    "": "checkins",
    "checkins": "checkins",
    "places": "places",
    "places/:id": "place",
    "users": "users",
    "users/:id": "user"
  },

  checkMeIn: function() {
    this.checkMeInView.show();
  },

  setMenu: function($el) {
    this.currentMenu && this.currentMenu.removeClass('current');
    this.currentMenu = $el.addClass('current');
  },

  showLoading: function() {
    this.$content.addClass("loading");
    // this.$content.append('<div id="loading-container"><div id="loading-spinner"></div></div>');
    return this;
  },
  hideLoading: function() {
    this.$content.removeClass("loading");
    return this;
  },
  emptyContent: function() {
    this.$content.empty();
    return this;
  },
  contentLoaded: function() {
    this.emptyContent().hideLoading();
  },


  checkins: function() {

    var self = this;
    this.showLoading();

    var checkins = new App.CheckinCollection();
    this.currentView = new App.CheckinListView({
      el: self.$content,
      collection: checkins,
      page: 1,
      parent: self
    }).render();

    this.checkedIn = function(checkin) {
      checkins.add(checkin, {at: 0, silent: true});
      self.currentView.addCheckin(checkin, true);
    };

    checkins.fetch({
      success: function() {
        self.setMenu(self.navItems.checkins);
      },
      error: function() {
        //log("computer says no!");
      }
    });
  },

  places: function() {
    var self = this;
    this.showLoading();

    this.checkedIn = function(){};

    var places = new App.PlaceCollection();
    this.currentView = new App.PlaceListView({
      el: self.$content,
      collection: places,
      parent: self
    }).render();
    places.fetch({
      success: function() {
        self.setMenu(self.navItems.places);
      },
      error: function() {

      }
    });
  },

  place: function(id) {
    var self = this;
    this.showLoading();

    this.checkedIn = function(){};

    var place = new App.Place({
      id: id
    });
    place.fetch({
      success: function() {
        self.currentView = new App.PlaceShowView({
          el: self.$content,
          model: place,
          parent: self
        }).render();
        self.setMenu(self.navItems.places);
      },
      error: function() {
      }
    });
  },

  user: function(id) {
    var self = this;
    this.showLoading();

    this.checkedIn = function(){};

    var user = new App.User({
      id: id
    });
    user.fetch({
      success: function() {
        self.currentView = new App.UserShowView({
          el: self.$content,
          model: user,
          parent: self
        }).render();
        self.setMenu(self.navItems.users);
      },
      error: function() {
      }
    });
  },

  users: function() {
    var self = this;
    this.showLoading();

    this.checkedIn = function(){};

    var users = new App.UserCollection();
    this.currentView = new App.UserListView({
      el: self.$content,
      collection: users,
      parent: self
    }).render();
    users.fetch({
      success: function() {
        self.setMenu(self.navItems.users);
      },
      error: function() {

      }
    });
  }

});

function log(m) {
  window.console && console.log(m);
}
