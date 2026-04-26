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
    toggle.textContent = "°C"

    toggle.addEventListener("click", () => {
        if (toggle.textContent === "°C") {
            toggle.textContent = "°F"
        } else {
            toggle.textContent = "°C"
        }
    })

    headerDiv.appendChild(title)
    headerDiv.appendChild(search)
    headerDiv.appendChild(toggle)

    return { headerDiv, search , toggle}
})()

head.appendChild(header.headerDiv)
head.appendChild(bod)

header.search.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
        bod.innerHTML = ""
        const data = await fetchData(header.search.value.trim())
        const current = data.currentConditions
        const addr = data.resolvedAddress

        const unit = header.toggle.textContent

        theBody(current, addr, unit)

    }
})

async function fetchData(location = "delhi") {
    try {
        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=EBGG3FSHC2H9K7G2FRG8T567B&include=current`

        const response = await fetch(url)
        const data = await response.json()
        console.log(data);
        return data
        
    } catch (error) {
        console.log(`error ${error}`)
    }
}

// const iconImg = document.createElement("img");
// iconImg.src = `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/SVG/2nd%20Set%20-%20Color/${current.icon}.svg`;
// iconImg.alt = current.icon;


// The body
const theBody = ((current, location, unit) => {
    const heroTile = document.createElement("div")
    heroTile.classList.add("hero-tile")

    const loc = document.createElement("h2");
    loc.textContent = location

    const iconImg = document.createElement("img")
    iconImg.src = `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/SVG/1st%20Set%20-%20Monochrome/${current.icon}.svg`

    const tempCond = document.createElement("div")
    const temprature = document.createElement("h3")
    temprature.textContent = `${current.temp}${unit}`
    const desc = document.createElement("p")
    desc.textContent = current.conditions
    tempCond.appendChild(temprature)
    tempCond.appendChild(desc)

    const statsGrid = document.createElement("div")
    statsGrid.classList.add("stats-grid")

    const stats = [
        { label: "Feels Like", value: `${current.feelslike}${unit}` },
        { label: "Humidity", value: `${current.humidity} %` },
        { label: "Rain Chance", value: `${current.precipprob}%` },
        { label: "Wind Speed", value: `${current.windspeed} km/h` },
        { label: "Visibility", value: `${current.visibility} km` },
        { label: "UV Index", value: current.uvindex },
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