import { useEffect, useState } from "react";
import Contacts from "./contacts";
import Conv from "./conv";
import axios from "axios";


function Dashboard_manager(probs){

    //search using name or phone among all users that are yours

    //option to add friend
    const user_id = probs.user;

    const [conv , setConv] = useState('');
    const sartConversation = async(chat)=>{
        setConv(chat);

    }
    const closeConv = ()=>{
        setConv('');
    }
    //if click on a contact get the conversation 

    //nav bar

    return(
        <>
            <Contacts startConv = {sartConversation} user = {user_id}></Contacts>
            {conv? <Conv conv_id = {conv} closeConv={closeConv} sender = {user_id}></Conv> : <div></div>}
            
        </>    
    );
}

export default Dashboard_manager;