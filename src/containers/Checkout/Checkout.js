import React, {useState} from 'react';
import {Route} from 'react-router-dom';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';
import {connect} from 'react-redux';
//====================================
const Checkout = props => {
 
//--------------------------------------
  const checkoutCancelledHandler = () => {
    props.history.goBack();
  };
  const checkoutContinuedHandler = () => {
    props.history.replace('/checkout/contact-data');
  };
  return (
    <div>
      <CheckoutSummary
        ingredients={props.ings}
        checkoutCancelled={checkoutCancelledHandler}
        checkoutContinued={checkoutContinuedHandler}
      />
      <Route 
        path={props.match.path + '/contact-data'} 
        component={ContactData} 
      />
    </div>
  );
};


const mapStateToProps = state =>{
  return {
    ings:state.ingredients,
    price:state.ingredients
  }
}

export default connect(mapStateToProps)(Checkout);