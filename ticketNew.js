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

let nextGroupID = 0;
let nextPassengerID = 0;
const maxGroupSize = 12;

function nextID(type) {
    return type === "group" ? nextGroupID++ : nextPassengerID++;
}

function floorRandom(max) {
    return Math.floor(Math.random() * max);
}

function skewedLowerRandom(max) {
    if (max < 1) return 0;
    const skewPower = 2;
    let randomSkewed = Math.pow(Math.random(), skewPower);
    let size = Math.ceil(randomSkewed * max);
    return Math.min(Math.max(1, size), max);
}

function input(field, randomBool) {
    let result;
    switch (field) {
        case "name":
            result = randomBool ? people.name[floorRandom(people.name.length)] : prompt("Enter name:");
            break;
        case "surname":
            result = randomBool ? people.surname[floorRandom(people.surname.length)] : prompt("Enter surname:");
            break;
    }
    return result;
}

class Passenger {
    constructor(name, surname, groupID, age, price) { 
        this.id = nextID("passenger");
        this.name = name;
        this.surname = surname;
        this.groupID = groupID;
        this.age = age;
        this.price = price;
    }
}

class Adult extends Passenger {
    constructor(name, surname, groupID) {
        const age = floorRandom(45) + 21; 
        super(name, surname, groupID, age, 200); 
        this.type = "Adult";
    }
}

class Child extends Passenger {
    constructor(name, surname, groupID) {
        const age = floorRandom(16) + 5; 
        super(name, surname, groupID, age, 125); 
        this.type = "Child";
    }
}

class Group {
    constructor(adultAmount, childAmount, randomBool = true) {
        this.id = nextID("group");
        this.adultAmount = adultAmount;
        this.childAmount = childAmount;
        this.amount = adultAmount + childAmount;
        
        this.passengers = this.createPassengers(this.id, adultAmount, childAmount, randomBool);
        
        this.price = this.calculateGroupPrice(this.passengers);
    }

    createPassengers(groupID, adultAmount, childAmount, randomBool) {
        let passengers = [];

        for (let i = 0; i < adultAmount; i++) {
            passengers.push(
                new Adult(
                    input("name", randomBool),
                    input("surname", randomBool),
                    groupID
                )
            );
        }

        for (let i = 0; i < childAmount; i++) {
            passengers.push(
                new Child(
                    input("name", randomBool),
                    input("surname", randomBool),
                    groupID
                )
            );
        }
        return passengers;
    }

    calculateGroupPrice(passengers) {
        return passengers.reduce((total, passenger) => total + passenger.price, 0);
    }

    showInfo() {
        console.log(`Group ${this.id}`);
        console.log(`Adults: ${this.adultAmount}, Children: ${this.childAmount}`);
        console.log(`${this.amount} passengers total`);
        console.log(`TOTAL PRICE: $${this.price}`);
        
        for (let passenger of this.passengers) {
            console.log(`- ${passenger.name} ${passenger.surname}, Age:${passenger.age}, Price: $${passenger.price}`);
        }
    }
}

function generateRandomGroupComposition(maxSize) {
    let adultAmount = skewedLowerRandom(maxSize);
    
    let maxChildren = Math.max(0, maxSize - adultAmount); 
    let childAmount = skewedLowerRandom(maxChildren);
    
    const total = adultAmount + childAmount;
    if (total > maxSize) {
        childAmount -= (total - maxSize); 
    }

    return {
        adultAmount: Math.max(1, adultAmount), 
        childAmount: Math.max(0, childAmount)
    };
}


function createMultipleGroups(groupsAmount, maxGroupSize) {
    let groups = [];
    for (let i = 0; i < groupsAmount; i++) {
        let composition = generateRandomGroupComposition(maxGroupSize);
        
        let group = new Group(composition.adultAmount, composition.childAmount);
        
        groups.push(group);
        group.showInfo();
        console.log("-------------------");
    }
}

createMultipleGroups(5, maxGroupSize);
