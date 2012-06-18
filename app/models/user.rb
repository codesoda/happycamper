require 'nest'

class User < ActiveRecord::Base
  attr_accessible :username
  has_many :checkins

  validates :username, :presence => true

  def to_param
    username
  end

  def to_s
    username
  end


  def feeditems size = 20, page = 1

    from = size * (page-1)
    to = size * page

    # grabs set from redis
    checkin_ids = (rdb[:feeditems].smembers || [])[from..to]

    # load checkins from db
    Checkin.where(:id => checkin_ids).includes(:place, :user)
  end

  def checked_in checkin
    # add to feed list in redis
    rdb[:feeditems].sadd checkin.id
  end

  def mentioned_in(checkin)
    rdb[:feeditems].sadd checkin.id
    rdb[:mentions].sadd checkin.id
  end

  def liked(checkin)
    rdb[:feeditems].sadd checkin.id unless self.id == checkin.user_id
    rdb[:likes].sadd checkin.id
  end
  
  def unliked(checkin)
    rdb[:feeditems].srem checkin.id
    rdb[:likes].srem checkin.id
  end

  # Nest wrappers

  def rdb
    Nest.new(self.class.name)[self.id]
  end

  def self.rdb
    Nest.new(name)
  end

end
