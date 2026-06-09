const fs = require('fs');

const data = JSON.parse(fs.readFileSync('C:\\Users\\user\\Downloads\\dataset_ig-reels-scraper_2026-06-09_08-34-00-416.json', 'utf8'));

const hashtagCounts = {};
const wordCounts = {};

data.forEach(reel => {
  const tags = reel.hashtags || [];
  tags.forEach(t => {
    const clean = t.replace(/^#/, '').toLowerCase();
    hashtagCounts[clean] = (hashtagCounts[clean] || 0) + 1;
  });

  if (reel.caption) {
    const words = reel.caption.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
    words.forEach(w => {
      if (w.length > 3) {
        wordCounts[w] = (wordCounts[w] || 0) + 1;
      }
    });
  }
});

const topHashtags = Object.entries(hashtagCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 50);

const topWords = Object.entries(wordCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 50);

console.log('--- TOP HASHTAGS ---');
topHashtags.forEach(([t, c]) => console.log(`${t}: ${c}`));

console.log('\n--- TOP WORDS ---');
topWords.forEach(([w, c]) => console.log(`${w}: ${c}`));
