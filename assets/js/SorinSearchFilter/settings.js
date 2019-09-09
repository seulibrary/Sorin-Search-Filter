import SearchFilter from "./index"
import SearchFilterButton from "./button"

export const components = [{
    component: SearchFilter,
    path: "searchFilter",
    settings: importJson()
},
{
    component: SearchFilterButton,
    path: "searchFilterButton"
}

]

function importJson() {
    try {
        return require("./config.json")
    } catch (ex) {
        return ""
    }
}
