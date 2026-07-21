import os, re, json
root = r'C:\Users\AjaySidal\AppData\Local\Programs\Microsoft VS Code\8a7abeba6e\resources\app\extensions\copilot'
package_path = os.path.join(root, 'package.json')
print('package exists', os.path.exists(package_path))
with open(package_path, 'r', encoding='utf-8', errors='ignore') as f:
    raw = f.read()
for term in ['utility', 'copilot-utility-small', 'byok', 'utilityModel', 'utility_model', 'github.copilot.chat']:
    print('TERM', term, raw.lower().count(term.lower()))

# print some context around first occurrences
for term in ['copilot-utility-small', 'utility', 'byok', 'utilityModel', 'utility_model', 'github.copilot.chat']:
    idx = raw.lower().find(term.lower())
    if idx != -1:
        start = max(0, idx-80)
        end = min(len(raw), idx+120)
        print('---', term, '---')
        print(raw[start:end].replace('\n',' '))

# parse JSON safely and search properties only if found
try:
    data = json.loads(raw)
    contributes = data.get('contributes')
    print('contributes type', type(contributes).__name__)
    if isinstance(contributes, dict):
        configuration = contributes.get('configuration')
        print('configuration type', type(configuration).__name__)
        if isinstance(configuration, dict):
            props = configuration.get('properties', {})
            for k in sorted(props):
                if re.search(r'utility|byok|copilot-utility-small|utilityModel|utility_model|model|assist|ollama|openai', k, re.IGNORECASE):
                    print('KEY', k)
                    desc = props[k].get('description') or props[k].get('markdownDescription')
                    if desc:
                        print('DESC', desc)
except Exception as e:
    print('json load error', e)