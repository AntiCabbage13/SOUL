// MealPrep.js
import { openDatabase } from 'expo-sqlite';
import  {createTableMeal} from '../reusableComp/database';
class MealPrep {
  #foodName = '';
  #mealType = '';
  #cellid = '';
  #ingredients = '';
  #selectedTime = null;
  #db = null;

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

  addToDatabase() {
    this.#db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO meals (name, ingredients, time, mealtype, cellid) VALUES (?, ?, ?, ?, ?)',
        [this.#foodName, this.#ingredients, this.#selectedTime ? this.#selectedTime.toLocaleTimeString() : null, this.#mealType, this.#cellid],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('Data added to the database:', {
              foodName: this.#foodName,
              ingredients: this.#ingredients,
              selectedTime: this.#selectedTime ? this.#selectedTime.toLocaleTimeString() : null,
              mealType: this.#mealType,
              cellId: this.#cellid,
            });

            // Retrieve the last inserted row and log it
            tx.executeSql('SELECT * FROM meals WHERE id = ?', [results.insertId], (_, { rows }) => {
              const lastInsertedRow = rows.item(0);
              console.log('Last inserted row:', lastInsertedRow);
            });
          }
        },
        (error) => {
          console.error('Error inserting data into the database:', error);
        }
      );
    });
  }

  commitToDatabase() {
    this.addToDatabase();
  }
}

export default MealPrep;
