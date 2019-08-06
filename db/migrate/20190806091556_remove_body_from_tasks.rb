class RemoveBodyFromTasks < ActiveRecord::Migration[5.2]
  def change
    remove_column :tasks, :body
  end
end
