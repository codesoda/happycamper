class AddCounterToUsersAndPlaces < ActiveRecord::Migration
  def change
    add_column :users, :checkins_count, :integer
    add_column :places, :checkins_count, :integer
  end
end
