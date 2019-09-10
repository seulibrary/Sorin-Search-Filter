import React, { Component } from "react"

import { connect } from "react-redux"

class SearchFilterButton extends Component {
    toggleFilter = () => {
        this.props.dispatch({
            type: "SEARCH_FILTER_SETTING",
            propertyName: "searchFiltersHidden",
            payload: !this.props.searchFilters.searchFiltersHidden
        })
    }

    render() {
        const showFilterClass = this.props.searchFilters.searchFiltersHidden ? "open" : "closed"

        return (
        <div className="search-filter-button" onClick={this.toggleFilter} >
            <span className={showFilterClass + " filter"}>Filter<span id="search-arrow"></span></span>
        </div>)
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
)(SearchFilterButton)