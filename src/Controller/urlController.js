const mongoose = require('mongoose');
const urlModel = require('../models/urlModel')
const shortid = require("shortid");
const res = require('express/lib/response');

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}


const urlShort = async function (req, res) {
    let longUrl = req.body.longUrl
    const urlCode = shortid.generate(longUrl)

    try {
        //let long = longUrl.trim();
        const baseUrl = "http://localhost:3000"

        if (Object.keys(req.body) == 0)
            return res.status(400).send({ status: false, message: "Invalid request parameters. Please provide URL details", });

        if (!isValid(longUrl))
            return res.status(400).send({ status: false, message: "Please provide Long Url." });

        if (!/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/.test(longUrl))
            return res.status(400).send({ status: false, msg: "Invalid url" })

        const alreadyCodeGeneratedByLongUrl = await urlModel.findOne({ longUrl: longUrl });

        if (alreadyCodeGeneratedByLongUrl)
            return res.status(400).send({ status: true, message: `Short URL already generated for this longURL.`,
            });


        const shortUrl = baseUrl + "/" + urlCode;

        const ShorteningUrlData = new urlModel({ longUrl, shortUrl, urlCode, });
        await ShorteningUrlData.save();
        return res.status(201).send({ status: true, message: `Successfully Shorten the URL`, data: ShorteningUrlData, });
    } catch (err) {
        console.log(err.message); 
        return res.status(500).send({ status: false, err: err.message, });
    }
};

const redirect = async function (req, res) {
    try {
        let urlCode = req.params.urlCode
        let findCode = await urlModel.findOne({ urlCode })

        if (!findCode)
            return res.status(404).send({ status: false, msg: "Please provide valid Url" });

        else {
            return res.status(200).redirect(findCode.longUrl)
        }

    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, meg: err.message })
    }
}


module.exports.urlShort = urlShort
module.exports.redirect = redirect;