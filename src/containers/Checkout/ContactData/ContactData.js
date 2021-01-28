import React,{ Component } from "react";

import {connect } from 'react-redux'

import Spinner from "../../../components/UI/Spinner/Spinner";
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';  
import * as actions from '../../../store/actions/index';

class ContactData extends Component{
    state = {
        orderForm:{
            
            name:{
                elementType: 'input',
                elementConfig : {
                    type: 'text',
                    placeholder:'Your Name'
                },
                value:'',
                validation : {
                    required : true
                },
                valid : false,
                touched:false
            },
            street : {
                elementType: 'input',
                elementConfig : {
                    type: 'text',
                    placeholder:'Street'
                },
                value:'',
                validation : {
                    required : true
                },
                valid : false,
                touched:false
            },
            zipcode: {
                elementType: 'input',
                elementConfig : {
                    type: 'text',
                    placeholder:'Your ZIP code'
                },
                value:'',
                validation : {
                    required : true,
                    minLength:5,
                    maxLength:5
                },
                valid : false,
                touched:false
            },
            country: {
                elementType: 'input',
                elementConfig : {
                    type: 'text',
                    placeholder:'Country'
                },
                value:'',
                validation : {
                    required : true
                },
                valid : false,
                touched:false
            },
            email : {
                elementType: 'input',
                elementConfig : {
                    type: 'email',
                    placeholder:'Your E-Mail'
                },
                value:'',
                validation : {
                    required : true
                },
                valid : false,
                touched:false
            },
            
            deliveryMethod: {
                elementType: 'select',
                elementConfig : {
                   options: [
                       {value:'fastest', displayValue:'Fastest'},
                       {value:'cheapest', displayValue:'Cheapest'},
                   ]
                },
                value:'fastest',
                validation :{},
                valid:true
            },
        },
        formIsValid:false
        
    }

    checkValidity(value,rules){
        let isValid = true;
        if(!rules){
            return  false;
        }

        if(rules.required ){
            isValid = value.trim() !== '' && isValid; 
        }
        if(rules.minLength){
            isValid = value.trim().length >= rules.minLength && isValid;
        }
        if(rules.maxLength ){
            isValid = value.trim().length <= rules.maxLength && isValid;
        }

        return isValid;
    }

    orderHandler = (event) =>{
        event.preventDefault();
        
        this.setState({loading:true})

        const formData = {};
        for(let formElementIdentifier in this.state.orderForm){
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }

        const order = {
            ingredients : this.props.ings,
            price: this.props.price,
            orderData : formData
        }
        
        this.props.onOrderBurger(order);

        
    }

    inputChangedHandler = (event,inputIndentifier) => {
        const updatedOrderForm = {
            ...this.state.orderForm
        };
        const updatedFormElement = {
            ...updatedOrderForm[inputIndentifier]
        };
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value,updatedFormElement.validation);
        updatedFormElement.touched = true;
        updatedOrderForm[inputIndentifier] = updatedFormElement;
       // console.log(updatedFormElement);

        let formIsValid = true;
        for(let inputIndentifier in updatedOrderForm){
            //console.log(formIsValid);
            formIsValid = updatedOrderForm[inputIndentifier].valid && formIsValid;
        }

        this.setState({orderForm:updatedOrderForm,formIsValid:formIsValid});
    }

    render(){

        const formElementsArray = [];
        for(let key in this.state.orderForm){
             formElementsArray.push({
                 id:key,
                 config:this.state.orderForm[key]
             })
        }

        let form = (<form onSubmit={this.orderHandler}>
            
            {formElementsArray.map(formElement => (
                <Input 
                    invalid={!formElement.config.valid}
                    changed={(event) => this.inputChangedHandler(event,formElement.id)}
                    key={formElement.id}
                    elementType={formElement.config.elementType} 
                    shouldValidate={formElement.config.validation}
                    touched={formElement.config.touched}
                    elementConfig={formElement.config.elementConfig} value={formElement.config.value}/>
            ))}
            <Button disabled={!this.state.formIsValid}  btnType="Success">ORDER</Button>
        </form>);
        if(this.props.loading){
            form = <Spinner />;
        }

        return(
            <div className={classes.ContactData}>
                <h4>
                    Enter your Contact Data
                </h4>
                {form}
            </div>
        );
    }


}
const mapStateToProps =state=>{
    return{
        ings:state.burgerBuilder.ingredients,
        price:state.burgerBuilder.totalPrice,
        loading: state.order.loading
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        onOrderBurger: (orderData)=> dispatch(actions.purchaseBurger(orderData))
    };
    
}

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(ContactData,axios));