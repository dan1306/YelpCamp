
const Campground = require("../models/campground");

let index =  async (req, res) => {
    const campgrounds = await Campground.find({});
    
    res.render("campgrounds/index", {
        campgrounds,
    });
}

let newCampground =  async (req, res) => {
    console.log(req.user.id)
    res.render("campgrounds/new");
}

let pstNewCampground = async (req, res, next) => {
    
    const campground = new Campground(req.body);

    req.files.map(async (val) => {
        await campground.image.push({ url: val.path, filename: val.filename})
    })
    campground.author = req.user._id
    await campground.save();
    console.log("New campground", campground)
    req.flash("success", "Successfully made a new Campground")
    res.redirect(`/campgrounds/${campground._id}`);
}

let deleCampground = async (req, res) => {
        
    await Campground.findByIdAndDelete(req.params.id);
    req.flash("success", "Successfully Deleted a Campground")
    res.redirect("/campgrounds");
}

let putEdit= async (req, res) => {
        


        
    const campground = await Campground.findByIdAndUpdate(
        req.params.id,
       { ...req.body}
    );
    req.files.map(async (val) => {
        await campground.image.push({ url: val.path, filename: val.filename})
    })
    if (!campground) {
        req.flash("error", "Can not find Campground")
        return res.redirect("/campgrounds")
    }
    await campground.save();
    req.flash("success", "Successfully updatted Campground")

    res.redirect(`/campgrounds/${req.params.id}`);
}

let getEdit = async (req, res) => {

        

    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash("error", "Can not find Campground")
        return res.redirect("/campgrounds")
    }


    res.render("campgrounds/edit", {
        campground,
    });
}


let showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate(
        {
            path: "reviews",
            populate: {
                path: "author"
            }
        }
    ).populate("author");
    console.log("SHOWCAMPGROUND", campground);
    let currentUser
    if (req.user) {
        currentUser = req.user
    } else{
        currentUser = null

    }
    if (!campground) {
        req.flash("error", "Can not find Campground")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/show", {
        campground,
        currentUser
    });
}
module.exports = {
    index,
    newCampground,
    pstNewCampground,
    deleCampground,
    putEdit,
    getEdit,
    showCampground
}