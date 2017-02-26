const fs = require('fs');
const Speech = require('@google-cloud/speech');
const Router = require('express').Router;
const last = require('lodash.last');
const Dream = require('../model/dream');
const User = require('../model/user');
const Like = require('../model/like');
const ensureAuth = require('../middlware/ensureAuth');
const upload = require('../middlware/upload');
const logger = require('../util/logger');
const speech = require('../util/speech');

const router = new Router();

router.get('/dream', ensureAuth, async (req, res) => {
    const token = req.token;
    const dreamId = req.params.dreamId;
    const user = await User.findByToken(token);
    let dream;

    if (dreamId && await Dream.isNotExists(dreamId)) {
        res.status(404);
        res.end();
        return;
    }

    if (!dreamId) {
        const dreams = await Dream.findAll({
            order: 'id',
        });

        dream = await Dream.findById(last(dreams).id);
    } else {
        dream = await Dream.findByid(dreamId);
    }

    const dreamData = await dream.getData(user.get('id'));

    res.status(200);
    res.json({
        results: dreamData,
    });
});

router.get('/dream/me', ensureAuth, async (req, res) => {
    const token = req.token;
    const user = await User.findByToken(token);
    const userId = user.get('id');

    const dreams = await Dream.findAll({
        order: 'id',
        where: {
            userId,
        },
    });
    const results = [];

    for (let idx = dreams.length - 1; idx >= 0; idx -= 1) {
        const dream = dreams[idx];
        const d = await Dream.findById(dream.id);
        const data = await d.getData(userId);

        results.push(data);
    }

    res.status(200);
    res.json({
        results,
    });
});

router.post('/dream', ensureAuth, upload.single('audio'), async (req, res) => {
    const audioFile = req.file;
    const token = req.token;
    const user = await User.findByToken(token);

    const fileName = audioFile.filename;
    const filePath = audioFile.path;

    const request = {
        config: {
            encoding: 'LINEAR16',
            language_code: 'ko-KR',
            sampleRate: 16000,
        },
        singleUtterance: false,
        interimResults: false,
    };

    fs
        .createReadStream(filePath)
        .on('error', (err) => {
            logger.error(err);
        })
        .pipe(speech.createRecognizeStream(request))
        .on('error', (err) => {
            logger.error(err);
        })
        .on('data', (data) => {
            if (data.endpointerType ===
                Speech.endpointerTypes.ENDPOINTER_EVENT_UNSPECIFIED) {
                const result = data.results;

                Dream.create({
                    userId: user.get('id'),
                    text: result,
                    audio: fileName,
                    timestamp: new Date().getTime(),
                });
            }
        });

    res.status(200);
    res.json({
        results: {
            success: true,
        },
    });
});

router.put('/dream/:id/like', ensureAuth, async (req, res) => {
    const token = req.token;
    const dreamId = req.params.id;
    const user = await User.findByToken(token);
    const userId = user.get('id');

    if (await Like.isUserLiked(dreamId, userId)) {
        const like = await Like.findOne({
            dreamId,
            userId,
        });

        await like.destroy();
    } else {
        await Like.create({
            dreamId,
            userId,
        });
    }

    res.status(200);
    res.json({
        results: {
            success: true,
        },
    });
});

module.exports = router;
