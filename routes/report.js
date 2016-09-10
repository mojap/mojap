var express = require('express')
var router = express.Router()
var utils = require('../utils')

router.post('/',function(req,res){
  createReport(req.body, function(err, report) {
    if (err) {
     res.statusCode(401)
    } else {
      res.send(report)
    }
  })
})

function createReport(data, callback) {
  utils.async.waterfall([
    function(callback) {
      models.report.createReport(data, callback)
    },
    function(report, callback) {
      if(utils._.isInvalid(report)) {
        return callback(null, null)
      }
      callback(null, report)
    }
  ], callback)
}

/*
function resolveReport(req,res){
  service.reportService.resolveReport(req.body, function(err, report) {
    if (err) {
      routeUtils.handleAPIError(req, res, err, err)
    } else {
      routeUtils.handleAPISuccess(req, res, report)
    }
  })
}

function listReport(req,res){
  service.reportService.listReport(req.param("status"), function(err, event) {
    if (err) {
      routeUtils.handleAPIError(req, res, err, err)
    } else {
      routeUtils.handleAPISuccess(req, res, event)
    }
  })
}
*/

module.exports = router;