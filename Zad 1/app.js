"use strict";

// Importuje moduł Express, który jest frameworkiem dla aplikacji webowych w Node.js
import express from "express";
// Importuje moduł fs/promises, który zapewnia asynchroniczne operacje na plikach
import fs from "fs/promises";
// Importuje moduł path, który udostępnia narzędzia do obsługi ścieżek plików
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

// Inicjalizuje aplikację Express
const app = express();
// Ścieżka do katalogu, gdzie będą przechowywane dane o samochodach
const dataDirectory = "./data/cars";

// Ustawia middleware do obsługi danych w formacie JSON
app.use(express.json());

// Endpoint do pobierania listy wszystkich samochodów
app.get("/cars", async (req, res) => {
    try {
        // Odczytuje nazwy plików samochodów z katalogu danych
        const carFiles = await fs.readdir(dataDirectory);

        // Odczytuje dane o każdym samochodzie z pliku i zwraca listę samochodów
        const cars = await Promise.all(
            carFiles.map(async (carFile) => {
                // Tworzy pełną ścieżkę do pliku samochodu
                const carFilePath = path.join(dataDirectory, carFile);
                // Odczytuje zawartość pliku (dane o samochodzie) jako ciąg znaków
                const carData = await fs.readFile(carFilePath, "utf-8");
                // Parsuje dane z formatu JSON na obiekt reprezentujący samochód
                return JSON.parse(carData);
            })
        );

        // Odpowiada klientowi z listą samochodów w formacie JSON
        res.json(cars);
    } catch (error) {
        // Obsługuje błędy, informuje o błędzie i zwraca status 500
        console.error("Błąd podczas pobierania listy samochodów:", error);
        res.status(500).json({ error: "Wewnętrzny błąd serwera" });
    }
});

// Endpoint do dodawania nowego samochodu
app.post("/cars", async (req, res) => {
    try {
        // Odczytuje dane nowego samochodu z ciała żądania
        const { number, mileage, passangerCount, pricePerDay } = req.body;
        // Tworzy nowy obiekt samochodu na podstawie przekazanych danych
        const car = new Car(number, mileage, passangerCount, pricePerDay);

        // Łączy ścieżkę do pliku, w którym będą przechowywane dane o nowym samochodzie
        const carFilePath = path.join(dataDirectory, `${car.number}-${car.number}.json`);

        // Zapisuje dane nowego samochodu do pliku w formacie JSON
        await fs.writeFile(carFilePath, JSON.stringify(car));

        // Odpowiada klientowi informacją o pomyślnym utworzeniu samochodu
        res.status(201).json({ message: "Samochód utworzony pomyślnie" });
    } catch (error) {
        // Obsługuje błędy, informuje o błędzie i zwraca status 500
        console.error("Błąd podczas dodawania nowego samochodu:", error);
        res.status(500).json({ error: "Wewnętrzny błąd serwera" });
    }
});

// Endpoint do pobierania informacji o samochodzie po numerze
app.get("/cars/:number", async (req, res) => {
    try {
        // Odczytuje numer samochodu z parametru żądania
        const carNumber = req.params.number;

        // Łączy ścieżkę do pliku z danymi o samochodzie
        const carFilePath = path.join(dataDirectory, `${carNumber}-${carNumber}.json`);

        // Odczytuje dane o samochodzie z pliku
        const carData = await fs.readFile(carFilePath, "utf-8");
        // Parsuje dane z formatu JSON na obiekt reprezentujący samochód
        const car = JSON.parse(carData);

        // Odpowiada klientowi danymi o samochodzie w formacie JSON
        res.json(car);
    } catch (error) {
        // Obsługuje błędy, informuje o błędzie i zwraca status 404
        console.error("Błąd podczas pobierania informacji o samochodzie:", error);
        res.status(404).json({ error: "Samochód nie znaleziony" });
    }
});

// Endpoint do aktualizacji informacji o samochodzie
app.put("/cars/:number", async (req, res) => {
    try {
        // Odczytuje numer samochodu z parametru żądania
        const carNumber = req.params.number;

        // Łączy ścieżkę do pliku z danymi o samochodzie
        const carFilePath = path.join(dataDirectory, `${carNumber}-${carNumber}.json`);

        // Odczytuje dane o samochodzie z pliku
        const carData = await fs.readFile(carFilePath, "utf-8");
        // Parsuje dane z formatu JSON na obiekt reprezentujący samochód
        const existingCar = JSON.parse(carData);

        // Odczytuje dane do aktualizacji z ciała żądania
        const { number, mileage, passangerCount, pricePerDay } = req.body;

        // Aktualizuje dane samochodu (jeśli podane)
        existingCar.number = number || existingCar.number;
        existingCar.mileage = mileage || existingCar.mileage;
        existingCar.passangerCount = passangerCount || existingCar.passangerCount;
        existingCar.pricePerDay = pricePerDay || existingCar.pricePerDay;

        // Zapisuje zaktualizowane dane do pliku w formacie JSON
        await fs.writeFile(carFilePath, JSON.stringify(existingCar));

        // Odpowiada klientowi informacją o pomyślnej aktualizacji samochodu
        res.json({ message: "Samochód zaktualizowany pomyślnie" });
    } catch (error) {
        // Obsługuje błędy, informuje o błędzie i zwraca status 404
        console.error("Błąd podczas aktualizacji informacji o samochodzie:", error);
        res.status(404).json({ error: "Samochód nie znaleziony" });
    }
});

// Endpoint do usuwania samochodu
app.delete("/cars/:number", async (req, res) => {
    try {
        // Odczytuje numer samochodu z parametru żądania
        const carNumber = req.params.number;

        // Łączy ścieżkę do pliku z danymi o samochodzie
        const carFilePath = path.join(dataDirectory, `${carNumber}-${carNumber}.json`);

        // Usuwa plik z danymi o samochodzie
        await fs.unlink(carFilePath);

        // Odpowiada klientowi informacją o pomyślnym usunięciu samochodu
        res.json({ message: "Samochód usunięty pomyślnie" });
    } catch (error) {
        // Obsługuje błędy, informuje o błędzie i zwraca status 404
        console.error("Błąd podczas usuwania samochodu:", error);
        res.status(404).json({ error: "Samochód nie znaleziony" });
    }
});

// Określa port, na którym serwer będzie nasłuchiwał
const port = 3000;

// Uruchamia serwer na określonym porcie
app.listen(port, () => {
    console.log(`Serwer działa na porcie ${port}`);
});
