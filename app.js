const express = require('express')
const app = express()
const path = require('path')
const Campground = require('./models/campground')


require('./config/database');

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))



app.get('/', (req, res) => {
    res.render('home')
})

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/k')
})


app.get('/makeCampGround', async (req, res) => {
    const camp = new Campground({
        title: "daniel"
    })
    await camp.save()
    res.send('camp')
})



app.listen(3000, () => {
    console.log('Port 3000')
})