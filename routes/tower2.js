const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('../config/default.json')
const auth = require('../middlewares/auth')
const Tow = require('../models/Tow')
const Tower = require('../models/Tower')


//@route GET api/models/tower
//@description Get all towings from tower
//@access Private

router.get('/:id', auth, async (req, res) => {
  try {
	const towerid = req.params.id
    const tows  = Tow.find({user:towerid});
    return res.status(200).json(tows)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error='+error.message)
  }
})

//@route PosT api/models/tower
//@description handler add Towing
//@access Private


router.post('/makeEntry',
  [
    auth,
    [
	  check('booking', 'Booking is required').not().isEmpty(),
	  check('towedin', 'Towed in time is required').not().isEmpty(),
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
		const towerid = req.user.id
		const {bookingid,towedin} = req.body
		if(bookingid){
			const booking = Active.find({booking:bookingid})
			if(!booking){
				return res.status(404).json({message: "Booking not found" })
			}
			const activeFields = {}
			if(userid) activeFields.tower = towerid
			
			if(booking) activeFields.user = booking.user
			if(booking) activeFields.vehicle = booking.vehicle
			if(clockin) activeFields.towedin = towedin
			
			const tow = new Tow(activeFields)
			await tow.save()
			return res.status(200).json(tow)
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
	  check('towedout', 'Towed out time is required').not().isEmpty(),
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
		const towerid = req.user.id
		const {bookingid,clockout} = req.body
		if(bookingid){
			const tow = Tow.find({booking:bookingid})
			if(!tow){
				return res.status(404).json({message: "Towing not found" })
			}
			const towedFields = {}
			
			if(clockout) towedFields.towedout = clockout
			
			const towed = await Tow.findByIdAndUpdate(
			  tow._id,
			  { $set: towedFields },
			  { new: true },
			)
			return res.status(200).json(towed)
		}
		
		return res.status(400).json({message: "Bad request" })
		
		
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})



module.exports = router