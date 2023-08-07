// ################## BOTTON ####################
const FrontStat = document.querySelector('.fds')
const BarStat = document.querySelector('.bds')
const RestStat = document.querySelector('.rds')
const Crtuser = document.querySelector('.crtuser')
const Deluser = document.querySelector('.deluser')
const Alluser = document.querySelector('.alluser')
const btncls = document.querySelectorAll('.close')
// #################################################

// ################## DISPLAY VIEW ####################
const  Adminview= document.querySelector('.admin-view')
const  Alogin= document.querySelector('.alogin')
const  Delogin= document.querySelector('.delogin')
const  Viewuser= document.querySelector('.view-user')
const  Frontoffice= document.querySelector('.front_office')
const  Baroffice= document.querySelector('.bar_office')
const  Restoffice= document.querySelector('.rest_office')
// ######################################################

// ################# VIEW BOTTON ###############################
Crtuser.addEventListener('click', () => {
    Alogin.style.display = 'flex'
    Adminview.style.display = 'none'
})
RestStat.addEventListener('click', () => {
    Restoffice.style.display = 'flex'
    Adminview.style.display = 'none'
})
Deluser.addEventListener('click', () => {
    Delogin.style.display = 'flex'
    Adminview.style.display = 'none'
})
Alluser.addEventListener('click', () => {
    Viewuser.style.display = 'flex'
    Adminview.style.display = 'none'
})
FrontStat.addEventListener('click', () => {
    Frontoffice.style.display = 'flex'
    Adminview.style.display = 'none'
})
BarStat.addEventListener('click', () => {
    Baroffice.style.display = 'flex'
    Adminview.style.display = 'none'
})

// ######################## CLOSE BOTTON ###########################
btncls.forEach(btncls => {
    btncls.addEventListener('click', () => {
    Alogin.style.display = 'none'
    Delogin.style.display = 'none'
    Viewuser.style.display = 'none'
    Frontoffice.style.display = 'none'
    Baroffice.style.display = 'none'
    Restoffice.style.display = 'none'
    Adminview.style.display = 'block'
    })
})

// ##################### VIEWING OF ALL USERS #################################
// ##################### VIEWING OF ALL USERS #################################
$('document').ready(
    $.ajax({
        method: "POST",
        success: (data, valid) => {
                for (let i = 0; i < data.viewser.length; i++) {
                    var no = i+1
                    document.querySelector('.num').innerHTML += `<h3>${no}</h3>`
                    document.querySelector('.users').innerHTML += `<h3>${data.viewser[i].username}</h3>`
                    document.querySelector('.users-pwd').innerHTML += `<h3>${data.viewser[i].pwd}</h3>`
                    document.querySelector('.users-pst').innerHTML += `<h3>${data.viewser[i].position}</h3>`
                }

                // ######################## FRONT OFFICE ################################
                for (let i = 0; i < data.FOST.length; i++) {
                    var no = i+1
                    document.querySelector('.nom').innerHTML += `<h2>${no}</h2>`
                    document.querySelector('.room_no').innerHTML += `<h2>${data.FOST[i].rooms}</h2>`
                    document.querySelector('.geust_name').innerHTML += `<h2>${data.FOST[i].guest}</h2>`
                    document.querySelector('.geust_g').innerHTML += `<h2>${data.FOST[i].sex}</h2>`
                    document.querySelector('.geust_st').innerHTML += `<h2>${data.FOST[i].marital}</h2>`
                    document.querySelector('.geust_occ').innerHTML += `<h2>${data.FOST[i].accupation}</h2>`
                    document.querySelector('.geust_add').innerHTML += `<h2>${data.FOST[i].address}</h2>`
                    document.querySelector('.geust_num').innerHTML += `<h2>${data.FOST[i].phone}</h2>`
                    document.querySelector('.amount_pd').innerHTML += `<h2>${data.FOST[i].rates}</h2>`
                    document.querySelector('.pay_typ').innerHTML += `<h2>${data.FOST[i].payment}</h2>`
                    document.querySelector('.arrv').innerHTML += `<h2>${data.FOST[i].arrival}</h2>`
                    document.querySelector('.demis').innerHTML += `<h2>${data.FOST[i].dismissal}</h2>`
                }

                // ############################# BAR OFFICE #############################
                for (let i = 0; i < data.Bar.length; i++) {
                    document.querySelector('.bar_dis').innerHTML += `<h1>Posted By:<span>${data.Bar[i].poster} </span>On: ${data.Bar[i].date}</h1>`
                    document.querySelector('.bar_dis').innerHTML += data.Bar[i].bar
                }

                // ################################ RESTUARANT ##############################
                for (let i = 0; i < data.Rest.length; i++) {
                    document.querySelector('.rest_dis').innerHTML += `<h1>Posted By: <span> ${data.Rest[i].poster} </span>On: ${data.Rest[i].date}</h1>`
                    document.querySelector('.rest_dis').innerHTML += `<div class="rest">${data.Rest[i].content}</div>`
                }
        },
        error: (err) => {
            console.log(err)
        }
    })  
)