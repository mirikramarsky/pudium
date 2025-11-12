const express = require("express");
const searchService = require("../BL/searchService");
const idError = require("../BL/errors/idError");
const stuInSeaService = require("../BL/studentsinsearchesService");
const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        let result = await searchService.get()
        if (result.length != undefined)
            res.send(result)
        else
            res.status(204).send();
    }
    catch {
        next();
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        let result = await searchService.getById(req.params.id)
        if (result != undefined)
            res.json(result || []);
        else
            res.status(204).send();
    }
    catch (err) {
        if (err instanceof idError)
           return  res.status(400).send(err.message);
        next(err);
    }
});
router.get('/student/:studentId', async (req, res, next) => {
    try {
        let result = await searchService.getByStudentId(req.params.studentId)
        if (result != undefined)
            res.json(result || []);
        else
            res.status(204).send();
    }
    catch (err) {
        if (err instanceof idError)
           return  res.status(400).send(err.message);
        next(err);
    }
});
router.get('/without/students/saved/:id', async (req, res, next) => {
    try {
        let result = await searchService.getSearchesWithoutStudents(req.params.id)
        if (result != undefined)
            res.json(result || []);
        else
            res.status(204).send();
    }
    catch (err) {
        if (err instanceof idError)
           return  res.status(400).send(err.message);
        next(err);
    }
});
router.get('/with/students/saved/:id', async (req, res, next) => {
    try {
        console.log("getting searches with students for id:", req.params.id);
        
        let result = await searchService.getSearchesWithStudents(req.params.id)
        if (result != undefined)
            res.json(result || []);
        else
            res.status(204).send();
    }
    catch (err) {
        if (err instanceof idError)
          return   res.status(400).send(err.message);
        next(err);
    }
});
router.get('/:id/students', async (req, res) => {
    try {
        const students = await getStudentsBySearchId(req.params.id);
        res.json(students);
    } catch (err) {
        if (err instanceof idError)
          return   res.status(400).send(err.message);
        next(err);
    }
});
router.post('/params', async (req, res, next) => {
    try {
        let result = await searchService.getByParams(req.body)
        if (result != undefined)
            res.json(result || []);
        else
            res.status(204).send();
    }
    catch (err) {
        if (err instanceof idError)
           return  res.status(400).send(err.message);
        next(err);
    }
});
router.post('/', async (req, res, next) => {
    try {
        let result = await searchService.insert(req.body);
        if (result != null)
            res.status(201).json({ id: result });
        else
            res.status(204).send();
    }
    catch (err) {
        if (err instanceof idError)
           return  res.status(400).send(err.message);
        next(err);
    }
});
router.post('/send-approval-mail/:searchId/school/:schoolid', async (req, res) => {
    try {
        await searchService.sendApprovalMail(req.params.searchId, req.params.schoolid, req.body);
        res.status(200).json({ message: 'המייל נשלח בהצלחה' });
    } catch (err) {
        res.status(500).json({ error: 'שגיאה בשליחת המייל' });
    }
});
router.put('/:id', async (req, res, next) => {
    try {
        let result = await searchService.update(req.params.id, req.body);
        if (result != undefined)
            res.send(result)
        else
            res.status(204).send();
    }
    catch (err) {
        if (err instanceof idError)
           return  res.status(400).send(err.message);
        next(err);
    }
});
router.get('/:id/delete', async (req, res) => {
    const { id } = req.params;
    try {
        await searchService.delete(id);
        res.send(`<div dir="rtl" style="font-family: Arial">✔️ החיפוש נמחק בהצלחה</div>`);
    } catch (err) {
        res.status(500).send(`<div dir="rtl" style="font-family: Arial; color:red">❌ שגיאה במחיקה</div>`);
    }
});
router.post('/:id/approve', async (req, res) => {
    const { id } = req.params;
    const studentsRaw = req.body.studentsid || '[]';
    try {
    } catch (e) {
        return res.status(400).send(`<div dir="rtl">שגיאה בפורמט הנתונים</div>`);
    }
    try {
        await stuInSeaService.insert(id, studentsRaw);
        res.send(`<div dir="rtl" style="font-family: Arial">✔️ החיפוש נשמר ואושר בהצלחה</div>`);
    } catch (err) {
        res.status(500).send(`<div dir="rtl" style="font-family: Arial; color:red">❌ שגיאה בשמירה</div>`);
    }
});
router.delete('/deleteSaerch/:id', async (req, res, next) => {
    try {
        let result = await searchService.deleteSearch(req.params.id);
        if (result != undefined)
            res.send(result)
        else
            res.status(204).send();
    }
    catch (err) {
        if (err instanceof idError)
           return res.status(400).send(err.message);
        next(err);
    }
});
router.delete('/:id', async (req, res, next) => {
    try {
        let result = await searchService.delete(req.params.id);
        if (result != undefined)
            res.send(result)
        else
            res.status(204).send();
    }
    catch (err) {
        if (err instanceof idError)
           return res.status(400).send(err.message);
        next(err);
    }
});
module.exports = router;