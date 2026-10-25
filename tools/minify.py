"""Builds main.min.js (the file the page loads) from main.js (the readable source).
Removes comments, indentation and blank lines only; every statement stays on its own line.
Run after any change to main.js:  python3 tools/minify.py"""
import re
from pathlib import Path

root = Path(__file__).resolve().parent.parent
src = (root / 'main.js').read_text()

# block comments: /* ... */ (none of them sit inside strings or regexes in main.js)
src = re.sub(r'/\*.*?\*/', '', src, flags=re.S)

out = []
for line in src.split('\n'):
    s = line.strip()
    if not s or s.startswith('//'):
        continue
    # trailing "  // comment" after code (always preceded by whitespace; URLs use "://")
    s = re.sub(r'\s+//\s.*$', '', s)
    out.append(s)

(root / 'main.min.js').write_text('\n'.join(out) + '\n')
print('main.min.js', len('\n'.join(out)), 'bytes')
