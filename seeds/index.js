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
        let price = Math.floor(Math.random() * 30) + 10
        const camp = new Campground({
            author: "637556137f115a8e8153c3e4",
            location: `${cities[randothousand].city}, ${cities[randothousand].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: [
                {
                  url: 'https://res.cloudinary.com/dl7q5qslr/image/upload/v1668889257/YelpCamp/ziy3z1uzuytdpvs86p4q.jpg',     
                  filename: 'YelpCamp/ziy3z1uzuytdpvs86p4q',
                },
                {
                  url: 'https://res.cloudinary.com/dl7q5qslr/image/upload/v1668889257/YelpCamp/pbfhrbeoynab3h7vkmjj.jpg',     
                  filename: 'YelpCamp/pbfhrbeoynab3h7vkmjj',
                },
                {
                  url: 'https://res.cloudinary.com/dl7q5qslr/image/upload/v1668889257/YelpCamp/kaezkwhlwywrthymnfsv.jpg',     
                  filename: 'YelpCamp/kaezkwhlwywrthymnfsv',
                },
                {
                  url: 'https://res.cloudinary.com/dl7q5qslr/image/upload/v1668889257/YelpCamp/r7qzmc7yy6rhq9vtpcma.jpg',     
                  filename: 'YelpCamp/r7qzmc7yy6rhq9vtpcma',
                },
                {
                  url: 'https://res.cloudinary.com/dl7q5qslr/image/upload/v1668889258/YelpCamp/n2v3mbdlsjcxcomlumy3.png',     
                  filename: 'YelpCamp/n2v3mbdlsjcxcomlumy3',
                },
                {
                  url: 'https://res.cloudinary.com/dl7q5qslr/image/upload/v1668889259/YelpCamp/oo7ichnmterktejtgagw.jpg',     
                  filename: 'YelpCamp/oo7ichnmterktejtgagw',
                }
              ],
            description: "blah ba blah ba blah",
            price
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})