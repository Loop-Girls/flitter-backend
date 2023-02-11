#Flitter

Deploy:

```sh
npm install
```

Load initial data to database:

```
npm run init-db
```

Start the application in production with:

```sh
npm start
```

Start the application in development with:

```sh
npm run dev
```
Authentification: (disabled)

```sh
user: admin
password: 1234
```

## API Documentation

Flits list:
```
GET /apiv1/flits
[
  {
    "_id": "63ddae60bf98e0cdc171c2ec",
    "author": "Karen2",
    "message": "Hello, this is my flit 2",
    "date": "2023-02-02T00:00:00.000Z",
    "kudos": [
      {
        "name": "kyl",
        "email": "firstuser@fakemail.com",
        "password": "123456",
        "avatar": "",
        "followers": [],
        "following": [],
        "_id": "63ddae60bf98e0cdc171c2ed"
      }
    ],
    "comments": [
      {
        "author": "Follower1",
        "image": "http://localhost:3000/images/flits/bici.png",
        "message": "Welcome!",
        "date": "2023-02-02T00:00:00.000Z",
        "_id": "63ddae60bf98e0cdc171c2ee",
        "kudos": []
      }
    ],
    "__v": 0
  },
  {
    "_id": "63ddae60bf98e0cdc171c2f0",
    "author": "postman",
    "message": "flit from postman",
    "date": "2023-02-02T00:00:00.000Z",
    "kudos": [],
    "comments": [],
    "__v": 0
  },
  {
    "_id": "63ddae60bf98e0cdc171c2f2",
    "author": "postman2",
    "message": "flit from postman 2",
    "date": "2023-02-02T00:00:00.000Z",
    "kudos": [],
    "comments": [],
    "__v": 0
  },
  {
    "_id": "63ddae60bf98e0cdc171c2f4",
    "author": "postman3",
    "message": "flit from postman 3",
    "date": "2023-02-02T00:00:00.000Z",
    "kudos": [],
    "comments": [],
    "__v": 0
  },
  {
    "_id": "63ddae60bf98e0cdc171c2f6",
    "author": "Bea",
    "message": "flit from postman 4",
    "date": "2023-02-06T00:00:00.000Z",
    "kudos": [],
    "comments": [],
    "__v": 0
  },
  {
    "_id": "63ddae60bf98e0cdc171c2f8",
    "author": "Bea2",
    "message": "flit from postman 5",
    "date": "2023-02-07T00:00:00.000Z",
    "kudos": [],
    "comments": [],
    "__v": 0
  },
  {
    "_id": "63ddae60bf98e0cdc171c2fa",
    "author": "Bea3",
    "message": "flit from postman 6",
    "date": "2023-02-08T00:00:00.000Z",
    "kudos": [],
    "comments": [],
    "__v": 0
  },
  {
    "_id": "63ddae60bf98e0cdc171c2fc",
    "author": "Bea4",
    "message": "flit from postman 7",
    "date": "2023-02-09T00:00:00.000Z",
    "kudos": [],
    "comments": [],
    "__v": 0
  },
  {
    "_id": "63ddae60bf98e0cdc171c2fe",
    "author": "Bea5",
    "message": "flit from postman 8",
    "date": "2023-02-10T00:00:00.000Z",
    "kudos": [],
    "comments": [],
    "__v": 0
  },
  {
    "_id": "63ddae60bf98e0cdc171c300",
    "author": "Bea6",
    "message": "flit from postman 9",
    "date": "2023-02-11T00:00:00.000Z",
    "kudos": [],
    "comments": [],
    "__v": 0
  }
]
```

Pagination query example:

```
GET /apiv1/flits?author=postman&skip=1&limit=1

```

search for a message that it starts with those letters

```
GET /apiv1/flits?message=h

```


search for a flip that it starts with those letters

```
GET /apiv1/flits?author=k

```


Search older:

```
GET /apiv1/flits?sort=date
```

Search most recent:

```
GET /apiv1/flits?sort=-date
```

Delete a flit:

```
DELETE /apiv1/flits/:id
```

Update a flit:

```
PUT /apiv1/flits/(id) (body=flitData)
```

Create a flit:

```
POST /apiv1/flits/post (body[form-data]=flitData)
```

Auth signup:

```
POST /apiv1/auth/signup (body=userData)
```
