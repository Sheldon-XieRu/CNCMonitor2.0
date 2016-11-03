var mongoose = require('mongoose');

//Genre Schema

var faultSchema = mongoose.Schema({
	title:{
		type: String,
		required: true
	},
	number:{
		type: String,
		required: true
	},
	level:{
		type:String,
		required: true
	},
	description:{
		type: String,
	},
	machine_type:{
		type: String,

	},
	location:{
		type: String,
	},	
	factory:{
		type: String,
	},
	image_url:{
		type: String,
	},
	occur_date:{
		type: Date,
		default: Date.now,
	},
	manu_man_name:{
		type: String,
	},
	manu_man_tel:{
		type: String,
	}
});

var Fault = module.exports = mongoose.model('faults',faultSchema);

//Get Genres 

module.exports.getFaults = function (callback,limit) {
	Fault.find(callback).limit(limit);
}

module.exports.getFaultById = function (id,callback) {
	Fault.findById(id,callback);
}

module.exports.addFault = function (fault,callback) {
	Fault.create(fault,callback);
}

//Update Genre
module.exports.updateFault = function (id,fault,options,callback) {
	var query = {_id:id};
	var update = {
		title: fault.title,
		level: fault.level,
		number:fault.number,
		description:fault.description,
		machine_type:fault.machine_type,
		location:fault.location,
		factory:fault.factory,
		occur_date:fault.occur_date,
		manu_man_name:fault.manu_man_name,
		manu_man_tel:fault.manu_man_tel,
		image_url:fault.image_url
	}
	Fault.findOneAndUpdate(query,update,options,callback);
}


module.exports.deleteFault= function (id,callback) {
	var query = {_id:id};
	Fault.remove(query,callback);
}


module.exports.findFaultByDate = function(beginDate,endDate,callback){
	var query = {
		occur_date:{
		"$gte": new Date(beginDate),
        "$lt":new Date(endDate)
	}
	}

	Fault.find(query,callback);
}


