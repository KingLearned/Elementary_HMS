const express = require('express')
const route = express()
const PATH = require('path')
const MYSQL = require('./Conn')
const bodyparser = require('body-parser') 

route.use(bodyparser.urlencoded({extended: true}))
route.use(bodyparser.json())

const UserLoggedIn = (req, res, next) => {
    if(req.session.user){
        res.redirect(`/${req.session.checker}`)
    }else{
        next()
    }
}

const LoginGet = (req,res,next) => {
    res.sendFile(PATH.join(__dirname, '../Public/home.html'))

}

// const LoginPost = ''
const LoginPost = () => {
    const { username, position, pwd } = req.body

    if(username,position,pwd){
        console.log(username,position,pwd)
    
        // const query = "SELECT * FROM `hotel_users`"
        // MYSQL.query(query, (err, result) => {
        //     if(result){
        //         for (let i = 0; i < result.length; i++) {
        //             if((username == result[i].username)&&(position == result[i].position)&&(pwd == result[i].pwd)){
        //                 if(position == 'Front Office'){
        //                     req.session.position = position
        //                     req.session.user = username //UserLoggIn
        //                     req.session.roomcheck = position //CheckPermit
        //                     req.session.checker = 'Front-Office' //FOR KEEPING TRACK OF USER
        //                     res.redirect(`/Front-Office`)
        //                 }else if(position == 'Waiter Bar'){
        //                     req.session.position = position
        //                     req.session.user = username //UserLoggIn
        //                     req.session.bar = position //BarMan
        //                     req.session.checker = 'Bar-Office' //FOR KEEPING TRACK OF USER
        //                     res.redirect(`/Bar-Office`)
        //                 }else if(position == 'Restuarant'){
        //                     req.session.position = position
        //                     req.session.user = username //UserLoggIn
        //                     req.session.restman = position //Restuarant
        //                     req.session.checker = 'Restuarant-Office' //FOR KEEPING TRACK OF USER
        //                     res.redirect(`/Restuarant-Office`)
        //                 }else if(position == 'Administrator'){
        //                     req.session.position = position
        //                     req.session.user = username
        //                     req.session.admin = position
        //                     req.session.checker = 'Admin-Dash' //FOR KEEPING TRACK OF USER
        //                     // res.redirect(`/Admin-Dash`)
        //                     console.log(req.session.user)
        //                 }
                        
        //             }
        //         }
        //     }
        // })
    }
}

module.exports = (LoginPost , LoginGet)
// module.exports = LoginPost