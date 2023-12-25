// measurement.js

class Measurement {
    constructor() {
      this.height = null;
      this.weight = null;
      this.headCircumference = null;
    }
  
    // Setters
    setHeight(height) {
      this.height = height;
    }
  
    setWeight(weight) {
      this.weight = weight;
    }
  
    setHeadCircumference(headCircumference) {
      this.headCircumference = headCircumference;
    }
  
    // Getters
    getHeight() {
      return this.height;
    }
  
    getWeight() {
      return this.weight;
    }
  
    getHeadCircumference() {
      return this.headCircumference;
    }
  }
  
  export default Measurement;
  