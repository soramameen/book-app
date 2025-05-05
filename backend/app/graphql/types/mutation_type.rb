# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    # TODO: remove me
    field :createBook, mutation: Mutations::CreateBook
    
  end
end
