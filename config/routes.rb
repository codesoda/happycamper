Happycamper::Application.routes.draw do
  resources :users
  resources :places
  resources :checkins
  post "/checkins/:id/likes" => "checkins#likes"
  delete "/checkins/:checkin_id/likes/:id" => "checkins#unlikes"
  resources :sessions, only: [:new, :create, :destroy]
  resources :upload, :only => [:new, :create]

  root to: 'checkins#index'
end
