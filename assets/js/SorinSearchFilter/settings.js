import SearchFilter from "./index"

export const components = [{
    component: SearchFilter,
    path: "searchFilter",
    settings: importJson()
}
]

function importJson() {
    try {
        return require("./config.json")
    } catch (ex) {
        return ""
    }
}
