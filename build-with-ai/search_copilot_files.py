import glob, os, re, json
root = r'C:\Users\AjaySidal\AppData\Local\Programs\Microsoft VS Code\8a7abeba6e\resources\app\extensions\copilot'
terms = [r'copilot-utility-small', r'utility', r'byok', r'utilityModel', r'utility_model', r'github.copilot.chat', r'chatModel', r'utilityModel']
regex = re.compile('|'.join(re.escape(t) for t in terms), re.IGNORECASE)
print('searching package.json...')
package_path = os.path.join(root, 'package.json')
with open(package_path, 'r', encoding='utf-8', errors='ignore') as f:
    raw = f.read()
print('package length', len(raw))
for term in terms:
    print('term', term, 'count', raw.lower().count(term.lower()))
idx = raw.lower().find('"contributes"')
print('contributes idx', idx)
if idx != -1:
    print('contributes snippet:', raw[idx:idx+1200].replace('\n', ' '))

print('\nsearching files...')
found = 0
for path in glob.glob(os.path.join(root, '**', '*.*'), recursive=True):
    if os.path.isfile(path) and path.lower().endswith(('.js', '.ts', '.json')):
        try:
            text = open(path, 'r', encoding='utf-8', errors='ignore').read()
        except Exception:
            continue
        for m in regex.finditer(text):
            found += 1
            start = max(0, m.start()-80)
            end = min(len(text), m.end()+120)
            snippet = text[start:end].replace('\n', ' ')
            print(f'FILE {path}')
            print(f'  match: {m.group(0)}')
            print('  snippet', snippet)
            if found >= 20:
                break
    if found >= 20:
        break
print('found count', found)

print('\nparsing configuration...')
try:
    data = json.loads(raw)
    conf = data.get('contributes', {}).get('configuration')
    print('configuration type', type(conf).__name__)
    if isinstance(conf, list):
        print('configuration items', len(conf))
        for idx, item in enumerate(conf):
            if isinstance(item, dict):
                keys = list(item.keys())
                print(f'item {idx} keys {keys[:20]}')
                if 'properties' in item and isinstance(item['properties'], dict):
                    for k in sorted(item['properties']):
                        if regex.search(k):
                            print('  KEY', k)
                            desc = item['properties'][k].get('description') or item['properties'][k].get('markdownDescription')
                            print('   desc', desc)
                            print('   type', item['properties'][k].get('type'))
                for key, value in item.items():
                    if isinstance(value, dict) and 'properties' in value and isinstance(value['properties'], dict):
                        for k in sorted(value['properties']):
                            if regex.search(k):
                                print('  NESTED KEY', k, 'in', key)
                                desc = value['properties'][k].get('description') or value['properties'][k].get('markdownDescription')
                                print('   desc', desc)
                                print('   type', value['properties'][k].get('type'))
    elif isinstance(conf, dict):
        print('configuration dict keys', list(conf.keys())[:20])
        props = conf.get('properties', {})
        if isinstance(props, dict):
            for k in sorted(props):
                if regex.search(k):
                    print('  KEY', k)
                    print('   desc', props[k].get('description') or props[k].get('markdownDescription'))
                    print('   type', props[k].get('type'))
except Exception as e:
    print('json parse error', e)
