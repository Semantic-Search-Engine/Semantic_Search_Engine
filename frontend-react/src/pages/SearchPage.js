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

  const history = useHistory();
  useEffect(() => {
    const options = {
      method: "POST",
      url:'http://0.0.0.0:9000/find?q='+term
        
      ,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if(term) {
      axios
      .request(options)
      .then((response) => {
        // const posts = [];
        // for (let key in response.data){
        //   posts.push({...response.data[key],id: key });
          
        // }
        // this.setState({
        //   posts:posts,
        // });


        var json_res=JSON.parse(response.data)
        setReturnedSearch(json_res);
        // setReturnedAnswers(json_res);
        setIsLoading(false);
        console.log((term+response.data))
        // document.write(Object.values(json_res)[1])
        
        document.write("<body style='color: white;background-color: black;'>")
        for (var i in Object.values(json_res)[1])
        { 
          document.write("<div id=res>")
          // document.write("<b>index: </b>"+Object.values(json_res)[1][i])
          document.write("</br><b>Title : ")
          document.write(Object.values(json_res)[2][i][1])
          document.write("</b></br>")
          document.write("<b>Abstract</b> </br>")
          document.write(Object.values(json_res)[2][i][2])
          document.write("</br><b>Authors</b>: " +Object.values(json_res)[2][i][3])
          document.write("</br><b>Year</b>:" + Object.values(json_res)[2][i][0]) 
          document.write("</br><a href='https://www.google.com/search?q="+Object.values(json_res)[2][i][1]+"'target='_blank'>Link to DOI</a>")

          document.write("</div>")
        }
        document.write("</body>")
        

        // document.write(Object.values(json_res)[2][0][2])
        // for (var i in Object.keys(json_res))
        // {
        //   document.write(Object.keys(json_res)[i])
          
          
        // }
        // ;
        

        // function parse(json_res)
        // {}
      
      })
      .catch(function (error) {
        console.error(error);
      });
    }else {
      setTimeout(() => history.push(`/?search=${encodeURI(term)}`));

    }
  }, [term]);

  // render(){{}


  //   const posts = this.state.posts.map((post) => {
  //     return <Post key={post.id} post={post}/>;

  //   });

  //   return(
  //     <div>
  //       <h1 className='font-bold text-xl my-3'> Post Data</h1>
  //     </div>
  //   );

  // }
  
  return (
    <section>

      <SearchBarTop term={term} />
    <div>
      <ul>
        {isLoading && <LoadingState />}
        {/* {returnedSearch.map((data, index) => (
            <li className="ka-box-one-search" key={index}>
              <h3><a href={data[0]}>{data[0]}</a></h3>
              <pre>{data[0]}</pre>
              <p>{data[1]}</p>
              <div>
                {result.additional_links.map((link,index) => (
                  <a href={link.href}>{link.text} | </a>
                ))}
              </div>
            </li>
          ))} */
          }
          
          {/* document.write(Object.keys(returnedSearch).map(key,index) */}

            
      </ul>
    </div>

    </section>
  );


}

export default Search;
