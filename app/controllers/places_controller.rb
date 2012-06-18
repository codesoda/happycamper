class PlacesController < SecureController
  respond_to :html, :json

  def index
    respond_with @places = Place.all
  end

  def show
    @place = Place.find(params[:id])
    respond_to do |format|
      format.json do
        checkins = @place.checkins.take(20)
        render :json => place_with_checkins(@place, checkins)
      end
    end
  end

  private

  def place_with_checkins(place, checkins)
    {
      id: place.id,
      name: place.name,
      checkins_count: place.checkins_count,
      checkins: checkins
    }
  end
end
