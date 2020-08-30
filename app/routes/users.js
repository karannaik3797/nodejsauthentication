var express = require('express');
var router = express.Router();
const User = require('../model/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', function(req, res) { 
      
    Users=new User({email: req.body.email, username : req.body.username}); 
  
          User.register(Users, req.body.password, function(err, user) { 
            if (err) { 
              res.json({success:false, message:"Your account could not be saved. Error: ", err})  
            }else{ 
              res.json({success: true, message: "Your account has been saved"}) 
            } 
          }); 
}); 

router.post('/forgot', function(req, res) { 
	 User.register(Users, req.body.username, function(err, user) { 
	    if (err) { 
	      res.json({success:false, message:"Your are not register yet. Error: ", err})  
	    }else{ 
	      res.redirext("../public/reset") 
	    } 
	  }); 
	}); 

userController.doLogin = function(req, res) { 
  if(!req.body.username){ 
    res.json({success: false, message: "Username was not given"}) 
  } else { 
    if(!req.body.password){ 
      res.json({success: false, message: "Password was not given"}) 
    }else{ 
      passport.authenticate('local', function (err, user, info) {  
         if(err){ 
           res.json({success: false, message: err}) 
         } else{ 
          if (! user) { 
            res.json({success: false, message: 'username or password incorrect'}) 
          } else{ 
            req.login(user, function(err){ 
              if(err){ 
                res.json({success: false, message: err}) 
              }else{ 
                const token =  jwt.sign({userId : user._id,  
                   username:user.username}, secretkey,  
                      {expiresIn: '24h'}) 
                res.json({success:true, message:"Authentication successful", token: token }); 
              } 
            }) 
          } 
         } 
      })(req, res); 
    } 
  } 
};

router.post('/reset', function(req, res) {

    User.findOne({ username: req.user.username },(err,user)=>{
    	// Check if error connecting
  if (err) {
    res.json({ success: false, message: err }); // Return error
  } else {
    // Check if user was found in database
    if (!user) {
      res.json({ success: false, message: 'User not found' }); // Return error, user was not found in db
    } else {
    	user.setPassword(req.body.password,(err, user) => {
    		if (err) return next(err);
        	u.save();
        	res.status(200).json({ message: 'password change successful' });
    });
	}
}
});

router.post('/changepassword', function(req, res) {

User.findOne({ username: req.user.username },(err, user) => {
  // Check if error connecting
  if (err) {
    res.json({ success: false, message: err }); // Return error
  } else {
    // Check if user was found in database
    if (!user) {
      res.json({ success: false, message: 'User not found' }); // Return error, user was not found in db
    } else {
      user.changePassword(req.body.oldpassword, req.body.newpassword, function(err) {
         if(err) {
                  if(err.name === 'IncorrectPasswordError'){
                       res.json({ success: false, message: 'Incorrect password' }); // Return error
                  }else {
                      res.json({ success: false, message: 'Something went wrong!! Please try again after sometimes.' });
                  }
        } else {
          res.json({ success: true, message: 'Your password has been changed successfully' });
         }
       })
    }
  }
});
});

module.exports = router;
