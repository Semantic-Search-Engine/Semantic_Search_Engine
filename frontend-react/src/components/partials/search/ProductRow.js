import React, {Component} from 'react';

class ProductRow extends Component {

     /*getRateHtml(rate){
        rate = Math.round( rate * 10 ) / 10

        let html = '';
        for(let i=1; i<=5; i++){
            if(i<rate){
                html += '<i className="fa fa-star-o">';
            }
            else{
                html += '<i className="fa fa-star">';
            }
        }

        return html;
    }*/

    render() {

        let product = this.props.product;

        let rate = Math.floor(Math.random() * 5) + 1;
        let price = Math.round(product.price);

        return (

            <tr>
                <td className="number text-center">
                    {product.sku}
                    </td>
                <td className="image">
                    <img src="https://lorempixel.com/400/300/nature/4" alt=""/>
                </td>
                <td className="product">
                    <strong>{product.name}</strong>
                    <br/>{product.description}
                </td>
                <td className="rate text-right">
                    {/*{this.getRateHtml(rate)}*/}
                    <span>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star-o"></i>
                    </span>
                </td>
                <td className="price text-right">{price} руб.</td>
            </tr>
        );
    }
}

export default ProductRow;