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

function createEl(tag, text, className) {
  const el = document.createElement(tag);
  if (text) el.textContent = text;
  if (className) el.className = className;
  return el;
}

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
      const passengerInfo = createEl("div", null, "passenger-info");
      const passengerNumber = createEl("h4", `Passenger ${this.passengerNumber}`, "passenger-number");
      const passengerFullName = createEl("p", `${this.name} ${this.surname}`, "passenger-name");
      const passengerAge = createEl("p", `Age: ${this.age}`);
      const passengerPrice = createEl("p", `Price: $${this.price}`);
      passengerInfo.append(passengerNumber, passengerFullName, passengerAge, passengerPrice);
      passengersInfo.appendChild(passengerInfo);  }
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

    const groupNumber = createEl("h3", `Group ${this.groupNumber}`);
    const groupTotalPassengers = createEl("h4", `${totalPassengers} passengers total`);
    const groupTotalPrice = createEl("h4", `$${totalPrice}`, "price");
    const groupInfo = createEl("div", null, "group-info");

    groupInfo.append(groupNumber, groupTotalPassengers, groupTotalPrice);
    groupContainer.appendChild(groupInfo);
}

  displayPassengers(groupContainer) {
    const passengersInfo = createEl("div", null, "passengers-info");
    this.passengers.map(passenger => passenger.info(passengersInfo));
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

  let mainContainer = document.querySelector("main");
  if (!mainContainer) {
    mainContainer = createEl("main");
    document.body.appendChild(mainContainer);
  } else {
    mainContainer.innerHTML = ""; // Clear previous content if <main> exists
  }


  groups.forEach((group) => {
    const groupContainer = createEl("section", null, "group-container");
    group.groupInfo(groupContainer);
    group.displayPassengers(groupContainer);
    mainContainer.appendChild(groupContainer);
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

  const firstGroup = document.querySelector(".group-container:first-child");
  if (firstGroup) {
    firstGroup.scrollIntoView();
  }
});

document.getElementById("addButton").addEventListener("click", function() {
  let input = document.getElementById("addInput").value;
  for (let i = 0; i < input ; i++) {
    const newGroup = createGroup(Math.floor(Math.random() * 12) + 1);
    groups.push(newGroup);
  }
  displayAllGroups(groups);

  const lastGroup = document.querySelector(".group-container:last-child");
  if (lastGroup) {
    lastGroup.scrollIntoView();
  }
});

document.getElementById("locationButton").addEventListener("click", function() {
  const randomLocation = Math.floor(Math.random() * locations.length);
  const locationElement = document.getElementById("location");
  locationElement.innerHTML = locations[randomLocation];

  const viewScroll = document.querySelector("#location");
  if (viewScroll) {
    viewScroll.scrollIntoView();
  }
});

document.getElementById("groupInput").addEventListener("click", function(event) {
  event.stopPropagation();
});

document.getElementById("addInput").addEventListener("click", function(event) {
  event.stopPropagation();
});