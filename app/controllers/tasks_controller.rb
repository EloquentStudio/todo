# frozen_string_literal: true

class TasksController < ApplicationController
  before_action :authenticate_user!
  before_action :set_tasklist

  def index
    @tasks = @tasklist.tasks
  end

  def new
    render plain: params
  end

  def create
    @tasks = @tasklist.tasks.build(tasklist_params)
    if @tasks.save
      redirect_to root_path
    else
      render plain: params.inspect
    end
  end

  def show
    @tasks = @tasklist.tasks.find(params[:id])
  end

  def edit
    @tasks = @tasklist.tasks.find(params[:id])
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
    redirect_to tasklist_tasks_path(@tasks.tasklist_id)
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
