# DevTinder APIs

## AuthRouter

POST /signup
POST /login
POST /logout

## ProfileRouter
GET /profile/view
PATCH /profile/edit
PATCH /profile/password

## ConnectionRequestRouter
POST /request/send/interested/:userId
POST /request/send/ignored/:userId
POST /request/review/accepted/:requestId
POST /request/review/rejected/:requestId

## UserRouter
GET /user/connections
GET /user/requests/received
GET /user/feed- gets you the profiles of users on the platform


explore the $nin,$and,$ne ...  


Status : ignore,interested,accepted,rejected


/feed?page=1&limit=10 => 1-10 => .skip(0) & .limit(10);

/feed?page=2&limit=10 => 11-20 => .skip(10) & .limit(10);

/feed?page=3&limit=10 => 21-30 => .skip(20) & .limit(10);


skip = (page-1)*limit


hello