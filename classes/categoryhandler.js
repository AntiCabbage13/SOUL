import { openDatabase } from "expo-sqlite";

this.db = openDatabase("ChildGrowth.db");

const createTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        categoryIdentifier TEXT,
        category TEXT
      )
      `,
      [],
      () => console.log("Categories table created successfully."),
      (error) => console.error("Error creating categories table:", error)
    );
  });
};

export const insertcategories = ({ categoryIdentifier, category }) => {
  createTable(); 

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `
        INSERT INTO categories (categoryIdentifier, category)
        VALUES (?, ?)
        `,
        [categoryIdentifier, category],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            console.log(`Category ${category} inserted successfully.`);
            resolve(true);
          } else {
            console.log("No rows affected.");
            resolve(false);
          }
        },
        (error) => {
          console.error("Error inserting category:", error);
          reject(error);
        }
      );
    });
  });
};
// Select the last two inserted rows from the categories table
export const getLastTwoInsertedRows = () => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `
          SELECT *
          FROM categories
          ORDER BY id DESC
          LIMIT 2
          `,
          [],
          (_, { rows }) => {
            const selectedRows = rows._array;
            console.log("Last two inserted rows:", selectedRows);
            resolve(selectedRows);
          },
          (error) => {
            console.error("Error selecting last two rows:", error);
            reject(error);
          }
        );
      });
    });
  };
  