import React, { Component } from 'react';
import CategoryFilter from './filters/CategoryFilter';
import DateFilter from './filters/DateFilter';
import PriceFilter from './filters/PriceFilter';

class Filters extends Component {

    render() {
        return (
            <div className="col-md-3">
                <h2 className="grid-title"><i className="fa fa-filter"></i> Filters</h2>
                <hr/>

                <CategoryFilter/>

                <div className="padding"></div>

                <DateFilter/>

                <div className="padding"></div>

                <PriceFilter/>
            </div>
        );
    }
}

export default Filters;