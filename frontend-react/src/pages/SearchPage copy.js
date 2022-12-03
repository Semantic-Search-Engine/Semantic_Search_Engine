import { render } from "@testing-library/react";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { Component } from "react/cjs/react.production.min";
import "../App.scss";

import LoadingState from "../components/LoadingState";
import SearchBarTop from "../components/SearchBarTop";

// export class Search extends React.Component{
//   constructor(props){
//     super(props);
//     this.state = {
//       post:[],
//     };
//   }
// }
function Search() {
  let {term} = useParams();

  const [returnedSearch, setReturnedSearch] = useState([]);
  const [returnedAnswers, setReturnedAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  setReturnedSearch=JSON.parse(response.data)
  {returnedSearch.map((result, index) => (
    <li className="ka-box-one-search" key={index}>
      <h3><a href={result.title}>{result.title}</a></h3>
      <pre>{result.title}</pre>
      <p>{result.abstract}</p>
      <div>
        {/* {result.additional_links.map((link,index) => (
          <a href={link.href}>{link.text} | </a>
        ))} */}
      </div>
    </li>
  ))}
  

}

export default Search;
