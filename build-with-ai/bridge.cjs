const http = require('http');

http.createServer((req, res) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
        try {
            const claudeReq = JSON.parse(body);
            const prompt = claudeReq.messages.map(m => '\n\n' + m.role + ': ' + m.content).join('') + '\n\nAssistant:';

            // Set headers for standard Server-Sent Events (SSE)
            res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            });

            // Initial Claude framing events
            res.write('data: ' + JSON.stringify({ type: 'message_start', message: { id: 'msg_' + Math.random().toString(36).slice(2), type: 'message', role: 'assistant', model: 'qwen2.5-coder:32b', content: [], stop_reason: null, stop_sequence: null, usage: { input_tokens: 0, output_tokens: 0 } } }) + '\n\n');
            res.write('data: ' + JSON.stringify({ type: 'content_block_start', index: 0, content_block: { type: 'text', text: '' } }) + '\n\n');

            // Send standard POST request using standard HTTP module to avoid fetch stream bugs
            const ollamaReq = http.request('http://localhost:11434/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            }, (ollamaRes) => {
                let buffer = '';
                ollamaRes.on('data', (chunk) => {
                    buffer += chunk.toString();
                    const lines = buffer.split('\n');
                    buffer = lines.pop(); // Keep half-read line in buffer

                    for (const line of lines) {
                        if (!line.trim()) continue;
                        try {
                            const parsed = JSON.parse(line);
                            if (parsed.response) {
                                res.write('data: ' + JSON.stringify({ type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: parsed.response } }) + '\n\n');
                            }
                        } catch(err) {}
                    }
                });

                ollamaRes.on('end', () => {
                    // Send final closing frames to complete handshake cleanly
                    res.write('data: ' + JSON.stringify({ type: 'content_block_stop', index: 0 }) + '\n\n');
                    res.write('data: ' + JSON.stringify({ type: 'message_delta', delta: { stop_reason: 'end_turn', stop_sequence: null }, usage: { output_tokens: 0 } }) + '\n\n');
                    res.write('data: ' + JSON.stringify({ type: 'message_stop' }) + '\n\n');
                    res.end();
                });
            });

            ollamaReq.write(JSON.stringify({ model: 'qwen2.5-coder:32b', prompt: prompt, stream: true }));
            ollamaReq.end();

        } catch (e) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: e.message }));
        }
    });
}).listen(4500, () => console.log('?? Native Streaming Bridge active on port 4500'));
