# frozen_string_literal: true

class TasksController < ApplicationController
  before_action :authenticate_user!
  before_action :set_tasklist
  before_action :set_task, except: :create

  def index; end

  def create
    @task = @tasklist.tasks.build(tasklist_params)
    if @task.save
      render partial: 'task'
    else
      render json: @task.errors.full_messages, status: 422
    end
  end

  def update
    if @task.update(tasklist_params)
      render partial: 'task'
    else
      render json: @task.errors.full_messages, status: 422
    end
  end

  def destroy
    @task.destroy
  end

  def toggle_status
    @task.update!(status: !@task.status)
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

  def set_task
    @task = @tasklist.tasks.find(params[:id])
  end
end
