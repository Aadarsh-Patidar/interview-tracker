const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

mongoose.connect(process.env.MONGO_URI);

const SECRET = "placementtrackersecret";

const User = mongoose.model("User", {
    username: String,
    password: String
});

/* Register */
app.post("/register", async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
        username: req.body.username,
        password: hashedPassword
    });

    await user.save();

    res.send("User Registered Successfully ✅");
});

/* Login */
app.post("/login", async (req, res) => {
    const user = await User.findOne({
        username: req.body.username
    });

    if (!user) {
        return res.send("User Not Found ❌");
    }

    const valid = await bcrypt.compare(
        req.body.password,
        user.password
    );

    if (!valid) {
        return res.send("Wrong Password ❌");
    }

    const token = jwt.sign(
        { username: user.username },
        SECRET
    );

    res.json({
        message: "Login Success",
        token: token
    });
});