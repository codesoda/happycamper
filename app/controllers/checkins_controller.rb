class CheckinsController < SecureController
  respond_to :html, :json

  def new
    @checkin = Checkin.new
  end

  def index
    @checkins = Checkin.page params[:page]
    respond_with @checkins 
  end

  def create
    checkin = Checkin.new(params[:checkin])
    checkin.user = current_user 

    place_name = params[:place_name]
    if checkin.place_id.to_i == 0 && !place_name.blank?
      # create the place on the fly
      place = Place.create! :name => place_name
      checkin.place_id = place.id
    end

    if checkin.save

      # add the feeditem
      checkin.add_checked_and_mentioned_users

      respond_to do |format|
        format.html { redirect_to root_path, :notice => 'Checked in' }
        format.json { render :json => checkin, :include => [:place, :user] }
      end
    end
  end

  def likes
    checkin = Checkin.find(params[:id])
    current_user.liked checkin
    checkin.liked_by current_user
    render :json => 1
  end

  def unlikes
    checkin = Checkin.find(params[:checkin_id])
    current_user.unliked checkin
    checkin.unliked_by current_user 
    render :json => 1
  end
end
