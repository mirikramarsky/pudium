const express = require("express");
const studentService = require("../BL/studentsServise");
const idError = require("../BL/errors/idError");
const DuplicateIdError = require("../BL/errors/DuplicateIdError");
const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        let result = await studentService.get()
        if (result.length != undefined)
            res.send(result)
        else
            res.status(204).send();
    }
    catch {
        next();
    }
});
router.get('/:schoolId', async (req, res, next) => {
    try {
        let result = await studentService.getBySchoolId(req.params.schoolId)        
        if (result != undefined)
            res.json(result || []);
        else
            res.status(204).send();
    }
    catch (err) {
        if (err instanceof idError)
            return res.status(400).send(err.message);
        next(err);
    }
});
router.post('/:schoolId', async (req, res, next) => {
    try {
        console.log("I am in student/:schoolId route", req.body);
        
        let result = await studentService.getStudentsByIds(req.params.schoolId, req.body.studentIds)
        if (result != undefined)
            res.json(result || []);
        else
            res.status(204).send();
    }
    catch (err) {
        if (err instanceof idError)
            return res.status(400).send(err.message);
        next(err);
    }
});
router.get('/goUpGrade/:schoolId', async (req, res, next) => {
    try {
        let result = await studentService.goUpGrade(req.params.schoolId)
        if (result != undefined)
            res.json(result || []);
        else
            res.status(204).send();
    }
    catch (err) {
        if (err instanceof idError)
            return res.status(400).send(err.message);
        next(err);
    }
});
router.get('/classes/:schoolId', async (req, res) => {
    try {
        let result = await studentService.getClassesBySchoolId(req.params.schoolId)
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
router.post('/firstname/:schoolId', async (req, res) => {
    try {
        let result = await studentService.getByFirstName(req.body.firstname, req.params.schoolId)
        if (result != undefined)
            res.json(result || []);
        else
            res.status(204).send();
    }
    catch (err) {
        if (err instanceof idError)
            return res.status(400).send(err.message);
        next(err);
    }
});
router.post('/lastname/:schoolId', async (req, res) => {
    try {
        let result = await studentService.getByLastName(req.body.lastname, req.params.schoolId)
        if (result != undefined)
            res.json(result || []);
        else
            res.status(204).send();
    }
    catch (err) {
        if (err instanceof idError)
            return res.status(400).send(err.message);
        next(err);
    }
});
router.post('/class/:schoolId', async (req, res) => {
    try {
        let result = await studentService.getByClass(req.body.class, req.params.schoolId)
        if (result != undefined)
            res.json(result || []);
        else
            res.status(204).send();
    }
    catch (err) {
        if (err instanceof idError)
            return res.status(400).send(err.message);
        next(err);
    }
});
router.post('/schoolid/:id', async (req, res, next) => {
    try {
        let result = await studentService.getById(req.params.id, req.body.schoolId)
        if (result != undefined)
            res.json(result || []);
        else
            res.status(204).send();
    }
    catch (err) {
        if (err instanceof idError)
            return res.status(400).send(err.message);
        next(err);
    }
});
router.post('/params/', async (req, res, next) => {
    try {
        console.log("studentRoute params", req.body); 
        let result = await studentService.getStudentsByParams(req.body)
        console.log("studentRoute result", result);
        
        if (result != undefined)
            res.json(result || []);
        else
            res.status(204).send();
    }
    catch (err) {
        if (err instanceof idError)
            return res.status(400).send(err.message);
        next(err);
    }
});
router.post('/', async (req, res, next) => {
    try {
        let result = await studentService.insert(req.body);
        res.json(result);
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
     
        let result = await studentService.update(req.params.id, req.body);
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
        let result = await studentService.delete(req.params.id);
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