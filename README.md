# Flitter

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
Authentification:

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
        "_id": "63dc32ea501f7847052c2369",
        "author": "Karen2",
        "message": "Hello, this is my flit 2",
        "date": "2023-02-02",
        "kudos": [
            {
                "name": "kyl",
                "email": "firstUser@fakemail.com",
                "avatar": "",
                "followers": [],
                "following": [],
                "_id": "63dc4047aba142f1e0b560da"
            }
        ],
        "comments": [
            {
                "author": "Follower1",
                "image": "http://localhost:3000/images/flits/bici.png",
                "message": "Welcome!",
                "_id": "63dc4047aba142f1e0b560db",
                "kudos": []
            }
        ],
        "__v": 0
    },
    {
        "_id": "63dc39857bd958e0a700ecf7",
        "author": "postman",
        "message": "flit from postman",
        "date": "2023-02-02",
        "kudos": [],
        "comments": [],
        "__v": 0
    },
    {
        "_id": "63dc3b925e37a9129167fa71",
        "author": "postman2",
        "message": "flit from postman 2",
        "date": "Wed Feb 01 2023 18:00:00 GMT-0600 (hora estándar central)",
        "kudos": [],
        "comments": [],
        "__v": 0
    },
    {
        "_id": "63dc3e9b9842a11e35139faf",
        "author": "postman3",
        "message": "flit from postman 3",
        "date": "2023-02-02",
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
