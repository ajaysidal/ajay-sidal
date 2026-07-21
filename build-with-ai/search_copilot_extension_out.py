import os, re, json
root = r'C:\Users\AjaySidal\AppData\Local\Programs\Microsoft VS Code\8a7abeba6e\resources\app\extensions\copilot'
package_path = os.path.join(root, 'package.json')
print('package exists', os.path.exists(package_path))
with open(package_path, 'r', encoding='utf-8', errors='ignore') as f:
    raw = f.read()
for term in ['utility', 'copilot-utility-small', 'byok', 'utilityModel', 'utility_model', 'github.copilot.chat']:
    print('TERM', term, raw.lower().count(term.lower()))
idx = raw.lower().find('"contributes"')
print('contributes idx', idx)
if idx != -1:
    print(raw[idx:idx+1200].replace('\n', ' '))
try:
    data = json.loads(raw)
    contrib = data.get('contributes')
    print('contributes type', type(contrib).__name__)
    if isinstance(contrib, list):
        print('configuration list length', len(contrib))
        for idx, item in enumerate(contrib):
            if isinstance(item, dict) and 'properties' in item:
                print('\nitem', idx, 'title=', item.get('title', '<no title>'))
                props = item['properties']
                for k in sorted(props):
                    if re.search(r'utility|byok|copilot-utility-small|utilityModel|utility_model|model|assistant|ollama|openai', k, re.IGNORECASE):
                        print('  KEY', k)
                        desc = props[k].get('description') or props[k].get('markdownDescription')
                        print('    desc', desc)
                        print('    type', props[k].get('type'))
    elif isinstance(contrib, dict):
        print('contrib dict keys', list(contrib.keys())[:20])
    else:
        print('unexpected contributes type')
except Exception as e:
    print('json load error', e)
with open('c:\Projects\build-with-ai\search_copilot_output.txt', 'w', encoding='utf-8') as out:
    out.write('package exists ' + str(os.path.exists(package_path)) + '\n')
    out.write('contributes idx ' + str(idx) + '\n')
    if idx != -1:
        out.write(raw[idx:idx+1200].replace('\n',' ') + '\n')
    try:
        data = json.loads(raw)
        contrib = data.get('contributes')
        out.write('contributes type ' + type(contrib).__name__ + '\n')
        if isinstance(contrib, list):
            out.write('configuration list length ' + str(len(contrib)) + '\n')
            for idx, item in enumerate(contrib):
                if isinstance(item, dict) and 'properties' in item:
                    out.write('\nitem ' + str(idx) + ' title=' + str(item.get('title', '<no title>')) + '\n')
                    props = item['properties']
                    for k in sorted(props):
                        if re.search(r'utility|byok|copilot-utility-small|utilityModel|utility_model|model|assistant|ollama|openai', k, re.IGNORECASE):
                            out.write('  KEY ' + k + '\n')
                            desc = props[k].get('description') or props[k].get('markdownDescription')
                            out.write('    desc ' + str(desc) + '\n')
                            out.write('    type ' + str(props[k].get('type')) + '\n')
        elif isinstance(contrib, dict):
            out.write('contrib dict keys ' + str(list(contrib.keys())[:20]) + '\n')
        else:
            out.write('unexpected contributes type\n')
    except Exception as e:
        out.write('json load error ' + str(e) + '\n')
