import React, { Component } from 'react';

class SearchPagination extends Component {

    render() {
        return (
            <ul className="pagination">
                <li className="disabled"><a href="#">«</a></li>
                <li className="active"><a href="#">1</a></li>
                <li><a href="#">2</a></li>
                <li><a href="#">3</a></li>
                <li><a href="#">4</a></li>
                <li><a href="#">5</a></li>
                <li><a href="#">»</a></li>
            </ul>
        );
    }
}

export default SearchPagination;