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

let nextGroupID = 1;
let nextPassengerID = 1;
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

function createRandomPassenger(groupID, type) {
    const name = people.name[floorRandom(people.name.length)];
    const surname = people.surname[floorRandom(people.surname.length)];
    
    if (type === "Adult") {
        return new Adult(name, surname, groupID);
    } else if (type === "Child") {
        return new Child(name, surname, groupID);
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
    constructor(name, surname, groupID) {
        const ageMin = 18;
        const ageMax = 65;
        const age = floorRandom(ageMax - ageMin + 1) + ageMin;
        
        super(name, surname, groupID, age, 200); 
        this.type = "Adult";
    }
}

class Child extends Passenger {
    constructor(name, surname, groupID) {
        const ageMin = 5;
        const ageMax = 17;
        const age = floorRandom(ageMax - ageMin + 1) + ageMin; 
        
        super(name, surname, groupID, age, 125); 
        this.type = "Child";
    }
}

const passengerDialog = document.getElementById("passengerDialog");

async function inputManually(groupID, adultAmount, childAmount) {
    const dialog = passengerDialog;
    const titleEl = dialog.querySelector("h3");
    const nameInputEl = dialog.querySelector("#nameInput");
    const surnameInputEl = dialog.querySelector("#surnameInput");
    const ageInputEl = dialog.querySelector("#ageInput");
    const submitBtn = dialog.querySelector("#passengerSubmitButton");
    const cancelBtn = dialog.querySelector("#passengerCancelButton");

    function askOne(promptMsg, ageMin, ageMax) {
        return new Promise((resolve) => {
            titleEl.textContent = promptMsg;
            nameInputEl.value = "";
            surnameInputEl.value = "";
            ageInputEl.value = "";
            ageInputEl.min = ageMin;
            ageInputEl.max = ageMax;

            dialog.showModal();

            function cleanup() {
                submitBtn.removeEventListener("click", onSubmit);
                cancelBtn.removeEventListener("click", onCancel);
                try { dialog.close(); } catch (e) {}
            }

            function onSubmit(ev) {
                // prevent the dialog/form from automatically closing and allow validation
                ev.preventDefault();
                const name = nameInputEl.value.trim();
                const surname = surnameInputEl.value.trim();
                const age = parseInt(ageInputEl.value, 10);

                if (!name) { alert("Name cannot be empty."); return; }
                if (!surname) { alert("Surname cannot be empty."); return; }
                if (isNaN(age) || age < ageMin || age > ageMax) {
                    alert(`Age must be a number between ${ageMin} and ${ageMax}.`);
                    return;
                }

                cleanup();
                resolve({ name, surname, age });
            }

            function onCancel() {
                cleanup();
                resolve(null);
            }

            submitBtn.addEventListener("click", onSubmit);
            cancelBtn.addEventListener("click", onCancel);
        });
    }

    const passengers = [];

    // Adults
    for (let i = 0; i < adultAmount; i++) {
        const promptMsg = `Add Adult ${i + 1} of ${adultAmount} (Group ${groupID})`;
        const result = await askOne(promptMsg, 18, 120);
        if (result === null) throw new Error("Passenger creation cancelled.");
        const p = new Passenger(result.name, result.surname, groupID, result.age, 200);
        p.type = "Adult";
        passengers.push(p);
    }

    // Children
    for (let i = 0; i < childAmount; i++) {
        const promptMsg = `Add Child ${i + 1} of ${childAmount} (Group ${groupID})`;
        const result = await askOne(promptMsg, 5, 17);
        if (result === null) throw new Error("Passenger creation cancelled.");
        const p = new Passenger(result.name, result.surname, groupID, result.age, 125);
        p.type = "Child";
        passengers.push(p);
    }

    return passengers;
}

class Group {
    constructor(adultAmount, childAmount, passengers = null, predefinedID = null) {
        this.id = predefinedID !== null ? predefinedID : nextID("group");
        this.adultAmount = adultAmount;
        this.childAmount = childAmount;
        this.amount = adultAmount + childAmount;
        
        try {
            if (passengers && Array.isArray(passengers)) {
                this.passengers = passengers;
            } else {
                this.passengers = [];
                for (let i = 0; i < adultAmount; i++) {
                    this.passengers.push(createRandomPassenger(this.id, "Adult"));
                }
                for (let i = 0; i < childAmount; i++) {
                    this.passengers.push(createRandomPassenger(this.id, "Child"));
                }
            }
        } catch (error) {
            if (predefinedID === null) nextGroupID--;
            console.error("Group creation aborted:", error.message);
            this.passengers = null;
            this.id = -1;
            return;
        }
        
        this.price = this.calculateGroupPrice(this.passengers);
    }

    // Removed createPassengers method
    
    calculateGroupPrice(passengers) {
        if (!passengers) return 0;
        return passengers.reduce((total, passenger) => total + passenger.price, 0);
    }
    
    // ... groupInfo and displayPassengers methods remain the same ...
    groupInfo(groupContainer) {
        if (this.id === -1) return;
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
        if (this.id === -1) return;
        const passengersInfo = createElement("div", null, "passengers-info");
        this.passengers.map(passenger => passenger.info(passengersInfo));
        groupContainer.appendChild(passengersInfo);
    }
}

/* Logica de creacion de grupo fuera de los constructores */

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

// --- LÓGICA DE INTERFAZ Y EVENTOS (No changes here, as it was already correct) ---

let groups = [];
const groupContainers = document.querySelectorAll(".group-container");
const groupsButton = document.getElementById("groupsButton");
const addRandomButton = document.getElementById("addRandomButton");

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
    nextPassengerID = 1;
    nextGroupID = 1;

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

/* ------- Añadir Grupos Customizados ------- */

const addButton = document.getElementById("addButton");
const addDialog = document.getElementById("addDialog");
const adultCountInput = document.getElementById("adultCountInput");
const childCountInput = document.getElementById("childCountInput");
const addCancelButton = document.getElementById("addCancelButton");
const addSubmitButton = document.getElementById("addSubmitButton");

addButton.addEventListener("click", function() {
    addDialog.showModal();
});

addSubmitButton.addEventListener("click", async function(event) {
    event.preventDefault();
    const adultAmount = parseInt(adultCountInput.value) || 1;
    const childAmount = parseInt(childCountInput.value) || 0;
    // Reserve a group ID so passenger objects reference correct group id
    const reservedGroupID = nextID("group");

    try {
        const passengers = await inputManually(reservedGroupID, adultAmount, childAmount);

        // randomBool is explicitly set to false because we have the manual passengers array
        const newCustomGroup = new Group(adultAmount, childAmount, passengers, reservedGroupID);

        if (newCustomGroup.id !== -1) {
            groups.push(newCustomGroup);
            displayAllGroups(groups);

            const lastGroup = document.querySelector(".group-container:last-child");
            if (lastGroup) {
                lastGroup.scrollIntoView({ behavior: 'smooth' });
            }
        }
    } catch (err) {
        // roll back reserved ID
        nextGroupID--;
        console.warn("Group creation cancelled or failed:", err.message || err);
    } finally {
        addDialog.close();
    }
});

addCancelButton.addEventListener("click", function() {
    addDialog.close();
});

const locationButton = document.getElementById("locationButton");

locationButton.addEventListener("click", function() {
    const randomLocation = floorRandom(locations.length);
    const locationElement = document.getElementById("location");
    locationElement.textContent = locations[randomLocation];

    const viewScroll = document.querySelector("#location");
    if (viewScroll) {
        viewScroll.scrollIntoView({ behavior: 'smooth' });
    }
});