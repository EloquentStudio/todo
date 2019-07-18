# frozen_string_literal: true

class Task < ApplicationRecord
  belongs_to :tasklist
  validates :name, :body, presence: true
end
