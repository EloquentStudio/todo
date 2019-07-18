# frozen_string_literal: true

class TasklistsController < ApplicationController
  before_action :authenticate_user!

  def index
    @tasklist = current_user.tasklists
    redirect_to new_tasklist_path if @tasklist.count.zero?
  end

  def new
    @tasklist = current_user.tasklists.build
  end

  def create
    @tasklist = current_user.tasklists.build(tasklist_params)
    if @tasklist.save
      redirect_to tasklists_path
    else
      render 'new'
    end
  end

  def show
    @tasklist = current_user.tasklists.find(params[:id])
  end

  private

  def tasklist_params
    print params.inspect
    params[:tasklist].permit(:name)
  end
end
