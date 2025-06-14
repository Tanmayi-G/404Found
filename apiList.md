# 404Found API list

## authRouter

- POST /signup
- POST /login
- POST /logout

## profileRouter

- GET /profile/view
- PATCH /profile/edit

## requestRouter

- POST /request/send/:status/:userId (status: interested,ignored)
- POST /request/review/:status/:requestId (status: accepted, rejected)

## userRouter

- GET /user/requests/received
- GET /user/connections
- GET /user/feed
