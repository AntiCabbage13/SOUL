import { openDatabase } from 'expo-sqlite';

class DatabaseHelper {
  constructor() {
    this.db = null;
    this.setupDatabase();
  }

  setupDatabase() {
    this.db = openDatabase('ChildGrowth.db');
    this.createTable(); // Create the table when setting up the database
  }

  createTable() {
    this.db.transaction((tx) => {
      tx.executeSql(
        `
        CREATE TABLE IF NOT EXISTS weightDataT (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          weight REAL,
          ageInMonths INTEGER,
          childObjectId TEXT,
          chronological_sds REAL
        )
        `,
        [],
        () => {},
        (error) => {
          console.error('Error creating table:', error);
        }
      );
    });
  }

  insertData(weight, ageInMonths, childObjectId, chronological_sds) {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          `
          INSERT INTO weightDataT (weight, ageInMonths, childObjectId, chronological_sds)
          VALUES (?, ?, ?, ?)
          `,
          [weight, ageInMonths, childObjectId, chronological_sds],
          (_, result) => {
            // On success, resolve the promise with the result
            resolve(result);
          },
          (error) => {
            // On error, reject the promise with the error
            console.log('Error inserting data:', error);
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

  getLastInsertedRow() {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          `
          SELECT * FROM weightDataT
          ORDER BY id DESC
          LIMIT 1
          `,
          [],
          (_, { rows }) => {
            const lastInsertedRow = rows.item(0);
            resolve(lastInsertedRow);
            console.log('i bear the last inserted row', lastInsertedRow);
          },
          (_, error) => {
            console.error('Error fetching last inserted row:', error);
            reject(error);
          }
        );
      });
    });
  }
}

export default new DatabaseHelper();
