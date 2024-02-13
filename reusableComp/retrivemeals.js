import { openDatabase } from 'expo-sqlite';

const db = openDatabase('ChildGrowth.db');

const initDatabase = async () => {
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
    console.error('Error in initDatabase:', error);
  }
};

const fetchMealForCell = async (cellId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM meals WHERE cellid = ?',
        [cellId],
        (_, { rows }) => {
          const meal = rows.item(0);
          resolve(meal);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

const fetchAllMealIds = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT id FROM meals',
        [],
        (_, { rows }) => {
          const idArray = [];
          for (let i = 0; i < rows.length; i++) {
            idArray.push(rows.item(i).id);
          }
          console.log('Fetched all meal IDs:', idArray);
          resolve(idArray);
        },
        (_, error) => {
          console.error('Error fetching all meal IDs:', error);
          reject(error);
        }
      );
    });
  });
};

const fetchTimeAndMealNameForCellById = async (id) => {
  return new Promise((resolve, reject) => {
    if (!id) {
      console.error('Invalid id in fetchTimeAndMealNameForCellById:', id);
      resolve(null); // or handle appropriately
    }

    db.transaction((tx) => {
      tx.executeSql(
        'SELECT id, time, cellid, name FROM meals WHERE id = ?',
        [id],
        (_, { rows }) => {
          const mealInfo = rows.item(0);
          console.log(`Fetched meal info for id ${id}:`, mealInfo);

          resolve(mealInfo);
        },
        (_, error) => {
          console.error(`Error fetching meal info for id ${id}:`, error);
          reject(error);
        }
      );
    });
  });
};

export { db, initDatabase, fetchMealForCell, fetchTimeAndMealNameForCellById, fetchAllMealIds };
