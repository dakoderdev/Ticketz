let people = {
  name: [
    "Doja", "Bryan", "Emma", "Carlos", "Tyra",
    "Sophia", "Liam", "Mia", "Noah", "Olivia",
    "Ethan", "Ava", "James", "Isabella", "Lucas",
    "Charlotte", "Mason", "Amelia", "Benjamin", "Harper"
  ],
  surname: [
    "Benz", "Hamilton", "Smith", "Doe", "Lee", "Ramirez",
    "Anderson", "Brown", "Clark", "Johnson", "Martinez",
    "Garcia", "Rodriguez", "Hernandez", "Nguyen", "Taylor",
    "Wilson", "Davis", "Miller", "Moore"
  ]
};

class Person {
  static passengerCount = 0;

  constructor(name, surname, age, groupNumber) {
    this.name = name;
    this.surname = surname;
    this.age = age;
    this.price = age >= 21 ? 200 : 125;
    this.passengerNumber = ++Person.passengerCount;
    this.groupNumber = groupNumber;
  }

  info() {
    console.log(`\x1b[31mPassenger ${this.passengerNumber}\x1b[0m, \x1b[34mGroup ${this.groupNumber}\x1b[0m:
- Full Name: ${this.name} ${this.surname}
- Age: ${this.age}
- Price: ${this.price}`);
  }
}

class Group {
  constructor(groupNumber) {
    this.groupNumber = groupNumber;
    this.passengers = [];
  }

  addPassenger(passenger) {
    this.passengers.push(passenger);
  }

  hasAdult() {
    return this.passengers.some((passenger) => passenger.age >= 21);
  }

  groupInfo() {
    const totalPassengers = this.passengers.length;
    const totalPrice = this.passengers.reduce((sum, p) => sum + p.price, 0);
    console.log(`\x1b[34mGroup ${this.groupNumber}\x1b[0m:
- Number of Passengers: ${totalPassengers}
- Total Price: $${totalPrice}
`);
  }

  displayPassengers() {
    this.passengers.forEach((passenger) => passenger.info());
  }
}

let groupCounter = 0;

function createGroup(size) {
  groupCounter++;
  let group;

  do {
    group = new Group(groupCounter);
    for (let i = 0; i < size; i++) {
      const randomName = Math.floor(Math.random() * people.name.length);
      const randomSurname = Math.floor(Math.random() * people.surname.length);
      const randomAge = Math.floor(Math.random() * 61);

      const passenger = new Person(
        people.name[randomName],
        people.surname[randomSurname],
        randomAge,
        groupCounter
      );
      group.addPassenger(passenger);
    }
  } while (!group.hasAdult());

  return group;
}

function createMultipleGroups(sizes) {
  const groups = [];
  sizes.forEach((size) => {
    groups.push(createGroup(size));
  });
  return groups;
}

function horizontalLine() {
  console.log("\x1b[33m" + "-".repeat(50) + "\x1b[0m"); 
}

const groupSizes = [3, 1];
const groups = createMultipleGroups(groupSizes);

groups.push(createGroup(2));
groups.push(createGroup(4));

// Display Groups and Passengers
function displayAllGroups(groups) {
  groups.forEach((group, index) => {
    if (index > 0) horizontalLine(); // Add separation between groups
    group.groupInfo();
    group.displayPassengers();
  });
}

// Initial display
console.log("\x1b[32mAll Groups:\x1b[0m");
displayAllGroups(groups);
