import os, json, re
root = r'C:\Users\AjaySidal\AppData\Local\Programs\Microsoft VS Code\8a7abeba6e\resources\app\extensions\copilot'
package_path = os.path.join(root, 'package.json')
result_path = r'c:\Projects\build-with-ai\search_copilot_config.out.txt'
with open(package_path, 'r', encoding='utf-8', errors='ignore') as f:
    data = json.load(f)
conf = data.get('contributes', {}).get('configuration')
with open(result_path, 'w', encoding='utf-8') as out:
    out.write(f'configuration type: {type(conf).__name__}\n')
    if isinstance(conf, list):
        out.write(f'items: {len(conf)}\n')
        for idx, item in enumerate(conf):
            out.write(f'--- item {idx} ---\n')
            out.write(f'type: {type(item).__name__}\n')
            if isinstance(item, dict):
                out.write(f'keys: {list(item.keys())}\n')
                if 'properties' in item and isinstance(item['properties'], dict):
                    out.write(f'properties count: {len(item["properties"])}\n')
                    for k in sorted(item['properties']):
                        if re.search(r'utility|byok|copilot-utility-small|utilityModel|utility_model|model|assistant|ollama|openai', k, re.IGNORECASE):
                            out.write(f'KEY {k}\n')
                            desc = item['properties'][k].get('description') or item['properties'][k].get('markdownDescription')
                            out.write(f'  desc: {desc}\n')
                            out.write(f'  type: {item['properties'][k].get('type')}\n')
                else:
                    for key, value in item.items():
                        if isinstance(value, dict) and 'properties' in value and isinstance(value['properties'], dict):
                            out.write(f'nested key {key} properties count: {len(value["properties"])}\n')
                            for k in sorted(value['properties']):
                                if re.search(r'utility|byok|copilot-utility-small|utilityModel|utility_model|model|assistant|ollama|openai', k, re.IGNORECASE):
                                    out.write(f'KEY {k}\n')
                                    desc = value['properties'][k].get('description') or value['properties'][k].get('markdownDescription')
                                    out.write(f'  desc: {desc}\n')
                                    out.write(f'  type: {value['properties'][k].get('type')}\n')
            out.write('\n')
    elif isinstance(conf, dict):
        out.write('configuration dict keys: ' + str(list(conf.keys())) + '\n')
        props = conf.get('properties', {})
        if isinstance(props, dict):
            out.write(f'properties count: {len(props)}\n')
            for k in sorted(props):
                if re.search(r'utility|byok|copilot-utility-small|utilityModel|utility_model|model|assistant|ollama|openai', k, re.IGNORECASE):
                    out.write(f'KEY {k}\n')
                    desc = props[k].get('description') or props[k].get('markdownDescription')
                    out.write(f'  desc: {desc}\n')
                    out.write(f'  type: {props[k].get('type')}\n')
    else:
        out.write('configuration value type not list or dict\n')
