const express = require('express');
const validUrl = require('valid-url');
const shortid = require('shortid');
const config = require('config');
const Url = require('../models/Url');
const router = express.Router();

// @route        POST /api/url/shorten
// @description  Create short URL
router.post('/shorten', async (req, res) => {
	const baseUrl = config.get('baseURL');
	if (!validUrl.isUri(baseUrl)) {
		res.status(401).json('Invalid Base URL');
	}

	const longUrl = req.body.fullUrl;
	if (!validUrl.isUri(longUrl)) {
		res.status(401).json('Invalid Long URL');
	}

	const urlCode = await getUrlCode(req.body.key);
	// console.log(req.body.fullUrl);
	// console.log(typeof longUrl);
	// console.log(urlCode);
	const url = await getURLObject(longUrl, baseUrl, urlCode);
	res.json(url);
});

async function getUrlCode(urlKey) {
	let id = shortid.generate();
	if (urlKey) {
		try {
			let url = await Url.findOne({ urlKey });
			if (url) {
				urlKey = id;
			}
		} catch (err) {
			console.error(err);
		}
	} else {
		urlKey = id;
	}
	return urlKey;
}

async function getURLObject(longUrl, baseUrl, urlCode) {
	try {
		let url = await Url.findOne({ longUrl });
		if (url) {
			return url;
		} else {
			const shortUrl = baseUrl + '/' + urlCode;
			url = new Url({
				longUrl,
				shortUrl,
				urlCode,
				date: new Date()
			});
			await url.save();
			return url;
		}
	} catch (err) {
		console.error(err);
		res.status(500).json('Server error');
	}
}

module.exports = router;
