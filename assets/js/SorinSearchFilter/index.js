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
    }

    componentWillMount() {
        this.props.extensions.searchFilter.map( filters => {
            filters.settings.map( filter => {
                if (filter.format === "slider_and_boxes") {
                    filter.entries.map( entry => {
                        this.props.dispatch(
                            setFilters({    
                                [entry.min_variable]: entry.min_value,
                                [entry.max_variable]: entry.max_value
                            }))
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
                    min_date: parseInt(value[0]),
                    max_date: parseInt(value[1])
                })
            )
        } else {
            if (value.target.name) {
                var data = parseInt(value.target.value) || ""

                this.props.dispatch(
                    setFilters({
                        [value.target.name]: data
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
                [e.target.name]: !this.props.searchFilters.searchFilters[e.target.value]
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
                return [React.createElement("label", {
                    key: "sf_label_" + entry.variable + index,
                    htmlFor: entry.variable
                }, entry.label)
                , React.createElement("input", 
                    {
                        key: "sf_cb_" + index,
                        type: "checkbox",
                        name: entry.variable,
                        id: entry.variable,
                        onChange: this.onCheckBoxChange,
                        value: this.props.searchFilters.searchFilters[entry.variable]
                    })]
            case "radio":
                return [React.createElement("label", {
                    key: "sf_label_" + entry.variable + index,
                    htmlFor: entry.variable
                }, entry.label),
                React.createElement("input",
                    {
                        key: "sf_r_" + entry.variable + index,
                        type: "radio",
                        name: filter.group,
                        id: entry.variable,
                        value: entry.variable,
                        onChange: this.onChange,
                        checked: this.props.searchFilters.searchFilters[filter.group] === entry.variable
                    })]
            case "slider_and_boxes":
                return <React.Fragment key={"years_sf_slider_" + index}>
                    <RangeWithTooltip
                        value={[this.props.searchFilters.searchFilters[entry.min_variable], this.props.searchFilters.searchFilters[entry.max_variable]]}
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
                        defaultValue={this.props.searchFilters.searchFilters[entry.min_variable]} 
                        onChange={this.onSliderChange} />
                    to 
                    <input 
                        type="number" 

                        name={entry.max_variable} 
                        min={entry.min_variable} 
                        max={entry.max_value} 
                        defaultValue={this.props.searchFilters.searchFilters[entry.max_variable]} 
                        onChange={this.onSliderChange} />

                </React.Fragment>
            default:
                return ""
            } }

        return React.createElement("div", {key: "sf_wrap_" + index}, input())
    }

    render() {
        const showFilterClass = this.props.searchFilters.searchFiltersHidden ? "open" : "closed"

        return (
            <div>
                <div className="search-filters">
                    <h3 onClick={this.toggleFilter}>Filter Search</h3>
                </div>
                
                <div className={showFilterClass +" search-fields"} >
                    <a className="search-close" onClick={this.toggleFilter}>x</a>
                    <h4>Filter Search</h4>
                    
                    {this.props.extensions.searchFilter[this.props.index].settings.map( filter => {
                        return this.buildSections(filter)
                    })}

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