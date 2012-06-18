namespace :load do
  desc "Import checkins and mentions to Redis"
  task :checkins => :environment do |t|
    Checkin.check_users
  end

  desc "flush all keys from redis"
  task :flush_all_keys => :environment do |t|
    r = Redis.current
    r.keys.each do |key|
      r.del key
    end
  end 
end
