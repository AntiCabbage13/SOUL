// MealPrep.js
import { openDatabase } from 'expo-sqlite';
import { createTableMeal } from '../reusableComp/database';

class MealPrep {
  #foodName = '';
  #mealType = '';
  #cellid = '';
  #ingredients = '';
  #selectedTime = null;
  #db = null;
  #hasMeal = false; // Added hasMeal property

  constructor() {
    this.#db = openDatabase('ChildGrowth.db');
    createTableMeal();
  }

  get foodName() {
    return this.#foodName;
  }

  set foodName(value) {
    this.#foodName = value;
  }

  get mealType() {
    return this.#mealType;
  }

  set mealType(value) {
    this.#mealType = value;
  }

  get cellId() {
    return this.#cellid;
  }

  set cellId(value) {
    this.#cellid = value;
  }

  get ingredients() {
    return this.#ingredients;
  }

  set ingredients(value) {
    this.#ingredients = value;
  }

  get selectedTime() {
    return this.#selectedTime;
  }

  set selectedTime(value) {
    this.#selectedTime = value;
  }

  get hasMeal() {
    return this.#hasMeal;
  }

  set hasMeal(value) {
    this.#hasMeal = value;
    console.log('Has Meal:', value); // Logging the value of hasMeal
  }

  addToDatabase() {
    const hasMeal = this.hasMeal;
    const foodName = this.#foodName.trim().toLowerCase();
    const ingredients = this.#ingredients.trim().toLowerCase();
  
    return new Promise((resolve, reject) => {
      this.#db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM allergies WHERE allergy = ?',
          [foodName],
          (_, { rows }) => {
            const exactAllergies = rows._array;
            if (exactAllergies.length > 0) {
              console.log('Exact allergy found:', exactAllergies);
              reject('This food or its ingredient is allergic');
              return;
            }
  
            // If no exact allergy found, check for partial matches
            tx.executeSql(
              'SELECT * FROM allergies WHERE ? LIKE "%" || allergy || "%"',
              [ingredients],
              (_, { rows }) => {
                const partialAllergies = rows._array;
                if (partialAllergies.length > 0) {
                  console.log('Partial allergy found:', partialAllergies);
                  reject('This food or its ingredient is allergic');
                  return;
                }
  
                // If no allergy found, proceed with database operation
                if (hasMeal) {
                  tx.executeSql(
                    'UPDATE meals SET name = ?, ingredients = ?, time = ?, mealtype = ? WHERE cellid = ?',
                    [this.#foodName, this.#ingredients, this.#selectedTime ? this.#selectedTime.toLocaleTimeString() : null, this.#mealType, this.#cellid],
                    (_, results) => {
                      if (results.rowsAffected > 0) {
                        console.log('Data updated in the database:', {
                          foodName: this.#foodName,
                          ingredients: this.#ingredients,
                          selectedTime: this.#selectedTime ? this.#selectedTime.toLocaleTimeString() : null,
                          mealType: this.#mealType,
                          cellId: this.#cellid,
                        });
                        resolve('Data updated in the database');
                      }
                    },
                    (error) => {
                      console.error('Error updating data in the database:', error);
                      reject(error);
                    }
                  );
                } else {
                  tx.executeSql(
                    'INSERT INTO meals (name, ingredients, time, mealtype, cellid) VALUES (?, ?, ?, ?, ?)',
                    [this.#foodName, this.#ingredients, this.#selectedTime ? this.#selectedTime.toLocaleTimeString() : null, this.#mealType, this.#cellid],
                    (_, results) => {
                      if (results.rowsAffected > 0) {
                        console.log('Data added to the database:', {
                          foodName: this.#foodName,
                          ingredients: this.#ingredients,
                          selectedTime: this.#selectedTime ? this.#selectedTime.toLocaleTimeString() : null,
                          mealType: this.#mealType,
                          cellId: this.#cellid,
                        });
  
                        resolve('Data added to the database');
  
                        tx.executeSql('SELECT * FROM meals WHERE id = ?', [results.insertId], (_, { rows }) => {
                          const lastInsertedRow = rows.item(0);
                          console.log('Last inserted row:', lastInsertedRow);
                        });
                      }
                    },
                    (error) => {
                      console.error('Error inserting data into the database:', error);
                      reject(error);
                    }
                  );
                }
              },
              (error) => {
                console.error('Error checking partial allergies:', error);
                reject(error);
              }
            );
          },
          (error) => {
            console.error('Error checking exact allergies:', error);
            // If there are no rows returned, proceed with the if-else statements below
            // Error case handled here to allow the code to continue executing
            // Proceeding with the same logic as if no allergies were found
            if (hasMeal) {
              tx.executeSql(
                'UPDATE meals SET name = ?, ingredients = ?, time = ?, mealtype = ? WHERE cellid = ?',
                [this.#foodName, this.#ingredients, this.#selectedTime ? this.#selectedTime.toLocaleTimeString() : null, this.#mealType, this.#cellid],
                (_, results) => {
                  if (results.rowsAffected > 0) {
                    console.log('Data updated in the database:', {
                      foodName: this.#foodName,
                      ingredients: this.#ingredients,
                      selectedTime: this.#selectedTime ? this.#selectedTime.toLocaleTimeString() : null,
                      mealType: this.#mealType,
                      cellId: this.#cellid,
                    });
                    resolve('Data updated in the database');
                  }
                },
                (error) => {
                  console.error('Error updating data in the database:', error);
                  reject(error);
                }
              );
            } else {
              tx.executeSql(
                'INSERT INTO meals (name, ingredients, time, mealtype, cellid) VALUES (?, ?, ?, ?, ?)',
                [this.#foodName, this.#ingredients, this.#selectedTime ? this.#selectedTime.toLocaleTimeString() : null, this.#mealType, this.#cellid],
                (_, results) => {
                  if (results.rowsAffected > 0) {
                    console.log('Data added to the database:', {
                      foodName: this.#foodName,
                      ingredients: this.#ingredients,
                      selectedTime: this.#selectedTime ? this.#selectedTime.toLocaleTimeString() : null,
                      mealType: this.#mealType,
                      cellId: this.#cellid,
                    });
  
                    resolve('Data added to the database');
  
                    tx.executeSql('SELECT * FROM meals WHERE id = ?', [results.insertId], (_, { rows }) => {
                      const lastInsertedRow = rows.item(0);
                      console.log('Last inserted row:', lastInsertedRow);
                    });
                  }
                },
                (error) => {
                  console.error('Error inserting data into the database:', error);
                  reject(error);
                }
              );
            }
          }
        );
      });
    });
  }
  
  
  deleteFromDatabase() {
    this.#db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM meals WHERE cellid = ?',
        [this.#cellid],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('Row deleted from the database with ID:', this.#cellid);
          } else {
            console.log('No rows deleted from the database.', this.#cellid);
          }
        },
        (error) => {
          console.error('Error deleting row from the database:', error);
        }
      );
    });
  }

  commitToDatabase() {
    this.addToDatabase();
  }
}

export default MealPrep;
