function info(msg){
	console.log("info"+msg)
}

function sever(msg){
	console.log("sever::"+msg)
}

module.exports={
	info:info,
	sever:sever
}