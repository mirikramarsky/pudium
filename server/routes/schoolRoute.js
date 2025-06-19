const express = require("express");
const schoolService = require("../BL/schoolService");
const idError = require("../BL/errors/idError");
const router = express.Router();

router.get('/', async (req, res,next)=>{
    try{
    let result = await schoolService.get()
    if(result.length != undefined)
        res.send(result)
    else
        res.status(204).send();
}
catch{
    next();
}});
router.get('/:id', async(req, res,next)=>{
    try{
        let result = await schoolService.getById(req.params.id)
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
    let result = await schoolService.insert(req.body);
    if(result.location != null)
        res.json(result)
    else
        res.status(204).send();
}
catch(err){
    if (err instanceof idError)
        res.status(400).send(err.message);
    next(err);
}});
router.put('/:id', async(req, res,next)=>{
    try{
        let result = await schoolService.update(req.params.id, req.body);
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
        let result = await schoolService.delete(req.params.id);
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