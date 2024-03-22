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
        console.log('Transaction started');

        // Select everything from the allergies table
        tx.executeSql(
          'SELECT * FROM allergies',
          [],
          (_, { rows }) => {
            const allAllergies = rows._array;
            console.log('Allergies table content:', allAllergies);
          },
          (error) => {
            console.error('Error retrieving allergies:', error);
          }
        );

        // Check for specific allergies
        tx.executeSql(
          'SELECT * FROM allergies WHERE allergy = ? OR ? LIKE "%" || allergy || "%"',
          [foodName, ingredients],
          (_, { rows }) => {
            const allergies = rows._array;
            console.log('Allergies fetched:', allergies);
            if (allergies.length > 0) {
              console.log('Allergies found:', allergies);
              reject('This food or its ingredient is allergic');
              return;
            }

            console.log('No allergies found');

            if (hasMeal) {
              console.log('Updating meal data...');
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
              console.log('Inserting meal data...');
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
            console.error('Error checking allergies:', error);
            reject(error);
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
