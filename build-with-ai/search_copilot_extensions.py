import json, os, glob, re

roots = [
    r'C:\Users\AjaySidal\AppData\Local\Programs\Microsoft VS Code\8a7abeba6e\resources\app\extensions\copilot',
    r'C:\Users\AjaySidal\.vscode\extensions'
]
terms = [
    'copilot-utility-small',
    'hasByokModels',
    'byok',
    'utilityModel',
    'utility_model',
    'github.copilot.chat',
    'github.copilot',
    'copilot.chat',
    'agent.model',
    '.model'
]
regex = re.compile('|'.join(re.escape(t) for t in terms), re.IGNORECASE)
output = []
for root in roots:
    output.append(f'SEARCH ROOT {root}')
    if not os.path.isdir(root):
        output.append('  (missing)')
        continue
    for dirpath, dirnames, filenames in os.walk(root):
        for filename in filenames:
            if filename.lower().endswith(('.js', '.ts', '.json', '.md')):
                path = os.path.join(dirpath, filename)
                try:
                    text = open(path, 'r', encoding='utf-8', errors='ignore').read()
                except Exception:
                    continue
                if regex.search(text):
                    output.append(f'FOUND {path}')
                    for m in regex.finditer(text):
                        start = max(0, m.start() - 80)
                        end = min(len(text), m.end() + 120)
                        snippet = text[start:end].replace('\n', ' ')
                        output.append(f'  match: {m.group(0)}')
                        output.append(f'  snippet: {snippet}')
                        break
    output.append('')

# search package.json contributions specifically
output.append('PACKAGE CONFIG KEYS')
for root in roots:
    package_path = os.path.join(root, 'package.json')
    if os.path.isfile(package_path):
        output.append(f'PACKAGE {package_path}')
        try:
            with open(package_path, 'r', encoding='utf-8', errors='ignore') as f:
                data = json.load(f)
        except Exception as e:
            output.append(f'  JSON load error: {e}')
            continue
        contrib = data.get('contributes', {})
        config = contrib.get('configuration')
        output.append(f'  contrib type {type(contrib).__name__} config type {type(config).__name__}')
        if isinstance(config, list):
            for item_idx, item in enumerate(config):
                if isinstance(item, dict) and 'properties' in item and isinstance(item['properties'], dict):
                    output.append(f'  item {item_idx} title={item.get("title")} props={len(item["properties"])}')
                    for k in sorted(item['properties']):
                        if 'model' in k.lower() or 'utility' in k.lower() or 'byok' in k.lower():
                            output.append(f'    KEY {k}')
        elif isinstance(config, dict):
            props = config.get('properties', {})
            for k in sorted(props):
                if 'model' in k.lower() or 'utility' in k.lower() or 'byok' in k.lower():
                    output.append(f'    KEY {k}')
    else:
        output.append(f'PACKAGE MISSING {package_path}')

out_path = r'c:\Projects\build-with-ai\search_copilot_extensions.out.txt'
with open(out_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(output))
print('written', out_path)
