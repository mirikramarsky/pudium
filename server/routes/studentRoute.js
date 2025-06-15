const express = require("express");
const studentService = require("../BL/studentsServise");
const idError = require("../BL/errors/idError");
const router = express.Router();

router.get('/', async (req, res,next)=>{
    try{
    let result = await studentService.get()
    if(result.length != undefined)
        res.send(result)
    else
        res.status(204).send();
}
catch{
    next();
}});
router.get('/schoolid/:schoolId', async(req, res,next)=>{
    try{
        let result = await studentService.getBySchoolId(req.params.schoolId)
        if(result != undefined)
            res.json(result || []);
        else
            res.status(204).send();
    }
    catch(err){
         if (err instanceof idError)
            res.status(400).send(err.message);
        next(err);
    }
});
router.get('/classes/:schoolId', async (req, res) => {
    try{
        let result = await studentService.getClassesBySchoolId(req.params.schoolId)
        if(result != undefined)
            res.json(result || []);
        else
            res.status(204).send();
    }
    catch(err){
         if (err instanceof idError)
            res.status(400).send(err.message);
        next(err);
    }
});
router.post('/:id', async(req, res,next)=>{
    try{
        let result = await studentService.getById(req.params.id,req.body.schoolId)
        if(result != undefined)
            res.json(result || []);
        else
            res.status(204).send();
    }
    catch(err){
         if (err instanceof idError)
            res.status(400).send(err.message);
        next(err);
    }
});
router.post('/params', async(req, res,next)=>{
    try{
        let result = await studentService.getStudentsByParams(req.body)
        if(result != undefined)
            res.json(result || []);
        else
            res.status(204).send();
    }
    catch(err){
         if (err instanceof idError)
            res.status(400).send(err.message);
        next(err);
    }
});
router.post('/', async(req, res,next)=>{
try{
    let result = await studentService.insert(req.body);
    if(result.location != null)
        res.json(result)
    else
        res.status(204).send();
}
catch(err){
    if (err instanceof idError)
        res.status(400).send(err.message);
    console.log(err);
    
    next(err);
}});
router.put('/:id', async(req, res,next)=>{
    try{
        let result = await studentService.update(req.params.id, req.body);
        if(result != undefined)
            res.send(result)
        else
            res.status(204).send();
    }
    catch(err){
         if (err instanceof idError)
            res.status(400).send(err.message);
        next(err);
    }
});
router.delete('/:id', async(req, res,next)=>{
    try{
        let result = await studentService.delete(req.params.id);
        if(result != undefined)
            res.send(result)
        else
            res.status(204).send();
    }
    catch(err){
         if (err instanceof idError)
            res.status(400).send(err.message);
        next(err);
    }
});
module.exports = router;