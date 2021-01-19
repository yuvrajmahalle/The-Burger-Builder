import React from 'react';
import classes from './BuildControl.css';


const buildControl = (props) => (
    <div className={classes.BuildControl}>
        <div className={classes.Label}>{props.label}</div>
        <button disabled={props.disabled} onClick={props.remove}  className={classes.Less}>Remove</button>
        <button onClick={props.added} className={classes.More}>Add</button>
    </div>
)


export default buildControl;