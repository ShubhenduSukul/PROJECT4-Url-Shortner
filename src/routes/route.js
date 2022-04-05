const express = require('express');
const router = express.Router();
const Controller=require("../Controller/urlController.js")

router.post("/urlShortern",Controller.urlShort);
router.get("/:urlCode",Controller.redirect)




module.exports = router;