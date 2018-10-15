const express = require('express');
const Passport = require('passport');
const bodyParser = require('body-parser');
const path = require('path');
const cookieSession = require('cookie-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./config/keys');
const User = require('./model/user');
const Post = require('./model/post');
const Solution = require('./model/solution');
const app = express();


module.exports= app =>{
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
// app.use(express.static(path.join(__dirname,'public')));
app.set('views',path.join(__dirname,'views'));
app.set('view engine',"ejs");

app.get('/',(req,res)=>{
    res.render('index.ejs');
});
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys:[keys.cookieKey]
    })
);

app.use(Passport.initialize());
app.use(Passport.session());

Passport.serializeUser((user,done)=>{
    done(null,user.id);
});

Passport.deserializeUser((id,done)=>{
    User.findById(id)
    .then((user)=>{
        done(null,user)
    });
});

Passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: true
},(accessToken,refreshToken,profile,done)=>{
    // console.log('accessToken : '+accessToken);
    // console.log('refreshToken : '+refreshToken);
    // console.log('profile : '+JSON.stringify( profile));
    // var profile = JSON.stringify(profile);
    User.findOne({googleid:profile.id})
    .then((existingUser)=>{
        if(existingUser){
            done(null, existingUser);
        }else{
            var newUser = new User({
                googleid: profile.id,
                name: profile.displayName,
                mailID: profile.emails[0].value,
                photo: profile.photos[0].value
                
            });
            newUser.save()
            .then((user)=>{
                console.log(user);
                done(null,user);
            });
        }
    });
    

}
));

app.get('/auth/google',Passport.authenticate('google',{
    scope:['profile','email']
}));

app.get('/auth/google/callback',Passport.authenticate('google'),(err, req, res, next) => { // custom error handler to catch any errors, such as TokenError
    if (err.name === 'TokenError') {
     res.redirect('/auth/google'); // redirect them back to the login page
    } else {
     // Handle other errors here
    }
  },
  (req, res) => { // On success, redirect back to '/'
    res.redirect('/api/current_user');
  }
);
};