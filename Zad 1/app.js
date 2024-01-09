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

// Endpoint do pobierania listy wszystkich samochodów
app.get("/cars", async (req, res) => {
    try {
        // Odczytaj nazwy plików z katalogu danych
        const carFiles = await fs.readdir(dataDirectory);

        // Odczytaj dane o każdym samochodzie z pliku i zwróć listę
        const cars = await Promise.all(
            carFiles.map(async (carFile) => {
                const carFilePath = path.join(dataDirectory, carFile);
                const carData = await fs.readFile(carFilePath, "utf-8");
                return JSON.parse(carData);
            })
        );

        // Odpowiedź z listą samochodów w formacie JSON
        res.json(cars);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Endpoint do dodawania nowego samochodu
app.post("/cars", async (req, res) => {
    try {
        // Odczytaj dane nowego samochodu z ciała żądania
        const { number, mileage, passangerCount, pricePerDay } = req.body;
        const car = new Car(number, mileage, passangerCount, pricePerDay);

        // Ścieżka do pliku z danymi o samochodzie
        const carFilePath = path.join(dataDirectory, `${car.number}-${car.number}.json`);

        // Zapisz dane nowego samochodu do pliku
        await fs.writeFile(carFilePath, JSON.stringify(car));

        // Odpowiedź potwierdzająca utworzenie samochodu
        res.status(201).json({ message: "Car created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Endpoint do pobierania informacji o samochodzie po numerze
app.get("/cars/:number", async (req, res) => {
    try {
        // Odczytaj numer samochodu z parametru żądania
        const carNumber = req.params.number;

        // Ścieżka do pliku z danymi o samochodzie
        const carFilePath = path.join(dataDirectory, `${carNumber}-${carNumber}.json`);

        // Odczytaj dane o samochodzie z pliku
        const carData = await fs.readFile(carFilePath, "utf-8");
        const car = JSON.parse(carData);

        // Odpowiedź z danymi o samochodzie w formacie JSON
        res.json(car);
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: "Car not found" });
    }
});

// Endpoint do aktualizacji informacji o samochodzie
app.put("/cars/:number", async (req, res) => {
    try {
        // Odczytaj numer samochodu z parametru żądania
        const carNumber = req.params.number;

        // Ścieżka do pliku z danymi o samochodzie
        const carFilePath = path.join(dataDirectory, `${carNumber}-${carNumber}.json`);

        // Odczytaj dane o samochodzie z pliku
        const carData = await fs.readFile(carFilePath, "utf-8");
        const existingCar = JSON.parse(carData);

        // Odczytaj dane do aktualizacji z ciała żądania
        const { number, mileage, passangerCount, pricePerDay } = req.body;

        // Aktualizuj dane samochodu (jeśli podane)
        existingCar.number = number || existingCar.number;
        existingCar.mileage = mileage || existingCar.mileage;
        existingCar.passangerCount = passangerCount || existingCar.passangerCount;
        existingCar.pricePerDay = pricePerDay || existingCar.pricePerDay;

        // Zapisz zaktualizowane dane do pliku
        await fs.writeFile(carFilePath, JSON.stringify(existingCar));

        // Odpowiedź potwierdzająca aktualizację samochodu
        res.json({ message: "Car updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: "Car not found" });
    }
});

// Endpoint do usuwania samochodu
app.delete("/cars/:number", async (req, res) => {
    try {
        // Odczytaj numer samochodu z parametru żądania
        const carNumber = req.params.number;

        // Ścieżka do pliku z danymi o samochodzie
        const carFilePath = path.join(dataDirectory, `${carNumber}-${carNumber}.json`);

        // Usuń plik z danymi o samochodzie
        await fs.unlink(carFilePath);

        // Odpowiedź potwierdzająca usunięcie samochodu
        res.json({ message: "Car deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: "Car not found" });
    }
});

// Określenie portu, na którym serwer będzie nasłuchiwał
const port = process.env.PORT || 3000;

// Uruchomienie serwera na określonym porcie
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
