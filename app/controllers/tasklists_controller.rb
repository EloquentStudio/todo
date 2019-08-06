# frozen_string_literal: true

class TasklistsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_tasklist, except: %i[index create]

  def index
    @tasklists = current_user.tasklists
  end

  def create
    @tasklist = current_user.tasklists.build(tasklist_params)
    if @tasklist.save
      render partial: 'tasklist'
    else
      render json: @tasklist.errors.full_messages, status: 422
    end
  end

  def update
    if @tasklist.update(tasklist_params)
      render partial: 'tasklist'
    else
      render json: @tasklist.errors.full_messages, status: 422
    end
  end

  def render_tasks
    @tasks = @tasklist.tasks
    render partial: 'tasks'
  end

  def destroy
    @tasklist.destroy
    redirect_to root_path
  end

  private

  def tasklist_params
    params.permit(:name)
  end

  def set_tasklist
    @tasklist = current_user.tasklists.find(params[:id])
  end
end
