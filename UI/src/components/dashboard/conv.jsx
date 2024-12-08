// name of the reciever

import { useEffect, useRef, useState } from "react";
import axios from "../../utilities/axios_setup.js";
import {io} from 'socket.io-client';
// messages

//able to write record and send images

function Conv (probs){
    //get conv id
    const sender_id = probs.sender;
    const socket = io('http://localhost:8080');
    
    const conv_id = probs.conv_id;
    
    //code to start connection
    // socket.emit('start_conversation' , conv_id); 

    const [messages , setMessages] = useState([]);
    const message  = useRef('');

    useEffect( ()=>{
        const fetch_data = async ()=>{

            const messages_list = await axios.get('/message/' + conv_id);
            setMessages([...messages_list.data]);
        }
        
        fetch_data();

        const handleMessageReceived = (new_message) => {
            setMessages((prev) => [...prev, new_message]);
        };

        socket.on('messageRecieved', handleMessageReceived);

        return () => {
            socket.off('messageRecieved', handleMessageReceived);
        };
    },[]);
    
    const handleClick =(e)=>{
        e.preventDefault();
        socket.emit('sent_message' , {conv_id , sender_id ,message : message.current});
    }
    
    return(
        <div>
            {messages.map(message =>( 
                <li className={(message.sender == sender_id )? "sender"  : "reciever"}>
                    {message.content}</li>
            ))}
            <form action="" method="post">
                <input name ="message" onChange={(e)=>{message.current = e.target.value}}></input>
                <button type="submit" onClick={handleClick}></button>
            </form>
            
        </div>
    )
}

export default Conv;