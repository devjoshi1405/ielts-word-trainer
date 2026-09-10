const http = require('http');

const routes = [
  '/',
  '/dashboard',
  '/listening',
  '/listening/listen-and-type',
  '/listening/vocabulary',
  '/listening/numbers',
  '/listening/dates-times',
  '/listening/mistakes',
  '/reading',
  '/writing',
  '/speaking',
  '/progress',
  '/settings'
];

async function checkRoute(route) {
  return new Promise((resolve) => {
    http.get(`http://127.0.0.1:3000${route}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ route, status: res.statusCode, length: data.length });
      });
    }).on('error', (err) => {
      http.get(`http://192.168.1.5:3000${route}`, (res2) => {
        let data2 = '';
        res2.on('data', chunk => data2 += chunk);
        res2.on('end', () => {
          resolve({ route, status: res2.statusCode, length: data2.length });
        });
      }).on('error', (err2) => {
        resolve({ route, error: err2.message });
      });
    });
  });
}

async function run() {
  console.log('--- Testing All 13 IELTS Word Trainer Routes ---');
  let allPass = true;
  for (const r of routes) {
    const result = await checkRoute(r);
    if (result.status === 200) {
      console.log(`[PASS 200 OK] ${result.route} (${result.length} bytes)`);
    } else {
      console.error(`[FAIL] ${result.route}`, result);
      allPass = false;
    }
  }
  console.log('--- Result:', allPass ? 'ALL 13 ROUTES PASSED' : 'SOME ROUTES FAILED', '---');
}

run();
