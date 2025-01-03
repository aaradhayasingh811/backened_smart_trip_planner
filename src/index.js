import dotenv from "dotenv"
dotenv.config({
    path: './.env'
})
import {app} from '../src/app.js'
import {connection} from "../src/db-connection/index.js"



connection().then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log('server is running on port',process.env.PORT);
    })
}).catch((err)=>{
    console.log(err)
})
