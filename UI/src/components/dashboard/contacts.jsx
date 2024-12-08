//load contacts that is stored in database and list image and name 
//search using name or contact
import { useRef, useState } from 'react';
import axios  from '../../utilities/axios_setup.js';
import {io} from 'socket.io-client';
const socket = io('http://localhost:8080');

function Contacts(probs){
    // api to get all friends from database
    
    const user_id = probs.user;
    const [contacts, setContacts] = useState([]);
    const added_contact = useRef('');
    useEffect(() => {
    // Simulate fetching data from the server
        const fetch_data = async ()=>{  
            const res = await axios.get('/contacts/'+ user_id )
            const chats = res.data.chats.map ((chat)=>{
                if(chat.first_user.id == user_id ){
                    return {id : chat.id , contact_id : chat.second_user.id ,username : chat.second_user.username};
                } else {
                    return {id : chat.id ,contact_id : chat.first_user.id, username : chat.first_user.username};
                }
            });
            
            for (const chat_obj of chats) {
                await io.emit('join-chat', { id: chat_obj.id }); 
            }

            setContacts([...chats ])
        }

        fetch_data();

  }, []);
    
    const handle_conv_open = probs.startConv;
    const [hide_add_form, setHide] = useState(true);
    
    const [add_err , set_add_err] = useState(false); 
    const add_friend_handler = async (e)=>{
        e.preventDefault();
        const res = await axios.post('/contacts/add/' + user_id  , {contact : added_contact.current});
        if(res.user_already_exist){set_add_err(true);}
        setContacts([...res.data.chats])
        setHide(true);
    }
    
    return(
        <div>
            <button onClick={()=>{setHide(!hide_add_form)}}>add new contact <span>+</span></button>
            { (hide_add_form) ? "" :
            <form action="">
                <input type="text" name='name' onChange={(e)=>{added_contact.current= e.target.value}} />
                <button type='submit' onClick={add_friend_handler}>add</button>
            </form>
              }
              {(add_err)? "user already exist" : ""}
            <div>
                {contacts.map(chat => <li key={chat.id} ><button onClick={handle_conv_open(chat.id)}>{chat.username}</button></li>  )}
            </div>
        </div>
    );
}

export default Contacts