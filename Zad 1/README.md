# PG_RAI_Proj_extra

prepare server and install dependencies:<br>
```
npm init -y
npm install express fs.promises
```

run server:
```
node app.js
```

run postman and add http tab



to print all cars:
GET localhost:300/cars

to print one car:
GET localhost:300/cars/<number>

to add car:
POST http://localhost:3000/cars

```
{
  "number": "ABC123",
  "mileage": 5000,
  "passangerCount": 4,
  "pricePerDay": 50
}
```

to update car:
PUT http://localhost:3000/cars/<number>

```
{
  "mileage": 6000,
  "pricePerDay": 55
}
```

to delete car:
DELETE http://localhost:3000/cars/<number>

<number> is first filed in struct