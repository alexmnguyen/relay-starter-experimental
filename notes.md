1) can pass a context so graphql schema can check that
  - we use the context to determine what user is currently logged in
  - the context is a decoded jwt payload in request.user.

2)
  "graphql": "0.5.0",
  "graphql-relay": "0.4.1",
  "express-graphql": "0.5.1",

  express-graphql at version 0.5.1 required to be able to check context variable
