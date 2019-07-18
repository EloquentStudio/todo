class AddUserToTaskklist < ActiveRecord::Migration[5.2]
  def change
    add_reference :tasklists, :user, foreign_key: true
  end
end
