var express = require('express');

var multer  = require('multer');
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/')
	},
	filename: function (req, file, cb) {

		var getFileExt = function(fileName){
			var fileExt = fileName.split(".");
			if( fileExt.length === 1 || ( fileExt[0] === "" && fileExt.length === 2 ) ) {
				return "";
			}
			return fileExt.pop();
		}
		cb(null, Date.now() + '.' + getFileExt(file.originalname))
	}
});

var upload = multer({ storage: storage });

var router = express.Router();
router.get('/',function(req,res){
	res.send("Hello Sir");
});

router.get('/users/:id',function(req,res){
	mongoose.model('users').find(function(err,users){
		res.send(users);
	});
});

router.post('/users/fileupload',upload.single('avatar'),function(req,res){
	//res.end(req.files);
	var fileData = req.file;
	console.log("got files "+fileData.path);
	console.log("filename "+fileData.originalname);
	 res.send({
		 fileName:fileData.originalname,
		 filePath : fileData.path
	 });
});

module.exports = router;
