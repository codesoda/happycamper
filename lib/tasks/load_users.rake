namespace :load do
  desc "Import user and check them at RailsCamp"
  task :users => :environment do |t|
    require 'csv'
    rc = Place.find_or_create_by_name(:name => 'Rails camp 11')
    CSV.open('lib/assets/twitter.csv').each do |twitter|
      username = twitter[0].gsub(/^@/, '').downcase
      user = User.find_or_create_by_username(:username => username)
      checkin = user.checkins.create(:place_id => rc.id)
      checkin.created_at = '2012-06-15 15:00:00'
      checkin.save
    end
  end
end
