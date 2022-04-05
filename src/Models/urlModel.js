const mongoose = require('mongoose')

const urlSchema = new mongoose.Schema({
    urlCode:{
        type:String,
        trim:true
    },
    
    longUrl: {
        type: String,
        required: "Long URL is required",
        trim:true

    },
    shortUrl:{
        type:String,
        trim:true
    }

})

module.exports = mongoose.model('url', urlSchema)