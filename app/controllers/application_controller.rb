class ApplicationController < ActionController::Base
  protect_from_forgery 

  def logged_in?
    not cookies[:user_id].blank?
  end
end
