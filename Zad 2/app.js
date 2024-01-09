"use strict";

import express from "express";
import fs from "fs/promises";
import path from "path";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

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

// Definiuje opcje dla Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Car Rental API",
      version: "1.0.0",
      description: "API for managing cars and rentals",
    },
  },
  // Ścieżka do plików z adnotacjami Swagger w kodzie
  apis: ["./app.js"],
};

// Generuje dokumentację Swagger na podstawie zdefiniowanych opcji
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Dodaje endpoint dla dokumentacji Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());

/**
 * @swagger
 * /cars:
 *   get:
 *     summary: Get a list of all cars
 *     responses:
 *       200:
 *         description: Successful response with a list of cars
 */
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
    console.error("Błąd podczas pobierania listy samochodów:", error);
    res.status(500).json({ error: "Wewnętrzny błąd serwera" });
  }
});

/**
 * @swagger
 * /cars:
 *   post:
 *     summary: Create a new car
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               number:
 *                 type: string
 *                 description: The registration number of the car
 *               mileage:
 *                 type: number
 *                 description: The mileage of the car
 *               passangerCount:
 *                 type: number
 *                 description: The number of passenger seats in the car
 *               pricePerDay:
 *                 type: number
 *                 description: The rental price per day for the car
 *             required:
 *               - number
 *               - mileage
 *               - passangerCount
 *               - pricePerDay
 *     responses:
 *       201:
 *         description: Car created successfully
 */
app.post("/cars", async (req, res) => {
  try {
    const { number, mileage, passangerCount, pricePerDay } = req.body;
    const car = new Car(number, mileage, passangerCount, pricePerDay);

    const carFilePath = path.join(dataDirectory, `${car.number}-${car.number}.json`);

    await fs.writeFile(carFilePath, JSON.stringify(car));

    res.status(201).json({ message: "Samochód utworzony pomyślnie" });
  } catch (error) {
    console.error("Błąd podczas dodawania nowego samochodu:", error);
    res.status(500).json({ error: "Wewnętrzny błąd serwera" });
  }
});

/**
 * @swagger
 * /cars/{number}:
 *   get:
 *     summary: Get information about a specific car by its number
 *     parameters:
 *       - in: path
 *         name: number
 *         required: true
 *         description: The registration number of the car
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response with information about the car
 *       404:
 *         description: Car not found
 */
app.get("/cars/:number", async (req, res) => {
  try {
    const carNumber = req.params.number;
    const carFilePath = path.join(dataDirectory, `${carNumber}-${carNumber}.json`);

    const carData = await fs.readFile(carFilePath, "utf-8");
    const car = JSON.parse(carData);

    res.json(car);
  } catch (error) {
    console.error("Błąd podczas pobierania informacji o samochodzie:", error);
    res.status(404).json({ error: "Samochód nie znaleziony" });
  }
});

/**
 * @swagger
 * /cars/{number}:
 *   put:
 *     summary: Update information about a specific car by its number
 *     parameters:
 *       - in: path
 *         name: number
 *         required: true
 *         description: The registration number of the car
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               number:
 *                 type: string
 *                 description: The registration number of the car
 *               mileage:
 *                 type: number
 *                 description: The mileage of the car
 *               passangerCount:
 *                 type: number
 *                 description: The number of passenger seats in the car
 *               pricePerDay:
 *                 type: number
 *                 description: The rental price per day for the car
 *             required:
 *               - number
 *     responses:
 *       200:
 *         description: Successful response with information about the updated car
 *       404:
 *         description: Car not found
 */
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

    res.json(existingCar);
  } catch (error) {
    console.error("Błąd podczas aktualizacji informacji o samochodzie:", error);
    res.status(404).json({ error: "Samochód nie znaleziony" });
  }
});

/**
 * @swagger
 * /cars/{number}:
 *   delete:
 *     summary: Delete a specific car by its number
 *     parameters:
 *       - in: path
 *         name: number
 *         required: true
 *         description: The registration number of the car
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response indicating that the car was deleted
 *       404:
 *         description: Car not found
 */
app.delete("/cars/:number", async (req, res) => {
  try {
    const carNumber = req.params.number;
    const carFilePath = path.join(dataDirectory, `${carNumber}-${carNumber}.json`);

    await fs.unlink(carFilePath);

    res.json({ message: "Samochód usunięty pomyślnie" });
  } catch (error) {
    console.error("Błąd podczas usuwania samochodu:", error);
    res.status(404).json({ error: "Samochód nie znaleziony" });
  }
});

const port = 3000;

app.listen(port, () => {
  console.log(`Serwer działa na porcie ${port}`);
});
