const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const auth = require('../middlewares/auth')
const config = require('../config/default.json')
const Company = require('../models/Company')
const Notification = require('../models/Notification')

//@route GET api/auth
//@description Get Logged in user information
//@access Private

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
	
    return res.status(200).json({ user })
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }
})

//@route POST api/auth
//@description Auth user & get token
//@access Public

router.post(
  '/',
  async (req, res) => {
    const errors = validationResult(req)
	
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(),message:"Multiple Errors" })
    }
	
    const {email,password} = req.body
	
    try { 
      let user = await User.findOne({ email })
	  
      if (!user) {
        return res.status(400).json({ message: 'Invalid Credentials' })
      }

      const isMatch = await bcrypt.compare(password, user.password)
	  
      
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid Credentials, 2' })
      }
	  
	  let company = await Company.findOne({user:user.id})
	  const notification = new Notification({description:"New Login"})
	  var payload
	  if(company) {
		notification.user = company
        payload = {
			user: {
			  id: user.id,
			  company:company.id,
			},
		  }
      }else{
		 notification.user = user
		 payload = {
			user: {
			  id: user.id,
			},
		  }
	  }
	  await notification.save()
      jwt.sign(
        payload,
        config.jwtSecret,
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err
		  
          return res.status(200).json({ token: token,payload:payload.user,message:"Login Successfull" })
        },
      )
    } catch (error) {
        console.log(error.message)
        res.status(500).send('Server Error')
    }
  },
)

module.exports = router
