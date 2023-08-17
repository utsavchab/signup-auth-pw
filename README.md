# INSTA SIGNUP AUTH PROJECT

### 1) Client
  #### a. GET REQUEST
   - '/' : home route ((if cookie contains a valid token then display the details else move to signin page)).
   - '/signin': signin page (if cookie contains a valid token then display the details else move to signin page).
   - '/signup': signup page (if cookie contains a valid token then display the details else move to signup page).
  
   #### b. POST REQUEST
   - '/signin': POST to 'SERVER_BASE/api/auth/signin' (is success then redirect to '/' else show the error on signin page).
   - '/signup': POST to 'SERVER_BASE/api/auth/signup' (is success then redirect to '/signin' else show the error on signin page).

### 2) Server
#### a. MIDDLEWARES
   1. jwtAuth: Token AUthentication.
   2. passwordChangeAuth: Check if the password was changed. If was changed then the invalidate the token (i.e logout) else the token is valid.
      
####   b. POST REQUEST
   - '/api/auth': Get user data from cookie token if present.
   - '/api/auth/signin': Sign in the user is correct details entered else throw the error.
   - '/api/auth/signup': Register user deatails in the data base.
