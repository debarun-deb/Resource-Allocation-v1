const { json } = require("express");
const formModel = require("../models/formModel.js");
var labels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];


exports.queryResults = async (req, res) => {
  let qObj = req.query;
  let results = await formModel.find(qObj);
  res.status(201).json({ status: "success", data: results });
};

exports.calendarArrayObj = async (req, res) => {
  const { user } = req;
  const { location } = user;
  console.log(user);
  try {
    let [...formDates] = await formModel.aggregate([
      {
        $match: { status: "Approved" }, // this match is not wokring properly
      },
      {
        $match: { resourceName: location },
      },
      {
        $project: {
          startDate: {
            $dateToString: { format: "%Y-%m-%d", date: "$startDate" },
          },
          endDate: { $dateToString: { format: "%Y-%m-%d", date: "$endDate" } },
          _id: 0,
        },
      },
    ]);

    res.status(200).json({ status: "success", data: formDates });
  } catch (err) {
    console.log(err);
  }
};


exports.getStartDates = async (req, res) => {
  let qObj = req.body;
  try{
    let results = await formModel.find(qObj, {_id:0,startDate:1});
    if (results.length > 0) res.status(201).json({ status: "success", data: results });
    else res.status(404).json({ status: "no matching documents", data:[]});
}
catch(err){
  res.status(404).json({ status: "fail", data: err.message});
}
}

exports.getAllRequests = async (req, res) => {
  let resName = req.body.resourceName;
  let stat = req.body.status;
  let userEm = req.body.email;
  let qObj= {}
  if(resName || stat || userEm){
    if(resName) qObj.resourceName = resName;
    if(stat) qObj.status = stat;
    if(userEm) qObj.userEmail = userEm; 
  }
  
  console.log(resName,stat,userEm);
  var monthCountList = [0,0,0,0,0,0,0,0,0,0,0,0];


  try{
    let results = await formModel.find(qObj, {_id:0,startDate:1});
    results.forEach((request)=>{
      monthCountList[request.startDate.getMonth()]++;
    })

    if (results.length > 0) res.status(201).json({ status: "success", 
      data:
      {
        labels,
        datasets:[
          {
            label:"Number of Bookings",
            data:monthCountList 
          }
        ]
      }}
      );
    else res.status(200).json({ status: "no matching documents", data:[]});
}
catch(err){
  res.status(404).json({ status: "fail", data: err.message});
}
}




