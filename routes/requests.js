const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('../config/default.json')
const auth = require('../middlewares/auth')
const admin= require('../middlewares/admin')
const Request = require('../models/Request')
const Notification = require('../models/Notification')

const Profile = require('../models/Profile')
const Active = require('../models/Active')
const Book = require('../models/Booking')
const Vehicle = require('../models/Vehicle')

const Company = require("../models/Company.js")
const Paypal = require("../models/Paypal.js")
const Stripe = require("../models/Stripe.js")
const Shipping = require("../models/Shipping.js")
const Tax = require("../models/Tax.js")
//api/request/
///Admin Functions on requests module
router.post('/getCompany',admin,  async (req, res) => {
  try {
	  const result = {}
    const company_id = req.user.company
    const company = await Company.findById(company_id).select("-password")
    if(!company){
      result.message = "Not Authorised"
      return res.status(401).json(result)
    }
    if(!company.profile){
      var new_profile = new Profile(company)
      new_profile.company = company._id
      await new_profile.save()
      company.profile = new_profile._id
      await Company.findByIdAndUpdate(
        company._id,
        {$set:company},
      )
    }
    const profile = await Profile.findById(company.profile)
    result.profile = profile
    result.taxes = []
    for(var tax of company.tax){
      const taxx = await Tax.findById(tax)
      result.taxes.push(taxx)
    }
    result.shippings = []
    for(var ship of company.shipping){
      const shipp  = await Shipping.findById(ship)
      result.shippings.push(shipp)
    }
    result.company = company
    return res.status(200).json(result)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})

router.post('/setCompany',admin,  async (req, res) => {
  try {
	  const result = {}
    const data = req.body
    const company_id = req.user.company
    const company = await Company.findById(company_id).select("-password")
    if(!company){
      result.message = "Not Authorised"
      return res.status(401).json(result)
    }
    if(!company.profile){
      var new_profile = new Profile(company)
      new_profile.company = company._id
      await new_profile.save()
      company.profile = new_profile._id
      await Company.findByIdAndUpdate(
        company._id,
        {$set:company},
      )
    }
    const profile = await Profile.findByIdAndUpdate(
      company.profile,
		  { $set: data },
		  { new: true },
    )
    result.profile = profile
    return res.status(200).json(result)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})


router.post('/Payments',admin,  async (req, res) => {
  try {
	  const result = {}
    const data = req.body 
    const company_id = req.user.company
    const company = await Company.findById(company_id).select("-password")
    if(!company){
      result.message = "Not Authorised"
      return res.status(401).json(result)
    }
    if(!company.paypal){
      var new_paypal = new Paypal()
      new_paypal.company = company._id
      await new_paypal.save()
      company.paypal = new_paypal._id
      await Company.findByIdAndUpdate(
        company._id,
        {$set:company},
      )
    }
    if(!company.stripe){
      var new_stripe = new Stripe()
      new_stripe.company = company._id
      await new_stripe.save()
      company.stripe = new_stripe._id
      await Company.findByIdAndUpdate(
        company._id,
        {$set:company},
      )
    }
    const paypal = await Paypal.findByIdAndUpdate(
      company.paypal,
		  { $set: data },
		  { new: true },
    )
    result.paypal = paypal
    const stripe = await Stripe.findByIdAndUpdate(
      company.stripe,
		  { $set: data },
		  { new: true },
    )
    result.stripe = stripe

    return res.status(200).json(result)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})

router.post('/getShipping',admin,  async (req, res) => {
  try {
	  const result = {}
    const company_id = req.user.company
    const company = await Company.findById(company_id).select("-password")
    if(!company){
      result.message = "Not Authorised"
      return res.status(401).json(result)
    }
    if(!company.shipping){
      var new_shipping = new Shipping()
      new_shipping.company = company._id
      await new_shipping.save()
      company.shipping.push(new_shipping._id)
      await Company.findByIdAndUpdate(
        company._id,
        {$set:company},
      )
    }
    result.shipping = []
    for(var shipping of company.shipping){
      const shipp = await Shiping.findById(shipping)
      result.shipping.push(shipp)
    }
    return res.status(200).json(result)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})


//add,or update shipping by passing shiiping_id in body
router.post('/setShipping',admin,  async (req, res) => {
  try {
	  const result = {}
    const data = req.body
    const company_id = req.user.company
    const company = await Company.findById(company_id).select("-password")
    if(!company){
      result.message = "Not Authorised"
      return res.status(401).json(result)
    }
 
    if(data.shipping_id){
      const shipping = await Shipping.findByIdAndUpdate(
        data.shipping_id,
        { $set: data },
        { new: true },
      )
    }else{
      var new_shipping = new Shipping()
      new_shipping.company = company._id
      await new_shipping.save()
      company.shipping.push(new_shipping._id)
      await Company.findByIdAndUpdate(
        company._id,
        {$set:company},
      )
    }
    
    result.profile = profile
    return res.status(200).json(result)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})

router.post('/setTax',admin,  async (req, res) => {
  try {
	  const result = {}
    const data = req.body
    const company_id = req.user.company
    const company = await Company.findById(company_id).select("-password")
    if(!company){
      result.message = "Not Authorised"
      return res.status(401).json(result)
    }
    const tax = new Tax(data)
    tax.company = company_id
    await tax.save()
    result.tax = tax   
    
    return res.status(200).json(result)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})

router.post('/deleteTax/:id',admin,  async (req, res) => {
  try {
	  const result = {}
    const tax_id = req.params.id
    const company_id = req.user.company
    const company = await Company.findById(company_id).select("-password")
    if(!company){
      result.message = "Not Authorised"
      return res.status(401).json(result)
    }
    var tax = await Tax.findById(tax_id)
    if(!tax){
      result.message = "Reffered tax  not found"
      return res.status(404).json(result)
    }
    await Tax.findByIdAndDelete(tax_id)
    result.tax = tax   
    
    return res.status(200).json(result)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})


module.exports = router