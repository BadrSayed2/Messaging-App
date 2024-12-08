import verify_login from './utilities/verify_login';
import cookies from 'js-cookie';
import Auth_manager from './components/auth/auth_manager';
import Dashboard_manager from './components/dashboard/dashboard_manager';
import { useEffect, useState } from 'react';

export default function App(){
    const [user , setUser] = useState(false);
    const [logged_in,setLogged_in] = useState(false);
    const trigger_login = ()=>{
        setLogged_in(true);
    }
    useEffect( ()=>{
        const verify = async()=>{
            setUser( await verify_login() ) ;
        }
        verify();
    }, []);
    if( !user){return(<Auth_manager return_func={trigger_login}/>)}
    else {return(<Dashboard_manager user = {user}/>)}
    
}