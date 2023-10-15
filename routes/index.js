const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    // res.render(<name of view>)
  res.render("index");
});

module.exports = router;
