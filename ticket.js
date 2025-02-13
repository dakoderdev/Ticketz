let people = {
  name: [
    "Doja", "Bryan", "Emma", "Carlos", "Tyra",
    "Sophia", "Liam", "Mia", "Noah", "Olivia",
    "Ethan", "Ava", "James", "Isabella", "Lucas",
    "Charlotte", "Mason", "Amelia", "Benjamin", "Harper",
    "Salem"
  ],
  surname: [
    "Benz", "Hamilton", "Smith", "Doe", "Lee", "Ramirez",
    "Anderson", "Brown", "Clark", "Johnson", "Martinez",
    "Garcia", "Rodriguez", "Hernandez", "Nguyen", "Taylor",
    "Wilson", "Davis", "Miller", "Moore","Payne"
  ]
};

let locations = [
  "New York", "Los Angeles", "Chicago", "Houston", "Phoenix",
  "Rio de Janeiro", "Buenos Aires", "London", "Paris", "Tokyo",
  "Sydney", "Cape Town", "Berlin", "Moscow", "Toronto",
  "Dubai", "Mumbai", "Beijing", "Seoul", "Mexico City",
  "São Paulo", "Madrid", "Rome", "Bangkok", "Istanbul"
];
  

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

  info(passengersInfo) {
      let passengerNumber = document.createElement("h4");
      passengerNumber.innerHTML = `Passenger ${this.passengerNumber}`;
      passengerNumber.className = `passenger-number`;
      let passengerFullName = document.createElement("p");
      passengerFullName.innerHTML = `${this.name} ${this.surname}`;
      passengerFullName.className = `passenger-name`;
      let passengerAge = document.createElement("p");
      passengerAge.innerHTML = `Age: ${this.age}`;
      let passengerPrice = document.createElement("p");
      passengerPrice.innerHTML = `Price: $${this.price}`;
      let passengerInfo = document.createElement("div");
      passengerInfo.className = `passenger-info`;
      passengerInfo.appendChild(passengerNumber);
      passengerInfo.appendChild(passengerFullName);
      passengerInfo.appendChild(passengerAge);
      passengerInfo.appendChild(passengerPrice);
      passengersInfo.appendChild(passengerInfo);
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

  groupInfo(groupContainer) {
    const totalPassengers = this.passengers.length;
    const totalPrice = this.passengers.reduce((sum, p) => sum + p.price, 0);
    
    let groupNumber = document.createElement("h3");
    groupNumber.innerHTML = `Group ${this.groupNumber}`;
    let groupTotalPassengers = document.createElement("h4");
    groupTotalPassengers.innerHTML = `${totalPassengers} passengers total`;
    let groupTotalPrice = document.createElement("h4");
    groupTotalPrice.innerHTML = `$${totalPrice}`;
    groupTotalPrice.className = `price`;
    let groupInfo = document.createElement("div");
    groupInfo.className = `group-info`;
    groupInfo.appendChild(groupNumber);
    groupInfo.appendChild(groupTotalPassengers);
    groupInfo.appendChild(groupTotalPrice);
    groupContainer.appendChild(groupInfo);
  }

  displayPassengers(groupContainer) {
    let passengersInfo = document.createElement("div");
    passengersInfo.className = `passengers-info`;
    this.passengers.forEach((passenger) => passenger.info(passengersInfo));
    groupContainer.appendChild(passengersInfo);
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

// Display Groups and Passengers
function displayAllGroups(groups) {
  document.querySelectorAll(".group-container").forEach((group) => group.remove());
  groups.forEach((group, index) => {
    let groupContainer = document.createElement("section");
    groupContainer.className = `group-container`;
    group.groupInfo(groupContainer);
    group.displayPassengers(groupContainer);
    document.body.appendChild(groupContainer);
  });
}

let groups = [];

document.getElementById("groupsButton").addEventListener("click", function() {
  Person.passengerCount = 0;
  groupCounter = 0;

  function generateRandomGroupSizes() {
    const groupSizes = [];
    let groupsAmount = document.getElementById("groupInput").value;
    if (groupsAmount === "") groupsAmount = 1;
    for (let i = 0; i < groupsAmount; i++) {
      groupSizes.push(Math.floor(Math.random() * 12) + 1);
    }
    return groupSizes;
  }

  const groupSizes = generateRandomGroupSizes();
  groups = createMultipleGroups(groupSizes);
  displayAllGroups(groups);
});

document.getElementById("addButton").addEventListener("click", function() {
  let input = document.getElementById("addInput").value;
  if (input === "") input = 1;
  for (let i = 0; i < input ; i++) {
    const newGroup = createGroup(Math.floor(Math.random() * 12) + 1);
    groups.push(newGroup);
  }
  displayAllGroups(groups);
});

document.getElementById("locationButton").addEventListener("click", function() {
  const randomLocation = Math.floor(Math.random() * locations.length);
  const locationElement = document.getElementById("location");
  locationElement.innerHTML = "";
  locationElement.innerHTML = locations[randomLocation];
});

document.getElementById("groupInput").addEventListener("click", function(event) {
  event.stopPropagation();
});

document.getElementById("addInput").addEventListener("click", function(event) {
  event.stopPropagation();
});