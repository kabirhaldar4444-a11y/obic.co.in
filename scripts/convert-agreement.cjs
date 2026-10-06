const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const server = http.createServer((req, res) => {
  if (req.url === '/pdf') {
    res.writeHead(200, { 'Content-Type': 'application/pdf' });
    fs.createReadStream(path.join(__dirname, '..', 'obayashi-agreement.pdf')).pipe(res);
  } else if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
        <script>
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        </script>
      </head>
      <body>
        <h1>Rendering PDF pages to PNG</h1>
        <div id="status">Loading PDF...</div>
        <script>
          async function render() {
            try {
              const loadingTask = pdfjsLib.getDocument('/pdf');
              const pdf = await loadingTask.promise;
              document.getElementById('status').innerText = 'Found ' + pdf.numPages + ' pages.';
              for (let i = 1; i <= pdf.numPages; i++) {
                document.getElementById('status').innerText = 'Rendering page ' + i + '...';
                const page = await pdf.getPage(i);
                // high-res 2x scale
                const viewport = page.getViewport({ scale: 2.0 });
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const ctx = canvas.getContext('2d');
                await page.render({ canvasContext: ctx, viewport }).promise;
                const dataUrl = canvas.toDataURL('image/png');
                await fetch('/save?page=' + i, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ data: dataUrl })
                });
              }
              document.getElementById('status').innerText = 'Completed all pages!';
              await fetch('/done');
            } catch (err) {
              console.error(err);
              document.getElementById('status').innerText = 'Error: ' + err.message;
              fetch('/error?msg=' + encodeURIComponent(err.message));
            }
          }
          render();
        </script>
      </body>
      </html>
    `);
  } else if (req.url.startsWith('/save')) {
    const page = new URL(req.url, 'http://localhost:8999').searchParams.get('page');
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const data = JSON.parse(body).data;
      const base64 = data.replace(/^data:image\/png;base64,/, '');
      const outDir = path.join(__dirname, '..', 'public', 'images', 'partnership');
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }
      const outPath = path.join(outDir, `agreement-page-${page}.png`);
      fs.writeFileSync(outPath, Buffer.from(base64, 'base64'));
      console.log(`Saved page ${page} to ${outPath} (${fs.statSync(outPath).size} bytes)`);
      res.writeHead(200);
      res.end('ok');
    });
  } else if (req.url === '/done') {
    console.log('Successfully generated all page images from obayashi-agreement.pdf!');
    res.writeHead(200);
    res.end('done');
    setTimeout(() => {
      server.close();
      process.exit(0);
    }, 1000);
  } else if (req.url.startsWith('/error')) {
    console.error('Error reported:', req.url);
    res.writeHead(200);
    res.end('error');
    setTimeout(() => {
      server.close();
      process.exit(1);
    }, 1000);
  }
});

server.listen(8999, () => {
  console.log('Rendering server listening on http://localhost:8999');
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  exec(`"${edgePath}" --headless=new --disable-gpu http://localhost:8999`, (err) => {
    if (err) {
      console.error('Edge execution error:', err);
    }
  });
});
