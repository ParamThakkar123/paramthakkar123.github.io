(async ()=>{
  const puppeteer = require('puppeteer');
  const fs = require('fs');
  const path = require('path');
  const http = require('http');
  const mime = {
    '.html':'text/html', '.htm':'text/html', '.js':'application/javascript', '.css':'text/css', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.svg':'image/svg+xml', '.ico':'image/x-icon', '.json':'application/json', '.txt':'text/plain'
  };

  // Start a lightweight static server to serve the generated site over HTTP so
  // external CDN scripts (KaTeX) load correctly and relative image paths resolve.
  const siteRoot = path.resolve('_site');
  const port = 4001;
  const server = http.createServer((req,res)=>{
    try{
      let p = decodeURIComponent(req.url.split('?')[0]);
      if (p === '/' ) p = '/index.html';
      const filePath = path.join(siteRoot, p.replace(/^\//,''));
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()){
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, {'Content-Type': mime[ext]||'application/octet-stream'});
        fs.createReadStream(filePath).pipe(res);
      } else {
        res.writeHead(404, {'Content-Type':'text/plain'});
        res.end('Not found');
      }
    }catch(e){
      res.writeHead(500, {'Content-Type':'text/plain'});
      res.end('Server error');
    }
  });
  await new Promise((resolve, reject)=> server.listen(port, err=> err?reject(err):resolve()));
  console.log('Static server running at http://localhost:'+port+' serving', siteRoot);
  const pages = [
    '/2021/03/08/blog-post-title-from-file-name.html',
    '/blog/2026/04/11/dreamer-v1.html',
    '/notes/2026-05-29-primitives-and-transformations.html'
  ];
  // Use a unique temporary user data directory to avoid conflicts with any running Chrome instances
  const profileDir = path.resolve('tmp', 'puppeteer_profile_' + Date.now());
  if (!fs.existsSync(profileDir)) fs.mkdirSync(profileDir, { recursive: true });
  const browser = await puppeteer.launch({ userDataDir: profileDir, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  page.on('requestfailed', req => {
    const f = req.failure();
    console.log('REQ FAILED:', req.url(), f && f.errorText);
  });

  for (const p of pages) {
    const url = 'http://localhost:' + port + p;
    console.log('\n--- loading', url);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 }).catch(e=>console.log('goto failed',e.toString()));
    // take screenshot
    const safe = p.replace(/[^a-z0-9]/gi,'_');
    await page.screenshot({ path: 'tmp/screen_'+safe+'.png', fullPage: true });
    console.log('screenshot saved tmp/screen_'+safe+'.png');
    // check for rendered math (look for .katex in body)
    const katexExists = await page.$('.katex') !== null;
    console.log('katex present?', katexExists);
    // list img tags and their src/status
    const imgs = await page.$$eval('img', imgs => imgs.map(i=>({src:i.getAttribute('src'), visible: !!(i.offsetWidth || i.offsetHeight)})));
    console.log('images:', imgs);
  }

  await browser.close();
  console.log('\nDone.');
})();
