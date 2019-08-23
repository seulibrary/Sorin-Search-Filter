import React, { Component } from "react"
import {
    setFilters
} from "../../actions/search"

import { connect } from "react-redux"

import Slider, {Range} from "rc-slider"
import "./SearchFilter.scss"

const RangeWithTooltip = Slider.createSliderWithTooltip(Range)

class SearchFilter extends Component {
    constructor(props) {
        super(props)

        this.state = {
            filterVariable: "",
            minVariable: "",
            maxVariable: "",
            minValue: 0,
            maxValue: 0
        }
    }

    componentWillMount() {
        this.props.extensions.searchFilter.map( filters => {
            filters.settings.map( filter => {
                if (filter.format === "slider_and_boxes") {
                    // Store the filer Variable name in local state for use in other functions without having to 
                    // go through all the filters again.
                    this.setState({filterVariable: filter.variable})
                    filter.entries.map( entry => {
                        // ONLY set state if it does not exist!
                        // This should only have one entry!

                        // Store the min/max variable names in local state for easy retrieval
                        this.setState({
                            minVariable: entry.min_variable,
                            maxVariable: entry.max_variable,
                            minValue: entry.min_value,
                            maxValue: entry.max_value
                        })
                       

                        if (!this.props.searchFilters.searchFilters.hasOwnProperty(filter.variable)) {
                            this.props.dispatch(
                                setFilters({
                                    [filter.variable]: entry.min_value + "," + entry.max_value
                                }))
                        }
                    })
                }
            })
        })
    }

    toggleFilter = () => {
        this.props.dispatch({
            type: "SEARCH_FILTER_SETTING",
            propertyName: "searchFiltersHidden",
            payload: !this.props.searchFilters.searchFiltersHidden
 
        })
    }
    
    onSliderChange = (value) => {
        if (value.length > 0) {
            this.props.dispatch(
                setFilters({
                    [this.state.filterVariable]: (parseInt(value[0]) || this.state.minValue) + "," + (parseInt(value[1]) || this.state.maxValue)
                })
            )
        } else {
            

            if (value.target.name == this.state.minVariable) {
                var data = parseInt(value.target.value) || this.state.minValue

                this.props.dispatch(
                    setFilters({
                        [this.state.filterVariable]: data + "," + (this.props.searchFilters.searchFilters[this.state.filterVariable].split(",")[1])
                    })
                )
            }
            
            if (value.target.name == this.state.maxVariable) {
                var data = parseInt(value.target.value) || this.state.maxValue

                this.props.dispatch(
                    setFilters({
                        [this.state.filterVariable]: this.props.searchFilters.searchFilters[this.state.filterVariable].split(",")[0] + "," + data
                    })
                )
            }
        }
    }
   
    onChange = (e) => {
        this.props.dispatch(setFilters(
            {
                [e.target.name]: e.target.value
            }
        ))
    }

    onCheckBoxChange = (e) => {
        this.props.dispatch(setFilters(
            {
                [e.target.name]: !(e.target.value == "true")
            }
        ))
    }

    buildSections = (filter) => {
        let label = React.createElement("h5", {
            key: "sf_h5" + filter.label
        }, filter.label)

        let elements = filter.entries.map((entry, index) => {
            return this.buildFilter(filter, entry, index)
        })
        
        return React.createElement("div", {
            className: "search-group",
            key: "searchFilters-" + filter.label
        }, [label, elements])
    }

    buildFilter = (filter, entry, index) => {
        let input = () => {
            switch(filter.format) {
                case "checkbox":
                    // Check to see if value of checkbox should be checked. Checks for both string and bool value
                    // Late where the variable is used, it also checks to see if the value is undefined. If it is,
                    // it will convert it to false.
                    let isChecked = this.props.searchFilters.searchFilters[entry.variable] == "true" || this.props.searchFilters.searchFilters[entry.variable] == true
                    
                    return [
                        React.createElement("input", 
                        {
                            key: "sf_cb_" + index,
                            type: "checkbox",
                            name: entry.variable,
                            id: entry.variable,
                            onChange: this.onCheckBoxChange,
                            value:  isChecked === undefined ? false : isChecked,
                            checked: isChecked === undefined ? false : isChecked
                        }), React.createElement("label", {
                            key: "sf_label_" + entry.variable + index,
                            htmlFor: entry.variable
                        }, entry.label)
                    ]
                case "radio":
                    return [
                        React.createElement("input",
                        {
                            key: "sf_r_" + entry.variable + index,
                            type: "radio",
                            name: filter.variable,
                            id: entry.variable,
                            value: entry.variable,
                            onChange: this.onChange,
                            checked: (this.props.searchFilters.searchFilters[filter.variable] === entry.variable)
                        }),
                        React.createElement("label", {
                            key: "sf_label_" + entry.variable + index,
                            htmlFor: entry.variable
                        }, entry.label)
                    ]
            case "slider_and_boxes":
                // Check to make sure redux is set up with filters before trying to render this.
                if (this.props.searchFilters.searchFilters.hasOwnProperty(this.state.filterVariable)) {
                    let min_value = parseInt(this.props.searchFilters.searchFilters[this.state.filterVariable].split(",")[0]) || this.state.minValue
                    
                    let max_value = parseInt(this.props.searchFilters.searchFilters[this.state.filterVariable].split(",")[1]) || this.state.maxValue
                    
                    return <React.Fragment key={"years_sf_slider_" + index}>
                        <RangeWithTooltip
                            value={[min_value, max_value]}
                            min={entry.min_value}
                            key={"sf_slider_" + entry.variable + index}
                            max={entry.max_value}
                            onChange={this.onSliderChange}
                            onAfterChange={this.onSliderChange}
                        />

                        <label>{entry.label}: </label>
                        
                        <input 
                            type="number" 
                            name={entry.min_variable} 
                            min={entry.min_value} 
                            max={entry.max_value} 
                            value={min_value} 
                            onChange={this.onSliderChange} />
                        to 
                        <input 
                            type="number" 
                            name={entry.max_variable} 
                            min={entry.min_value} 
                            max={entry.max_value} 
                            value={max_value} 
                            onChange={this.onSliderChange} />
                    </React.Fragment>
                }
                return ""
            default:
                return ""
            } }

        return React.createElement("div", {key: "sf_wrap_" + index}, input())
    }

    render() {
        const showFilterClass = this.props.searchFilters.searchFiltersHidden ? "open" : "closed"

        if (!this.props.extensions.searchFilter) {
            return null
        } 
        return (
            <div>
                <div className="search-filters">
                    <a onClick={this.toggleFilter} className={showFilterClass +" filter"}>Filter<span id="search-arrow"></span></a>
                </div>
                
                <div className={showFilterClass +" search-fields"} >
                    <a className="search-close" onClick={this.toggleFilter}>x</a>
                    
                    <div id="searchGroups">
                    
                    {this.props.extensions.searchFilter[this.props.index].settings.map( filter => {
                        return this.buildSections(filter)
                    })}
                    </div>

                    <input type="button"
                        value="Apply Filters"
                        id="search-submit-btn-two"
                        onClick={this.props.onSumbit} />
                </div> 
            </div>
        )
    }
}

export default connect(
    function mapStateToProps(state) {
        return {
            extensions: state.extensions,
            searchFilters: state.searchFilters
        }
    },
    function mapDispatchToProps(dispatch) {
        return {
            dispatch,
        }
    }
)(SearchFilter)