const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('../config/default.json')
const auth = require('../middlewares/auth')
const Book = require("../models/Booking")
const Company = require("../models/Company")
const Vehicle = require("../models/Vehicle")
const Alert = require("../models/Notification")
const Invoice = require('../models/Invoice')
const Wish = require("../models/Wish")
const Review = require('../models/Review')
const Checkout = require("../models/Checkout")
const Payment = require("../models/Payment")

router.post('/deleteAlert/:id',auth,  async (req, res) => {
	try {
		
		await Alert.findByIdAndDelete(req.params.id)
		return res.status(200).json({message:"Alert removed"})
	}catch(e){console.log(e);
		res.status(500).send('Server Error')
	}
})

router.post('/newAlert',auth,  async (req, res) => {
	try {
		const data = req.body
		if(!data.price){
			return res.status(400).json({message:"Missing required data price"})
		}
		const newalert = new Alert(data)
		newalert.user = req.user.id
		await newalert.save()
		return res.status(200).json({alert:newalert,message:"New alert created"})
	}catch(e){console.log(e);
		res.status(500).send('Server Error')
	}
})

router.post('/checkAlert',auth,  async (req, res) => {
	try {
		const result = {}
		const data = req.body
		const user_id  = req.user.id
		const alerts = await Alert.find({user:user_id}).sort({date:-1})
		let from = new Date()
		alerts.map(function(alt){
			let dt = new Date(alt.date)
			if(dt.getTime() <  from.getTime){
				from = dt
			}
		})
		result.alerts = {}
		const vehicles = await Vehicle.find({createdAt: { $gte: from } }).sort({date:-1})
		for(var alat of alerts){
			for(var vehicle of vehicles){
				if(vehicle.description.vehiclePrice <= alat.price){
					if(!alat._id in result.alerts){
						result.alerts[alat._id] = []
					}
					result.alerts[alat._id].push({vehicle:vehicle,alert:alat})
				}
			}
		}
		return res.status(200).json(result)
	}catch(e){console.log(e);
		res.status(500).send('Server Error')
	}
})

router.post('/updateCard',auth,  async (req, res) => {
	try {
	  const result = {}
	  const user_id = req.user.id
	  const data = req.body
	  const user = await User.findById(user_id)
	  const card = await Payment.findOne({user:user_id})
	  result.message = "No card data"
	  console.log(data)
	  if(card){
		if(data.id){
			await Payment.findByIdUpdate(
				card._id,
				{$set:{id:data.id,description:data}},
				{new:true}
			)
			card.id = data.id
			card.description = data
			result.card = card
			result.message = "User card data Updated"
		}else{
			result.card = card
			return res.status(200).json(result)
		}
	  }else{
		
			var newcard = new Payment()
			newcard.user = user_id
			newcard.id = data.id ? data.id : null
			newcard.description = data
			await newcard.save()
			result.card = newcard
			result.message = "Created new card"
		
	  }
	  
	  return res.status(200).json(result)
	} catch (error) {
	  console.error(error.message)
	  res.status(500).send('Server Error')
	}
})


router.post('/updateStripe',auth,  async (req, res) => {
	try {
	  const result = {}
	  const user_id = req.user.id
	  const {stripe_id} = req.body
	  const user = await User.findById(user_id)
	  if(stripe_id && !user.stripe_id){
		  
		  await User.findByIdAndUpdate(
			user_id,
			{$set:{stripe_id:stripe_id}},
				{new:true},
		  )
	  }
	  result.message = "Stripe Id Updated"
	  return res.status(200).json(result)
	} catch (error) {
	  console.error(error.message)
	  res.status(500).send('Server Error')
	}
})

router.post('/updateCheckout',auth,  async (req, res) => {
	try {
	  const result = {}
	  const user_id = req.user.id
	  const data = req.body
	  const user = await Checkout.findOne({id: { $ne: null },user:user_id})
	  if(user){
		if(data.id !== user.id){
			return res.status(400).json({message:"Checkout data do not correspond"})
		}
		const checkoutInvoices = []
		if(data.payment_status === "paid" || data.status && data.status === "succeeded"){
			const dt = new Date()
			const books = await Book.find({user:user_id})
			const invoice = await Invoice.find({user:user_id,complete:false,cancelled:false})
			for(var inv of invoice){
				await Invoice.findByIdAndUpdate(
					inv._id,
					{$set:{complete:true,due:dt}},
					{new:true}
				)
				checkoutInvoices.push(inv._id)
			}
			for(var book of books){
				await Book.findByIdAndUpdate(
					book._id,
					{$set:{complete:true}},
					{new:true}
				)
			}
			await Checkout.findByIdAndUpdate(
				user._id,
				{$set:{complete:true,invoices:checkoutInvoices}},
				{new:true}
			)
			result.message = "Checkout Updated"
		}else{
			result.message = "Checkout status is unpaid"
		}
	  }
	  
	  return res.status(200).json(result)
	} catch (error) {
	  console.error(error.message)
	  res.status(500).send('Server Error')
	}
})

router.post('/saveCheckout',auth,  async (req, res) => {
	try {
	  const result = {}
	  const user_id = req.user.id
	  const data = req.body
	  console.log(data)
	  if(data.id !== null){
		const found = await Checkout.findOne({user:user_id,complete:false})
		//console.log(found)
		if(found){
			await Checkout.findByIdAndUpdate(
				found._id,
				{$set:{description:data,id:data.id}},
				{new:true}
			)
			
			/*const invoice = await Invoice.find({user:user_id,complete:false,cancelled:false})
			for(var inv of invoice){
				await Invoice.findByIdAndUpdate(
					inv._id,
					{$set:{complete:true}},
					{new:true}
				)
			}*/
			return res.status(200).json({message:"Checkout completed & updated",checkout:found})
		}else{
			const checkout = new Checkout()
			checkout.id = data.id
			checkout.description = data
			
			checkout.user = user_id
			await checkout.save()
			result.checkout = checkout
			result.message = "Added new checkout"
			return res.status(200).json(result)
		}	
		
	}	
	
	  const found = await Checkout.findOne({id: { $ne: null },user:user_id,complete:false})
	  if(found){
		result.message = "Checkout found, proceed to complete"
		result.checkout = found
	  	return res.status(200).json(result)
	  }
	  const checkout = new Checkout()
	  checkout.id = null
	  
	  checkout.user = user_id
	  await checkout.save()
	  result.checkout = checkout
	  result.message = "Added new  checkout"
	  return res.status(200).json(result)
	} catch (error) {
	  console.error(error.message)
	  res.status(500).send('Server Error')
	}
})

router.post('/addReview/:id',auth,  async (req, res) => {
	try {
	  const result = {}
	  const user_id = req.user.id
	  const order_id = req.params.id
	  const {description,rating} = req.body
	  const book = await Book.findById(order_id)
	  if(!book){
		return res.status(404).json({message:"No booking found"})
	  }
	  if(book.complete === false){
		return res.status(400).json({message:"You will be able to submit a review after your have completed your purchase"})
	  }
	  const review = new Review()
	  review.invoice = book.invoice
	  review.description = description
	  review.rating = rating
	  review.user = user_id
	  review.company = book.company
	  review.vehicle = book.vehicle
	  await review.save()
	  
	  result.message = "Added review"
	  return res.status(200).json(result)
	} catch (error) {
	  console.error(error.message)
	  res.status(500).send('Server Error')
	}
})

router.post('/getReviews',auth,  async (req, res) => {
	try {
	  const result = {}
	  result.reviews = {data: [],total:0}
	  const user_id = req.user.id
	  const invoices = await Review.find({user:user_id})
	  for(var invoice of invoices){
		const r = {}
		r.invoice = invoice
		const book = await Book.findOne({vehicle:invoice.vehicle,user:user_id,invoice:invoice.invoice})
		
		const vehicle = await Vehicle.findById(invoice.vehicle)
		r.vehicle = vehicle
		r.book = book
		if(book && book.complete === true){
			result.wishlist.complete.push(r)
		}else{
			result.wishlist.pending.push(r)
		}
		result.wishlist.total += 1
		
	  }
	
	  return res.status(200).json(result)
	} catch (error) {
	  console.error(error.message)
	  res.status(500).send('Server Error')
	}
})



router.post('/getCart',auth,  async (req, res) => {
	try {
	  const result = {}
	  result.cart = {complete:[],pending: [],total:0,amount:0}
	  const user_id = req.user.id
	  const invoices = await Invoice.find({user:user_id})
	  for(var invoice of invoices){
		const r = {}
		r.invoice = invoice
		const book = await Book.findById(invoice.booking)
		if(book){
			const vehicle = await Vehicle.findById(book.vehicle)
			r.vehicle = vehicle
			r.book = book
			if(invoice.complete === true){
				result.cart.complete.push(r)
			}else{
				result.cart.pending.push(r)
			}
			if(!invoice.amount || invoice.amount === ""){
				var pr = vehicle.description.vehiclePrice ? vehicle.description.vehiclePrice : 1
				r.invoice = await Invoice.findByIdAndUpdate(
					invoice._id,
					{$set:{amount: pr}},
					{new:true}
				)
			
			}
			result.cart.total += 1
			if(invoice.complete === false){
				result.cart.amount += invoice.amount
			}
			
		}
	  }
	
	  return res.status(200).json(result)
	} catch (error) {
	  console.error(error.message)
	  res.status(500).send('Server Error')
	}
})

router.post('/getWish',auth,  async (req, res) => {
	try {
	  const result = {}
	  result.wishlist = {complete:[],pending: [],total:0}
	  const user_id = req.user.id
	  const invoices = await Wish.find({user:user_id})
	  for(var invoice of invoices){
		const r = {}
		r.invoice = invoice
		const book = await Book.findOne({vehicle:invoice.vehicle,user:user_id})
		
		const vehicle = await Vehicle.findById(invoice.vehicle)
		r.vehicle = vehicle
		r.book = book
		if(book && book.complete === true){
			result.wishlist.complete.push(r)
		}else{
			result.wishlist.pending.push(r)
		}
		result.wishlist.total += 1
		
	  }
	
	  return res.status(200).json(result)
	} catch (error) {
	  console.error(error.message)
	  res.status(500).send('Server Error')
	}
})

router.post('/addWish',auth,  async (req, res) => {
	try {
	  const result = {}
	  const user_id = req.user.id
	  const {vehicle_id}= req.body
	  if(!vehicle_id){
		return res.status(400).json({nessage:"No vehicle identified"})
	  }
	  const vehicle = await Vehicle.findById(vehicle_id)
	  if(!vehicle){
		result.message = "Vehicle not available"
		return res.status(404).json(result)
	  }
	  const wished = await Wish.findOne({user:user_id,vehicle:vehicle_id})
	  if(wished){
		await Wish.findByIdAndRemove(wished._id)
		return res.status(200).json({message:"Removed from wishlist"})
	  }
	  const company = await Company.findById(vehicle.company)
	  const wish = new Wish()
	  wish.user = user_id
	  wish.vehicle = vehicle_id
	  wish.company = company._id
	  await wish.save()
	  result.message = "Added to wishlist"
	  return res.status(200).json(result)
	} catch (error) {
	  console.error(error.message)
	  res.status(500).send('Server Error')
	}
})



router.post('/addCart',auth,  async (req, res) => {
	try {
	  const result = {}
	  const user_id = req.user.id
	  const {vehicle_id}= req.body
	  if(!vehicle_id){
		return res.status(400).json({nessage:"No vehicle identified"})
	  }
	  const vehicle = await Vehicle.findById(vehicle_id)
	  if(!vehicle){
		result.message = "Vehicle not available"
		return res.status(404).json(result)
	  }
	  const booked = await Book.findOne({user:user_id,vehicle:vehicle_id,complete:false})
	  if(booked){
		return res.status(200).json({message: "Already booked",book:booked})
	  }else{
		  const company = await Company.findById(vehicle.company)
		  const invoice = new Invoice()
		  const book = new Book()
		  book.description = vehicle.description
		  book.vehicle = vehicle_id
		  book.user = req.user.id
		  book.company = company._id
		  invoice.company = company._id
		  invoice.booking = book._id
		  invoice.user = user_id
		  book.invoice = invoice._id
		  invoice.amomunt = vehicle.description.vehiclePrice 
		  await invoice.save()
		  await book.save()
		  result.message = "Booking complete"
	  }
	  
	  return res.status(200).json(result)
	} catch (error) {
	  console.error(error.message)
	  res.status(500).send('Server Error')
	}
})


router.post('/deleteBook/:id',auth,  async (req, res) => {
	try {
	  const result = {}
	  const data = req.body
	  const book_id = req.params.id
	  const book = await Book.findById(book_id)
	  if(!book){
		result.message = "Book not available"
		return res.status(404).json(result)
	  }
	  if(book.user.toString() === req.user.id){
		if(book.complete === false){
			await Invoice.findByIdAndUpdate(
				book.invoice,
				{$set:{cancelled:true}},
				{new:true}
			)
		}else{
			await Invoice.findByIdAndUpdate(
				book.invoice,
				{$set:{deleted:true}},
				{new:true}
			)
		}
		await Book.findByIdAndDelete(book._id)
		result.message = "Booking removed succsffully"
	  }else{
		result.message = "Anaouthirised acess"
		return res.status(401).jons(result)
	  }
	  return res.status(200).json(result)
	} catch (error) {
	  console.error(error.message)
	  res.status(500).send('Server Error')
	}
})



//@route DELETE api/models/users
//@description Delete a vehicle
//@access Private

router.delete('/deleteVehicle/:id', auth, async (req, res) => {
  try {
   
    return res.status(200).json({ message: 'Vehicle removed' })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

router.post('/getOrder/:id', auth, async (req, res) => {
	try {
	  const userid = req.user.id
	  const result = {}
	  const invoice = await Invoice.findById(req.params.id)
	  if(!invoice){
		return res.status(404).json({message:"Invoice not found"})
	  }
	  const book = await Book.findById(invoice.booking)
	  if(book){
		const vehicle = await Vehicle.findById(book.vehicle)
		result.vehicle = vehicle
		result.book = book
	  }
	  result.invoice = invoice
	  
	  return res.status(200).json(result)
	} catch (error) {
	  console.error(error.message)
	  res.status(500).send('Server Error='+error.message)
	}
  })

//@route GET api/models/users
//@description Get user Payment
//@access Private

router.post('/getBookings', auth, async (req, res) => {
  try {
	const userid = req.user.id
	const result = {}
    const books = await Book.find({user:userid})
	result.bookings = []
	for(var book of books){
		const r = {}
		r.book = book
		const company = await Company.findOne({company:book.company})
		r.company = company
		const vehicle = await Vehicle.findById(book.Vehicle)
		r.vehicle= vehicle
		data = []
		for(var categ of vehicle.category){
			const category = await Category.findById(categ)
			data.push(category)
		}
		r.vehicle.category = data
		result.bookings.push(r)
	}
    return res.status(200).json(result)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error='+error.message)
  }
})

router.post('/getVehicle/:id',  async (req, res) => {
	try {
	  
	  const result = {}
	  const vehicle_id = req.params.id
	  const vehicles = await Vehicle.findById(vehicle_id)
	  if(!vehicles){
		return res.status(404).json({message:"No vehicle with specified ID found"})
	  }
	  const company = await Company.findById(vehicles.company)
	  result.company = company ? company : {}
	  result.vehicle = vehicles
		
	  return res.status(200).json(result)
	} catch (error) {
	  console.error(error.message)
	  res.status(500).send('Server Error='+error.message)
	}
})

router.post('/getVehicles',  async (req, res) => {
	try {
	  
	  const result = {}
	  const vehicles = await Vehicle.find({})
	  result.vehicles = vehicles
		
	  return res.status(200).json(result)
	} catch (error) {
	  console.error(error.message)
	  res.status(500).send('Server Error='+error.message)
	}
})

  router.post('/getCategories/:id',  async (req, res) => {
	try {
	  
	  const result = {}
	  const Vehicle_id = req.params.id
	  const Vehicle = await Vehicle.findById(Vehicle_id)
	  if(!Vehicle){
		result.message = "Vehicle not found"
		return res.status(404).json(result)
	  }
	  result.Vehicle = Vehicle
	  categs = []
	  for(var category_id of Vehicle.categories){
		if(category_id !== ''){
			const category = await Category.findById(category_id)
			if(category){
				categs.push(category)
			}
		}
	  }
	  result.categories = categs
	  return res.status(200).json(result)
	} catch (error) {
	  console.error(error.message)
	  res.status(500).send('Server Error='+error.message)
	}
  })


module.exports = router