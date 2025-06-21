import bcrypt from "bcrypt";

async function verify_user (user){
    try{
        let regex = /^[a-zA-Z0-9_#]{4,14}$/;
        const username_test = regex.test(user.username);
        regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@#$_^]{8,16}$/;
        const password_test = regex.test(user.password);
        regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;;
        const email_test = regex.test(user.email);
        
        if(!parseInt(user.phone_number)){
            user.err = "enter valid phone number"
        }
        if(!username_test){
            user.err = "username can have characters , numbers , _ ,# only and must be 4-14 characters"
        }
        
        if(!password_test){
            user.err = "passowrds must have characters , numbers , _ ,#,@,$  and must be 8-16 characters"
        }

        if(!email_test){
            user.err = "enter a valid email (ex : kir@au.ca)";
        }
        
        if(user.err){return;}
        
        user.password = await bcrypt.hash(user.password , 12);
        
    }catch(e){
        user.err = "server error please try again";
    }

}

export default verify_user;