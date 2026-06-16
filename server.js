const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '0d68429dbfmsh6622338ff42ce1cp1a0a4bjsne9f8a332646f';

app.get('/download', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ success: false, error: 'No URL provided' });
  }

  try {
    const response = await axios.get(
      'https://tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com/index',
      {
        params: { url: url },
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com'
        }
      }
    );

    const d = response.data;

    if (!d || !d.video || d.video.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Video not found or is private'
      });
    }

    res.json({
      success:     true,
      title:       d.description?.[0]   || 'TikTok Video',
      author:      d.author?.[0]        || 'unknown',
      cover:       d.cover?.[0]         || d.dynamic_cover?.[0] || '',
      avatar:      d.avatar_thumb?.[0]  || '',
      play:        d.OriginalWatermarkedVideo?.[0] || d.video?.[0] || '',
      hdplay:      d.video?.[0]         || '',
      mp3:         d.music?.[0]         || '',
      videoid:     d.videoid?.[0]       || '',
      region:      d.region?.[0]        || ''
    });

  } catch (error) {
    console.error('ERROR:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch video. ' + error.message,
      details: error.response?.data
    });
  }
});

app.get('/', (req, res) => {
  res.json({ status: 'TokSnap server is running', version: '1.0.0' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('TokSnap server running on port ' + PORT);
});