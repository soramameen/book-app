# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    field :all_books, [BookType], null: false 
    def all_books
      Book.all
    end
  end
end
