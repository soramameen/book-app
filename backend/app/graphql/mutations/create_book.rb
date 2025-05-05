module Mutations
    class CreateBook < BaseMutation
        # Define the arguments for the mutation
        argument :title, String, required: true
        argument :author, String, required: true
        argument :content, String, required: true
        # Define the return type of the mutation
        type   Types::BookType
    
        # The resolve method is where the mutation logic is implemented
        def resolve(title:nil, author:nil, content:nil)
            book = Book.create!(
            title: title,
            author: author,
            content: content
            )
        end
    end
end