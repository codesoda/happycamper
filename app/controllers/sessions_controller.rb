class SessionsController < ApplicationController

  def new
    redirect_to root_path if logged_in?
  end

  def create
    session = params[:session]
    username = session[:username].gsub(/^@/, '').downcase
    @user = User.find_by_username(username) || User.new(username: username)
    if @user.save
      cookies.permanent[:user_id] = @user.id
      redirect_to root_path
    else
      flash.now[:error] = 'Try again'
      render :new
    end
  end

  def destroy
    cookies.delete :user_id
    redirect_to :action => :new
  end
end
