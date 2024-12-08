
import { useState } from "react";
import Sign_up from "./sign_up";
import Login from "./login";


function Auth_manager(props){
    const return_func = props.return_func;

    const [user , setUser] = useState('login');
    return(
        <div>
            <button onClick={()=>{setUser('login')}}>login</button>
            <button onClick={()=>{setUser('Sign_up')}}>Sign_up</button>
            {(user == 'login')? 
            <Login return_func={return_func}></Login>:
            <Sign_up></Sign_up>
            }
        </div>
    );
}


export default Auth_manager;