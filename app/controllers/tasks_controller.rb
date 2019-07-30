# frozen_string_literal: true

class TasksController < ApplicationController
  before_action :authenticate_user!
  before_action :set_tasklist

  def index; end

  def create
    @task = @tasklist.tasks.build(tasklist_params)
    render partial: 'task' if @task.save
  end

  def update
    @tasks = @tasklist.tasks.find(params[:id])
    if @tasks.update(tasklist_params)
      redirect_to root_path
    else
      render 'edit'
    end
  end

  def destroy
    @tasks = @tasklist.tasks.find(params[:id])
    @tasks.destroy
    # render json
    redirect_to root_path
  end

  def checkbox_update
    task = @tasklist.tasks.find(params[:id])
    task.update!(status: !task.status)
  end

  private

  def permit_params
    params[:task].permit(:name, :body, :status, :tasklist_id)
  end

  def tasklist_params
    params.permit(:tasklist_id, :name)
  end

  def set_tasklist
    @tasklist = current_user.tasklists.find(params[:tasklist_id])
  end
end
