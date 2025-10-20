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

function createElement(tag, text, className) {
    const el = document.createElement(tag);
    if (text) el.textContent = text;
    if (className) el.className = className;
    return el;
}

// --- FUNCIÓN DE ENTRADA MEJORADA Y ROBUSTA ---
function input(field, randomBool, promptMessage = "passenger", ageMin, ageMax) {
    let result;

    if (randomBool) {
        // Generación aleatoria para grupos NO personalizados
        switch (field) {
            case "name":
                return people.name[floorRandom(people.name.length)];
            case "surname":
                return people.surname[floorRandom(people.surname.length)];
            // La edad aleatoria ahora se genera en las clases Adult/Child
        }
    } else {
        // Entrada manual para grupos personalizados
        let isValid = false;
        
        while (!isValid) {
            switch (field) {
                case "name":
                    result = prompt(`Enter name for ${promptMessage}:`);
                    break;
                case "surname":
                    result = prompt(`Enter surname for ${promptMessage}:`);
                    break;
                case "age":
                    // Validación especial para la edad
                    let ageInput = prompt(`Enter age for ${promptMessage} (Min: ${ageMin}, Max: ${ageMax}):`);
                    let parsedAge = parseInt(ageInput);
                    
                    if (ageInput === null) return null; // Permite cancelar el prompt
                    
                    if (!isNaN(parsedAge) && parsedAge >= ageMin && parsedAge <= ageMax) {
                        return parsedAge;
                    }
                    alert(`Invalid age. Please enter a number between ${ageMin} and ${ageMax}.`);
                    continue; // Vuelve a intentar la edad
            }

            // Validación de nombre/apellido (no nulo y no vacío)
            if (result !== null && result.trim() !== "") {
                isValid = true;
            } else if (result === null) {
                // Si el usuario presiona Cancelar, salimos
                return null;
            } else {
                alert(`Input cannot be empty for ${promptMessage}'s ${field}.`);
            }
        }
        return result;
    }
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

    info(passengersInfo) {
        const passengerInfo = createElement("div", null, "passenger-info");
        const passengerNumber = createElement("h4", `Passenger ${this.id}`, "passenger-number");
        const passengerFullName = createElement("p", `${this.name} ${this.surname}`, "passenger-name");
        const passengerAge = createElement("p", `Age: ${this.age}`);
        const passengerPrice = createElement("p", `Price: $${this.price}`);
        
        const passengerType = createElement("p", `Type: ${this.type}`);
        
        passengerInfo.append(passengerNumber, passengerFullName, passengerType, passengerAge, passengerPrice);
        passengersInfo.appendChild(passengerInfo);
    }
}

class Adult extends Passenger {
    constructor(name, surname, groupID, randomBool) {
        let age;
        const ageMin = 18;
        const ageMax = randomBool ? 65 : 120;

        if (randomBool) {
            age = floorRandom(ageMax - ageMin + 1) + ageMin;
        } else {
            // Edad manual
            age = input("age", false, `Adult`, ageMin, ageMax);
            if (age === null) throw new Error("Passenger creation cancelled by user.");
        }
        
        super(name, surname, groupID, age, 200); 
        this.type = "Adult";
    }
}

class Child extends Passenger {
    constructor(name, surname, groupID, randomBool) {
        let age;
        const ageMin = 5;
        const ageMax = 17;

        if (randomBool) {
            age = floorRandom(ageMax - ageMin + 1) + ageMin; 
        } else {
            // Edad manual
            age = input("age", false, `Child`, ageMin, ageMax);
            if (age === null) throw new Error("Passenger creation cancelled by user.");
        }
        
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
        
        try {
            this.passengers = this.createPassengers(this.id, adultAmount, childAmount, randomBool);
        } catch (error) {
            // Maneja la cancelación del usuario. Retrocede el ID.
            nextGroupID--;
            console.error("Group creation aborted:", error.message);
            this.passengers = null;
            this.id = -1; // Marca el grupo como inválido
            return;
        }
        
        this.price = this.calculateGroupPrice(this.passengers);
    }

    createPassengers(groupID, adultAmount, childAmount, randomBool) {
        let passengers = [];

        for (let i = 0; i < adultAmount; i++) {
            const promptMsg = `Adult ${i + 1} of ${adultAmount} (Group ${groupID})`;
            const name = input("name", randomBool, promptMsg);
            if (name === null) throw new Error("Name input cancelled.");
            const surname = input("surname", randomBool, promptMsg);
            if (surname === null) throw new Error("Surname input cancelled.");
            
            passengers.push(
                new Adult(name, surname, groupID, randomBool)
            );
        }

        for (let i = 0; i < childAmount; i++) {
            const promptMsg = `Child ${i + 1} of ${childAmount} (Group ${groupID})`;
            const name = input("name", randomBool, promptMsg);
            if (name === null) throw new Error("Name input cancelled.");
            const surname = input("surname", randomBool, promptMsg);
            if (surname === null) throw new Error("Surname input cancelled.");
            
            passengers.push(
                new Child(name, surname, groupID, randomBool)
            );
        }
        return passengers;
    }

    calculateGroupPrice(passengers) {
        if (!passengers) return 0;
        return passengers.reduce((total, passenger) => total + passenger.price, 0);
    }

    groupInfo(groupContainer) {
        if (this.id === -1) return; // No mostrar grupos cancelados
        
        const totalPassengers = this.amount;
        const totalPrice = this.price;

        const groupNumber = createElement("h3", `Group ${this.id}`);
        const groupTotalPassengers = createElement("h4", `${totalPassengers} passengers total`);
        const groupTotalPrice = createElement("h4", `$${totalPrice}`, "price");
        const groupComposition = createElement("p", `Adults: ${this.adultAmount}, Children: ${this.childAmount}`); 
        const groupInfo = createElement("div", null, "group-info");

        groupInfo.append(groupNumber, groupTotalPassengers, groupComposition, groupTotalPrice);
        groupContainer.appendChild(groupInfo);
    }

    displayPassengers(groupContainer) {
        if (this.id === -1) return; // No mostrar grupos cancelados
        
        const passengersInfo = createElement("div", null, "passengers-info");
        this.passengers.map(passenger => passenger.info(passengersInfo));
        groupContainer.appendChild(passengersInfo);
    }
}

function generateRandomGroupComposition(maxSize) {
    let totalSize = skewedLowerRandom(maxSize); 

    totalSize = Math.max(1, totalSize); 
    let adultAmount = floorRandom(totalSize) + 1;
    let childAmount = totalSize - adultAmount;
    return {
        adultAmount: adultAmount, 
        childAmount: childAmount
    };
}

function createStructuredGroup() {
    const composition = generateRandomGroupComposition(maxGroupSize);
    return new Group(composition.adultAmount, composition.childAmount);
}

function createMultipleGroups(groupsAmount) {
    const groups = [];
    for (let i = 0; i < groupsAmount; i++) {
        groups.push(createStructuredGroup());
    }
    return groups;
}

// --- LÓGICA DE INTERFAZ Y EVENTOS ---

let groups = [];
const groupContainers = document.querySelectorAll(".group-container");
const groupsButton = document.getElementById("groupsButton");
const addRandomButton = document.getElementById("addRandomButton");
const addButton = document.getElementById("addButton");
const locationButton = document.getElementById("locationButton");

function displayAllGroups(groupsToDisplay) {
    groupContainers.forEach((group) => group.remove());

    let mainContainer = document.querySelector("main");
    if (!mainContainer) {
        mainContainer = createElement("main");
        document.body.appendChild(mainContainer);
    } else {
        mainContainer.innerHTML = "";
    }

    groupsToDisplay.filter(g => g.id !== -1).forEach((group) => { // Filtra grupos cancelados
        const groupContainer = createElement("section", null, "group-container");
        group.groupInfo(groupContainer);
        group.displayPassengers(groupContainer);
        mainContainer.appendChild(groupContainer);
    });
}

groupsButton.addEventListener("click", function() {
    nextPassengerID = 0;
    nextGroupID = 0;

    let groupsAmount = parseInt(document.getElementById("groupInput").value) || 1;
    
    groups = createMultipleGroups(groupsAmount);
    displayAllGroups(groups);

    const firstGroup = document.querySelector(".group-container:first-child");
    if (firstGroup) {
        firstGroup.scrollIntoView({ behavior: 'smooth' });
    }
});

addRandomButton.addEventListener("click", function() {
    let amountToAdd = parseInt(document.getElementById("addInput").value) || 1;
    
    for (let i = 0; i < amountToAdd ; i++) {
        const newGroup = createStructuredGroup();
        groups.push(newGroup);
    }
    displayAllGroups(groups);

    const lastGroup = document.querySelector(".group-container:last-child");
    if (lastGroup) {
        lastGroup.scrollIntoView({ behavior: 'smooth' });
    }
});

// NUEVA FUNCIÓN MEJORADA: Grupo Personalizado
addButton.addEventListener("click", function() {
    const adultAmount = parseInt(prompt("Enter number of adults in the group (min 1):"));
    const childAmount = parseInt(prompt("Enter number of children in the group (min 0):"));
    const newCustomGroup = new Group(adultAmount, childAmount, false);
    
    // Solo agrega y muestra si el grupo no fue cancelado por el usuario
    if (newCustomGroup.id !== -1) {
        groups.push(newCustomGroup);
        displayAllGroups(groups);

        const lastGroup = document.querySelector(".group-container:last-child");
        if (lastGroup) {
            lastGroup.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

locationButton.addEventListener("click", function() {
    const randomLocation = floorRandom(locations.length);
    const locationElement = document.getElementById("location");
    locationElement.textContent = `Destination: ${locations[randomLocation]}`;

    const viewScroll = document.querySelector("#location");
    if (viewScroll) {
        viewScroll.scrollIntoView({ behavior: 'smooth' });
    }
});
