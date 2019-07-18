class Tasklist < ApplicationRecord
  validates :name, presence: true
  has_many :tasks
  belongs_to :user
end
