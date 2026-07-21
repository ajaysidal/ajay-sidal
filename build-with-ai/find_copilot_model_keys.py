import os, json, re
root = r'C:\Users\AjaySidal\AppData\Local\Programs\Microsoft VS Code\8a7abeba6e\resources\app\extensions\copilot'
package_path = os.path.join(root, 'package.json')
with open(package_path, 'r', encoding='utf-8', errors='ignore') as f:
    data = json.load(f)
conf = data.get('contributes', {}).get('configuration')
print('configuration type', type(conf).__name__)
if isinstance(conf, list):
    for idx, item in enumerate(conf):
        if isinstance(item, dict) and 'properties' in item and isinstance(item['properties'], dict):
            for k in sorted(item['properties']):
                if k.endswith('.model') or '.model.' in k or 'utility' in k.lower() or 'byok' in k.lower():
                    print(k)
elif isinstance(conf, dict):
    for k in sorted(conf.get('properties', {})):
        if k.endswith('.model') or '.model.' in k or 'utility' in k.lower() or 'byok' in k.lower():
            print(k)
else:
    print('unexpected configuration type', type(conf).__name__)
