import React, { Component } from 'react';

class SearchOrder extends Component {

    render() {
        return (
            <div className="row">
                <div className="col-sm-6">
                    <div className="btn-group">
                        <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
                            Order by <span className="caret"></span>
                        </button>
                        <ul className="dropdown-menu" role="menu">
                            <li><a href="#">Name</a></li>
                            <li><a href="#">Date</a></li>
                            <li><a href="#">View</a></li>
                            <li><a href="#">Rating</a></li>
                        </ul>
                    </div>
                </div>

                <div className="col-md-6 text-right">
                    <div className="btn-group">
                        <button type="button" className="btn btn-default active"><i className="fa fa-list"></i></button>
                        <button type="button" className="btn btn-default"><i className="fa fa-th"></i></button>
                    </div>
                </div>
            </div>
        );
    }
}

export default SearchOrder;