const fs=require('fs');
for (const file of ['index.html','styles.css','app.js']) {
  const data=fs.readFileSync(file,'utf8');
  if (!data.trim()) throw new Error(`${file} is empty`);
}
console.log('Static site files validated.');
