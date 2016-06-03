# Usage

```npm install```

Development: `npm run local`

Production: `NODE_ENV=production npm start`

# Possible Future Enhancements

1. proxy all github requests through server so as to avoid github's public rate limit (60 rph)
1. use css extension language (e.g. sass)
1. host css/js in cdn for stability and availability
  * create bundle on build server so-as not to build during app startup 
1. front-end tests (e.g. jasmine and karma)
1. more back-end tests
1. implement async/await on server for code simplicity
1. support keyboard shortcuts for easier navigation
1. better loading indicators and splash screen
1. aria support
