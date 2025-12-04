const fs = require('fs');
const path = process.argv[2];
if (!path) { console.error('Usage: node check_balance.js <file>'); process.exit(1);} 
const text = fs.readFileSync(path, 'utf8');
const lines = text.split(/\r?\n/);
let brace = 0; let paren = 0; let angle = 0; let inSingle = false; let inDouble = false; let inBack = false; let inComment = false; let inLineComment = false;
for (let i=0;i<lines.length;i++){
  const line = lines[i];
  for (let j=0;j<line.length;j++){
    const ch = line[j];
    const next = line[j+1] || '';
    // handle comments
    if (!inSingle && !inDouble && !inBack && !inComment && ch==='/' && next==='*') { inComment=true; j++; continue; }
    if (inComment && ch==='*' && next==='/' ) { inComment=false; j++; continue; }
    if (!inSingle && !inDouble && !inBack && !inComment && ch==='/' && next==='/') { inLineComment=true; break; }
    if (inLineComment) break;
    if (!inComment){
      if (ch === "'") inSingle = !inSingle;
      if (ch === '"') inDouble = !inDouble;
      if (ch === '`') inBack = !inBack;
      if (!inSingle && !inDouble && !inBack){
        if (ch === '{') brace++;
        else if (ch === '}') brace--;
        else if (ch === '(') paren++;
        else if (ch === ')') paren--;
      }
    }
  }
  if (inLineComment) inLineComment=false;
  if (brace < 0) { console.log('Unmatched } at line', i+1); break; }
  if (paren < 0) { console.log('Unmatched ) at line', i+1); break; }
}
console.log('Final counts -> { }:', brace, ' ( ):', paren);

// show last 40 lines for manual inspection
const start = Math.max(0, lines.length-60);
console.log('--- tail ---');
for (let i=start;i<lines.length;i++){
  console.log((i+1).toString().padStart(4)+': '+lines[i]);
}
