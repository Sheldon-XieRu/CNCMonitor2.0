var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var multer = require('multer');
var datalist = new Array();
var outdatalist = new Array();
var formidable = require('formidable');
var fs = require('fs');
app.use(express.static(__dirname + '/client'));

app.use(bodyParser.json());

Fault = require('./models/fault');

//connect to mongoose
mongoose.connect('mongodb://localhost/CNCMonitor');
var db = mongoose.connection;

app.get('/',function (req,res) {
	res.send('Please use /api/faults or /api/');
})

app.listen(3000);
console.log('Running on port 3000');



app.get('/api/faults',function (req,res) {
	Fault.getFaults(function(err,faults){
		if (err) {
			throw err;
		}
		res.json(faults);
	});
});


app.get('/api/faults/:_id',function (req,res) {
	Fault.getFaultById(req.params._id,function(err,fault){
		if (err) {
			throw err;
		}
		res.json(fault);
	});
});


app.get('/api/findFaultsWithDate/:_beginDate/:_endDate',function (req,res) {
    console.log(req.params._beginDate);
    console.log(req.params._endDate);

    Fault.findFaultByDate(req.params._beginDate,req.params._endDate,function (err,faults) {
        if (err) {
            throw err;
        }
        res.json(faults);
    });
});

app.post('/api/faults',function(req,res){
	var fault = req.body;
	Fault.addFault(fault,function(err,fault) {
		if (err) {
			throw err;
		}
		res.json(fault);
	})
});

app.put('/api/faults/:_id',function(req,res){
	var id = req.params._id;
	var fault = req.body;
	Fault.updateFault(id,fault,{},function(err,fault) {
		if (err) {
			throw err;
		}
		res.json(fault);
	})
});

app.delete('/api/faults/:_id',function(req,res){
	var id = req.params._id;
	Fault.deleteFault(id,function(err,fault) {
		if (err) {
			throw err;
		}
		res.json(fault);
	})
});




//处理实时传感器数据

app.get('/datalist',function (req,res) {
    res.json(outdatalist);
});


var net = require('net');
// var client = new net.Socket();

var server = net.createServer(function (socket) {
    socket.on('data',function (data) {
        var response = data.toString().trim();
        var strs = new Array();
        strs=response.split(",");
        strs.splice(1,1);

        datalist = datalist.concat(strs);

        if (datalist.length >= 11024){
            var temlist = datalist;
            var k;

            var temOut = [];
            for (k=0;k<temlist.length-1;k++){
                var num = new Number(temlist[k]);
                // console.log(num);
                if (num > 1){
                    continue;
                }

                temOut.push(num * 10000000000000);
            };
            outdatalist = temOut;
            // console.log(outdatalist);

            console.log(Math.max.apply(Math, outdatalist));
            datalist = [];
        }

    });

    socket.on('end',function () {
        outdatalist = [];
        console.log('end');
    })
});

//上传模块
// var storage = multer.diskStorage({ //multers disk storage settings
//         destination: function (req, file, cb) {
//             cb(null, '/client/uploads/');
//         },
//         filename: function (req, file, cb) {
//             var datetimestamp = Date.now();
//             cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
//         }
//     });


// var upload = multer({ //multer settings
//                 storage: storage
//             }).single('file');

// var upload = multer({ dest: 'client/uploads/' })

/** API path that will upload the files */
// app.post('/upload', function(req, res) {
//     res.json(req.files);
// });

app.post('/file-upload', function(req, res, next) {
  var form = new formidable.IncomingForm();

  form.parse(req,function (err,fields,files) {
      req.body = fields;
      req.files = files;
      res.json(files);
      // res

      for (var i in req.files) {
        fs.renameSync(files[i].path,"client/uploads/"+files[i].name);
      }
  });

});


server.listen(1338);

console.log("data server is Running on port 1338");

