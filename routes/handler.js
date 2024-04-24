const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('../config/default.json')
const auth = require('../middlewares/admin')
const Handler = require('../models/Handler')
const Notification = require('../models/Notification')
const Company = require('../models/Company')
const Active = require('../models/Active')

//@route GET api/handler
//@description Get all handlers
//@access Private

router.get('/getHandlers', auth, async (req, res) => {
  try {
	const userid = req.user.company
    const handlers  = await Handler.find({company:userid}).select("-password");
    return res.status(200).json(handlers)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error='+error.message)
  }
})

router.get('/getHandler/:id', auth, async (req, res) => {
  try {
	const id = req.params.id
    const handlers  = await Handler.findById(id).select("-password");
    return res.status(200).json(handlers)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error='+error.message)
  }
})

router.get('/getDetailed/:id', auth, async (req, res) => {
  try {
	const id = req.params.id
	const result = {}
    const handler  = await Handler.findById(id).select("-password");
	if(handler){
		result.handler = handler
		const company  = await Company.findById(handler.company).select("-password");
		const active  = await Active.find({handler:id}).select("-password");
		result.company = company
		result.active = active
		result.data = {bookings:active.length,active:0,complete:0}
		for(const i of active){
			if(i.clockedout){
				result.data.complete+=1
			}else{
				result.data.active+=1
			}
		}	
	}
	
    return res.status(200).json(result)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error='+error.message)
  }
})

//@route PosT api/handlers
//@description add handler
//@access Private


router.post('/addHandler',
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty(),
	  check('password', 'Password is required').not().isEmpty(),
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
		
		const {name,email,password} = req.body
		
		const handlerFields = {}
		if(name) handlerFields.name = name
		if(email) handlerFields.email = email
		if (password){
			const salt = await bcrypt.genSalt(10)
			handlerFields.password = await bcrypt.hash(password, salt)
		}

		const handler = new Handler(handlerFields)
		const notification = new Notification({description:`Added new Handler ${handler.name} to company`,user:req.user.company})
		handler.company =  req.user.company
		await handler.save()
		await notification.save()
		return res.status(200).json(handler)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})

router.put('/updateHandler/:id', auth, async (req, res) => {
	const handlerid = req.params.id
	var handler =	await Handler.findById(handlerid) 
	if(!handler){
		return res.status(404).send({message: "Handler not found" })
	}
	try {
		const userid = req.user.id
		const {name,password,active,email} = req.body
		
		const handlerFields = {}
		if(name) handlerFields.name = name
		if(active !== undefined && active != null) handlerFields.active = active
		if(email) handlerFields.email = email
		if (password){
			const salt = await bcrypt.genSalt(10)
			handlerFields.password = await bcrypt.hash(password, salt)
		}
		if(handler.company.toString()!==req.user.company){
			return res.status(401).send({message: "Anauthorised request" })
		}
		handler = await Handler.findByIdAndUpdate(
		  handlerid,
		  { $set: handlerFields },
		  { new: true },
		)
		return res.status(200).json(handler)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})

//@route DELETE api/handler
//@description Delete handler
//@access Private

router.delete('/deleteHandler/:id', auth, async (req, res) => {
  try {
    var handler = await Handler.findById(req.params.id)
	const notification = new Notification({description:`Deleted new Handler ${handler.name} to company`,user:req.user.company})
    if (!handler){
		handler = await Tower.findById(req.params.id)
		if (!handler) return res.status(404).json({ message: 'Not found' })
			if(handler.company.toString()!==req.user.company){
				return res.status(401).send({message: "Anauthorised request" })
			}
			
			await Tower.findByIdAndRemove(req.params.id)
			await notification.save()
	}else{
		if(handler.company.toString()!==req.user.company){
			return res.status(401).send({message: "Anauthorised request" })
		}
		
		await Handler.findByIdAndRemove(req.params.id)
		await notification.save()
	} 
	
	
    return res.status(200).json({ message: 'Deleted successfully' })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})



module.exports = router