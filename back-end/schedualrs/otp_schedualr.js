import node_cron from 'node-cron'
import { PrismaClient } from '@prisma/client'
import { configDotenv } from 'dotenv';
configDotenv();

const user_schedular = {}
const prisma = new PrismaClient()

user_schedular.remove_expired_otp =  async function remove_expired_otp(){
    try{

        node_cron.schedule( '*/2 * * * *' , async ()=>{
            // console.log("schedular is runnig")
            await prisma.$transaction([
                prisma.oTP.deleteMany({where : {expire_at : { lt : new Date()} }}),
                prisma.user.deleteMany({where : { AND : [
                    {verified : false},
                    {OR : [
                        {otp : null},
                        {otp : { expire_at : {lt : new Date()}}}
                    ]}
                ]}})
            ])
            // console.log("schedular finised")
        })
    }  catch(e){
        // console.log(e.message)
    }
}

export default user_schedular