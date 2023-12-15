const express = require('express');
const path = require('path')
const app = express();

app.use(express.json())
app.use(express.static(path.join(__dirname, './public')));

app.set('PORT', process.env.PORT || 3000);
app.use("/", require('./routes/index'))
app.listen(app.get('PORT'), () =>{
    console.log('Por puerto 3000')
})

