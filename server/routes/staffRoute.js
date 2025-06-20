const express = require("express");
const staffService = require("../BL/staffService");
const idError = require("../BL/errors/idError");
const router = express.Router();

router.get('/', async (req, res,next)=>{
    try{
    let result = await staffService.get()
    if(result.length != undefined)
        res.send(result)
    else
        res.status(204).send();
}
catch{
    next();
}});
// router.get('/:id', async(req, res,next)=>{
//     try{
//         let result = await staffService.getById(req.params.id)
//         if(result != undefined)
//             res.json(result || []);
//         else
//             res.status(204).send();
//     }
//     catch(err){
//          if (err instanceof idError)
//             res.status(400).send(err.message);
//         next(err);
//     }
// });
router.get('/schoolId/:id', async(req, res,next)=>{
    try{
        let result = await staffService.getBySchoolId(req.params.id)
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
router.get('/schoolId/:schoolId/id/:id', async(req, res,next)=>{
    try{
        let result = await staffService.getBySchoolIdAndId(req.params.schoolId,req.params.id)
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
    let result = await staffService.insert(req.body);
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
        let result = await staffService.update(req.params.id, req.body);
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
// router.put('/changeName/:id', async(req, res,next)=>{
//     try{
//         let result = await staffService.updateName(req.params.id, req.body);
//         if(result != undefined)
//             res.send(result)
//         else
//             res.status(204).send();
//     }
//     catch(err){
//          if (err instanceof idError)
//             res.status(400).send(err.message);
//         next(err);
//     }
// });
router.delete('/:id', async(req, res,next)=>{
    try{
        let result = await staffService.delete(req.params.id, req.body.schoolId);
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