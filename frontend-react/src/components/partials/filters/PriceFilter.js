import React, { Component } from 'react';

class PriceFilter extends Component {

    render() {
        return (
            <div>
                <h4>By price:</h4>
                Between
                <div id="price1">$300</div> to <div id="price2">$800</div>

                <div className="slider-primary">
                    <div className="slider slider-horizontal" styles={{width: '152px'}}>
                        <div className="slider-track">
                            <div className="slider-selection" styles={{left: '30%', width: '50%'}}></div>
                            <div className="slider-handle round" styles={{left: '30%'}}></div>
                            <div className="slider-handle round" styles={{left: '80%'}}></div>
                        </div>
                        <div className="tooltip top hide" styles="top: -30px; left: 50.1px;">
                            <div className="tooltip-arrow"></div>
                            <div className="tooltip-inner">300 : 800</div>
                        </div>
                        <input type="text" className="slider" value="" data-slider-min="0" data-slider-max="1000" data-slider-step="1" data-slider-value="[300,800]" data-slider-tooltip="hide"/>
                    </div>
                </div>
            </div>
        );
    }
}

export default PriceFilter;