class Tasklist < ApplicationRecord
  validates :name, presence: true
  has_many :tasks, dependent: :delete_all
  belongs_to :user
end
