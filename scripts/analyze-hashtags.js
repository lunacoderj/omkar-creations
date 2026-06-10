const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'dataset_ig-reels-scraper_2026-06-09_08-34-00-416.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const hashtagCounts = {};

data.forEach(post => {
  if (post.hashtags && Array.isArray(post.hashtags)) {
    post.hashtags.forEach(tag => {
      const lowerTag = tag.toLowerCase().replace('#', '');
      hashtagCounts[lowerTag] = (hashtagCounts[lowerTag] || 0) + 1;
    });
  }
});

const sortedTags = Object.entries(hashtagCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 30);

console.log("Top 30 Hashtags:");
sortedTags.forEach(([tag, count]) => {
  console.log(`${tag}: ${count}`);
});
