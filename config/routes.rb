# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  devise_for :users, controllers: { session: 'users/session' }
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'tasklists#index'
  resources :tasklists do
    resources :tasks
  end

  get 'updatecheck/:tasklist_id/:id', to: 'tasks#checkbox_update'
end
