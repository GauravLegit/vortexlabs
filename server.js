const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = fs.existsSync(path.join(__dirname, 'index.html')) ? __dirname : path.join(__dirname, 'public');
const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');
const RESOURCES_FILE = path.join(DATA_DIR, 'resources.json');
const GALLERY_FILE = path.join(PUBLIC_DIR, 'gallery-data.json');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'images', 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Initial default reviews
const defaultReviews = [
  {
    id: 1,
    author: 'Alex K.',
    role: 'Owner, CraftRealms Network',
    service: 'Plugins',
    rating: 5,
    content: 'Gaurav coded a custom duel & matchmaking plugin for our network in just 4 days. Zero bugs, clean Java 21 codebase, and our TPS never dipped below 20.0 with 350 players online. Truly high tier!',
    date: '2 days ago'
  },
  {
    id: 2,
    author: 'Sarah M.',
    role: 'Community Lead, Apex Legends Hub',
    service: 'Discord bots',
    rating: 5,
    content: 'VortexLabs completely revamped our community Discord. The custom ticket bot with transcript saving and automated store role sync saved our staff team 20+ hours every week. Worth every penny.',
    date: '1 week ago'
  },
  {
    id: 3,
    author: 'Marcus T.',
    role: 'Founder, PixelSurvive SMP',
    service: 'Survival & Configs',
    rating: 5,
    content: 'Ordered the Survival setup with custom DeluxeMenus configs. The layout, RGB messages, and economy balance are sublime. Gaurav answered every question immediately on Discord. 10/10 service!',
    date: '2 weeks ago'
  }
];

if (!fs.existsSync(REVIEWS_FILE)) {
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(defaultReviews, null, 2));
}

if (!fs.existsSync(INQUIRIES_FILE)) {
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify([], null, 2));
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Endpoints
  if (pathname === '/api/reviews' && req.method === 'GET') {
    try {
      const data = fs.readFileSync(REVIEWS_FILE, 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to read reviews' }));
    }
    return;
  }

  if (pathname === '/api/reviews' && req.method === 'POST') {
    try {
      const payload = await readBody(req);
      if (!payload.author || !payload.content) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing required fields' }));
        return;
      }

      const reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE, 'utf8'));
      const newReview = {
        id: Date.now(),
        author: payload.author,
        role: payload.role || 'Verified Client',
        service: payload.service || 'General Service',
        rating: payload.rating || 5,
        content: payload.content,
        date: 'Just now'
      };

      reviews.unshift(newReview);
      fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, review: newReview }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to save review' }));
    }
    return;
  }

  if (pathname === '/api/contact' && req.method === 'POST') {
    try {
      const inquiry = await readBody(req);
      if (!inquiry.name || !inquiry.discord || !inquiry.details) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing required fields' }));
        return;
      }

      inquiry.id = Date.now();
      inquiry.receivedAt = new Date().toISOString();

      let inquiries = [];
      try {
        inquiries = JSON.parse(fs.readFileSync(INQUIRIES_FILE, 'utf8'));
      } catch (err) {
        inquiries = [];
      }

      inquiries.unshift(inquiry);
      fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2));

      console.log(`[VortexLabs] New commission inquiry from: ${inquiry.name} (${inquiry.discord}) for ${inquiry.service || 'Services'}`);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Inquiry received successfully' }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to process inquiry' }));
    }
    return;
  }

  // GET resources
  if (pathname === '/data/resources.json' || pathname === '/api/resources') {
    try {
      const data = fs.readFileSync(RESOURCES_FILE, 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify([]));
    }
    return;
  }

  // GET inquiries
  if (pathname === '/data/inquiries.json' || pathname === '/api/inquiries') {
    try {
      const data = fs.readFileSync(INQUIRIES_FILE, 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify([]));
    }
    return;
  }

  // Admin: Add Gallery Capture (Drag & drop base64 image file)
  if (pathname === '/api/admin/gallery/add' && req.method === 'POST') {
    try {
      const payload = await readBody(req);
      const { filename, fileData, title, category, categoryName, badge } = payload;
      
      const safeName = Date.now() + '_' + (filename || 'capture.png').replace(/[^a-zA-Z0-9._-]/g, '_');
      const imageSrc = '/images/uploads/' + safeName;

      if (fileData) {
        const base64Content = fileData.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Content, 'base64');
        const diskPath = path.join(PUBLIC_DIR, 'images', 'uploads', safeName);
        fs.writeFileSync(diskPath, buffer);
      }

      let gallery = [];
      try {
        gallery = JSON.parse(fs.readFileSync(GALLERY_FILE, 'utf8'));
      } catch (err) {
        gallery = [];
      }

      const newItem = {
        category: category || 'custom',
        categoryName: categoryName || 'Custom Showcase',
        badge: badge || 'Showcase Capture',
        title: title || 'New Capture',
        src: imageSrc
      };

      gallery.unshift(newItem);
      fs.writeFileSync(GALLERY_FILE, JSON.stringify(gallery, null, 2));

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, item: newItem }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // Admin: Delete Gallery Capture
  if (pathname === '/api/admin/gallery/delete' && req.method === 'POST') {
    try {
      const { src } = await readBody(req);
      let gallery = JSON.parse(fs.readFileSync(GALLERY_FILE, 'utf8'));
      gallery = gallery.filter(item => item.src !== src);
      fs.writeFileSync(GALLERY_FILE, JSON.stringify(gallery, null, 2));

      if (src && src.startsWith('/images/uploads/')) {
        const diskPath = path.join(PUBLIC_DIR, src);
        if (fs.existsSync(diskPath)) fs.unlinkSync(diskPath);
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // Admin: Delete Resource
  if (pathname === '/api/admin/resources/delete' && req.method === 'POST') {
    try {
      const { id } = await readBody(req);
      let resources = JSON.parse(fs.readFileSync(RESOURCES_FILE, 'utf8'));
      resources = resources.filter(item => item.id !== id);
      fs.writeFileSync(RESOURCES_FILE, JSON.stringify(resources, null, 2));
      fs.writeFileSync(path.join(PUBLIC_DIR, 'resources-data.json'), JSON.stringify(resources, null, 2));

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // Admin: Delete Review
  if (pathname === '/api/admin/reviews/delete' && req.method === 'POST') {
    try {
      const { id } = await readBody(req);
      let reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE, 'utf8'));
      reviews = reviews.filter(item => item.id !== id);
      fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
      fs.writeFileSync(path.join(PUBLIC_DIR, 'reviews-data.json'), JSON.stringify(reviews, null, 2));

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // Admin: Delete Inquiry
  if (pathname === '/api/admin/inquiries/delete' && req.method === 'POST') {
    try {
      const { id } = await readBody(req);
      let inquiries = JSON.parse(fs.readFileSync(INQUIRIES_FILE, 'utf8'));
      inquiries = inquiries.filter(item => item.id !== id);
      fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2));

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // Admin: Sync with GitHub
  if (pathname === '/api/admin/sync-github' && req.method === 'POST') {
    const { exec } = require('child_process');
    exec('git add . && git commit -m "Admin updates via VortexLabs Dashboard" && git push origin main', (error, stdout, stderr) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: !error,
        message: stdout || stderr || 'Pushed successfully to GitHub'
      }));
    });
    return;
  }

  // Static File Serving
  let decodedPath = pathname;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch (e) {
    decodedPath = pathname;
  }

  // Clean URLs: 301 redirect any URL ending in .html to clean URL (e.g. /gallery.html -> /gallery)
  if (decodedPath.endsWith('.html') && decodedPath !== '/index.html') {
    const cleanPath = decodedPath.slice(0, -5);
    const search = parsedUrl.search || '';
    res.writeHead(301, { 'Location': cleanPath + search });
    res.end();
    return;
  }

  let safePath = path.normalize(decodedPath).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '') {
    safePath = '/index.html';
  }

  let filePath = path.join(PUBLIC_DIR, safePath);

  // If path doesn't have an extension, check if an HTML file exists (e.g. /gallery -> /gallery.html)
  if (!path.extname(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA if not found
      const fallbackPath = path.join(PUBLIC_DIR, 'index.html');
      fs.readFile(fallbackPath, (fallbackErr, content) => {
        if (fallbackErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(content);
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Server Error');
      } else {
        res.writeHead(200, {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        });
        res.end(content);
      }
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`  VortexLabs Platform is LIVE! (Founded by Gaurav)`);
  console.log(`  Local URL:   http://localhost:${PORT}`);
  console.log(`  Network URL: http://0.0.0.0:${PORT}`);
  console.log(`  Services:    Plugins, Server setups, Discord bots,`);
  console.log(`               Discord setups, Survival, Minigames, Configs`);
  console.log(`====================================================`);
});
