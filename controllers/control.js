const sha256=require('js-sha256');
const cookieParser = require('cookie-parser');
let SALT = "exhlim";
let reference = "";
module.exports = (db) => {
// <----------------------------------------------------------------------------------------------------------> //
// <----------------------------------------------LOGIN/REGISTER----------------------------------------------> //
// <----------------------------------------------------------------------------------------------------------> //

    let loginPage=(request,response)=> {
        if(!request.cookies['loggedIn']) {
            response.render('LoginPage')
        } else {
            let reference = request.cookies['reference']
            let cookieValue = request.cookies['loggedIn']
            if(cookieValue === sha256(`true${SALT}-${reference}`)) {
                // REDIRECT TO HOME PAGE AND RENDER OUT EMIALS FROM SQL
                response.send("You are still logged in");
            } else {
                response.send("You are tempering");
            }
        }
    }
        let loginCheck=(request,response)=> {
        let params = [
        request.body.username,
        sha256(`${request.body.password}`)
        ]
        db.poolRoutes.loginCheckFX(params, (err,results)=> {
            // If username and password does not match with the database
            if(results.rows.length == 0) {
                response.redirect("/");
            } else {
                response.cookie('loggedIn', sha256(`true${SALT}-${sha256((results.rows[0].id).toString())}`))
                response.cookie("reference", (`${sha256((results.rows[0].id).toString())}`))
                // REDIRECT TO HOME PAGE AND RENDER OUT EMIALS FROM SQL
                response.redirect('/emailinput')
            }
        })
    }
    let registerPage=(request,response)=> {
        response.render("RegisteringPage")
    }
    let registerDone=(request,response)=> {
        let params = [
            request.body.username,
        ]
        db.poolRoutes.registerCheckFX(params, (err,results)=> {
            console.log(results.rows.length)
            // If the username already exists render the same login page
            if(results.rows.length !== 0) {
                response.redirect('/register')
            } else {
                params.push(sha256(`${request.body.password}`));
                // If the username does not exists render the email input page.
                db.poolRoutes.registerFX(params, (err,results2)=> {
                    response.cookie('loggedIn', sha256(`true${SALT}-${sha256((results2.rows[0].id).toString())}`))
                    response.cookie("reference", (`${sha256((results2.rows[0].id).toString())}`))
                    response.redirect('/emailinput')
                })
            }
        })
    }
// <----------------------------------------------------------------------------------------------------------> //
// <-********************************************************************************************************-> //
// <----------------------------------------------------------------------------------------------------------> //

// <----------------------------------------------------------------------------------------------------------> //
// <------------------------------------------Email Input/ GMAIL API------------------------------------------> //
// <----------------------------------------------------------------------------------------------------------> //

    let emailLinkPage=(request,response)=> {
        response.send(`<!DOCTYPE html>
                        <html>
                          <head>
                            <title>Gmail</title>
                            <link rel="stylesheet" type="text/css" href="/linkPage.css"/>
                            <meta charset="utf-8" />
                          </head>
                          <body>
                            <p>Please sign in to the email that you want to link: </p>
                            <button id="authorize_button" style="display: none;">Authorize</button>
                            <button id="signout_button" style="display: none;">Sign Out</button>
                            <pre id="content" style="white-space: pre-wrap;"></pre>
                            <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.20.0/axios.min.js"></script>
                            <script type="text/javascript" src="./public/main.js"></script>
                            <script async defer src="https://apis.google.com/js/api.js"
                              onload="this.onload=function(){};handleClientLoad()"
                              onreadystatechange="if (this.readyState === 'complete') this.onload()">
                            </script>
                          </body>
                        </html>`)
    }
// <----------------------------------------------------------------------------------------------------------> //
// <-********************************************************************************************************-> //
// <----------------------------------------------------------------------------------------------------------> //

// <----------------------------------------------------------------------------------------------------------> //
// <------------------------------------------------Home Page ------------------------------------------------> //
// <----------------------------------------------------------------------------------------------------------> //
    let sortedEmails;
    let insertData = (request, response) =>{
        sortedEmails = request.body.slice(0);
            sortedEmails.sort(function(a,b) {
                return b.rawDate - a.rawDate;
            });

        // db.poolRoutes.insertDataFX(params[0], (error, result)=>{
        //     if(error) {
        //         response.status(404).send("Failed to insert in DB")
        //     } else {
        //         response.send(result)
        //     }
        // })
    }
    let homePage=(request,response)=> {
        let params = {
            emails: sortedEmails
        }
        response.render('MailPage', params)
    }
    let getIndividualMail=(request,response)=> {
        let individualemail = [];
        function filter(sortedEmails) {
            sortedEmails.forEach(email=> {
                if(email.mailid == request.params.id) {
                    individualemail.push(email)
                }
            })
        }
        filter(sortedEmails)
        let params = {
            emails : sortedEmails,
            indemail : individualemail
        }
        response.render('IndMailPage', params)
    }





// <----------------------------------------------------------------------------------------------------------> //
// <-********************************************************************************************************-> //
// <----------------------------------------------------------------------------------------------------------> //

    return {
        loginPage,
        loginCheck,

        registerPage,
        registerDone,

        emailLinkPage,

        homePage,
        insertData,
        getIndividualMail
        // linking

    }
}