var express = require('express');
const machines = require('../config/mongoose/maquinas');

exports.deleteMachine = async (req, res) => {
    const { id, name } = req.body;

    machines.deleteOne(
        
        { _id: id },
        (err, response) => {
            
            if(err) {
                res.json({err: "error"});
            }
            else {
                console.log(res);
                res.json({msg: "endpoint delete" + name});
            }  
    });
    
};

exports.editMachine = async (req, res) => {
    const { id } = req.body;

    machines.find({
        
        _id: id,
    }, (err, response) => {
        
        if(err){        
            
            res.json({ msg: "Error, no se pudo completar la solicitud", status: false });
        
        } else {
            
            if(response == null){
                res.json({ msg: "no hay maquinas asociadas", status: false });
            }
            else {
                console.log(response);
                res.json({data: response, status: true});
            } 
        }
      });
};

exports.createMachine = async (req, res) => {
    res.json({msg: "endpoint create"});
};

exports.readMachine = async (req, res) => {
    res.json({msg: "endpoint read"});
};