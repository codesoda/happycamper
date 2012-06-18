class CreateCheckinsTable < ActiveRecord::Migration
  def change
    create_table :checkins do |t|
      t.integer :user_id
      t.integer :place_id
      t.text    :description

      t.timestamps
    end
  end
end
