const express = require("express");
const stuInSeaService = require("../BL/studentsinsearchesService");
const idError = require("../BL/errors/idError");
const router = express.Router();

router.get('/', async (req, res,next)=>{
    try{
    let result = await stuInSeaService.get()
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
        let result = await stuInSeaService.getById(req.params.id)
        if(result != undefined)
            res.json(result || []);
        else
            res.status(204).send();
    }
    catch(err){
         if (err instanceof idError)
            return res.status(400).send(err.message);
        next(err);
    }
});

router.get('/student/:id', async(req, res,next)=>{
    try{
        let result = await stuInSeaService.getByStudentId(req.params.id)
        if(result != undefined)
            res.json(result || []);
        else
            res.status(204).send();
    }
    catch(err){
         if (err instanceof idError)
            return res.status(400).send(err.message);
        next(err);
    }
});

router.get('/search/:id', async(req, res,next)=>{
    try{
        let result = await stuInSeaService.getBySearchId(req.params.id)
        console.log("results", result);
        
        if(result != undefined)
            res.json(result || []);
        else
            res.status(204).send();
    }
    catch(err){
         if (err instanceof idError)
            return res.status(400).send(err.message);
        next(err);
    }
});

router.post('/', async(req, res,next)=>{
try{
    let result = await stuInSeaService.insert(req.body);
    if(result != null)
        res.json(result)
    else
        res.status(204).send();
}
catch(err){
    if (err instanceof idError)
        return res.status(400).send(err.message);
    
    next(err);
}});
router.post('/:searchid', async(req, res,next)=>{
try{
    let result = await stuInSeaService.insert(req.params.searchid, req.body.studentsid);
    if(result != null)
        res.json(result)
    else
        res.status(204).send();
}
catch(err){
    if (err instanceof idError)
        return res.status(400).send(err.message);
    next(err);
}});

router.put('/:id', async(req, res,next)=>{
    try{
        let result = await stuInSeaService.update(req.params.id, req.body);
        if(result != undefined)
            res.send(result)
        else
            res.status(204).send();
    }
    catch(err){
         if (err instanceof idError)
            return res.status(400).send(err.message);
        next(err);
    }
});
router.delete('/:id', async(req, res,next)=>{
    try{
        let result = await stuInSeaService.delete(req.params.id);
        if(result != undefined)
            res.send(result)
        else
            res.status(204).send();
    }
    catch(err){
         if (err instanceof idError)
            return res.status(400).send(err.message);
        next(err);
    }
});
module.exports = router;