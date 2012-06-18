class Place < ActiveRecord::Base
  default_scope :order => 'checkins_count desc'
  attr_accessible :name
  has_many :checkins

  def to_s
    name
  end
end
