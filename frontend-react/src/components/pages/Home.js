import React, { Component } from 'react';
import Filters from '../partials/Filters';
import Search from '../partials/Search';

class Home extends Component {

    render() {

        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="grid search">
                            <div className="grid-body">
                                <div className="row">

                                    <Filters/>

                                    <div className="col-md-9">
                                        <h2>
                                            <i className="fa fa-file-o"></i>&nbsp;
                                            220V Search Result
                                        </h2>
                                        <hr/>

                                        <Search/>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;