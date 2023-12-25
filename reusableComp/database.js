import { openDatabase } from 'expo-sqlite';

const db = openDatabase('ChildGrowth.db');

const createTableMeal = async () => {
  try {
    // Check if the table exists
    const tableExists = await new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT COUNT(*) FROM sqlite_master WHERE type="table" AND name="meals"',
          [],
          (_, results) => {
            resolve(results.rows.item(0)['COUNT(*)'] === 1);
          },
          (_, error) => reject(error)
        );
      });
    });

    // Create the table only if it doesn't exist
    if (!tableExists) {
      await new Promise((resolve, reject) => {
        db.transaction((tx) => {
          tx.executeSql(
            'CREATE TABLE IF NOT EXISTS meals (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, ingredients TEXT, time TEXT, mealtype TEXT, cellid TEXT)',
            [],
            () => {
              console.log('Table created successfully');
              resolve();
            },
            (error) => {
              console.error('Error creating table: ', error);
              reject(error);
            }
          );
        });
      });
    }
  } catch (error) {
    console.error('Error in createTableMeal:', error);
  }
};

// Don't call the function at the top level; instead, call it when necessary
// createTableMeal();

export { db, createTableMeal };
