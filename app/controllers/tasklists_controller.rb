# frozen_string_literal: true

class TasklistsController < ApplicationController
  before_action :authenticate_user!

  def index
    @tasklists = current_user.tasklists
  end

  def create
    @tasklist = current_user.tasklists.build(tasklist_params)
    render partial: 'tasklist' if @tasklist.save
  end

  def update
    @tasklist = current_user.tasklists.find(params[:id])
    render partial: 'tasklist' if @tasklist.update(tasklist_params)
  end

  def render_tasks
    @tasks = Tasklist.find(params[:id]).tasks
    render partial: 'tasks'
  end

  def destroy
    Tasklist.find(params[:id]).destroy
    redirect_to root_path
  end

  private

  def tasklist_params
    params.permit(:name)
  end
end
