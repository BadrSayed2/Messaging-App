// email password
// or login with google (cannot login with email is not in database)
import { useRef ,useState } from "react";
import axios from '../../utilities/axios_setup.js';

function Login(props){

    const user  = useRef({username : "", password:""  });
    const [err , setErr] = useState("");

    const handle_login = async (e)=>{
        e.preventDefault();
        const response = await axios.post('/login',user);
        const res = response.data;
        if(res.success){
            setErr("");
            const date = new Date();
            date.setDate(date.getDate() + 7); 
            document.cookie += `auth=` + res.token+`; expires=${date.toUTCString()}; path=/;`;
            props.return_func();
        } else {
            setErr(res.message);
        }
    }
    
    return(
        <div>
            <form action="">
                
                <label for="email">email or phone</label>
                <input type="text"  name = "email" onChange={(e)=>{user.current.username = e.target.value}}/>
                
                <label for="password">password</label>
                <input type="password" name="password" onChange={(e)=>{user.current.password = e.target.value}}/>

                <button type="submit" onClick={handle_login}>login</button>
            </form>
        {err? <h4>{err}</h4>: ""}
        </div>
    );
}

export default Login;