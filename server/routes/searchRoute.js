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
            res.status(400).send(err.message);
        next(err);
    }
});
router.get('/without/students/saved/', async (req, res, next) => {
    try {
        let result = await searchService.getSearchesWithoutStudents()
        if (result != undefined)
            res.json(result || []);
        else
            res.status(204).send();
    }
    catch (err) {
        if (err instanceof idError)
            res.status(400).send(err.message);
        next(err);
    }
});
router.get('/with/students/saved/', async (req, res, next) => {
    try {
        let result = await searchService.getSearchesWithStudents()
        if (result != undefined)
            res.json(result || []);
        else
            res.status(204).send();
    }
    catch (err) {
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
            res.status(400).send(err.message);
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
            res.status(400).send(err.message);
        next(err);
    }
});
router.post('/send-approval-mail/:searchId/school/:schoolid', async (req, res) => {
    try {
        await searchService.sendApprovalMail(req.params.searchId, req.params.schoolid, req.body);
        res.status(200).json({ message: 'המייל נשלח בהצלחה' });
    } catch (err) {
        console.error(err);
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
            res.status(400).send(err.message);
        next(err);
    }
});
router.get('/:id/delete', async (req, res) => {
    const { id } = req.params;
    try {
        await searchService.delete(id);
        res.send(`<div dir="rtl" style="font-family: Arial">✔️ החיפוש נמחק בהצלחה</div>`);
    } catch (err) {
        console.error(err);
        res.status(500).send(`<div dir="rtl" style="font-family: Arial; color:red">❌ שגיאה במחיקה</div>`);
    }
});

router.post('/:id/approve', async (req, res) => {
    const { id } = req.params;
    console.log(`body : ${JSON.stringify(req.body)}`)
    const studentsRaw = req.body.studentsid || '[]';
    console.log("I in approve Route");

    let studentsids;
    try {
        console.log(  JSON.parse(studentsRaw));
    } catch (e) {
        return res.status(400).send(`<div dir="rtl">שגיאה בפורמט הנתונים</div>`);
    }
    try {
        await stuInSeaService.insert(id, studentsids);
        res.send(`<div dir="rtl" style="font-family: Arial">✔️ החיפוש נשמר ואושר בהצלחה</div>`);
    } catch (err) {
        console.error(err);
        res.status(500).send(`<div dir="rtl" style="font-family: Arial; color:red">❌ שגיאה בשמירה</div>`);
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
            res.status(400).send(err.message);
        next(err);
    }
});
module.exports = router;