// we gonna need this to refresh the function
import { useState } from "react-test";


function Counter() {
    const [clickedTimes, setClickedTimes] = useState(0);
        // these names to match by the way

    function add() {
        setClickedTimes(clickedTimes + 1);
        // console.log("Counter " + clickedTimes)
    }
    function subtract() {
        setClickedTimes(clickedTimes - 1);
        // console.log("Counter " + clickedTimes)
    }

    return(
        <div>
            <h1> I have been clicked {clickedTimes} times </h1>
            <button onClick={add}>Add</button> <button onClick={subtract}>Subtract</button>
        </div>   
    )
}

export default Counter;