const people = {
  name: [
    "Doja",
    "Bryan",
    "Emma",
    "Carlos",
    "Tyra",
    "Sophia",
    "Liam",
    "Mia",
    "Noah",
    "Olivia",
    "Ethan",
    "Ava",
    "James",
    "Isabella",
    "Lucas",
    "Charlotte",
    "Mason",
    "Amelia",
    "Benjamin",
    "Harper",
    "Salem",
  ],
  surname: [
    "Benz",
    "Hamilton",
    "Smith",
    "Doe",
    "Lee",
    "Ramirez",
    "Anderson",
    "Brown",
    "Clark",
    "Johnson",
    "Martinez",
    "Garcia",
    "Rodriguez",
    "Hernandez",
    "Nguyen",
    "Taylor",
    "Wilson",
    "Davis",
    "Miller",
    "Moore",
    "Payne",
  ],
}

let nextGroupID = 1
let nextPassengerID = 1
const maxGroupSize = 12

let currentTripId = null
let currentTrip = null

function nextID(type) {
  return type === "group" ? nextGroupID++ : nextPassengerID++
}

function floorRandom(max) {
  return Math.floor(Math.random() * max)
}

function skewedLowerRandom(max) {
  if (max < 1) return 0
  const skewPower = 2
  const randomSkewed = Math.pow(Math.random(), skewPower)
  const size = Math.ceil(randomSkewed * max)
  return Math.min(Math.max(1, size), max)
}

function createElement(tag, text, className) {
  const el = document.createElement(tag)
  if (text) el.textContent = text
  if (className) el.className = className
  return el
}

function createRandomPassenger(groupID, type) {
  const name = people.name[floorRandom(people.name.length)]
  const surname = people.surname[floorRandom(people.surname.length)]

  if (type === "Adult") {
    return new Adult(name, surname, groupID)
  } else if (type === "Child") {
    return new Child(name, surname, groupID)
  }
}

class Passenger {
  constructor(name, surname, groupID, age, price) {
    this.id = nextID("passenger")
    this.name = name
    this.surname = surname
    this.groupID = groupID
    this.age = age
    this.price = price
  }

  info(passengersInfo) {
    const passengerInfo = createElement("div", null, "passenger__info")
    const passengerNumber = createElement("h4", `Passenger ${this.id}`, "passenger__number")
    const passengerFullName = createElement("p", `${this.name} ${this.surname}`, "passenger__name")
    const passengerAge = createElement("p", `Age: ${this.age}`)
    const passengerPrice = createElement("p", `$${this.price}`, "passenger__price")

    const passengerType = createElement("p", `Type: ${this.type}`)

    passengerInfo.append(passengerNumber, passengerFullName, passengerType, passengerAge, passengerPrice)
    passengersInfo.appendChild(passengerInfo)
  }
}

class Adult extends Passenger {
  constructor(name, surname, groupID) {
    const ageMin = 18
    const ageMax = 65
    const age = floorRandom(ageMax - ageMin + 1) + ageMin

    super(name, surname, groupID, age, 200)
    this.type = "Adult"
  }
}

class Child extends Passenger {
  constructor(name, surname, groupID) {
    const ageMin = 5
    const ageMax = 17
    const age = floorRandom(ageMax - ageMin + 1) + ageMin

    super(name, surname, groupID, age, 125)
    this.type = "Child"
  }
}

const passengerDialog = document.getElementById("passengerDialog")

async function inputManually(groupID, adultAmount, childAmount) {
  const dialog = passengerDialog
  const titleEl = dialog.querySelector("h3")
  const nameInputEl = dialog.querySelector("#nameInput")
  const surnameInputEl = dialog.querySelector("#surnameInput")
  const ageInputEl = dialog.querySelector("#ageInput")
  const submitBtn = dialog.querySelector("#passengerSubmitButton")
  const cancelBtn = dialog.querySelector("#passengerCancelButton")

  function askOne(promptMsg, ageMin, ageMax) {
    return new Promise((resolve) => {
      titleEl.textContent = promptMsg
      nameInputEl.value = ""
      surnameInputEl.value = ""
      ageInputEl.value = ""
      ageInputEl.min = ageMin
      ageInputEl.max = ageMax

      dialog.showModal()

      function cleanup() {
        submitBtn.removeEventListener("click", onSubmit)
        cancelBtn.removeEventListener("click", onCancel)
        try {
          dialog.close()
        } catch (e) {}
      }

      function onSubmit(ev) {
        // prevent the dialog/form from automatically closing and allow validation
        ev.preventDefault()
        const name = nameInputEl.value.trim()
        const surname = surnameInputEl.value.trim()
        const age = Number.parseInt(ageInputEl.value, 10)

        if (!name) {
          alert("Name cannot be empty.")
          return
        }
        if (!surname) {
          alert("Surname cannot be empty.")
          return
        }
        if (isNaN(age) || age < ageMin || age > ageMax) {
          alert(`Age must be a number between ${ageMin} and ${ageMax}.`)
          return
        }

        cleanup()
        resolve({ name, surname, age })
      }

      function onCancel() {
        cleanup()
        resolve(null)
      }

      submitBtn.addEventListener("click", onSubmit)
      cancelBtn.addEventListener("click", onCancel)
    })
  }

  const passengers = []

  // Adults
  for (let i = 0; i < adultAmount; i++) {
    const promptMsg = `Add Adult ${i + 1} of ${adultAmount} (Group ${groupID})`
    const result = await askOne(promptMsg, 18, 120)
    if (result === null) throw new Error("Passenger creation cancelled.")
    const p = new Passenger(result.name, result.surname, groupID, result.age, 200)
    p.type = "Adult"
    passengers.push(p)
  }

  // Children
  for (let i = 0; i < childAmount; i++) {
    const promptMsg = `Add Child ${i + 1} of ${childAmount} (Group ${groupID})`
    const result = await askOne(promptMsg, 5, 17)
    if (result === null) throw new Error("Passenger creation cancelled.")
    const p = new Passenger(result.name, result.surname, groupID, result.age, 125)
    p.type = "Child"
    passengers.push(p)
  }

  return passengers
}

class Group {
  constructor(adultAmount, childAmount, passengers = null, predefinedID = null) {
    this.id = predefinedID !== null ? predefinedID : nextID("group")
    this.adultAmount = adultAmount
    this.childAmount = childAmount
    this.amount = adultAmount + childAmount

    try {
      if (passengers && Array.isArray(passengers)) {
        this.passengers = passengers
      } else {
        this.passengers = []
        for (let i = 0; i < adultAmount; i++) {
          this.passengers.push(createRandomPassenger(this.id, "Adult"))
        }
        for (let i = 0; i < childAmount; i++) {
          this.passengers.push(createRandomPassenger(this.id, "Child"))
        }
      }
    } catch (error) {
      if (predefinedID === null) nextGroupID--
      console.error("Group creation aborted:", error.message)
      this.passengers = null
      this.id = -1
      return
    }

    this.price = this.calculateGroupPrice(this.passengers)
  }

  calculateGroupPrice(passengers) {
    if (!passengers) return 0
    return passengers.reduce((total, passenger) => total + passenger.price, 0)
  }

  groupInfo(groupContainer) {
    if (this.id === -1) return
    const totalPassengers = this.amount
    const totalPrice = this.price

    const groupNumber = createElement("h3", `Group ${this.id}`)
    const groupTotalPassengers = createElement("h4", `${totalPassengers} passengers total`)
    const groupTotalPrice = createElement("h4", `$${totalPrice}`, "price")
    const groupComposition = createElement("p", `Adults: ${this.adultAmount}, Children: ${this.childAmount}`)
    const groupInfo = createElement("div", null, "group__info")

    groupInfo.append(groupNumber, groupTotalPassengers, groupComposition, groupTotalPrice)
    groupContainer.appendChild(groupInfo)
  }

  displayPassengers(groupContainer) {
    if (this.id === -1) return
    const passengersInfo = createElement("div", null, "passengers__info")
    this.passengers.map((passenger) => passenger.info(passengersInfo))
    groupContainer.appendChild(passengersInfo)
  }
}

/* Logica de creacion de grupo fuera de los constructores */

function generateRandomGroupComposition(maxSize) {
  let totalSize = skewedLowerRandom(maxSize)

  totalSize = Math.max(1, totalSize)
  const adultAmount = floorRandom(totalSize) + 1
  const childAmount = totalSize - adultAmount
  return {
    adultAmount: adultAmount,
    childAmount: childAmount,
  }
}

function createStructuredGroup() {
  const composition = generateRandomGroupComposition(maxGroupSize)
  return new Group(composition.adultAmount, composition.childAmount)
}

function createMultipleGroups(groupsAmount) {
  const groups = []
  for (let i = 0; i < groupsAmount; i++) {
    groups.push(createStructuredGroup())
  }
  return groups
}

function loadTripFromLocalStorage(tripId) {
  const tripsData = localStorage.getItem("trips")
  if (!tripsData) return null

  const trips = JSON.parse(tripsData)
  return trips.find((trip) => trip.id === Number.parseInt(tripId, 10))
}

function saveTripToLocalStorage(tripId, groups) {
  const tripsData = localStorage.getItem("trips")
  if (!tripsData) return

  const trips = JSON.parse(tripsData)
  const tripIndex = trips.findIndex((trip) => trip.id === Number.parseInt(tripId, 10))

  if (tripIndex !== -1) {
    trips[tripIndex].groups = groups
    trips[tripIndex].currentPassengers = groups.reduce((total, group) => {
      return total + (group.amount || 0)
    }, 0)
    localStorage.setItem("trips", JSON.stringify(trips))
  }
}

function updateCapacityDisplay() {
  if (!currentTrip) return

  // 1. Calculate current passengers by summing all passengers across all groups
  const currentPassengers = groups.reduce((total, group) => total + (group.amount || 0), 0)
  const tripCapacity = currentTrip.capacity
  
  // 3. Select the capacity span
  const capacitySpan = document.querySelector(".main__capacity")

  if (capacitySpan) {
    // 4. Update its text content
    capacitySpan.textContent = `${currentPassengers}/${tripCapacity} passengers`

    // Optional: Add conditional styling class
    if (currentPassengers >= tripCapacity) {
      capacitySpan.classList.add("main__capacity--full")
    } else {
      capacitySpan.classList.remove("main__capacity--full")
    }
  }
}

// --- LÓGICA DE INTERFAZ Y EVENTOS ---

let groups = []
const groupContainers = document.querySelectorAll(".group__container")
const groupsButton = document.getElementById("groupsButton")
const addRandomButton = document.getElementById("addRandomButton")

function displayAllGroups(groupsToDisplay) {
  groupContainers.forEach((group) => group.remove())

  let mainContainer = document.querySelector("main")
  if (!mainContainer) {
    mainContainer = createElement("main")
    document.body.appendChild(mainContainer)
  } else {
    mainContainer.innerHTML = ""
  }

  groupsToDisplay
    .filter((g) => g.id !== -1)
    .forEach((group) => {
      const groupContainer = createElement("section", null, "group__container")
      group.groupInfo(groupContainer)
      group.displayPassengers(groupContainer)
      mainContainer.appendChild(groupContainer)
    })

  if (currentTripId !== null) {
    saveTripToLocalStorage(currentTripId, groups)
    updateCapacityDisplay()
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search)
  currentTripId = urlParams.get("tripId")

  if (currentTripId) {
    currentTrip = loadTripFromLocalStorage(currentTripId)

    if (currentTrip) {
      const locationElement = document.getElementById("location")
      if (locationElement) {
        locationElement.textContent = currentTrip.location
      }

      if (currentTrip.groups && currentTrip.groups.length > 0) {

        displayAllGroups(groups) 
      }

      updateCapacityDisplay()
    }
  }

});

groupsButton.addEventListener("click", () => {
  nextPassengerID = 1
  nextGroupID = 1

  const groupsAmount = Number.parseInt(document.getElementById("groupInput").value) || 1

  groups = createMultipleGroups(groupsAmount)
  displayAllGroups(groups)

  const firstGroup = document.querySelector(".group__container:first-child")
  if (firstGroup) {
    firstGroup.scrollIntoView({ behavior: "smooth" })
  }
})

addRandomButton.addEventListener("click", () => {
  const amountToAdd = Number.parseInt(document.getElementById("addInput").value) || 1

  for (let i = 0; i < amountToAdd; i++) {
    const newGroup = createStructuredGroup()
    groups.push(newGroup)
  }
  displayAllGroups(groups)

  const lastGroup = document.querySelector(".group__container:last-child")
  if (lastGroup) {
    lastGroup.scrollIntoView({ behavior: "smooth" })
  }
})

/* ------- Añadir Grupos Customizados ------- */

const addButton = document.getElementById("addButton")
const addDialog = document.getElementById("addDialog")
const adultCountInput = document.getElementById("adultCountInput")
const childCountInput = document.getElementById("childCountInput")
const addCancelButton = document.getElementById("addCancelButton")
const addSubmitButton = document.getElementById("addSubmitButton")
const backDirectory = document.querySelector(".main__a--trips");
const currentDirectory = document.querySelector(".main__a--groups");


backDirectory.addEventListener("click", () => {
    window.location.href = "index.html"
  })

addButton.addEventListener("click", () => {
  addDialog.showModal()
})


function updateCurrentDirectoryName() {
    const tripName = currentTrip && (currentTrip.name || currentTrip.location)
    if (tripName) {
        currentDirectory.textContent = tripName
    }
}

updateCurrentDirectoryName()
window.addEventListener("DOMContentLoaded", updateCurrentDirectoryName)

addSubmitButton.addEventListener("click", async (event) => {
    event.preventDefault()
    const adultAmount = Number.parseInt(adultCountInput.value) || 1
    const childAmount = Number.parseInt(childCountInput.value) || 0
    const reservedGroupID = nextID("group")

    try {
        const passengers = await inputManually(reservedGroupID, adultAmount, childAmount)

        const newCustomGroup = new Group(adultAmount, childAmount, passengers, reservedGroupID)

        if (newCustomGroup.id !== -1) {
            groups.push(newCustomGroup)
            displayAllGroups(groups)

            const lastGroup = document.querySelector(".group__container:last-child")
            if (lastGroup) {
                lastGroup.scrollIntoView({ behavior: "smooth" })
            }
        }
    } catch (err) {
        nextGroupID--
        console.warn("Group creation cancelled or failed:", err.message || err)
    } finally {
        addDialog.close()
    }
})

addCancelButton.addEventListener("click", () => {
  addDialog.close()
})
