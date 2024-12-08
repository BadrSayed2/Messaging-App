// sign up with google
// or write email password name and contact number

import { useState,useRef } from "react";
import axios from '../../utilities/axios_setup.js';

// request contacts and save in database
function Sign_up(){

    const user  = useRef({username : "", email : "" , phone: "" , password:""  });
    const repeat = useRef("");
    const [err , setErr] = useState("");
    const [success , setSuccess] = useState(false);

    const handle_sign_up = async (e)=>{
        e.preventDefault();

        if(repeat.current != user.current.password){
            setErr("the repeat password and password does not match")
            return ;
        }

        const req = await axios.post('/user/sign_up',user);
        const res = req.data;
        if(res.already_exist){
            setErr("this user already exist please login")
            return;
        }
        if(res.success){

            setSuccess(true);
            setErr("");
        } else {
            setErr(res.message);
        }

     }
     
     return(
         <div>
             <form action="">
                 
                 <label for="username">username</label>
                 <input type="text"  name = "username" onChange={(e)=>{user.current.username = e.target.value}}/>

                 <label for="email">email</label>
                 <input type="text"  name = "email" onChange={(e)=>{user.current.email = e.target.value}}/>
                 
                 <label for="phone">phone</label>
                 <input type="text"  name = "phone"onChange={(e)=>{user.current.phone = e.target.value}}/>
                 
                 <label for="password">password</label>
                 <input type="password" name="password" onChange={(e)=>{user.current.password = e.target.value}}/>
                
                 <label for="r_password">repeat password</label>
                 <input type="password" name="r_password" onChange={(e)=>{repeat.current = e.target.value}}/>
 
                 <button type="submit" onClick={handle_sign_up}>sign_up</button>
             </form>
            {err?<h4>{err}</h4> : ""}
            {success?<h4>you successfully signed up right please login</h4> : ""}
         </div>
     );
}


export default Sign_up;