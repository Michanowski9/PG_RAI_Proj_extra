"use strict";

import express from "express";
import fs from "fs/promises";
import path from "path";

export default class Car {
    number;
    mileage;
    passangerCount;
    pricePerDay;
    defects=[];
    rentals=[];
    returns=[];

    constructor(number, mileage, passangerCount, pricePerDay) {
        this.number = number;
        this.mileage = mileage;
        this.passangerCount = passangerCount;
        this.pricePerDay = pricePerDay;
    }

    Rent(start, end){
        this.rentals.push([start,end]);
    }

    Return(){

    }

    WhenAvailable(){

    }

    AddDefect(defect){
        this.defects.push(defect);
    }

    GetRentalsCount(){
        return this.rentals.length;
    }
    GetDefectsCount(){
        return this.defects.length;
    }
}

const app = express();
const dataDirectory = "./data/cars";

app.use(express.json());

app.get("/cars", async (req, res) => {
    try {
      const carFiles = await fs.readdir(dataDirectory);
  
      const cars = await Promise.all(
        carFiles.map(async (carFile) => {
          const carFilePath = path.join(dataDirectory, carFile);
          const carData = await fs.readFile(carFilePath, "utf-8");
          return JSON.parse(carData);
        })
      );
  
      res.json(cars);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

// Endpoint do dodawania nowego samochodu
app.post("/cars", async (req, res) => {
  try {
    const { number, mileage, passangerCount, pricePerDay } = req.body;
    const car = new Car(number, mileage, passangerCount, pricePerDay);

    const carFilePath = path.join(dataDirectory, `${car.number}-${car.number}.json`);
    await fs.writeFile(carFilePath, JSON.stringify(car));

    res.status(201).json({ message: "Car created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint do pobierania informacji o samochodzie po numerze
app.get("/cars/:number", async (req, res) => {
  try {
    const carNumber = req.params.number;
    const carFilePath = path.join(dataDirectory, `${carNumber}-${carNumber}.json`);

    const carData = await fs.readFile(carFilePath, "utf-8");
    const car = JSON.parse(carData);

    res.json(car);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Car not found" });
  }
});

// Endpoint do aktualizacji informacji o samochodzie
app.put("/cars/:number", async (req, res) => {
  try {
    const carNumber = req.params.number;
    const carFilePath = path.join(dataDirectory, `${carNumber}-${carNumber}.json`);

    const carData = await fs.readFile(carFilePath, "utf-8");
    const existingCar = JSON.parse(carData);

    const { number, mileage, passangerCount, pricePerDay } = req.body;
    existingCar.number = number || existingCar.number;
    existingCar.mileage = mileage || existingCar.mileage;
    existingCar.passangerCount = passangerCount || existingCar.passangerCount;
    existingCar.pricePerDay = pricePerDay || existingCar.pricePerDay;

    await fs.writeFile(carFilePath, JSON.stringify(existingCar));

    res.json({ message: "Car updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Car not found" });
  }
});

// Endpoint do usuwania samochodu
app.delete("/cars/:number", async (req, res) => {
  try {
    const carNumber = req.params.number;
    const carFilePath = path.join(dataDirectory, `${carNumber}-${carNumber}.json`);

    await fs.unlink(carFilePath);

    res.json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Car not found" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
