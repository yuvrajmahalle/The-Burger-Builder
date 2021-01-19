import React from 'react';
import classes from './BuildControl.css';


const buildControl = (props) => (
    <div className={classes.BuildControl}>
        <diV className={classes.Label}>{props.label}</diV>
        <button className={classes.Less}>Remove</button>
        <button onClick={props.added} className={classes.More}>Add</button>
    </div>
)


export default buildControl;