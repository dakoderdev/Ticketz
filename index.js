let locations = [
    "New York", "Los Angeles", "Chicago", "Houston", "Phoenix",
    "Rio de Janeiro", "Buenos Aires", "London", "Paris", "Tokyo",
    "Sydney", "Cape Town", "Berlin", "Moscow", "Toronto",
    "Dubai", "Mumbai", "Beijing", "Seoul", "Mexico City",
    "São Paulo", "Madrid", "Rome", "Bangkok", "Istanbul"
];

let usedLocations = [];

let capacities = [50, 75, 100, 200, 250];

let containerColors = ["yellow","green","pink"];

let TripID = 0;

function nextID() {
    return TripID++;
}

function floorRandom(max) {
    return Math.floor(Math.random() * max);
}

function skewedLowerRandom(max) {
    if (max < 1) return 0;
    const skewPower = 2;
    let randomSkewed = Math.pow(Math.random(), skewPower);
    const index = Math.min(Math.max(0, Math.floor(randomSkewed * max)), max - 1);
    return index;
}

function createElement(tag, text, className) {
    const el = document.createElement(tag);
    if (text) el.textContent = text;
    if (className) el.className = className;
    return el;
}

function createRandomTrip() {
    let location;
    do {
        location = locations[floorRandom(locations.length)];
        if (usedLocations.length === locations.length) {
            usedLocations = [];
        }
    } while (usedLocations.some(l => l === location));
    usedLocations.push(location);
    const capIndex = Math.max(0, skewedLowerRandom(capacities.length));
    const capacity = capacities[capIndex];
    const trip = new Trip(location, capacity);
    return trip.info();
}

function setAttributes(element, attributes) {
    Object.entries(attributes).forEach(([name, value]) => {
        element.setAttribute(name, value);
    });
}

const SVG_COMMON_ATTRS = {
    'xmlns': 'http://www.w3.org/2000/svg',
    'width': '16',
    'height': '16',
    'viewBox': '0 0 24 24',
    'fill': 'none',
    'stroke': 'currentColor',
    'stroke-width': '2.375',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
};

const SVG_NS = 'http://www.w3.org/2000/svg';

function createEditIcon() {
    const svg = document.createElementNS(SVG_NS, 'svg');
    setAttributes(svg, {
        ...SVG_COMMON_ATTRS, // Spread the common attributes
        'class': 'lucide lucide-pencil-icon lucide-pencil'
    });
    const path1 = document.createElementNS(SVG_NS, 'path');
    path1.setAttribute('d', 'M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z');
    svg.appendChild(path1);
    const path2 = document.createElementNS(SVG_NS, 'path');
    path2.setAttribute('d', 'm15 5 4 4');
    svg.appendChild(path2);
    return svg;
}
function createDeleteIcon() {
    const svg = document.createElementNS(SVG_NS, 'svg');
    setAttributes(svg, {
        ...SVG_COMMON_ATTRS, // Spread the common attributes
        'class': 'lucide lucide-trash-icon lucide-trash'
    });
    const path1 = document.createElementNS(SVG_NS, 'path');
    path1.setAttribute('d', 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6');
    svg.appendChild(path1);
    const path2 = document.createElementNS(SVG_NS, 'path');
    path2.setAttribute('d', 'M3 6h18');
    svg.appendChild(path2);
    const path3 = document.createElementNS(SVG_NS, 'path');
    path3.setAttribute('d', 'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2');
    svg.appendChild(path3);
    return svg;
}
// Your existing helper
function createElement(tag, text, className) {
    const el = document.createElement(tag);
    if (text) el.textContent = text;
    if (className) el.className = className;
    return el;
}

/**
 * Creates the entire <div class="trips__buttons"> structure.
 * @returns {HTMLDivElement} The complete DOM element.
 */
function createTripsButtonsContainer(randomColor) {
    // 1. Create the Parent Div: <div class="trips__buttons">
    const tripsButtonsDiv = createElement('div', null, 'trips__buttons');

    // 2. Create the EDIT Button and append the SVG
    const editButton = createElement('button', null, 'trips__button');
    editButton.id = 'trips__button--edit';
    editButton.setAttribute("data-color", randomColor);
    editButton.appendChild(createEditIcon());

    // 3. Create the DELETE Button and append the SVG
    const deleteButton = createElement('button', null, 'trips__button');
    deleteButton.id = 'trips__button--delete';
    deleteButton.setAttribute("data-color", randomColor);
    deleteButton.appendChild(createDeleteIcon());

    // 4. Append buttons to the container
    tripsButtonsDiv.appendChild(editButton);
    tripsButtonsDiv.appendChild(deleteButton);

    return tripsButtonsDiv;
}

const tripsButtonEditSVG = createElement('svg');

class Trip {
    constructor(location, capacity) {
        this.id = nextID();
        this.location = location;
        this.capacity = capacity;
        this.currentPassengers = 0;
        this.groups = [];
        this.price = this.calculatePrice();
    }

    calculatePrice() {
        // Simple example; you can change formula
        return (50 + this.capacity * 2).toFixed(2);
    }

    info() {
        // === LEFT SIDE ===
        const title = createElement('h2', this.location, 'trips__title');

        const passengersText = `Pasajeros `;
        const span = createElement('span', `${this.currentPassengers}/${this.capacity}`);
        const amount = createElement('h3', passengersText, 'trips__amount');
        amount.appendChild(span);

        const price = createElement('p', `$${this.price}`, 'trips__price');
        
        const randomColor = containerColors[floorRandom(containerColors.length)];
        const left = createElement('div', null, 'trips__left');
        left.setAttribute("data-color", randomColor);
        left.append(title, amount, price);

        // === GROUPS ===
        const groupsContainer = createElement('div', null, 'trips__groups');
        for (let i = 0; i < 20; i++) {
            const group = createElement('div', null, 'trips__group');
            groupsContainer.appendChild(group);
        };

        // === BUTTONS (using your helper) ===
        const buttons = createTripsButtonsContainer(randomColor);

        // === ASIDE ===
        const aside = createElement('aside', null, 'trips__aside');
        aside.setAttribute("data-color", randomColor);
        aside.append(groupsContainer, buttons);

        // === FINAL CARD ===
        const card = createElement('article', null, 'trips__card');
        card.append(left, aside);

        // Optional: Add data attributes or IDs
        card.dataset.tripId = this.id;

        return card;
    }
}

// Logica de UI

const randomizeTripButton = document.getElementById('nav__button--randomize-trip');
const addTripButton = document.getElementById('nav__button--add-trip');
const editTripButton = document.getElementById('trips__button--edit');
const deleteTripButton = document.getElementById('trips__button--delete');
const tripsGrid = document.getElementById('trips__grid');
const dialogAddTrip = document.querySelector('.dialog--add-trip');
const dialogAddTripCancel = document.querySelector('.dialog__button--cancel');
const dialogAddTripSubmit = document.querySelector('.dialog__button--submit');

randomizeTripButton.addEventListener('click', () => {
    tripsGrid.appendChild(createRandomTrip());
});

addTripButton.addEventListener('click', () => {
    dialogAddTrip.showModal();
});

dialogAddTripCancel.addEventListener('click', () => {
    dialogAddTrip.close();
});

dialogAddTripSubmit.addEventListener('click', (event) => {
    event.preventDefault();
    const locationInput = document.getElementById('tripLocationInput');
    const capacityInput = document.getElementById('tripCapacityInput');
    const location = locationInput.value;
    const capacity = parseInt(capacityInput.value, 10);

    if (location && capacity) {
        const trip = new Trip(location, capacity);
        tripsGrid.appendChild(trip.info());
        dialogAddTrip.close();
        locationInput.value = '';
        capacityInput.value = '';
    }
});