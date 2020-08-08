import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getSingleProductThunk,
  increaseQuantity,
  decreaseQuantity,
} from "../store/singleProduct";

export class SingleProduct extends Component {
  constructor() {
    super();
    this.state = {
      quantity: 0,
      subtotal: 0,
    };

    this.increase = this.increase.bind(this);
    this.decrease = this.decrease.bind(this);
    this.getSubtotal = this.getSubtotal.bind(this);
    this.addToCart = this.addToCart.bind(this);
  }
  componentDidMount() {
    this.props.getSingleProduct(this.props.match.params.id);
    // we call this.getSubtotal when we refresh but
    // this.getSubtotal();
  }
  increase() {
    this.setState({ ...this.state, quantity: (this.state.quantity += 1) });
    this.getSubtotal();
  }
  decrease() {
    if (this.state.quantity === 0) {
      this.getSubtotal();
    } else {
      this.setState({ ...this.state, quantity: (this.state.quantity -= 1) });
      this.getSubtotal();
    }
  }
  getSubtotal() {
    this.setState({
      ...this.state,
      subtotal: this.state.quantity * this.props.product.price,
    });
  }

  addToCart() {
    //productId would be this.props.match.params.id
    let productId = this.props.match.params.id;
    let quantity = console.log("add to cart clicked in single products");
    // call thunk to put item in cart in backend
    //
    // create cart or add to current cart
  }

  render() {
    const { name, imageUrl, description, category, price } = this.props.product;
    const quantity = this.state.quantity;
    const subtotal = this.state.subtotal;
    return (
      <div>
        <div>
          <h2>{name}</h2>
          <img src={imageUrl} />
          <p>Price: {price}</p>
          <p>Category: {category}</p>
          <p>Product Info: {description}</p>
        </div>
        <div>
          <p>Quantity: {quantity}</p>
          <p>Subtotal: {subtotal} </p>
          <button type="button" size="small" onClick={this.increase}>
            +
          </button>
          <button type="button" size="small" onClick={this.decrease}>
            -
          </button>

          <button type="button" onClick={this.addToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    );
  }
}
// on "addtocart" submit, we want to POST a request to database AND local storage, reset view, and
// redirect to cart component - > this might eleminate the need to reset.
// ^ see if our window.localstorage object has orderId, if NOT then we create an orderId and set it in the local storage
// ^ use utility functions
// ^ while checking, we need to update localState to quantity 0, rerendering the quantity view
// Local state in SingleProduct for quantity, productId/info
//
const mapStateToProps = (state) => ({
  product: state.product,
});
const mapDispatchToProps = (dispatch) => ({
  getSingleProduct: (id) => dispatch(getSingleProductThunk(id)),
  increaseQuantity: (id) => dispatch(increaseQuantity(id)),
  decreaseQuantity: (id) => dispatch(decreaseQuantity(id)),
});
export default connect(mapStateToProps, mapDispatchToProps)(SingleProduct);
