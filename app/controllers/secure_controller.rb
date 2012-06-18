class SecureController < ApplicationController
  before_filter :authenticate_user!
  before_filter :current_user

  def authenticate_user!
    redirect_to new_session_path unless logged_in?
  end

  def current_user
    @current_user ||= User.find(cookies[:user_id])
  end
end
