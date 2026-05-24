const fs = require('fs');
const path = require('path');
const https = require('https');

const mode = process.argv[2];
const repo = process.env.GITHUB_REPOSITORY;
const token = process.env.GITHUB_TOKEN;
const eventPath = process.env.GITHUB_EVENT_PATH;
const releasePath = path.resolve(__dirname, '../../docs/release_notes.md');

if (!['pr', 'weekly'].includes(mode)) {
  console.error('Usage: node update-release-notes.js <pr|weekly>');
  process.exit(1);
}

if (!repo) {
  console.error('GITHUB_REPOSITORY is required.');
  process.exit(1);
}

if (!token) {
  console.error('GITHUB_TOKEN is required.');
  process.exit(1);
}

function readReleaseNotes() {
  return fs.readFileSync(releasePath, 'utf8');
}

function writeReleaseNotes(content) {
  fs.writeFileSync(releasePath, content, 'utf8');
}

function formatEntry(pr) {
  const number = pr.number;
  const title = (pr.title || '').replace(/\s+/g, ' ').trim();
  const url = pr.html_url || `https://github.com/${repo}/pull/${number}`;
  const author = pr.user?.login || 'unknown';
  const mergedAt = pr.merged_at ? pr.merged_at.slice(0, 10) : (pr.closed_at ? pr.closed_at.slice(0, 10) : new Date().toISOString().slice(0, 10));
  return `- **[#${number}](${url})** - ${title} *by @${author}, merged ${mergedAt}.*`;
}

function insertIntoAutoSection(content, block) {
  const marker = '## Auto-generated release notes';
  const markerIndex = content.indexOf(marker);
  if (markerIndex === -1) {
    throw new Error(`Could not find marker section '${marker}' in ${releasePath}`);
  }

  const afterMarker = content.indexOf('\n', markerIndex) + 1;
  const before = content.slice(0, afterMarker);
  let remainder = content.slice(afterMarker);

  if (remainder.trimStart().startsWith('- This section receives automated updates')) {
    remainder = remainder.replace(/- This section receives automated updates[\s\S]*?(?=\n## |$)/, '');
  }

  return before + block + '\n\n' + remainder.trimStart();
}

function alreadyContains(content, prNumber) {
  return content.includes(`[#${prNumber}]`) || content.includes(`PR #${prNumber}`);
}

function apiGet(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path,
      method: 'GET',
      headers: {
        'User-Agent': 'github-actions',
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(body));
          } catch (err) {
            reject(err);
          }
        } else {
          reject(new Error(`GitHub API request failed: ${res.statusCode} ${res.statusMessage} ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function fetchMergedPRs() {
  const now = new Date();
  const since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const sinceIso = since.toISOString().slice(0, 10);
  const untilIso = now.toISOString().slice(0, 10);
  const query = encodeURIComponent(`repo:${repo} is:pr is:merged merged:${sinceIso}..${untilIso}`);
  const path = `/search/issues?q=${query}&sort=updated&order=desc&per_page=100`;

  const data = await apiGet(path);
  return data.items || [];
}

async function runPrMode() {
  if (!eventPath || !fs.existsSync(eventPath)) {
    console.error('GITHUB_EVENT_PATH is missing or invalid.');
    process.exit(1);
  }

  const event = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
  const pr = event.pull_request;
  if (!pr) {
    console.log('No pull_request payload found. Skipping.');
    return;
  }

  if (!pr.merged) {
    console.log(`PR #${pr.number} was closed without merge. Skipping.`);
    return;
  }

  const content = readReleaseNotes();
  if (alreadyContains(content, pr.number)) {
    console.log(`PR #${pr.number} already exists in release notes. Skipping.`);
    return;
  }

  const entry = formatEntry(pr);
  const block = entry + '\n';
  const updated = insertIntoAutoSection(content, block);
  writeReleaseNotes(updated);
  console.log(`Added PR #${pr.number} to release notes.`);
}

function formatWeekRange() {
  const now = new Date();
  const since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startDate = since.toISOString().slice(0, 10);
  const endDate = now.toISOString().slice(0, 10);
  return `Week of ${startDate} to ${endDate}`;
}

async function runWeeklyMode() {
  const prs = await fetchMergedPRs();
  if (!prs.length) {
    console.log('No merged PRs found in the last 7 days. Nothing to update.');
    return;
  }

  const content = readReleaseNotes();
  const entries = prs
    .filter((pr) => !alreadyContains(content, pr.number))
    .map(formatEntry);

  if (!entries.length) {
    console.log('All recent merged PRs already exist in release notes. Skipping.');
    return;
  }

  const dateLabel = formatWeekRange();
  const block = [`### Weekly release note update - ${dateLabel}`, ''];
  entries.forEach((entry) => block.push(entry));

  const updated = insertIntoAutoSection(content, block.join('\n') + '\n');
  writeReleaseNotes(updated);
  console.log(`Added ${entries.length} weekly release note entries.`);
}

(async () => {
  if (mode === 'pr') {
    await runPrMode();
  } else {
    await runWeeklyMode();
  }
})();
