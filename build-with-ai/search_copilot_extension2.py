import os, re, json
root = r'C:\Users\AjaySidal\AppData\Local\Programs\Microsoft VS Code\8a7abeba6e\resources\app\extensions\copilot'
package_path = os.path.join(root, 'package.json')
print('package exists', os.path.exists(package_path))
with open(package_path, 'r', encoding='utf-8', errors='ignore') as f:
    raw = f.read()
print('raw length', len(raw))
print('contains utility', 'utility' in raw)
print('contains byok', 'byok' in raw)
print('contains copilot-utility-small', 'copilot-utility-small' in raw)
print('contains github.copilot.chat', 'github.copilot.chat' in raw)
for term in ['utility', 'copilot-utility-small', 'byok', 'utilityModel', 'utility_model', 'github.copilot.chat']:
    idx = raw.lower().find(term.lower())
    print('term', term, 'index', idx)
    if idx != -1:
        start = max(0, idx - 80)
        end = min(len(raw), idx + 120)
        print(raw[start:end].replace('\n', ' '))

try:
    data = json.loads(raw)
    contrib = data.get('contributes')
    print('contributes type', type(contrib).__name__)
    if isinstance(contrib, dict):
        print('contrib keys', list(contrib.keys())[:20])
        configuration = contrib.get('configuration')
        print('configuration type', type(configuration).__name__)
        if isinstance(configuration, dict):
            props = configuration.get('properties', {})
            print('configuration properties count', len(props))
            for k in sorted(props):
                if re.search(r'utility|byok|copilot-utility-small|utilityModel|utility_model|model|assistant|ollama|openai', k, re.IGNORECASE):
                    print('KEY', k)
                    desc = props[k].get('description') or props[k].get('markdownDescription')
                    print(' desc', desc)
                    print(' type', props[k].get('type'))
    elif isinstance(contrib, list):
        print('contrib list length', len(contrib))
        for idx, item in enumerate(contrib):
            if not isinstance(item, dict):
                continue
            title = item.get('title', '<no title>')
            print('\nitem', idx, 'title=', title)
            for key, value in item.items():
                if key == 'properties' and isinstance(value, dict):
                    print('  found properties count', len(value))
                    for k in sorted(value):
                        if re.search(r'utility|byok|copilot-utility-small|utilityModel|utility_model|model|assistant|ollama|openai', k, re.IGNORECASE):
                            print('  KEY', k)
                            desc = value[k].get('description') or value[k].get('markdownDescription')
                            print('   desc', desc)
                            print('   type', value[k].get('type'))
                elif isinstance(value, dict) and 'properties' in value:
                    print('  nested part', key, 'properties count', len(value['properties']))
                    for k in sorted(value['properties']):
                        if re.search(r'utility|byok|copilot-utility-small|utilityModel|utility_model|model|assistant|ollama|openai', k, re.IGNORECASE):
                            print('  KEY', k)
                            desc = value['properties'][k].get('description') or value['properties'][k].get('markdownDescription')
                            print('   desc', desc)
                            print('   type', value['properties'][k].get('type'))
except Exception as e:
    print('json parse error', repr(e))
