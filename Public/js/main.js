$('document').ready(
    $.ajax({
        method: "POST",
        success: (data, valid) => {
                for (let i = 0; i < data.Rnom.length; i++) {
                    var rclass = 'ready'
                    if(data.Rnom[i].status == 'occupied'){
                        rclass = `occupied`
                    }
                    if(data.Rnom[i].status == 'faulty'){
                        rclass = `faulty`
                    }
                    if(data.Rnom[i].status == 'unready'){
                        rclass = `unready`
                        
                    }
                    
                    document.querySelector('#ready').innerHTML = data.Rnum.length //For Ready Rooms Number
                    document.querySelector('#unready').innerHTML = data.Unum.length //For Unready Rooms Number
                    document.querySelector('#occupied').innerHTML = data.Onum.length //For Occupied Rooms Number
                    document.querySelector('#faulty').innerHTML = data.Fnum.length //For Faulty Rooms Number
                    // document.querySelector('.view-guest').innerHTML = data.Fnum.length
                    document.querySelector('.rooms').innerHTML += `<div class="${rclass} rm${data.Rnom[i].rooms}" title="Room: ${data.Rnom[i].rooms}">RM ${data.Rnom[i].rooms}</div>`
                }
                
                for (let i = 0; i < data.Rnom.length; i++) {
                    
                    var PerRoom = document.querySelector(`.rm${data.Rnom[i].rooms}`)
                    PerRoom.addEventListener('click', () => {
                        var operate_In = `<a href="/check-in-${data.Rnom[i].rooms}"><button>Check In</button></a><br><br>`
                        var operate_Rd = `<a href="/make-ready-${data.Rnom[i].rooms}"><button>Make Ready</button></a><br><br>`
                        var operate_Out = `<a href="/check-out-${data.Rnom[i].rooms}"><button>Check Out</button></a><br><br>`
                        var operate_Faut = `<a href="/faulty${data.Rnom[i].rooms}"><button>Faulty Room</button></a>`
                        if(data.Rnom[i].status == 'occupied'){
                            operate_In = ''
                            operate_Rd = ''
                        }else if(data.Rnom[i].status == 'ready'){
                            operate_Rd = ''
                            operate_Out = ''
                        }else if(data.Rnom[i].status == 'unready'){
                            operate_In = ''
                            operate_Out = ''
                        }else if(data.Rnom[i].status == 'faulty'){
                            operate_In = ''
                            operate_Out = ''
                            operate_Faut = ''
                        }

                        document.querySelector('.activity').style.display = 'block'
                        document.querySelector('.activity').style.visibility = 'visible'
                        document.querySelector('.activity').innerHTML = `
                                                <div class="close">X</div>
                                                <h1 style="text-align:center;">Room: <span style="color:navy;">${data.Rnom[i].rooms}</span></h1>
                                                ${operate_In}
                                                ${operate_Out}
                                                ${operate_Rd}
                                                ${operate_Faut}
                                                `
                        document.querySelector(`.rm${data.Rnom[i].rooms}`).setAttribute("id", "activate")
                        document.querySelector('.close').setAttribute("id", "close")

                        $('#close').on('click', () => {
                            document.querySelector('.activity').style.display = 'none'
                            document.querySelector('.activity').style.visibility = 'hidden'
                        })
                    })  
                     
                }
                    
        }
    })  
)
