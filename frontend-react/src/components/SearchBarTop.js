import React, { useState } from 'react'
import { Link } from "react-router-dom";

import { useHistory } from "react-router-dom";

import qlogo from "../qhunt.png";


function SearchBarTop({ term }) {
    const [searchFor, setSearchFor] = useState("");
    const history = useHistory();

    const triggerSearch = (e) => {
        e.preventDefault();
    
        if (searchFor) {
          
          setTimeout(() => history.push(`/search/${encodeURI(searchFor)}`));
        }
      };


    return (
        <nav className="nav-yapa-mwamba">
            <Link to="/">
                <img className="foresight-logo logo-yapa-mwamba" alt="Qsearch" src={qlogo} />
            </Link>

            <form onSubmit={triggerSearch}>
                <input
                 value={searchFor}
                onChange={(e) => {
                    setSearchFor(e.target.value);
                }}
                type="search"
                placeholder={term} />
                <button type="submit">Search</button>
            </form>

            <div>
                {/* <a href="#!">QHUNT </a> */}
            </div>
        </nav>
    )
}

export default SearchBarTop
