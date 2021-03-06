import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import {
  getSingleProductThunk,
  increaseQuantity,
  decreaseQuantity,
} from "../store/singleProduct";
import { getCartThunk, createCartThunk, addToCartThunk } from "../store/cart";
import { me } from "../store/user";

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
    this.addToCartHandler = this.addToCartHandler.bind(this);
  }

  async componentDidMount() {
    await this.props.getSingleProduct(this.props.match.params.id);
    await this.props.getUser();
    if (this.props.user) {
      await this.props.getCart(this.props.user.id);
    }
  }
  async addToCartHandler() {
    console.log("Add To Cart Clicked!");
    const productId = this.props.match.params.id;
    const quantity = this.state.quantity;
    // const userId = window.localStorage.getItem("userId");

    if (!this.props.user.id) {
      window.localStorage.setItem(productId, quantity);
      console.log("LOCALSTORAGE STUFF", window.localStorage);
      return "your item is added to cart";
    }

    const userId = this.props.user.id;
    console.log("able to get userId in props in addToCartHandler", userId);
    console.log("cart before creating cart", this.props.cart); // undefined

    // create cart if we dont have one
    if (this.props.cart === undefined) {
      await this.props.createCart(userId);
      await this.props.getCart(userId);
      const orderId = this.props.cart.id;
      console.log(orderId, "can get orderId after creating cart");
      await this.props.addToCart(orderId, productId, quantity);
      this.setState({ ...this.state, quantity: 0, subtotal: 0 });
    } else {
      const orderId = this.props.cart.id;
      console.log(orderId, "can get order id if we already have cart");
      await this.props.addToCart(orderId, productId, quantity);
      this.setState({ ...this.state, quantity: 0, subtotal: 0 });
    }
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
      subtotal: (this.state.quantity * this.props.product.price).toFixed(2),
    });
  }

  render() {
    console.log("props in singleproduct", this.props);
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
          {/* <NavLink to="/cart"> */}
          <button type="submit" onClick={this.addToCartHandler}>
            Add To Cart
          </button>
          {/* </NavLink> */}
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
  user: state.user,
  product: state.product,
  cart: state.cart,
});
const mapDispatchToProps = (dispatch) => ({
  getSingleProduct: (id) => dispatch(getSingleProductThunk(id)),
  increaseQuantity: (id) => dispatch(increaseQuantity(id)),
  decreaseQuantity: (id) => dispatch(decreaseQuantity(id)),
  getUser: () => dispatch(me()),
  getCart: (userId) => dispatch(getCartThunk(userId)),
  createCart: (userId) => dispatch(createCartThunk(userId)),
  addToCart: (orderId, productId, quantity) =>
    dispatch(addToCartThunk(orderId, productId, quantity)),
});
export default connect(mapStateToProps, mapDispatchToProps)(SingleProduct);
