// api/tts.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { text, voice = 'keli_hailuo' } = req.query;

  console.log('Received request URL:', req.url);

  if (!text) {
    console.log('Missing text parameter');
    return res.status(400).send('Missing text parameter. Please provide a "text" query parameter.');
  }

  console.log('Received text:', text);

  const apiUrl = 'https://hailuo-free-api-hwl9.onrender.com/v1/audio/speech';
  
  const keys = [
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjU3OTI5NjEsInVzZXIiOnsiaWQiOiIyNzQ2NDYzMjAzNTQxNTI0NTAiLCJuYW1lIjoi5bCP6J665bi9MjQ1MCIsImF2YXRhciI6Imh0dHBzOi8vY2RuLnlpbmdzaGktYWkuY29tL3Byb2QvdXNlcl9hdmF0YXIvMTcwNjI2NzU0NDM4OTgyMDgwMS0xNzMxOTQ1NzA2Njg5NjU4OTZvdmVyc2l6ZS5wbmciLCJkZXZpY2VJRCI6IjI3NDUyNjU4NDc3MzUyMTQxNCIsImlzQW5vbnltb3VzIjpmYWxzZX19.kNJ6a0sApshdI19qgVerkXCgD7YruV299-apG2nz43w',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjU3OTI3OTksInVzZXIiOnsiaWQiOiIyNTM0ODMyNTQ4MDc1Mjc0MjciLCJuYW1lIjoi5bCP6J665bi9NzQyNyIsImF2YXRhciI6Imh0dHBzOi8vY2RuLnlpbmdzaGktYWkuY29tL3Byb2QvdXNlcl9hdmF0YXIvMTcwNjI2NzU0NDM4OTgyMDgwMS0xNzMxOTQ1NzA2Njg5NjU4OTZvdmVyc2l6ZS5wbmciLCJkZXZpY2VJRCI6IjI1MzQ4MzI1NDU2NDI1Nzc5NiIsImlzQW5vbnltb3VzIjpmYWxzZX19.a42wq0TFN8bPqDkoeEfp8lHItNO65O-lCiZwHi2ezZo',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjU3OTIyNjgsInVzZXIiOnsiaWQiOiIyNzQ2NDM1NDcxMzA2NzkzMDAiLCJuYW1lIjoi5bCP6J665bi9OTMwMCIsImF2YXRhciI6Imh0dHBzOi8vY2RuLnlpbmdzaGktYWkuY29tL3Byb2QvdXNlcl9hdmF0YXIvMTcwNjI2NzM2NDE2NDQwNDA3Ny0xNzMxOTQ1NzA2Njg5NjU4OTZvdmVyc2l6ZS5wbmciLCJkZXZpY2VJRCI6IjI3NDY0MzI5MDM1OTU4NjgyNSIsImlzQW5vbnltb3VzIjpmYWxzZX19.dSgDyrV_qsREu8MLwNSHYlHpgPwwdEFdolOWfdc4bz0'
  ];

  const authorization = keys.join(',');

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authorization}`,
        'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "hailuo",
        input: text,
        voice: voice
      })
    });

    if (!response.ok) {
      console.log('API response not OK:', response.status, response.statusText);
      return res.status(response.status).send(`Error fetching audio: ${response.status} ${response.statusText}`);
    }

    const audioData = await response.buffer();
    const fileName = `audio_${Date.now()}.mp3`;  // 生成唯一的文件名
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(audioData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(`Internal server error: ${error.message}`);
  }
};
