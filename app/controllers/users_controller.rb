class UsersController < SecureController
  respond_to :html, :json

  def index
    respond_with @users = User.order('checkins_count DESC').limit(20)
  end

  def show
    @user = User.find_by_username(params[:id])
    respond_to do |format|
      format.json do
        checkins = @user.feeditems
        render :json => user_with_checkins(@user, checkins)
      end
    end
  end

  private

  def user_with_checkins(user, checkins)
    {
      id: user.id,
      username: user.username,
      checkins_count: user.checkins_count,
      checkins: checkins
    }
  end
end
