import json, glob, os, re
root = r'C:\Users\AjaySidal\AppData\Local\Programs\Microsoft VS Code\8a7abeba6e\resources\app\extensions\copilot'
json_path = os.path.join(root, 'package.json')
print('package exists:', os.path.exists(json_path))
with open(json_path, 'r', encoding='utf-8', errors='ignore') as f:
    raw = f.read()
print('raw length', len(raw))
print('contains keywords: utility', 'utility' in raw, 'byok', 'byok' in raw, 'copilot-utility-small', 'copilot-utility-small' in raw)
idx = raw.find('"contributes"')
print('contributes idx', idx)
if idx != -1:
    print(raw[idx:idx+1200])
try:
    data = json.loads(raw)
    print('json parsed')
    contrib = data.get('contributes')
    print('contrib type', type(contrib).__name__)
    if isinstance(contrib, dict):
        print('contrib keys', list(contrib.keys())[:20])
        conf = contrib.get('configuration')
        print('config type', type(conf).__name__)
        if isinstance(conf, dict):
            props = conf.get('properties', {})
            print('properties count', len(props))
            for k in sorted(props):
                if re.search(r'utility|byok|copilot|agent|model|assistant|ollama|openai', k, re.I):
                    print('KEY', k)
                    desc = props[k].get('markdownDescription') or props[k].get('description')
                    print(' DESC', desc)
                    print(' TYPE', props[k].get('type'))
                    print('---')
except Exception as e:
    print('json parse error', e)

# search dist files
pattern = re.compile(r'copilot-utility-small|utility|byok|BYOK|model|assistant', re.IGNORECASE)
for path in glob.glob(os.path.join(root, '**', '*.*'), recursive=True):
    if os.path.isfile(path) and path.lower().endswith(('.js', '.ts', '.json')):
        try:
            with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                for i, line in enumerate(f, 1):
                    if pattern.search(line):
                        print('FOUND', path)
                        print(f'{i}: {line.strip()}')
                        raise SystemExit
        except Exception:
            pass
print('search complete')
