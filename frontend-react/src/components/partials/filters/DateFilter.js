import React, { Component } from 'react';

class DateFilter extends Component {

    render() {
        return (
            <div>
                <h4>By date:</h4>
                From
                <div className="input-group date form_date" data-date="2014-06-14T05:25:07Z" data-date-format="dd-mm-yyyy" data-link-field="dtp_input1">
                    <input type="text" className="form-control"/>
                    <span className="input-group-addon bg-blue"><i className="fa fa-th"></i></span>
                </div>
                <input type="hidden" id="dtp_input1" value=""/>

                To
                <div className="input-group date form_date" data-date="2014-06-14T05:25:07Z" data-date-format="dd-mm-yyyy" data-link-field="dtp_input2">
                    <input type="text" className="form-control"/>
                    <span className="input-group-addon bg-blue"><i className="fa fa-th"></i></span>
                </div>
                <input type="hidden" id="dtp_input2" value=""/>
            </div>
        );
    }
}

export default DateFilter;