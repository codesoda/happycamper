require 'nest'

class Checkin < ActiveRecord::Base
  default_scope includes(:user)
  default_scope :order => 'created_at DESC'

  cattr_reader :per_page
  @@per_page = 20

  attr_accessible :description, :place_id

  validates :description, :length => { :maximum => 140 }
  belongs_to :user, :counter_cache => true
  belongs_to :place, :counter_cache => true

  def to_s
    "#{created_at.strftime('%a %l:%M%p')} #{user} #{place ? place : ''}"
  end

  def as_json(options = {})
    super(:include => [:user, :place], :methods => [:likes])
  end

  def add_checked_and_mentioned_users
    user.checked_in self
    if description
      description.scan(/@([\w0-9_]+)/).flatten.each do |username|
        user = User.find_or_create_by_username(username)
        unless @current_user && @current_user.username == username
          self.mention user
          user.mentioned_in self 
        end
      end
    end
  end

  def self.check_users
    Checkin.all.each do |checkin|
      checkin.add_checked_and_mentioned_users
    end
  end

  def likes size = 20, page = 1
    from = size * (page - 1)
    to = size * page
    user_ids = (rdb[:likes].smembers || [])[from..to]
  end

  def unliked_by(user)
    rdb[:likes].srem user.id
  end

  def liked_by user
    rdb[:likes].sadd user.id
  end

  def mention(user)
    rdb[:mentions].sadd user.id
  end

  # Nest wrappers

  def rdb
    Nest.new(self.class.name)[self.id]
  end

  def self.rdb
    Nest.new(name)
  end
end
