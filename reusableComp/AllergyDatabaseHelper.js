import { openDatabase } from "expo-sqlite";

class AllergyDatabaseHelper {
  constructor() {
    this.db = null;
    this.setupDatabase();
  }

  setupDatabase() {
    this.db = openDatabase("ChildGrowth.db");
    this.createTable(); // Create the table when setting up the database
  }

  createTable() {
    this.db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS allergies (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          allergy TEXT
        );`
      );
    });
  }

  addAllergy(allergy) {
    const formattedAllergy = allergy.trim().toLowerCase();
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO allergies (allergy) VALUES (?)",
          [formattedAllergy],
          (_, { insertId }) => {
            console.log("Allergy added with ID: ", insertId);
            resolve(insertId);
          },
          (_, error) => {
            console.error("Error adding allergy: ", error);
            reject(error);
          }
        );
      });
    });
  }

  getAllAllergies() {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM allergies",
          [],
          (_, { rows }) => {
            const allergies = rows._array;
            console.log("Allergies:", allergies);
            resolve(allergies);
          },
          (_, error) => {
            console.error("Error fetching allergies: ", error);
            reject(error);
          }
        );
      });
    });
  }

  removeAllergy(id) {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          "DELETE FROM allergies WHERE id = ?",
          [id],
          (_, { rowsAffected }) => {
            if (rowsAffected > 0) {
              console.log("Allergy removed successfully");
              resolve();
            } else {
              console.error("No rows deleted");
              reject(new Error("No rows deleted"));
            }
          },
          (_, error) => {
            console.error("Error removing allergy: ", error);
            reject(error);
          }
        );
      });
    });
  }
}

export default AllergyDatabaseHelper;
