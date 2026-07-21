import os, re, glob
root = r'C:\Users\AjaySidal\AppData\Local\Programs\Microsoft VS Code\8a7abeba6e\resources\app\extensions\copilot'
terms = [r'copilot-utility-small', r'utility', r'byok', r'hasByokModels', r'utilityModel', r'utility_model', r'github.copilot.chat', r'agent.model']
regex = re.compile('|'.join(re.escape(t) for t in terms), re.IGNORECASE)
output_lines = []
for path in glob.glob(os.path.join(root, '**', '*.*'), recursive=True):
    if os.path.isfile(path) and path.lower().endswith(('.js', '.ts', '.json')):
        try:
            text = open(path, 'r', encoding='utf-8', errors='ignore').read()
        except Exception:
            continue
        for m in regex.finditer(text):
            start = max(0, m.start() - 80)
            end = min(len(text), m.end() + 120)
            snippet = text[start:end].replace('\n', ' ')
            output_lines.append(f'FILE {path}')
            output_lines.append(f'  match: {m.group(0)}')
            output_lines.append(f'  snippet: {snippet}')
            output_lines.append('')
            if len(output_lines) > 200:
                output_lines.append('... truncated ...')
                break
    if len(output_lines) > 200:
        break
if not output_lines:
    output_lines.append('No matches found.')
with open(r'c:\Projects\build-with-ai\search_copilot_byok.out.txt', 'w', encoding='utf-8') as out:
    out.write('\n'.join(output_lines))
print('done', len(output_lines), 'lines')
