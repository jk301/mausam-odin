/* index.js */
import "./styles.css";

const mainTab = document.createElement("div")
mainTab.classList.add("main-tab")
document.body.appendChild(mainTab)

// The header
const header = (() => {
    const headerDiv = document.createElement("div")
    headerDiv.classList.add("main-header")
    const title = document.createElement("h2")
    title.textContent = "MAUSAM"

    const search = document.createElement("input")
    search.type = "search"
    search.placeholder = "search"

    headerDiv.appendChild(title)
    headerDiv.appendChild(search)

    return { headerDiv, search }
})()

mainTab.appendChild(header.headerDiv)

header.search.addEventListener("input", () => {console.log("input")})