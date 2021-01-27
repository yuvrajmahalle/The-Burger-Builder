import React,{Component} from 'react';
import {connect} from 'react-redux';

import Aux from '../../hoc/Auxi/Auxi';
import Burger from '../../components/Burger/Burger';
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actionTypes from '../../store/action';



class BurgerBuilder extends Component {
/*
    constructor(props){
        super(props);
        this.state ={../}
    }
*/

    state = {
        purchasing:false,
        loading:false,
        error:false
    }

    componentDidMount(){
       /* axios.get('https://react-my-burger-a928a-default-rtdb.firebaseio.com/ingredients.json')
        .then(response => {
            this.setState({ingredients:response.data})
        }).catch(error => {
            this.setState({error:true})
        }) */
    }

    updatePurchaseState (ingredients) {
         
        const sum = Object.keys(ingredients)
        .map(igKey => {
            return ingredients[igKey]
        })
        .reduce((sum,el)=>{
            return sum+el;
        },0);

        return sum>0;
    }

    purchaseHandler = () => {
        this.setState({purchasing:true})
    }
 
    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        this.props.history.push('/checkout');
    }

    render(){

        const disabledInfo = {
            ...this.props.ings
        }
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null;
        let burger = this.state.error ? <p>ingredients can't be loaded</p> : <Spinner />;

        if(this.props.ings){
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings}/>
                    <BuildControls
                     disabled={disabledInfo} 
                     ingredientAdded={this.props.onIngredientAdded}
                     ingredientRemove={this.props.onIngredientRemoved} 
                     price={this.props.price}
                     ordered={this.purchaseHandler}
                     purchaseable={this.updatePurchaseState(this.props.ings)}
                     />
                </Aux>
            );

            orderSummary = <OrderSummary 
            price={this.props.price}
            purchaseCancelled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler}
            ingredients={this.props.ings}/>;
        }

          
        if(this.state.loading){
            orderSummary = <Spinner />;
        }
 
        return(
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                 {burger}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return{
        ings: state.ingredients,
        price: state.totalPrice
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
        onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(BurgerBuilder,axios));