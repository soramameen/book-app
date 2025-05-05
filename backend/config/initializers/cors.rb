# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
    allow do
      origins 'http://localhost:5173'  # Reactアプリケーションのオリジン
  
      resource '/graphql',
        headers: :any,
        methods: [:post, :options],
        credentials: true
    end
  end