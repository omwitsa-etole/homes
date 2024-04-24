const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('../config/default.json')
const auth = require('../middlewares/admin')
const Tower = require('../models/Tower')
const Notification = require('../models/Notification')
const Company = require('../models/Company')
const Tow = require('../models/Tow')

//@route GET api/tower
//@description Get all towers
//@access Private

router.get('/getTowers', auth, async (req, res) => {
  try {
	const userid = req.user.company
    const towers  = await Tower.find({company:userid}).select("-password");
    return res.status(200).json(towers)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error='+error.message)
  }
})

router.get('/getTower/:id', auth, async (req, res) => {
  try {
	const id = req.params.id
    const towers  = await Tower.findById(id).select("-password");
    return res.status(200).json(towers)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error='+error.message)
  }
})

router.get('/getDetailed/:id', auth, async (req, res) => {
  try {
	const id = req.params.id
	const result = {}
    const tower  = await Tower.findById(id).select("-password");
	if(tower){
		result.tower = tower
		const company  = await Company.findById(tower.company).select("-password");
		const active  = await Tow.find({tower:id}).select("-password");
		result.company = company
		result.active = active
		result.data = {towings:active.length,active:0,complete:0}
		for(const i of active){
			if(i.towedout){
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

//@route PosT api/towers
//@description add a tower
//@access Private


router.post('/addTower',
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
		const userid = req.user.id
		const {name,password,email} = req.body
		
		const towerFields = {}
		if(name) towerFields.name = name
		if(email) towerFields.email = email
		if (password){
			const salt = await bcrypt.genSalt(10)
			towerFields.password = await bcrypt.hash(password, salt)
		}

		const tower = new Tower(towerFields)
		const notification = new Notification({description:`Added new Tower ${tower.name} to company`,user:req.user.company})
		tower.company = req.user.company
		await tower.save()
		await notification.save()
		return res.status(200).json(tower)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})

router.put('/updateTower/:id', auth, async (req, res) => {
	const towerid = req.params.id
	const tower =	await Tower.findById(towerid) 
	if(!tower){
		return res.status(404).send({message: "Tower not found" })
	}
	try {
		
		const {name,password,active,rate} = req.body
		
		const towerFields = {}
		if(name) towerFields.name = name
		if(active !== undefined && active != null) towerFields.active = active
		if(rate) towerFields.rate = rate
		if (password){
			const salt = await bcrypt.genSalt(10)
			towerFields.password = await bcrypt.hash(password, salt)
		}
		if(tower.company.toString()!==req.user.company){
			return res.status(401).send({message: "Anauthorised request" })
		}
		const tower = await Tower.findByIdAndUpdate(
		  towerid,
		  { $set: towerFields },
		  { new: true },
		)
		return res.status(200).json(tower)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})

//@route DELETE api/tower
//@description Delete tower
//@access Private

router.delete('/deleteTower/:id', auth, async (req, res) => {
  try {
    const tower = await Tower.findById(req.params.id)

    if (!tower) return res.status(404).json({ message: 'tower not found' })
	if(tower.company.toString()!==req.user.company){
		return res.status(401).send({message: "Anauthorised request" })
	}
    const notification = new Notification({description:`Deleted Tower ${tower.name} to company`,user:req.user.company})
    await Tower.findByIdAndRemove(req.params.id)
	await notification.save()
    return res.status(200).json({ message: 'tower removed' })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})



module.exports = router