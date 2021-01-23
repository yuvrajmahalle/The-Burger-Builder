import React, {useState} from 'react';
import {Route} from 'react-router-dom';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';
//====================================
const Checkout = props => {
  const initState = () => {
    const queryInit = new URLSearchParams(
      props.location.search
    );
    const ingredientsInit = {};
    let priceInit = 0;
    for (let param of queryInit.entries()) {
      if (param[0] === 'price') {
        priceInit = param[1];
      } else {
        ingredientsInit[param[0]] = +param[1];
      }
    }
    return {
      ingredients: ingredientsInit,
      totalPrice: priceInit
    };
  };
  const [state] = useState(initState());
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
        ingredients={state.ingredients}
        checkoutCancelled={checkoutCancelledHandler}
        checkoutContinued={checkoutContinuedHandler}
      />
      <Route 
        path={props.match.path + '/contact-data'} 
        render={
          props => (
            <ContactData
              ingredients={state.ingredients}
              price={state.totalPrice}
              {...props}
            />
          )
        }
      />
    </div>
  );
};
export default Checkout;