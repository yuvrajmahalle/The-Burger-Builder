import React,{Component} from 'react';
import Aux from '../../hoc/Auxi/Auxi';
import Burger from '../../components/Burger/Burger';
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';

const INGREDIENT_PRICES = {
    salad : 0.3,
    cheese: 0.2,
    meat: 1.5,
    bacon: 0.5
};

class BurgerBuilder extends Component {
/*
    constructor(props){
        super(props);
        this.state ={../}
    }
*/

    state = {
        ingredients: {
            salad:0,
            bacon:0,
            cheese:0,
            meat:0
        },
        totalPrice : 4,
        purchaseable:false,
        purchasing:false,
        loading:false
    }

    updatePurchaseState (ingredients) {
         
        const sum = Object.keys(ingredients)
        .map(igKey => {
            return ingredients[igKey]
        })
        .reduce((sum,el)=>{
            return sum+el;
        },0);

        this.setState({purchaseable:sum>0})
    }

    purchaseHandler = () => {
        this.setState({purchasing:true})
    }

    addIngredientHandler = (type) =>{
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount+1;
        const updatedIngredients = {
            ...this.state.ingredients
        }

        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice+priceAddition;
        this.setState({totalPrice:newPrice, ingredients:updatedIngredients });
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) =>{
        const oldCount = this.state.ingredients[type];
        if(oldCount <= 0){
            return;
        }
        const updatedCount = oldCount-1;
        const updatedIngredients = {
            ...this.state.ingredients
        }

        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice-priceAddition;
        this.setState({totalPrice:newPrice, ingredients:updatedIngredients });
        this.updatePurchaseState(updatedIngredients);
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        this.setState({loading:true})
        const order = {
            ingredients : this.state.ingredients,
            price: this.state.totalPrice,
            customer:{
                name:'Ashish Mahalle',
                address: {
                    street : 'Test',
                    zipcode: '34324',
                    country: 'IND'
                },
                email : 'test@g.com',
            },
            deliveryMethod: 'fastest'
        }
        axios.post('/orders.json',order)
        .then(response => {
            this.setState({loading:false, purchasing: false})
        })
        .catch(error => {
            this.setState({loading:false, purchasing:false})
        });
        
        //alert('You continue!');
    }

    render(){

        const disabledInfo = {
            ...this.state.ingredients
        }
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = <OrderSummary 
        price={this.state.totalPrice}
        purchaseCancelled={this.purchaseCancelHandler}
        purchaseContinued={this.purchaseContinueHandler}
     ingredients={this.state.ingredients}/>;
        if(this.state.loading){
            orderSummary = <Spinner />;
        }

        return(
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                <Burger ingredients={this.state.ingredients}/>
                <BuildControls
                 disabled={disabledInfo} 
                 ingredientAdded={this.addIngredientHandler}
                 ingredientRemove={this.removeIngredientHandler} 
                 price={this.state.totalPrice}
                 ordered={this.purchaseHandler}
                 purchaseable={this.state.purchaseable}
                 />
            </Aux>
        );
    }
}

export default BurgerBuilder;