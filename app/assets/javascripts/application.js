// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require_tree .

var resizeCheckinTextarea = function() {
  var height = $('.sidebar').outerHeight() - 100
  $('#checkin_description').css('height', height);
}

var linkify = function(text) {
  linkified = text.replace(/@([\w0-9_]+)/g, '<a href="#users/$1" class="mention">@$1</a>');
  return linkified;
}

$(function(){

  $(window).resize(function() {
    return resizeCheckinTextarea();
  })
  resizeCheckinTextarea();


  // Kick off the backbone app
  var app = new App.Router();
  Backbone.history.start();

});
