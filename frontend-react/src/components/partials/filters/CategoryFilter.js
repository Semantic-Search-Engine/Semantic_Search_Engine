import React, { Component } from 'react';

class CategoryFilter extends Component {

    render() {
        return (
            <div>
                <h4>By category:</h4>

                <div className="checkbox">
                    <label><input type="checkbox" className="icheck"/> Application</label>
                </div>
                <div className="checkbox">
                    <label><input type="checkbox" className="icheck"/> Design</label>
                </div>
                <div className="checkbox">
                    <label><input type="checkbox" className="icheck"/> Desktop</label>
                </div>
                <div className="checkbox">
                    <label><input type="checkbox" className="icheck"/> Management</label>
                </div>
                <div className="checkbox">
                    <label><input type="checkbox" className="icheck"/> Mobile</label>
                </div>
            </div>
        );
    }
}

export default CategoryFilter;