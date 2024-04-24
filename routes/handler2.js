const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('../config/default.json')
const auth = require('../middlewares/auth')
const Active = require('../models/Active')
const Notification = require('../models/Notification')
const Handler = require('../models/Handler')
const Spot = require('../models/Spot')
const Company = require('../models/Company')
const Parked = require('../models/Parked')
const Book = require('../models/Booking')
const Invoice = require('../models/Invoice')
const Vehicle = require('../models/Vehicle')
const Parking = require('../models/Parking')

//@route GET api/models/handler
//@description Get all checkins made by handler
//@access Private

router.get('/', auth, async (req, res) => {
  try {
	const handlerid = req.user.id
	const result = {}
	result.bookings = {total:0,data:[]}
	const handler = await Handler.findById(handlerid).select("-password")
	const company = await Company.findById(handler.company).select("-password")
    const actives  = await Active.find({handler:handlerid});
	for(var active of actives){
		const booking = await Book.findById(active.booking)
		result.bookings.total += 1
		result.bookings.data.push(booking)
	}
	result.handler = handler
	result.active = actives
	result.company = company
    return res.status(200).json(result)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error='+error.message)
  }
})

router.get('/getDetail/:id', auth, async (req, res) => {
	try {
	  const bookid = req.params.id
	  const result = {}
	  const book = await Book.findById(bookid.toString())
	  if(!book){
		return res.status(404).json({message:"Not Found"})
	  }
	  result.book = book
	  const location = await Parking.findById(book.parking)
	  result.location = location
	  const invoice = await Invoice.findById(book.invoice)
	  if(!invoice){
		  const inv = new Invoice(book)
		  inv.amount = location.price
		  inv.booking = book._id
		  await inv.save()
	  }
	  
	  const slot = await Spot.findById(book.spot)
	  result.slot = slot
	  const vehicle = await Vehicle.findById(book.vehicle)
	  result.vehicle = vehicle
	  return res.status(200).json(result)
	} catch (error) {
	  console.error(error.message)
	  res.status(404).json({message:"Not Found"})
	}
  })

router.get('/getAnalysis', auth, async (req, res) => {
	try {
	  const handlerid = req.user.id
	  const result = {}
	  result.bookings = {total:0,data:[]}
	  const handler = await Handler.findById(handlerid).select("-password")
	  const company = await Company.findById(handler.company).select("-password")
	  const actives  = await Active.find({handler:handlerid});
	  for(var active of actives){
		  const dat = {}
		  const booking = await Book.findById(active.booking)
		  dat.booking = booking
		  const invoice = await Invoice.findById(booking.invoice)
		  dat.invoice = invoice
		  result.bookings.total += 1
		  result.bookings.data.push(dat)
	  }
	  result.handler = handler
	  result.active = actives
	  result.company = company
	  return res.status(200).json(result)
	} catch (error) {
	  console.error(error.message)
	  res.status(500).send('Server Error='+error.message)
	}
  })

router.post('/update',auth, async (req, res) => {
	const {  password} = req.body
	const userFields = {}
	if (password){
	  const salt = await bcrypt.genSalt(10)
	  userFields.password = await bcrypt.hash(password, salt)
	}
	
	try {
	  let user = await Handler.findById(req.user.id)
  
	  if (!user) return res.status(404).json({ message: 'Handler not found' })
	  
	  
	  user = await Handler.findByIdAndUpdate(
		user._id,
		{ $set: userFields },
		{ new: true },
	  )
  
	  return res.status(200).json({ message: 'Password changed success' })
	} catch (err) {
	  console.error(err.message)
	  res.status(500).send('Server Error')
	}
  })

//@route PosT api/models/handler
//@description handler add checkin
//@access Private


router.post('/makeEntry',
  [
    auth,
    [
	  check('book', 'Booking is required').not().isEmpty(),
	  check('clockin', 'Clock in Time is required').not().isEmpty(),
    ],
  ], async (req, res) => {
	  const errors = validationResult(req)
	  const msgs = [];
		if (!errors.isEmpty()) {
			for(const e of errors.array()){
				msgs.push(e.msg)
			}
			return res.status(400).send({message: msgs })
		}
	try {
		const handlerid = req.user.id
		const {book,clockin} = req.body
			const handler = await Handler.findById(handlerid)
			if(!handler){
				return res.status(401).json({message:"Anauthorised request"})
			}
			const booking = await Book.findById(book)
			if(!booking){
				return res.status(404).json({message: "Booking not found" })
			}
			const location = await Parking.findById(booking.parking)
			if(handler.company.toString() != location.company.toString()){
				return res.status(401).json({message:"Anauthorised request, Request outside company"})
			}
			const actv = await Active.findOne({booking:booking._id})
			if(actv){
				return res.status(400).json({message:"Booking is Active"})
			}
			
			const inv = await Invoice.findById(booking.invoice)
			
			if(!inv){
				return res.status(400).json({message:"Booking Payment Incomplete, No Invoice"})
			}
			if(inv.complete === false){
				return res.status(400).json({message:"Booking Payment Incomplete"})
			}
			const activeFields = {}
			activeFields.handler = handlerid
			if(booking) activeFields.booking = booking._id
			if(booking) activeFields.user = booking.user
			if(booking) activeFields.spot = booking.spot
			if(booking) activeFields.vehicle = booking.vehicle
			if(clockin) activeFields.clockedin = clockin
			
			const active = new Active(activeFields)
			active.handler = req.user.id
			active.booking = booking
			await active.save()
			if(active){
				const spotFields = {}
				spotFields.occupied = true
				await Spot.findByIdAndUpdate(
				  booking.spot,
				  { $set: spotFields },
				  { new: true },
				)
				await Book.findByIdAndUpdate(
				  booking._id,
				  { $set: {scanned:true} },
				  { new: true },
				)
				return res.status(200).json(active)
			}
		
			return res.status(400).json({message: "Bad request" })
		
		
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})

router.post('/makeExit',
  [
    auth,
    [
	  check('booking', 'Booking is required').not().isEmpty(),
	  check('clockout', 'Clock out time is required').not().isEmpty(),
    ],
  ], async (req, res) => {
	  const errors = validationResult(req)
	  const msgs = [];
		if (!errors.isEmpty()) {
			for(const e of errors.array()){
				msgs.push(e.msg)
			}
			return res.status(400).send({message: msgs })
		}
	try {
		const handlerid = req.user.id
		const {bookingid,clockout} = req.body
		if(bookingid){
			const booking = await Active.find({booking:bookingid})
			if(!booking){
				return res.status(404).json({message: "Booking not found" })
			}
			const activeFields = {}
			
			if(clockout) activeFields.clockedout = clockout
			
			const active = await Active.findByIdAndUpdate(
			  booking._id,
			  { $set: activeFields },
			  { new: true },
			)
			if(active){
				const spotFields = {}
				spotFields.occupied = false
				await Spot.findByIdAndUpdate(
				  booking.spot,
				  { $set: spotFields },
				  { new: true },
			)
			}
			return res.status(200).json(active)
		}
		
		return res.status(400).json({message: "Bad request" })
		
		
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})

router.post(
  '/login',
  async (req, res) => {
    const errors = validationResult(req)
	
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
	
    const {name,password} = req.body
	
    try { 
      let user = await Handler.findOne({ name })
	  
      if (!user) {
        return res.status(400).json({ message: 'Invalid Credentials' })
      }

      const isMatch = await bcrypt.compare(password, user.password)
	  

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid Credentials' })
      }
	  
	  
	  const notification = new Notification({description:"New Login"})
	  var payload
	  
	 notification.user = user
	 payload = {
		user: {
		  id: user.id,
		},
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
		  
          return res.status(200).json({ token: token })
        },
      )
    } catch (error) {
        console.log(error.message)
        res.status(500).send('Server Error')
    }
  },
)



module.exports = router