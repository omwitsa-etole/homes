const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('../config/default.json')
const auth = require('../middlewares/admin')

const Book = require('../models/Booking')
const Vehicle = require('../models/Vehicle')

const Company = require('../models/Company')
const Invoice = require("../models/Invoice")

const Order = require("../models/Order")
const Review = require("../models/Review")
//const upload = multer({ dest: 'files/assets/global/images/uploads/' });
const {formidable} = require('formidable');

//@route GET api/models/admin
//@access Private

router.get('/', auth, async (req, res) => {
	try {
	  const result = {}
	  return res.status(200).json(result)
	} catch (error) {
	  console.error(error.message)
	  res.status(500).send('Server Error')
	}
})

router.post('/editReview/:id', auth, async (req, res) => {
	try {
	  const result = {}
	  const data = req.body
	  const review = await Review.findById(req.params._id)
	  if(!review){
		  result.message = "No review found"
		  return res.status(404).json(result)
	  }
	  result.message = null
	  if(data.delete === true){
		  if(review.company.toString()!== req.user.company){
			  result.message = "Anauthorised request"
			  return res.status(401).json(result)
		  }
		  await Review.findByIdAndDelete(review._id)
		  result.message = "Review removed"
	  }
	  if(data.approve){
		  if(review.company.toString()!== req.user.company){
			  result.message = "Anauthorised request"
			  return res.status(401).json(result)
		  }
		  await Review.findByIdAndUpdate(review._id,{$set:{approve:data.approve}})
		  result.message = "Review updated status to " + data.approved ? "Approved" : "Rejected" 
	  }
	  
	  result.review = review
	  return res.status(200).json(result)
	} catch (error) {
	  console.error(error.message)
	  res.status(500).send('Server Error')
	}
})

router.post('/delivereOrder/:id', auth, async (req, res) => {
	try {
	  const result = {}
	  const book = await Book.findById(req.params._id)
	  if(!book){
		  result.message = "No Order find"
		  return res.status(404).json(result)
	  }
	  if(book.company.toString()!== req.user.company){
		  result.message = "Anauthorised request"
		  return res.status(401).json(result)
	  }
	  
	  const order = await Order.findOne({company:req.user.company,invoice:book.invoice})
	  await Order.findByIdAndUpdate(order._id,{$set:{delivered:true,due:new Date()}})
	  await Book.findByIdAndUpdate(order._id,{$set:{complete:true}})
	  result.message = "Order has been delivered"
	  return res.status(200).json(result)
	} catch (error) {
	  console.error(error.message)
	  res.status(500).send('Server Error')
	}
})

router.post('/deleteOrder/:id',auth,  async (req, res) => {
	try {
	  const result = {}
	  const book = await Book.findById(req.params._id)
	  if(!book){
		  result.message = "No Order found"
		  return res.status(404).json(result)
	  }
	  if(book.company.toString()!== req.user.company){
		  result.message = "Anauthorised request"
		  return res.status(401).json(result)
	  }
	  const invoice = await Invoice.findByIdAndUpdate(book.invoice,{$set:{cancelled:true}})
	  const order = await Order.findOne({company:req.user.company,invoice:book.invoice})
	  await Order.findByIdAndUpdate(order._id,{$set:{cancelled:true}})
	  await Book.findByIdAndDelete(book._id)
	  result.message = "Order has been deleted"
	  return res.status(200).json(result)
	} catch (error) {
	  console.error(error.message)
	  res.status(500).send('Server Error')
	}
})

router.post('/addInventory/:id',  auth,async (req, res) => {
	try {
	  const result = {}
	  const orderid = req.params.id
	  const data = req.body
	  const book = await Book.findById(orderid)
	  if(!book){
	    result.message = "Book order not found"
	  	return res.status(404).json(result)
	  }
	  var order = await Order.findOne({book:orderid})
	  if(order){
		result.message = "Order already added"
		if(data.update && data.update === true && data.new_address){
			var address = order.address ? order.address : []
			address = address.push(data.address)
			order = await Order.findByIdAndUpdate(
				order._id,
				{$set:{address:address}},
				{new:true}
			)
			result.message = "Order address location updated"
		}
		result.order = order
		
		return res.status(200).json(result)
	  }
	  if(data && !data.new){
		  return res.status(406).json({message:"Missing required data"})
	  }
	  order = new Order()
	  order.invoice = book.invoice
	  order.company = req.user.company
	  order.book = orderid
	  order.user = book.user
	  order.vehicle = book.vehicle
	  await order.save()
	  result.order = order
	  result.message = "New Order added to inventory"
	  return res.status(200).json(result)
	} catch (error) {
	  console.error(error.message)
	  res.status(500).send('Server Error')
	}
})

router.post('/getInventory', auth, async (req, res) => {
	try {
	  const result = {}
	  const orders = await Order.find().sort({date:-1}).limit(19)
	  result.orders = []
	  for(var order of orders){
		const r = {}
		const book = await Book.findById(order.book)
		const user = await User.findById(order.user)
		const invoice = await Invoice.findById(order.invoice)
		const vehicle = await Vehicle.findById(order.vehicle)
		r.order = order
		r.vehicle = vehicle
		r.book = book ? book : {complete:false,date:new Date(),user:user._id}
		r.user = user
		r.invoice = invoice
		result.orders.push(r)
	  }
	  return res.status(200).json(result)
	} catch (error) {
	  console.error(error.message)
	  res.status(500).send('Server Error')
	}
})

router.post('/getReviews',auth,  async (req, res) => {
	try {
	  const result = {}
	  const company_id = req.user.company
	  result.reviews = []
	  const reviews = await Review.find({company:company_id}).sort({ date: -1 }).limit(19)
	  for(var review of reviews){
	  	const r = {} 
		r.review = review
	  	const invoice = await Invoice.findById(review.invoice)
		const user = await User.findById(review.user)
		const vehicle = await Review.findById(review.vehicle)
		r.invoice = invoice
		r.user = user
		r.vehicle = vehicle
		r.review = review
		if(invoice){
			const book = await Book.findById(invoice.booking)
			r.book = book ? book : []
			result.reviews.push(r)
		}
	  }
	  result.message = "success"
	  
	  return res.status(200).json(result)
	} catch (error) {
	  console.error(error.message)
	  res.status(500).send('Server Error')
	}
})


router.post('/getCustomers',auth,  async (req, res) => {
	try {
	  const result = {}
	  const company_id = req.user.company
	  const users = await User.find({}).select("-password").sort({ date: -1 }).limit(19)
	  result.users = []
	  for(var user of users){
		const r = {}
		r.user = user
		r.bookings = []
		if(user._id.toString() === req.user.id){continue}
		const book = await Book.find({user:user._id,company:req.user.company}).sort({ date: -1 })
		for(var bk of book){
			const vehicle = await Vehicle.findById(bk.vehicle)
			if(vehicle){
				r.vehicle = vehicle
			}else{
				r.vehicle = {deleted:true}
			}
			
			if(!r.bookings.includes(bk)){
				r.bookings.push(bk)
			}
		}
		result.users.push(r)
	  }
	  result.message = "success"
	  
	  return res.status(200).json(result)
	} catch (error) {
	  console.error(error.message)
	  res.status(500).send('Server Error')
	}
})


router.post('/getOrders',auth,  async (req, res) => {
	try {
	  const result = {}
	  const company_id = req.user.company
	  const vehicles = await Vehicle.find({company:company_id}).sort({ date: -1 }).limit(19)
	  result.vehicles = vehicles
	  result.orders = []
	  result.customers = 0
	  
	  for(var vehicle of vehicles){
		const r = {}
		r.vehicle = vehicle
		const books = await Book.find({vehicle:vehicle._id}).sort({ date: -1 }).limit(19)
		r.books = []
		for(var book of books){
			const user = await User.findById(book.user).select("-password")
			result.customers += 1
			var invoice  = null
			if(!book.invoice){
				invoice = await Invoice.findOne({booking:book._id,user:user._id}).sort({ date: -1 })
				if(invoice){
					await Book.findByIdAndUpdate(
						book._id,
						{$set:{invoice:invoice._id}},
						{new:true}
					)
				}
			}else{
				invoice = await Invoice.findById(book.invoice)
			}
			if(!invoice){
				invoice = new Invoice(book)
				invoice.booking = book._id
				invoice.user = user._id
				invoice.amount = vehicle.description.vehiclePrice
				invoice.vehicle = vehicle._id
				invoice.company = company_id
				await invoice.save()
				await Book.findByIdAndUpdate(
					book._id,
					{$set:{invoice:invoice._id}},
					{new:true}
				)
			}
			if(!invoice.amount || invoice.amount && invoice.amount === ""){
				let pr = vehicle.description.vehiclePrice ?  vehicle.description.vehiclePrice : vehicle.description.vehicleMarketvalue
				
				invoice = await Invoice.findByIdAndUpdate(
					invoice._id,
					{$set:{amount:pr}},
					{new:true}
				)
				invoice.amount = pr
			}
			
			r.books.push({book:book,user:user,invoice:invoice})
		}
		result.orders.push(r)
	  }
	  const invc = await Invoice.find({company:company_id})
	  result.transactions = 0
	  for(var i of invc){
		if(i.cancelled === true){continue}
		result.transactions += 1
	  }

	  result.message = "success"
	  
	  return res.status(200).json(result)
	} catch (error) {
	  console.error(error.message)
	  res.status(500).send('Server Error')
	}
})

router.post('/newVehicle',auth,  async (req, res) => {
	try {
	  const result = {}
	  const data = req.body
	  max = 999999
	  min = 111111
	  if(!data.vehicleFiles || !data.vehiclePrice || !data.vehicleModel || !data.vehicleStatus || !data.vehicleTransmission){
		return res.status(400).json({message:"Required data missing"})
	  }
	  if(data._id && data.update){
		await Vehicle.findByIdAndUpdate(
			data._id,
			{$set:{name:data.vehicleModel,description:data}},
			{new:true}
		)
		return res.status(200).json({message:"Vehicle Updated"})
	  }
	  const vehicle = new Vehicle()
	  vehicle.description = data
	  vehicle.plate = Math.random() * (max - min)+min
	  vehicle.name = data.vehicleModel
	  vehicle.company = req.user.company
	  await vehicle.save()
	  result.message = "New Vehicle created"
	  return res.status(200).json(result)
	} catch (error) {
	  console.error(error.message)
	  res.status(500).send('Server Error')
	}
})

router.post('/updateVehicle/:id',auth,  async (req, res) => {
	try {
	  const result = {}
	  const data = req.body
	  result.message = "incomplete"
	  const vehicle_id = req.params.id
	  const vehicle = await Vehicle.findById(vehicle_id)
	  if(!vehicle){
		  return res.status(404).json({message:"Vehicle not found"})
	  }
	  if(vehicle.company.toString() !== req.user.company){
		  return res.status(401).json({message:"Request Anauthorised"})
	  }
	  if(data.update){
		await Vehicle.findByIdAndUpdate(
			vehicle._id,
			{$set:data},
			{new:true}
		)
		result.message = "Vehicle Updated"
	  }
	 
	  return res.status(200).json(result)
	} catch (error) {
	  console.error(error.message)
	  res.status(500).send('Server Error')
	}
})

router.delete('/deleteVehicle/:id',auth,  async (req, res) => {
	try {
	  const result = {}
	  const vehicle_id = req.params.id
	  const vehicle = await Vehicle.findById(vehicle_id)
	  if(!vehicle){
		  return res.status(404).json({message:"Vehicle not found"})
	  }
	  if(vehicle.company.toString() !== req.user.company){
		  return res.status(401).json({message:"Request Anauthorised"})
	  }
	  await Vehicle.findByIdAndDelete(vehicle_id)
	  const books = await Book.find({vehicle:vehicle_id,complete:false})
	  for(var book of books){
		  await Invoice.findByIdAndUpdate(
			book.invoice,
			{$set:{cancelled:true}},
				{new:true}
		  )
	  }
	  result.message = "Vehicle Removed"
	  return res.status(200).json(result)
	} catch (error) {
	  console.error(error.message)
	  res.status(500).send('Server Error')
	}
})

router.post('/uploadImage',auth,  async (req, res) => {
	try {
	  //upload.single("file"),
	  const result = {};
	  result.message = "incomplete"
	  const form = formidable({ multiples: true });
		form.parse(req, (err, fields, files) => {
			console.log('fields: ', fields);
			console.log('files: ', files);
			result.message = "Successfully uploaded"
			result.success = true
			return res.status(200).json(result)
		});
	  
	  
	} catch (error) {
	  console.error(error.message)
	  res.status(500).send('Server Error')
	}
})

router.post('/vehicleBookings/:id', auth, async (req, res) => {
	try {
	  const company_id = req.user.company
	  const result = {}
	  const vehicle_id = req.params.id
	  const vehicles = await Vehicle.findById(vehicle_id).sort({ date: -1 })
	  if(!vehicles){
		return res.status(404).json({message:"Vehicle not found"})
	  }
	  const book = await Book.find({vehicle:vehicle_id}).sort({ date: -1 }).limit(99)
	  result.bookings = book
	  result.vehicle = vehicles
		
	  return res.status(200).json(result)
	} catch (error) {
	  console.error(error.message)
	  res.status(500).send('Server Error='+error.message)
	}
  })

router.post('/getVehicles', auth, async (req, res) => {
	try {
	  const company_id = req.user.company
	  const result = {}
	  const vehicles = await Vehicle.find({company:company_id}).sort({ date: -1 })
	  result.vehicles = vehicles
	  const r =  {vehicles:[]}
	  for(var vehicle of vehicles){
		var rs = {}
		rs.vehicle = vehicle
		const bookings = await Book.find({vehicle:vehicle._id}).sort({ date: -1 })
		rs.bookings = {data:[],complete:0,total:0}
		for(var book of bookings){
			if(!book.invoice){continue}
			//var invoice = await Invoice.findById(book.invoice)
			if(book.complete === true){
				rs.bookings.complete += 1
			}
			rs.bookings.data.push(book)
			//r.bookings.invoice.push(invoice)
			rs.bookings.total +=1 
		}
		r.vehicles.push(rs)
		
	  }
	  
	  return res.status(200).json(r)
	} catch (error) {
	  console.error(error.message)
	  res.status(500).send('Server Error='+error.message)
	}
  })

router.post('/getAnalysis', auth, async (req, res) => {
	try {
	  const company_id = req.user.company
	  const result = {}
	  const vehicles = await Vehicle.find({company:company_id}).sort({ date: -1 }).limit(19)
	  result.vehicles = {data:vehicles,sale:0,rent:0,total:0,booked:0,complete:0}
	  const books = await Invoice.find({company:company_id}).sort({ date: -1 }).limit(99)
	  result.invoice = books 
	  const bookings = await Book.find({company:company_id}).sort({ date: -1 }).limit(99)
	  result.books = bookings 
	  result.invoice ={data:[],total:0,complete:0,pending:0,cancelled:0,deleted:0}
	  result.booked = []
	  result.latest = []
	  for(var book of books){
			let invoice = book
			if(invoice.cancelled === true){result.invoice.cancelled += 1}
			if(invoice.deleted === true){result.invoice.deleted += 1}
			
			result.vehicles.booked += 1
			if(invoice.complete === true){
				result.invoice.complete += invoice.amount		
				result.vehicles.complete += 1
			}else{
				if(invoice.cancelled === false){
					result.invoice.pending += invoice.amount	
				}
				
			}
			result.invoice.total += invoice.amount
			result.invoice.data.push(invoice)
	  }
	  for(var vehicle of vehicles){
			const r = {}
			r.vehicle = vehicle
			result.vehicles.total += 1
			//console.log(vehicle.description,vehicle)
			if(vehicle.description.vehicleStatus && vehicle.description.vehicleStatus.includes('rent')){
				result.vehicles.rent += 1
			}else{
				result.vehicles.sale += 1
			}
			const book = await Book.find({vehicle:vehicle._id}).sort({ date: -1 })
			r.book = book
			result.booked.push(r)
	  }
	  return res.status(200).json(result)
	} catch (error) {
	  console.error(error.message)
	  res.status(500).send('Server Error='+error.message)
	}
  })


  router.post('/getDetail/:id', auth, async (req, res) => {
	try {
	  const company_id = req.user.company
	  const result = {}
	  const vehicle_id = req.params.id
	  const vehicle = await Vehicle.findById(vehicle_id)
	  if(!vehicle){
		return res.status(404).json({message:" Vehicle not found"})
	  }
	  result.vehicle = vehicle
	  const books = await Book.find({vehicle:vehicle}).sort({ date: -1 }).limit(19)
	  result.books = {data:[],total:0,complete:0}
	  for(var book of books){
		if(book.complete){
			result.books.complete += 1
		}
		const r = {}
		const user = await User.findById(book.user)
		var invoice = await Invoice.findById(book.invoice)
		if(!book.invoice || invoice === null){
			var invoice = new Invoice()
			invoice.user = user._id
			invoice.company = company_id
			invoice.booking = book._id
			invoice.vehicle = vehicle._id
			invoice.amount = vehicle.description.vehiclePrice
			await invoice.save()
			await Book.findByIdAndUpdate(
				book._id,
				{$set:{invoice:invoice._id}},
				{new:true}
			)
		}
		
		
		r.book = book
		r.user = user
		r.invoice = invoice
		result.books.total += 1
		result.books.data.push(r)
	  }
	  return res.status(200).json(result)
	} catch (error) {
	  console.error(error.message)
	  res.status(500).send('Server Error='+error.message)
	}
})


module.exports = router