const express = require('express');
const pool = require('./DAL/db');

const app = express();
app.use(express.json());


const schoolRoute = require('./routes/schoolRoute');
const searchRoute = require('./routes/searchRoute');
const staffRoute = require('./routes/staffRoute');
const studentRoute = require('./routes/studentRoute');

app.use(cors());

app.use(express.json());
app.use('/api/podium/schools', schoolRoute);
app.use('/api/podium/searches', searchRoute);
app.use('/api/podium/staff', staffRoute);
app.use('/api/podium/students', studentRoute);

app.get('/api/podium', async (req, res,next)=>{
    try{
    let result = "wellcome to podium"
    if(result.length != undefined)
        res.send(result)
    else
        res.status(204).send();
}
catch{
    next();
}});
app.use((err ,req, res, next)=>{
    res.status(500).send('sorry,😶😶😶😶😟😟😟😳😳 an error in app, pleasy runn again later...')
});
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`I am running at http://0.0.0.0:${port}`);
});
