/* index.js */
import "./styles.css";

const head = document.createElement("div")
head.classList.add("main-tab")
document.body.appendChild(head)
const bod = document.createElement("div")
bod.classList.add("bod")

// The header
const header = (() => {
    const headerDiv = document.createElement("div")
    headerDiv.classList.add("main-header")
    const title = document.createElement("h2")
    title.textContent = "MAUSAM"

    const search = document.createElement("input")
    search.type = "search"
    search.placeholder = "search"

    const toggle = document.createElement("button")
    toggle.textContent = "°F"


    headerDiv.appendChild(title)
    headerDiv.appendChild(search)
    headerDiv.appendChild(toggle)

    return { headerDiv, search , toggle}
})()

head.appendChild(header.headerDiv)
head.appendChild(bod)

// for higher scope 
let current = null
let addr = null

let currTemp = null
let feelTemp = null
let dewPoint = null

// Showing error & stuff
const badReq = (() => {
    // could add more error checks in future
    const msg = document.createElement("div")
    msg.textContent = "Bad request :( couldn't find the place"

    const initialMsg = document.createElement("div")
    initialMsg.textContent = "Couldn't load the data for some reason :("

    const fetching = document.createElement("Div")
    fetching.textContent = "fetching..."

    return {msg, initialMsg, fetching}
})()

// initial data 
const initial = ( async () => {
    const initialData = await fetchData()
    if (!initialData) {
        bod.innerHTML = ""
        bod.appendChild(badReq.initialMsg)
        return
    }
    current = initialData.currentConditions
    addr = initialData.resolvedAddress
    currTemp = current.temp
    feelTemp = current.feelslike
    dewPoint = current.dew
    theBody(current, addr, header.toggle.textContent)
})()

// search
header.search.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
        if (header.search.value.trim() === "") return
        bod.innerHTML = ""
        const data = await fetchData(header.search.value.trim())
        if (!data) {
            bod.innerHTML = ""
            bod.appendChild(badReq.msg)
            return
        }
        current = data.currentConditions
        addr = data.resolvedAddress
        currTemp = current.temp
        feelTemp = current.feelslike
        dewPoint = current.dew
        header.toggle.textContent = "°F"

        theBody(current, addr, header.toggle.textContent)

    }
})

// Toggling with the data at hand (not fetching for each toggle)
header.toggle.addEventListener("click", () => {
    if (header.toggle.textContent === "°C") {
        header.toggle.textContent = "°F"
        current.temp = currTemp
        current.feelslike = feelTemp
        current.dew = dewPoint
        bod.innerHTML = ""
        theBody(current, addr, header.toggle.textContent)
    } else if (header.toggle.textContent === "°F") {
        header.toggle.textContent = "°C"
        current.temp = Math.round((currTemp - 32) * 5/9)
        current.feelslike = Math.round((feelTemp - 32) * 5/9)
        current.dew =  Math.round((dewPoint - 32) * 5/9)
        bod.innerHTML = ""
        theBody(current, addr, header.toggle.textContent)
    } else {
        return
    }
})

// Fetch 
async function fetchData(location = "delhi") {
    try {
        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=EBGG3FSHC2H9K7G2FRG8T567B&include=current`

        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`)
        }
        const data = await response.json()
        console.log(data);
        return data
        
    } catch (error) {
        console.log(error)
    }
}

// The body
const theBody = ((current, location, unit) => {
    const heroTile = document.createElement("div")
    heroTile.classList.add("hero-tile")

    const loc = document.createElement("h2");
    loc.textContent = location

    const iconImg = document.createElement("img")
    iconImg.src = `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/SVG/1st%20Set%20-%20Monochrome/${current.icon}.svg`

    const tempCond = document.createElement("div")
    tempCond.classList.add("temp-div")
    const temprature = document.createElement("h2")
    temprature.textContent = `${current.temp}${unit}`
    const desc = document.createElement("p")
    desc.textContent = current.conditions
    tempCond.appendChild(temprature)
    tempCond.appendChild(desc)

    const statsGrid = document.createElement("div")
    statsGrid.classList.add("stats-grid")

    const stats = [
        // looping through this is efficient (inspired)
        { label: "Feels Like", value: `${current.feelslike}${unit}` },
        { label: "Humidity", value: `${current.humidity} %` },
        { label: "Rain Chance", value: `${current.precipprob}%` },
        { label: "Wind Speed", value: `${current.windspeed} km/h` },
        { label: "Visibility", value: `${current.visibility} km` },
        { label: "UV Index", value: current.uvindex },
        { label: "Dew Point", value: `${current.dew}${unit}` },
        { label: "Pressure", value: `${current.pressure} hPa` },
        { label: "Cloud Cover", value: `${current.cloudcover} %` },
        { label: "Moon Phase", value: current.moonphase },
        { label: "Sunrise", value: current.sunrise },
        { label: "Sunset", value: current.sunset },
    ]

    stats.forEach(({ label, value }) => {
        const statItem = document.createElement("div")
        statItem.classList.add("stat-item")

        const statLabel = document.createElement("p")
        statLabel.textContent = label

        const statValue = document.createElement("h4")
        statValue.textContent = value

        statItem.appendChild(statLabel)
        statItem.appendChild(statValue)
        statsGrid.appendChild(statItem)
    })

    heroTile.appendChild(loc)
    heroTile.appendChild(iconImg)
    heroTile.appendChild(tempCond)
    heroTile.appendChild(statsGrid)

    bod.appendChild(heroTile)
})
