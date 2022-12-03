import React, { Component } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import Home from '../pages/Home';
import About from '../pages/About';

import { Route } from 'react-router-dom'

class MainLayout extends Component {
  render() {
    return (
        <div className="primary-layout">

            <Header/>

            <main>
                <Route path="/" exact component={Home} />
                <Route path="/about" exact component={About} />
            </main>

            <Footer/>

        </div>
    );
  }
}

export default MainLayout;
