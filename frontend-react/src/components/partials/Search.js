import React, { Component } from 'react';
import SearchInput, {createFilter} from 'react-search-input'
import SearchOrder from './search/SearchOrder';
import SearchPagination from './search/SearchPagination';
import ProductRow from './search/ProductRow';
import axios from "axios/index";

class SearchBar extends Component {

    constructor (props) {
        super(props);
        this.state = {
            searchTerm: '',
            prevSearchTerm: '',
            products: [],
            suggestions: [],
        };

        this.apiUrl = '/proxy/proxy.php?q=';
        this.state.searchTerm = "Дрели";

        this.apiSearch();

        this.searchUpdated = this.searchUpdated.bind(this)
    }

    apiSearch(){
        axios({
            method:'post',
            url: this.apiUrl + '/search',
            data: {
                "query": this.state.searchTerm
            },
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => {
            const products = res.data.products;
            this.setState({ products });
        });
    }

    apiSuggest(){
        axios({
            method:'post',
            url: this.apiUrl + '/suggest',
            data: {
                "query": this.state.searchTerm
            },
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => {
            const suggestions = res.data;
            this.setState({ suggestions });
        });
    }

    render() {

        if(this.state.searchTerm != this.state.prevSearchTerm){
            this.state.prevSearchTerm = this.state.searchTerm;

            this.apiSearch();
            this.apiSuggest();
        }

        return (
            <div>
                <div className="input-group">
                    <SearchInput className="search-input" onChange={this.searchUpdated} />
                    <span className="input-group-btn">
                        <button className="btn search-btn btn-primary" type="button"><i className="fa fa-search"></i></button>
                    </span>
                </div>

                {/*<div className="input-group">
                    <input type="text" className="form-control" value="web development"/>
                    <span className="input-group-btn">
                        <button className="btn search-btn btn-primary" type="button"><i className="fa fa-search"></i></button>
                    </span>
                </div>*/}

                <div className="padding"></div>

                <div>
                    <strong>Suggestions:</strong>

                    {this.state.suggestions.map(function(suggestion, i){
                        return <span>
                            <br/>{suggestion.name}
                        </span>;
                    })}
                </div>

                <div className="padding"></div>

                <p>
                    <strong>
                        Showing all results matching "{this.state.searchTerm}"
                    </strong>
                </p>

                <SearchOrder/>

                <div className="table-responsive">
                    <table className="table table-hover">
                        <tbody>
                            {this.state.products.map(function(product, i){
                                return <ProductRow product={product} key={i} />;
                            })}
                        </tbody>
                    </table>
                </div>

                <SearchPagination/>

            </div>
        );
    }

    searchUpdated (term) {
        this.setState({searchTerm: term})
    }
}

export default SearchBar;