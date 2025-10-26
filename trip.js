const locations = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Rio de Janeiro",
  "Buenos Aires",
  "London",
  "Paris",
  "Tokyo",
  "Sydney",
  "Cape Town",
  "Berlin",
  "Moscow",
  "Toronto",
  "Dubai",
  "Mumbai",
  "Beijing",
  "Seoul",
  "Mexico City",
  "São Paulo",
  "Madrid",
  "Rome",
  "Bangkok",
  "Istanbul",
]

let usedLocations = []

const capacities = [50, 75, 100, 200, 250]

const containerColors = ["yellow", "green", "pink"]

let TripID = 0

function nextID() {
  return TripID++
}

function floorRandom(max) {
  return Math.floor(Math.random() * max)
}

function skewedLowerRandom(max) {
  if (max < 1) return 0
  const skewPower = 2
  const randomSkewed = Math.pow(Math.random(), skewPower)
  const index = Math.min(Math.max(0, Math.floor(randomSkewed * max)), max - 1)
  return index
}

function createElement(tag, text, className) {
  const el = document.createElement(tag)
  if (text) el.textContent = text
  if (className) el.className = className
  return el
}

function createRandomTrip() {
  let location
  do {
    location = locations[floorRandom(locations.length)]
    if (usedLocations.length === locations.length) {
      usedLocations = []
    }
  } while (usedLocations.some((l) => l === location))
  usedLocations.push(location)
  const capIndex = Math.max(0, skewedLowerRandom(capacities.length))
  const capacity = capacities[capIndex]
  const trip = new Trip(location, capacity)
  return trip.info()
}

function setAttributes(element, attributes) {
  Object.entries(attributes).forEach(([name, value]) => {
    element.setAttribute(name, value)
  })
}

const SVG_COMMON_ATTRS = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "16",
  height: "16",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2.375",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
}

const SVG_NS = "http://www.w3.org/2000/svg"

function createAddUserIcon() {
  const svg = document.createElementNS(SVG_NS, "svg")
  setAttributes(svg, {
    ...SVG_COMMON_ATTRS,
    class: "lucide lucide-user-plus-icon lucide-user-plus",
  })

  const path = document.createElementNS(SVG_NS, "path")
  path.setAttribute("d", "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2")
  svg.appendChild(path)

  const circle = document.createElementNS(SVG_NS, "circle")
  circle.setAttribute("cx", "9")
  circle.setAttribute("cy", "7")
  circle.setAttribute("r", "4")
  svg.appendChild(circle)

  const line1 = document.createElementNS(SVG_NS, "line")
  line1.setAttribute("x1", "19")
  line1.setAttribute("y1", "8")
  line1.setAttribute("x2", "19")
  line1.setAttribute("y2", "14")
  svg.appendChild(line1)

  const line2 = document.createElementNS(SVG_NS, "line")
  line2.setAttribute("x1", "22")
  line2.setAttribute("y1", "11")
  line2.setAttribute("x2", "16")
  line2.setAttribute("y2", "11")
  svg.appendChild(line2)

  return svg
}


function createEditIcon() {
  const svg = document.createElementNS(SVG_NS, "svg")
  setAttributes(svg, {
    ...SVG_COMMON_ATTRS,
    class: "lucide lucide-pencil-icon lucide-pencil",
  })
  const path1 = document.createElementNS(SVG_NS, "path")
  path1.setAttribute(
    "d",
    "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
  )
  svg.appendChild(path1)
  const path2 = document.createElementNS(SVG_NS, "path")
  path2.setAttribute("d", "m15 5 4 4")
  svg.appendChild(path2)
  return svg
}

function createDeleteIcon() {
  const svg = document.createElementNS(SVG_NS, "svg")
  setAttributes(svg, {
    ...SVG_COMMON_ATTRS,
    class: "lucide lucide-trash-icon lucide-trash",
  })
  const path1 = document.createElementNS(SVG_NS, "path")
  path1.setAttribute("d", "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6")
  svg.appendChild(path1)
  const path2 = document.createElementNS(SVG_NS, "path")
  path2.setAttribute("d", "M3 6h18")
  svg.appendChild(path2)
  const path3 = document.createElementNS(SVG_NS, "path")
  path3.setAttribute("d", "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2")
  svg.appendChild(path3)
  return svg
}

/**
 * Creates the entire <div class="trips__buttons"> structure.
 * @returns {HTMLDivElement} The complete DOM element.
 */
function createTripsButtonsContainer(randomColor) {
  const tripsButtonsDiv = createElement("div", null, "trips__buttons")

  const addUserButton = createElement("button", null, "trips__button")
  addUserButton.id = "trips__button--add-user"
  addUserButton.setAttribute("data-color", randomColor)
  addUserButton.appendChild(createAddUserIcon())

  const editButton = createElement("button", null, "trips__button")
  editButton.id = "trips__button--edit"
  editButton.setAttribute("data-color", randomColor)
  editButton.appendChild(createEditIcon())

  const deleteButton = createElement("button", null, "trips__button")
  deleteButton.id = "trips__button--delete"
  deleteButton.setAttribute("data-color", randomColor)
  deleteButton.appendChild(createDeleteIcon())

  tripsButtonsDiv.appendChild(addUserButton)
  tripsButtonsDiv.appendChild(editButton)
  tripsButtonsDiv.appendChild(deleteButton)

  return tripsButtonsDiv
}

const tripsButtonEditSVG = createElement("svg")

// Quick fix: ensure each trip always has a color and reuse it
class Trip {
  constructor(location, capacity, color = null) {
    this.id = nextID()
    this.location = location
    this.capacity = capacity
    this.currentPassengers = 0
    this.groups = []
    this.price = this.calculatePrice()
    this.color = color || containerColors[floorRandom(containerColors.length)]
  }

  calculatePrice() {
    return (50 + this.capacity * 2).toFixed(2)
  }

  updateGroups(groups) {
    this.groups = groups
    this.currentPassengers = groups.reduce((total, group) => total + (group.amount || 0), 0)
  }

  info() {
    const title = createElement("h2", this.location, "trips__title")
    const passengersText = `Pasajeros `
    const span = createElement("span", `${this.currentPassengers}/${this.capacity}`)
    const amount = createElement("h3", passengersText, "trips__amount")
    amount.appendChild(span)
    const price = createElement("p", `$${this.price}`, "trips__price")

    const left = createElement("div", null, "trips__left")
    left.setAttribute("data-color", this.color)
    left.append(title, amount, price)

    const groupsContainer = createElement("div", null, "trips__groups")
    const maxGroupSlots = 20
    const actualGroups = this.groups.length

    for (let i = 0; i < actualGroups && i < maxGroupSlots; i++) {
      const groupData = this.groups[i]
      const passengerCount = groupData?.amount || 0
      const group = createElement("div", `${passengerCount}`, "trips__group trips__group--filled")
      group.setAttribute("data-color", this.color)
      groupsContainer.appendChild(group)
    }

    for (let i = actualGroups; i < maxGroupSlots; i++) {
      const group = createElement("div", null, "trips__group")
      groupsContainer.appendChild(group)
    }

    const buttons = createTripsButtonsContainer(this.color)

    const aside = createElement("aside", null, "trips__aside")
    aside.setAttribute("data-color", this.color)
    aside.append(groupsContainer, buttons)

    const card = createElement("article", null, "trips__card")
    card.append(left, aside)
    card.dataset.tripId = this.id

    const addUserButton = card.querySelector("#trips__button--add-user")
    addUserButton.addEventListener("click", (e) => {
      e.stopPropagation()
      saveTripsToLocalStorage()
      window.location.href = `group.html?tripId=${this.id}`
    })

    const deleteButton = card.querySelector("#trips__button--delete")
    deleteButton.addEventListener("click", (e) => {
      e.stopPropagation()
      if (confirm(`Are you sure you want to delete the trip to ${this.location}?`)) {
        allTrips = allTrips.filter((trip) => trip.id !== this.id)
        saveTripsToLocalStorage()
        renderAllTrips()
      }
    })

    return card
  }
}

function loadTripsFromLocalStorage() {
  const tripsData = localStorage.getItem("trips")
  const savedTripID = localStorage.getItem("nextTripID")

  if (savedTripID) TripID = Number.parseInt(savedTripID, 10)

  if (!tripsData) return []

  const parsed = JSON.parse(tripsData)
  return parsed.map((data) => {
    // use saved color or fallback
    const color = data.color || containerColors[floorRandom(containerColors.length)]
    return Object.assign(new Trip(data.location, data.capacity, color), data)
  })
}

function saveTripsToLocalStorage() {
  const tripsData = allTrips.map((trip) => ({
    id: trip.id,
    location: trip.location,
    capacity: trip.capacity,
    currentPassengers: trip.currentPassengers,
    groups: trip.groups,
    price: trip.price,
    color: trip.color,
  }))
  localStorage.setItem("trips", JSON.stringify(tripsData))
  localStorage.setItem("nextTripID", TripID.toString())
}

function loadTripsFromLocalStorage() {
  const tripsData = localStorage.getItem("trips")
  const savedTripID = localStorage.getItem("nextTripID")

  if (savedTripID) {
    TripID = Number.parseInt(savedTripID, 10)
  }

  if (tripsData) {
    const parsed = JSON.parse(tripsData)
    return parsed.map((data) => {
      const trip = Object.assign(new Trip(data.location, data.capacity), data)
      return trip
    })
  }
  return []
}

let allTrips = []

function renderAllTrips() {
  tripsGrid.innerHTML = ""
  allTrips.forEach((trip) => {
    tripsGrid.appendChild(trip.info())
  })
}

// Logica de UI

const randomizeTripButton = document.getElementById("nav__button--randomize-trip")
const addTripButton = document.getElementById("nav__button--add-trip")
const editTripButton = document.getElementById("trips__button--edit")
const deleteTripButton = document.getElementById("trips__button--delete")
const tripsGrid = document.getElementById("trips__grid")
const dialogAddTrip = document.querySelector(".dialog--add-trip")
const dialogAddTripCancel = dialogAddTrip.querySelector(".dialog__button--cancel")
const dialogAddTripSubmit = dialogAddTrip.querySelector(".dialog__button--submit")

window.addEventListener("DOMContentLoaded", () => {
  allTrips = loadTripsFromLocalStorage()
  renderAllTrips()
})

randomizeTripButton.addEventListener("click", () => {
  const tripElement = createRandomTrip()
  const location = tripElement.querySelector(".trips__title").textContent
  const capacityText = tripElement.querySelector(".trips__amount span").textContent
  const capacity = Number.parseInt(capacityText.split("/")[1], 10)

  const tripObj = new Trip(location, capacity)
  allTrips.push(tripObj)
  saveTripsToLocalStorage()
  renderAllTrips()
})

addTripButton.addEventListener("click", () => {
  dialogAddTrip.showModal()
})

dialogAddTripCancel.addEventListener("click", () => {
  dialogAddTrip.close()
})

dialogAddTripSubmit.addEventListener("click", (event) => {
  event.preventDefault()
  const locationInput = document.getElementById("tripLocationInput")
  const capacityInput = document.getElementById("tripCapacityInput")
  const location = locationInput.value
  const capacity = Number.parseInt(capacityInput.value, 10)

  if (location && capacity) {
    const trip = new Trip(location, capacity)
    allTrips.push(trip)
    saveTripsToLocalStorage()
    renderAllTrips()
    dialogAddTrip.close()
    locationInput.value = ""
    capacityInput.value = ""
  }
})

// === Edit Trip Dialog Logic ===

const dialogEditTrip = document.querySelector(".dialog--edit-trip")
const dialogEditTripCancel = dialogEditTrip.querySelector(".dialog__button--cancel")
const dialogEditTripSubmit = dialogEditTrip.querySelector(".dialog__button--submit")

let currentEditingTrip = null // Track which trip is being edited

// Handle edit icon clicks (delegated)
document.addEventListener("click", (e) => {
  const editButton = e.target.closest("#trips__button--edit")
  if (!editButton) return

  const card = editButton.closest(".trips__card")
  const tripId = Number(card.dataset.tripId)
  const trip = allTrips.find((t) => t.id === tripId)
  if (!trip) return

  currentEditingTrip = trip

  // Prefill dialog inputs
  const locationInput = document.getElementById("tripEditLocationInput")
  const capacityInput = document.getElementById("tripEditCapacityInput")

  locationInput.value = trip.location
  capacityInput.value = trip.capacity

  dialogEditTrip.showModal()
})

// Cancel edit
dialogEditTripCancel.addEventListener("click", () => {
  dialogEditTrip.close()
  currentEditingTrip = null
})

// Submit edit
document.addEventListener("click", (e) => {
  const editButton = e.target.closest("#trips__button--edit")
  if (!editButton) return

  const card = editButton.closest(".trips__card")
  const tripId = Number(card.dataset.tripId)
  const trip = allTrips.find((t) => t.id === tripId)
  if (!trip) return

  currentEditingTrip = trip

  // Prefill dialog inputs
  const locationInput = document.getElementById("tripEditLocationInput")
  const capacityInput = document.getElementById("tripEditCapacityInput")

  locationInput.value = trip.location
  capacityInput.value = trip.capacity

  // ✅ Prevent capacity lower than current passengers
  capacityInput.min = trip.currentPassengers

  dialogEditTrip.showModal()
})


// Submit edit
dialogEditTripSubmit.addEventListener("click", (event) => {
  event.preventDefault()

  if (!currentEditingTrip) return

  const locationInput = document.getElementById("tripEditLocationInput")
  const capacityInput = document.getElementById("tripEditCapacityInput")
  const location = locationInput.value
  const capacity = Number(capacityInput.value)

  // ✅ Check for empty inputs
  if (!location || !capacity) {
    alert("Please fill in all fields")
    return
  }

  // ✅ Warn if capacity < current passengers
  if (capacity < currentEditingTrip.currentPassengers) {
    alert(`Capacity cannot be less than the current passenger count (${currentEditingTrip.currentPassengers}).`)
    return
  }

  // Update trip
  currentEditingTrip.location = location
  currentEditingTrip.capacity = capacity
  currentEditingTrip.price = currentEditingTrip.calculatePrice()

  saveTripsToLocalStorage()
  renderAllTrips()

  dialogEditTrip.close()
  currentEditingTrip = null
})
