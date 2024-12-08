import axios from '../utilities/axios_setup.js';

async function verify_login(){
    const cookies = document.cookie.split(';')
    let auth_cookie = '';
    cookies.map((cookie)=>{
        let cookie_name = cookie.split('=')[0].trim();
        let cookie_value = cookie.split('=')[1];
        if (cookie_name == "auth"){auth_cookie = cookie_value}
    });
    
    if(!auth_cookie) {return false};

    try {
        const user = await axios.get('/verify_login/' + auth_cookie);
        if (user.data.success) {
            return user.data;
        } else {
            return false;  
        }
    } catch (error) {
        return false;  
    }
}

export default verify_login;