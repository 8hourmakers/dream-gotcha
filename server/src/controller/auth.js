const Router = require('express').Router;
const User = require('../model/user');
const jwt = require('../util/jwt');

const router = new Router();

router.post('/auth/sign-up', async (req, res) => {
    const email = req.body.email;
    const nickname = req.body.nickname;
    const password = req.body.password;

    if (!await User.isUnique(email, nickname)) {
        res.status(409);
        res.end();
        return;
    }

    const user = await User.createNew({
        email,
        nickname,
        password,
    });

    res.status(200);
    res.json({
        results: user.getData(),
    });
});

router.post('/auth/sign-in', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findByEmail(email);

    if (!user) {
        res.status(401);
        res.end();
        return;
    }

    if (!user.comparePassword(password)) {
        res.status(401);
        res.end();
        return;
    }

    const token = await jwt.sign(user.getData());
    await user.updateToken(token);

    res.status(200);
    res.json({
        results: {
            token,
        },
    });
});

module.exports = router;
