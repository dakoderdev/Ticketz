let people = {
  name: ["Doja", "Bryan", "Emma", "Carlos", "Tyra"],
  surname: ["Benz", "Hamilton", "Smith", "Doe", "Lee", "Ramirez"],
  age: ["16", "24", "32"]
};

class Person {
  static passengerCount = 0;

  constructor(name, surname, age) {
    this.name = name;
    this.surname = surname;
    this.age = age;
    this.price = age >= 21 ? 200 : 125; // Price based on age
    this.passengerNumber = ++Person.passengerCount; // Increment passenger count
  }

  info() {
    console.log(`Passenger ${this.passengerNumber}:
- Full Name: ${this.name} ${this.surname}
- Age: ${this.age}
- Price: ${this.price}`);
  }
}

function generateRandomPersons(count) {
  let passengers = []; // Array to store generated persons
  for (let i = 0; i < count; i++) {
    let randomName = Math.floor(Math.random() * people.name.length);
    let randomSurname = Math.floor(Math.random() * people.surname.length);
    let randomAge = Math.floor(Math.random() * 30); // Random age between 0 and 29

    // Create a new Person object and add to the array
    let person = new Person(
      people.name[randomName],
      people.surname[randomSurname],
      randomAge
    );
    passengers.push(person);
  }
  return passengers;
}

let passengers = generateRandomPersons(5);

passengers.forEach((passenger) => passenger.info());
