const express = require('express')
const app = express()
const path = require('path')
const Campground = require('./models/campground')
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/catchAsync')

require('./config/database');

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));


app.get('/', (req, res) => {
    res.render('home')
})

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {
        campgrounds
    })
})

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds/new', catchAsync(async (req, res, next) => {
    try {
        const campground = new Campground(req.body)
        await campground.save()
        res.redirect(`/campgrounds/${campground._id}`)
    }
    catch (e) {
        next(e)
}
}))

app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', {
        campground
    })
})



app.get('/makeCampGround', async (req, res) => {
    const camp = new Campground({
        title: "daniel"
    })
    await camp.save()
    res.send('camp')
})

app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', {
        campground
    })
})

app.put('/campgrounds/:id/edit', async (req, res) => {
    console.log(req.body)
    let campground = await Campground.findByIdAndUpdate(req.params.id, req.body)
    await campground.save()

    res.redirect(`/campgrounds/${req.params.id}`)
})

app.delete('/campgrounds/:id', async (req, res) => {
    let delCampground = await Campground.findByIdAndDelete(req.params.id)
    res.redirect('/campgrounds')
})


app.use((err, req, res, next) => {
    res.send("There is something wrong here")
})
app.listen(3000, () => {
    console.log('Port 3000')
})