const mongoose = require('mongoose');
const mongodb =require('mongodb');
//await mongoose.createConnection('mongodb://127.0.0.1:27017/test',)



const userSchema = new mongoose.Schema({ 
	key: mongoose.ObjectId,
	firstname: String,
	lastname : String,
	email: String,
	age: { type: Number, min: 18, max: 65 },
	password:String,
	date:{ type: Date, default: Date.now }
});

const hostelSchema = new mongoose.Schema({
	user:userSchema,
	key: mongoose.ObjectId,
	name:String,
	price: Number,
	date: { type: Date, default: Date.now },
})
/*
//const uri = 'mongodb+srv://etolebradone:lovingson%4023@cluster0.pjipfgw.mongodb.net/'
const uri = 'mongodb://127.0.0.1:27017/'

export class User{
	constructor(user){
		this.Model = mongoose.model('User', userSchema	);
	}
	get(){
		return this.Model
	}
	create(us){
		const user = new this.Model(us);
		this.user = user
		return user
	}
	async save(){
		await this.user.save()
	}
}
export default class DB{
	constructor(db,coll){
		
		this.db = "test"
		this.collection = "user"
		
		this.start()
	}
	async start(myobj){
		const client = mongodb.MongoClient;
		const db = await client.connect(uri, function(err, db) {
			if (err){console.log(err); throw err;}
		    var dbo = db.db(this.db);
			dbo.collection('users')
			dbo.insertOne(myobj, function(err, res) {
				if (err) throw err;
				console.log("1 document inserted");
				
				db.close();
				return res
			});
			
		})
		return db
	}
	create(myobj){
		if(this.collection === "user"){
			const user = new User()
			myobj = user.create({email:"1",password:"12"})
			
			
		}
		this.start(myobj).then((dbo)=>{
			if(dbo){
				console.log(dbo)
			}
		})
		
		
		
		
	}
	
	get(myobj){
		if (myobj === undefined){myobj = {}}
		var dbo = this.start()
		
		dbo.users.findOne(myobj, function(err, res) {
			if (err) throw err;
			console.log("1 document inserted");

			db.close();
			return res
		  });
	}
	query(){
		
	}
}
*/