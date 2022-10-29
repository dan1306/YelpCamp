const Campground = require('../models/campground')
const cities = require('./cities.js')
const {
    places,
    descriptors
} = require('./seedHelpers')
const mongoose = require("mongoose")


require('../config/database');


const sample = (arr) => arr[Math.floor(Math.random() * arr.length)]

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const randothousand = Math.floor(Math.random() * 1000)
        const camp = new Campground({
            location: `${cities[randothousand].city}, ${cities[randothousand].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})