const express = require("express");
const searchService = require("../BL/searchService");
const idError = require("../BL/errors/idError");
const router = express.Router();

router.get('/', async (req, res,next)=>{
    try{
    let result = await searchService.get()
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
        let result = await searchService.getById(req.params.id)
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
router.get('/:id/students', async (req, res) => {
    try {
        const students = await getStudentsBySearchId(req.params.id);
        res.json(students);
    } catch (err) {
         if (err instanceof idError)
            res.status(400).send(err.message);
        next(err);
    }
});
router.post('/params', async(req, res,next)=>{
    try{
        let result = await searchService.getByParams(req.body)
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
    let result = await searchService.insert(req.body);
    if(result != null)
        res.status(201).json({ id: result });
    else
        res.status(204).send();
}
catch(err){
    if (err instanceof idError)
        res.status(400).send(err.message);    
    next(err);
}});
router.post('/send-approval-mail/:searchId', async (req, res) => {
    const { searchId } = req.params;
    try {
        await searchService.sendApprovalMail(searchId);
        res.status(200).json({ message: 'המייל נשלח בהצלחה' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאה בשליחת המייל' });
    }
});
router.put('/:id', async(req, res,next)=>{
    try{
        let result = await searchService.update(req.params.id, req.body);
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
        let result = await searchService.delete(req.params.id);
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