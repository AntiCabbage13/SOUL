import { openDatabase } from "expo-sqlite";

class DatabaseHelperheight {
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
        `
        CREATE TABLE IF NOT EXISTS heightDataT (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          height REAL,
          ageInMonths INTEGER,
          childObjectId TEXT,
          chronological_sds REAL
        )
        `,
        [],
        () => {},
        (error) => {
          console.error("Error creating table:", error);
        }
      );
    });
  }

  insertData(height, ageInMonths, childObjectId, chronological_sds) {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          `
          INSERT INTO heightDataT (height, ageInMonths, childObjectId, chronological_sds)
          VALUES (?, ?, ?, ?)
          `,
          [height, ageInMonths, childObjectId, chronological_sds],
          (_, result) => {
            // On success, resolve the promise with the result
            resolve(result);
          },
          (error) => {
            // On error, reject the promise with the error
            console.log("Error inserting data:", error);
            reject(error);
          }
        );
      });
    });
  }

  closeDatabase() {
    if (this.db) {
      this.db.close();
    }
  }

  getLastInsertedRowHeight() {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          `
          SELECT chronological_sds
          FROM heightDataT
          ORDER BY id DESC
          LIMIT 1;
          `,
          [],
          (_, { rows }) => {
            const lastInsertedRow = rows.item(0);
            resolve(lastInsertedRow);
            console.log("i bear the last inserted row height", lastInsertedRow);
          },
          (_, error) => {
            console.error("Error fetching last inserted row:", error);
            reject(error);
          }
        );
      });
    });
  }

  getLastInsertedRowAgeInMonths() {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          `
          SELECT ageInMonths
          FROM heightDataT
          ORDER BY id DESC
          LIMIT 1
          `,
          [],
          (tx, results) => {
            if (results.rows.length > 0) {
              const { ageInMonths } = results.rows.item(0);
              resolve(ageInMonths);
            } else {
              reject(new Error("No rows found"));
            }
          },
          (error) => {
            console.error("Error querying last inserted row:", error);
            reject(error);
          }
        );
      });
    });
  }
  
}

export default new DatabaseHelperheight();
