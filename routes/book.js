const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User')

const Book = require('../models/Booking')
const Vehicle = require('../models/Vehicle')


const Invoice = require('../models/Invoice')
const Notification = require('../models/Notification')

const History = require('../models/History')


const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('../config/default.json')
const auth = require('../middlewares/auth')
const Company = require('../models/Company')

//@route GET api/booking
//@description Get all bookings
//@access Private

router.get('/getBookings', auth, async (req, res) => {
  try {
	const userid = req.user.id
    const bookings = await Book.find({ user:userid })
	const result = {}
	result.bookings = []
	for(const booking of bookings){
		const r = {}
		const invoice = await Invoice.findOne({booking:booking._id})
		const user = await User.findById(booking.user).select("-password")
		const vehicle = await Vehicle.findById(booking.vehicle)
		const company = await Company.findById(booking.company).select("-password")
		r.invoice = invoice
		r.user = user
		r.vehicle = vehicle
		r.company = company
		result.bookings.push(result)		
	}
    return res.status(200).json(found)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error='+error.message)
  }
})

router.get('/getBooking/:id', auth, async (req, res) => {
    
    const userid = req.user.id
	const bookid = req.params.id
	const result = {}
    try {
		const booking = await Book.findById(bookid)
		if(!booking){
			return res.status(404).json({message:"No booking found"})
		}
		if(booking){
			result.message = "success"
			result.book = booking
			const invoice = await Invoice.findOne({booking:booking._id})
			const user = await User.findById(booking.user).select("-password")
			const vehicle = await Vehicle.findById(booking.vehicle)
			const company = await Company.findById(booking.company).select("-password")
			result.invoice = invoice
			result.user = user
			result.vehicle = vehicle
			result.company = company
			return res.status(200).json(result)
		}
    } catch (error) {
      console.log(error.message)
      res.status(500).send('Server Error')
    }
})

router.put('/updateBooking/:id', auth, async (req, res) => {
  try {
	const stats = req.body
	const bookid = req.params.id
    const booking = await Book.findById(bookid)
	if(!booking){
		return res.status(404).json({message:"No booking found"})
	}
	await Book.findByIdAndUpdate(
		booking._id,
		{ $set: stats },
		 { new: true },
	)
	
    return res.status(200).json({message:"Booking updated success"})
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error='+error.message)
  }
})


//@route POST api/booking
//@description Add new booking
//@access Private

router.post('/newBooking/:id', auth, async (req, res) => {
    try{
		const data = req.body
		const vehicle_id = req.params.id
		const vehicle = await Vehicle.findById(vehicle_id)
		if(!vehicle){
			return res.status(404).json({message:"Vehicle not found"})
		}
		const book = await Book.find({vehicle:vehicle_id})
		if(book.length > vehicle.description.vehicleMax){
			return res.status(400).json({message:"Maximum orders already fullfilled"})
		}
		const invoice = new Invoice()
		const order = new Book()
		order.vehicle = vehicle_id
		order.user = req.user.id
		order.description = data
		invoice.company = vehicle.company
		invoice.user = vehicle.user
		invoice.booking = order._id
		invoice.amount = vehicle.description.vehiclePrice
		await invoice.save()
		await order.save()
		return res.status(200).json({book:order,message:"Order placed successfully"})

	}catch(e){
		console.error(err.message)
    res.status(500).send('Server Error')
	}
 })

router.delete('/deleteBooking/:id', auth, async (req, res) => {
  try {
    
	const userid = req.user.id
	const bookid = req.params.id
	const book = await Book.findById(bookid)
    if (!book) return res.status(404).json({ message: 'Booking not found' })

    // Make sure user owns contact
    if (book.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    await Book.findByIdAndRemove(req.params.id)
	await Invoice.findByIdAndUpdate(
		book.invoice,
	  { $set: {deleted:true,date:Date.now()} },
	  { new: true },
	)
	
    return res.status(200).json({ message: 'Booking removed' })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})


router.get('/getAll/users', auth, async (req, res) => {
  try {
	
    const users = await User.find({  }).select("-password")
	const found = []
	
	
    return res.status(200).json(users)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error='+error.message)
  }
})

module.exports = router
