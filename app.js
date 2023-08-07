const express = require('express')
const route = express()
const fs = require('fs')
const PATH = require('path')
const bodyparser = require('body-parser') // FOR CAPTURING OF INPUT FROM FRONT END
const CORS = require('cors')
const JOI = require('joi') // FOR VALIDATION OF LOGIN || FORMS
const MD5 = require('md5')
const session = require('express-session')
const UUID = require('uuid')
const MULTER = require('multer')
const PORT = process.env.PORT || 1000 // FOR HOSTING OF SERVER
const authenticated = require('speakeasy')
const MAILER = require('nodemailer')
const TWILIO = require('twilio')
const dotenv = require('dotenv')
const { app, BrowserWindow } = require('electron') 
dotenv.config()
// // ###################### Serving Static Files ###########################
route.use(express.static(PATH.join(__dirname, './Public')))
        
// ############################# MIDDLE-WARES #############################
route.use(bodyparser.urlencoded({extended: true}))
route.use(bodyparser.json())

const expDate = 1000 * 60 * 60 * 24 * 7 //It will Last for Days
route.use(session({
        name: "Retro-Hotels-Session",
        secret: UUID.v4(),
        resave: false,
        saveUninitialized: process.env.NODE_ENV === "production",
        cookie: {
            httpOnly: process.env.NODE_ENV === "production" ? false : true,
            maxAge: expDate, 
            secure: false,
            sameSite: true //'strict'
        }
}))

const MYSQL = require('./MODULES/Conn')

const Admin = (req, res, next) => {
    if(!req.session.admin){
        res.redirect('/')
    }else{
        next()
    }
}
const CheckPermit = (req, res, next) => {
    if(req.session.admin){
        next()
    }else if(!req.session.roomcheck){
        res.redirect(`/${req.session.checker}`)
    }else{
        next()
    }
}
const BarMan = (req, res, next) => {
    if(req.session.admin){
        next()
    }else if(!req.session.bar){
        res.redirect(`/${req.session.checker}`)
    }else{
        next()
    }
}
const RestMan = (req, res, next) => {
    if(req.session.admin){
        next()
    }else if(!req.session.restman){
        res.redirect(`/${req.session.checker}`)
    }else{
        next()
    }
}
const UserLoggedIn = (req, res, next) => {
    if(req.session.user){
        res.redirect(`/${req.session.checker}`)
    }else{
        next()
    }
}
// ####################################################
// ####################################################

route.get('/logout', (req, res) =>{

    req.session.destroy((err) => {
        if(err){
            // return res.redirect('/dasboard')
        }else{
            // console.log('User Logged Out Successfully')
            res.clearCookie("Retro-Hotels-Session")
            return res.redirect('/')
        }
    })
})
route.get('/undefined', (req, res) => {
    res.redirect('/')
})

// const createWindow = () => {
//     const win = new BrowserWindow({
//       width: 800,
//       height: 600
//     })
  
//     win.loadURL(`http://localhost:${PORT}`)

// } 
// app.whenReady().then(() => {
//     createWindow()
// }) 

//####################### HOME DESK ##############################
//####################### HOME DESK ##############################

route.get('/', UserLoggedIn, (req,res) =>{
    res.sendFile(PATH.join(__dirname, './Public/home.html'))  
})

route.post('/', UserLoggedIn, (req,res) =>{
    const { username, position, pwd } = req.body

    if(username,position,pwd){
        const query = "SELECT * FROM `hotel_users`"
        MYSQL.query(query, (err, result) => {
            if(result){
                for (let i = 0; i < result.length; i++) {
                    if((username == result[i].username)&&(position == result[i].position)&&(pwd == result[i].pwd)){
                        if(position == 'Front Office'){
                            req.session.position = position
                            req.session.user = username //UserLoggIn
                            req.session.roomcheck = position //CheckPermit
                            req.session.checker = 'Front-Office' //FOR KEEPING TRACK OF USER
                            res.redirect(`/Front-Office`)
                        }else if(position == 'Waiter Bar'){
                            req.session.position = position
                            req.session.user = username //UserLoggIn
                            req.session.bar = position //BarMan
                            req.session.checker = 'Bar-Office' //FOR KEEPING TRACK OF USER
                            res.redirect(`/Bar-Office`)
                        }else if(position == 'Restuarant'){
                            req.session.position = position
                            req.session.user = username //UserLoggIn
                            req.session.restman = position //Restuarant
                            req.session.checker = 'Restuarant-Office' //FOR KEEPING TRACK OF USER
                            res.redirect(`/Restuarant-Office`)
                        }else if(position == 'Administrator'){
                            req.session.position = position
                            req.session.user = username
                            req.session.admin = position
                            req.session.checker = 'Admin-Dash' //FOR KEEPING TRACK OF USER
                            res.json({LOGIN : `/Admin-Dash`})
                            // res.redirect(`/Admin-Dash`)
                            console.log(req.session.user)
                        }
                        
                    }
                }
            }
        })
    }
})

// #############################################################################
// #############################################################################

//####################### ADMINISTRATOR DESK ##############################
//####################### ADMINISTRATOR DESK ##############################
route.get('/Admin-Dash', Admin, (req, res) => {
    res.sendFile(PATH.join(__dirname, '/Public/admin.html'))
})
route.post('/Admin-Dash', Admin, (req, res) => {

    const Regname = req.body.user_name
    const Regposition = req.body.user_position
    const Regpwd = req.body.user_pwd
    const Delname = req.body.user_name
    const Delposition = req.body.user_position

    if(Regname, Regposition, Regpwd){
        const query = "INSERT INTO `hotel_users`(`username`, `position`, `pwd`) VALUES (?,?,?)"
        MYSQL.query(query,[Regname, Regposition, Regpwd,], (err, result) => {
            // console.log(result)
            res.redirect('/Admin-Dash')
        })
        // console.log(name,pwd,position)
    }else if(Delname,Delposition){
        const query = "SELECT * FROM `hotel_users`"
        MYSQL.query(query, (err, result) => {
            //Cross Checking If User Exist and Delete Function
            for (let i = 0; i < result.length ; i++) {
                if((Delposition  == result[i].position) && (Delname  == result[i].username)){//Input from user
                   function Del(){
                    const query = "DELETE FROM `hotel_users` WHERE `hotel_users`.`username`=? "
                    MYSQL.query(query,[Delname], (err, result) => {
                        res.redirect('/Admin-Dash')
                    })
                   }Del()
                    return console.log('Deleted Successfully')
                }
            }
            // For Checking If User Does Not Exist
            for (let i = 0; i < result.length ; i++) {
                if((result[i].username !== Delname)&&(result[i].position !== Delposition)){//Input from user
                    return console.log('User Does Not Exist') 
                }
            }
        })
    }else{
        // send data here
        const query = "SELECT * FROM `front_office_db` ORDER BY `front_office_db`.`room_id` DESC"
        MYSQL.query(query, (err, result1) => {
            const query = "SELECT * FROM `hotel_users`"
            MYSQL.query(query, (err, result) => {
                const query = "SELECT * FROM `bar_db` ORDER BY `bar_db`.`date` DESC"
                MYSQL.query(query, (err, result2) => {
                    const query = "SELECT * FROM `rest_office` ORDER BY `rest_office`.`entry_id` DESC"
                    MYSQL.query(query, (err, result3) => {
                        res.json({viewser: result, FOST: result1, Bar: result2, Rest: result3})
                    })
                })
            })
        })
        
    }
})
// ###################################################################################
// ###################################################################################

// ################################ FRONT OFFICE SECTION ###########################################
// ################################ FRONT OFFICE SECTION ############################################
route.get('/Guest-View', CheckPermit, (req, res) => {
    res.sendFile(PATH.join(__dirname, './Public/viewguest.html'))
})
route.post('/Guest-View', (req, res) =>{
    const query1 = "SELECT * FROM `front_office` WHERE `status`='occupied'"
    MYSQL.query(query1, (err, result) => {
        if(result){
            // console.log(req.session.position)
            res.json({Guest: result})
        }
    })
})

function fronOffice(){
const query = "SELECT * FROM `front_office`"
MYSQL.query(query, (err, result) => {
    if(result){
    for (let i = 0; i < result.length; i++) {
        // ################# CHECK-IN GUEST ################
        // ################# CHECK-IN GUEST ################
        route.get(`/check-in-${result[i].rooms}`, CheckPermit,(req, res) => {
            res.sendFile(PATH.join(__dirname, './Public/checkinguest.html'))  
        })
        route.post(`/check-in-${result[i].rooms}`, CheckPermit,(req, res) => {
            const d = new Date()
            const DateMonth = ['Jan', 'Feb', 'Mar', 'April', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
            const DateDay = ['Sun', 'Mon', 'Tuse', 'Wed', 'Thu', 'Fri', 'Sat']
            const Day = DateDay[d.getDay()]
            const Month = DateMonth[d.getMonth()]
            var DateD = d.getDate()
            if(DateD < 10){
                DateD = `0${DateD}`
            }
            var Min = d.getMinutes()
            if(Min < 10){
                Min = `0${Min}`
            }
            var Sec = d.getSeconds()
            if(Sec < 10){
                Sec = `0${Sec}`
            }

            const Name = req.body.guest_name
            const Address = req.body.guest_address
            const sex = req.body.sex
            const Occupation = req.body.guest_occupation
            const Number = req.body.guest_number
            const M_statu = req.body.M_status
            const Payment = req.body.payment
            const Amount = req.body.amount_pd
            const arr =  `${Day} ${Month} ${DateD} ${d.getFullYear()} ${d.getHours()}:${Min}:${Sec}`
            const deb =  'Retaining'
            const Room_Num = result[i].rooms
            const status = 'occupied'
            if(Name, Number){
                const query = "UPDATE `front_office` SET `guest`=?, `rates`=?, `sex`=?, `marital`=?, `address`=?, `demissal`=?, `arrival`=?, `occupation`=?, `phone`=?, `payment`=?, `status`=? WHERE `rooms`=?"
                MYSQL.query(query,[Name, Amount, sex, M_statu, Address, deb, arr, Occupation, Number, Payment, status, Room_Num], (err, result) => {
                    setTimeout(() => {
                        res.redirect('/Front-Office')
                    }, 2000)
                })
                // ############### UPDATING OF THE MAIN DATABASE (FRONT_OFFICE_DB) ##########################
                const query1 = "INSERT INTO `front_office_db` (`rooms`, `rates`, `guest`, `sex`, `marital`, `address`, `accupation`, `phone`, `arrival`, `dismissal`, `payment`) VALUES(?,?,?,?,?,?,?,?,?,?,?)"
                MYSQL.query(query1,[Room_Num, Amount, Name, sex, M_statu, Address, Occupation, Number, arr, deb, Payment], (err, result) => {
                    // console.log("result")
                })
            }else{
                res.json({Room: result[i].rooms})
            } 
        })
        // ################# CHECK-OUT GUEST ################
        // ################# CHECK-OUT GUEST ################
        route.get(`/check-out-${result[i].rooms}`, CheckPermit,(req, res) => {
            const query = "SELECT * FROM `front_office`"
            MYSQL.query(query, (err, result) => {
                const d = new Date()
                const DateMonth = ['Jan', 'Feb', 'Mar', 'April', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
                const DateDay = ['Sun', 'Mon', 'Tuse', 'Wed', 'Thu', 'Fri', 'Sat']
                const Day = DateDay[d.getDay()]
                const Month = DateMonth[d.getMonth()]
                var DateD = d.getDate()
                if(DateD < 10){
                    DateD = `0${DateD}`
                }
                var Min = d.getMinutes()
                if(Min < 10){
                    Min = `0${Min}`
                }
                var Sec = d.getSeconds()
                if(Sec < 10){
                    Sec = `0${Sec}`
                }
                const deb =  `${Day} ${Month} ${DateD} ${d.getFullYear()} ${d.getHours()}:${Min}:${Sec}`
                const Room_Num = result[i].rooms
                const Room_OutTime = result[i].arrival
                const status = 'unready'
                // ####################### UPDATING THE DISMISSAL TIME ##########################
                const query1 = "UPDATE `front_office_db` SET `dismissal`=? WHERE `arrival`=?"
                MYSQL.query(query1,[deb, Room_OutTime], (err, result1) => {
                    console.log(result1)
                })
                const query = "UPDATE `front_office` SET `guest`=?, `sex`=?, `marital`=?, `address`=?, `demissal`=?, `arrival`=?, `occupation`=?, `phone`=?, `payment`=?, `status`=? WHERE `rooms`=?"
                MYSQL.query(query,['', '', '', '', '', '', '', '', '', status, Room_Num], (err, result) => {
                    res.redirect(`/Front-Office`)
                })
            })
        })
        // ################# MAKE ROOM READY ################
        // ################# MAKE ROOM READY ################
        route.get(`/make-ready-${result[i].rooms}`, CheckPermit,(req, res) => {
            const room = result[i].rooms
            const status = 'ready'
            const query = "UPDATE `front_office` SET `status`=? WHERE `rooms`=?"
            MYSQL.query(query,[status,room], (err, result) => {
                res.redirect('/Front-Office')
            })
        })
        // ################# MAKE ROOM FAULTY ################
        // ################# MAKE ROOM FAULTY ################
        route.get(`/faulty${result[i].rooms}`, CheckPermit,(req, res) => {
            const room = result[i].rooms
            const status = 'faulty'
            const query = "UPDATE `front_office` SET `status`=? WHERE `rooms`=?"
            MYSQL.query(query,[status,room], (err, result) => {
                res.redirect('/Front-Office')
            })
        })
    }
    }
})
}fronOffice()

route.get(`/Front-Office`, CheckPermit, (req,res) =>{
    res.sendFile(PATH.join(__dirname, './Public/Frontoffice.html'))
})
route.post(`/Front-Office`, CheckPermit, (req,res) =>{
    const query = "SELECT * FROM `front_office`"
    MYSQL.query(query, (err, result) => {
        const query = "SELECT * FROM `front_office` WHERE `status`='faulty'"
        MYSQL.query(query, (err, faulty) => {
            const query = "SELECT * FROM `front_office` WHERE `status`='occupied'"
            MYSQL.query(query, (err, occupied) => {
                const query = "SELECT * FROM `front_office` WHERE `status`='unready'"
                MYSQL.query(query, (err, unready) => {
                    const query = "SELECT * FROM `front_office` WHERE `status`='ready'"
                    MYSQL.query(query, (err, ready) => {
                        res.json({Rnom: result,
                            Fnum: faulty,
                            Onum: occupied,
                            Unum: unready,
                            Rnum: ready
                        })
                    })
                })
            })
        })
    })
})
// ###############################################################################
// ###############################################################################

// ############################ RESTUARANT OFFICE SECTION ###########################
// ############################ RESTUARANT OFFICE SECTION ###########################
route.get(`/Restuarant-Office`, RestMan, (req, res) => {
    res.sendFile(PATH.join(__dirname,'/Public/restdesk.html'))
})
route.post(`/Restuarant-Office`, RestMan, (req, res) => {
    const d = new Date()
    const DateMonth = ['Jan', 'Feb', 'Mar', 'April', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    const DateDay = ['Sun', 'Mon', 'Tuse', 'Wed', 'Thu', 'Fri', 'Sat']
    const Day = DateDay[d.getDay()]
    const Month = DateMonth[d.getMonth()]
    var DateD = d.getDate()
    if(DateD < 10){
        DateD = `0${DateD}`
    }
    var Min = d.getMinutes()
    if(Min < 10){
        Min = `0${Min}`
    }
    var Sec = d.getSeconds()
    if(Sec < 10){
        Sec = `0${Sec}`
    }

    const Dy =  `${Day} ${Month} ${DateD} ${d.getFullYear()} ${d.getHours()}:${Min}:${Sec}`
    const Restpost = req.body.restpost
    const Poster = req.session.user
    if(Restpost !== '' && req.session.restman){
        const query = "INSERT INTO `rest_office` (`content`, `poster`, `date`) VALUES(?,?,?)"
        MYSQL.query(query,[Restpost,Poster,Dy], (err, result) => {
            res.redirect('/logout')
        })
    }else{
        res.redirect('/Restuarant-Office')
    }
})

// ############################ BAR OFFICE SECTION ###########################
// ############################ BAR OFFICE SECTION ###########################
route.get('/Bar-Office', BarMan, (req, res) => {
    res.sendFile(PATH.join(__dirname,'/Public/bardesk.html'))
})

route.post('/Bar-Office', BarMan, (req, res) => {
    const d = new Date()
    const DateMonth = ['Jan', 'Feb', 'Mar', 'April', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    const DateDay = ['Sun', 'Mon', 'Tuse', 'Wed', 'Thu', 'Fri', 'Sat']
    const Day = DateDay[d.getDay()]
    const Month = DateMonth[d.getMonth()]
    var DateD = d.getDate()
    if(DateD < 10){
        DateD = `0${DateD}`
    }
    var Min = d.getMinutes()
    if(Min < 10){
        Min = `0${Min}`
    }
    var Sec = d.getSeconds()
    if(Sec < 10){
        Sec = `0${Sec}`
    }
    var Dy =  `${Day} ${Month} ${DateD} ${d.getFullYear()} ${d.getHours()}:${Min}:${Sec}`
    const Poster = req.session.user
    const test = req.body.test
    if(test, req.session.bar){
        const query = "INSERT INTO `bar_db` (`bar`, `poster`, `date`) VALUES(?,?,?)"
        MYSQL.query(query,[test,Poster,Dy], (err, result) => {
            // console.log(result)
            res.redirect('/logout')
        })
    }else{
        res.redirect('/Bar-Office')
    }
})
// ###################################################################################
// ###################################################################################

route.listen(PORT, () => console.log(`Server Running on Port ${PORT}`))