#!/usr/bin/env python3
import json
import os
import sys
import uuid
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib import request, error
from urllib.parse import urlsplit

UPSTREAM = os.environ.get("OLLAMA_UPSTREAM", "http://127.0.0.1:11434").rstrip("/")
DEFAULT_MODEL = os.environ.get("OLLAMA_PROXY_MODEL", "qwen2.5-coder:14b")
HOST = os.environ.get("OLLAMA_PROXY_HOST", "127.0.0.1")
PORT = int(os.environ.get("OLLAMA_PROXY_PORT", "11435"))
TIMEOUT = int(os.environ.get("OLLAMA_PROXY_TIMEOUT", "300"))
CLAUDE_ALIASES = {
    "sonnet",
    "claude-sonnet-4-6",
    "claude-sonnet-4-5",
    "haiku",
    "claude-haiku-4-5",
    "opus",
    "claude-opus-4-6",
}


def resolve_model(model_name: str | None):
    if not model_name:
        return DEFAULT_MODEL
    if model_name in CLAUDE_ALIASES:
        return DEFAULT_MODEL
    return model_name


def read_json_body(handler: BaseHTTPRequestHandler):
    length = int(handler.headers.get("Content-Length", "0") or "0")
    raw = handler.rfile.read(length) if length else b"{}"
    if not raw:
        return {}
    return json.loads(raw.decode("utf-8"))


def post_json(url: str, payload: dict):
    data = json.dumps(payload).encode("utf-8")
    req = request.Request(
        url,
        data=data,
        headers={
            "Content-Type": "application/json",
            "Authorization": "Bearer ollama",
            "anthropic-version": "2023-06-01",
        },
        method="POST",
    )
    with request.urlopen(req, timeout=TIMEOUT) as resp:
        return resp.status, dict(resp.headers.items()), json.loads(resp.read().decode("utf-8"))


def get_json(url: str):
    req = request.Request(url, headers={"Authorization": "Bearer ollama"}, method="GET")
    with request.urlopen(req, timeout=TIMEOUT) as resp:
        return resp.status, dict(resp.headers.items()), json.loads(resp.read().decode("utf-8"))


def send_event(handler: BaseHTTPRequestHandler, event: str, data: dict):
    handler.wfile.write(f"event: {event}\n".encode("utf-8"))
    handler.wfile.write(f"data: {json.dumps(data, separators=(',', ':'))}\n\n".encode("utf-8"))
    handler.wfile.flush()


def extract_text(block: dict):
    if not isinstance(block, dict):
        return str(block)
    if block.get("type") == "text":
        return block.get("text", "")
    return json.dumps(block, separators=(",", ":"))


def flatten_content(content):
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts = []
        for item in content:
            if isinstance(item, dict):
                kind = item.get("type")
                if kind == "text":
                    parts.append(item.get("text", ""))
                elif kind == "tool_result":
                    parts.append(json.dumps(item.get("content", ""), ensure_ascii=False))
                elif kind == "tool_use":
                    parts.append(json.dumps(item.get("input", {}), ensure_ascii=False))
                else:
                    parts.append(json.dumps(item, ensure_ascii=False))
            else:
                parts.append(str(item))
        return "\n".join(p for p in parts if p)
    if content is None:
        return ""
    return str(content)


def normalize_system(system):
    return flatten_content(system)


def normalize_messages(messages):
    normalized = []
    for msg in messages or []:
        role = msg.get("role", "user") if isinstance(msg, dict) else "user"
        content = flatten_content(msg.get("content", "") if isinstance(msg, dict) else msg)
        normalized.append({"role": role, "content": content})
    return normalized


def count_text_tokens(payload: dict):
    parts = []
    system_text = normalize_system(payload.get("system"))
    if system_text:
        parts.append(system_text)
    for msg in normalize_messages(payload.get("messages", [])):
        parts.append(msg.get("content", ""))
    text = " ".join(parts)
    return max(1, len(text.split())) if text.strip() else 1


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def log_message(self, fmt, *args):
        sys.stdout.write("[proxy] " + (fmt % args) + "\n")
        sys.stdout.flush()

    def _send_json(self, code: int, payload: dict):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Connection", "close")
        self.end_headers()
        self.wfile.write(body)
        self.close_connection = True

    def _send_text(self, code: int, payload: str):
        body = payload.encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Connection", "close")
        self.end_headers()
        self.wfile.write(body)
        self.close_connection = True

    def do_HEAD(self):
        path = urlsplit(self.path).path
        if path in ("/", "/health"):
            self.send_response(200)
            self.send_header("Content-Length", "0")
            self.end_headers()
            return
        self.send_response(404)
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_GET(self):
        try:
            path = urlsplit(self.path).path
            if path in ("/", "/health"):
                return self._send_json(200, {"ok": True, "upstream": UPSTREAM, "model": DEFAULT_MODEL})
            if path in ("/v1/models", "/models"):
                try:
                    _, _, data = get_json(f"{UPSTREAM}/v1/models")
                except Exception:
                    _, _, tags = get_json(f"{UPSTREAM}/api/tags")
                    data = {
                        "object": "list",
                        "data": [
                            {
                                "id": m.get("name", DEFAULT_MODEL),
                                "object": "model",
                                "created": 0,
                                "owned_by": "library",
                            }
                            for m in tags.get("models", [])
                        ]
                    }
                existing = {item.get("id") for item in data.get("data", [])}
                for alias in ["claude-sonnet-4-6", "sonnet", "claude-haiku-4-5", "haiku"]:
                    if alias not in existing:
                        data.setdefault("data", []).append({
                            "id": alias,
                            "object": "model",
                            "created": 0,
                            "owned_by": "library",
                        })
                return self._send_json(200, data)
            if path.startswith("/v1/models/") or path.startswith("/models/"):
                model_id = path.rsplit("/", 1)[-1]
                return self._send_json(200, {
                    "id": model_id,
                    "object": "model",
                    "created": 0,
                    "owned_by": "library"
                })
            if path == "/api/tags":
                try:
                    _, _, data = get_json(f"{UPSTREAM}/api/tags")
                except Exception:
                    _, _, models = get_json(f"{UPSTREAM}/v1/models")
                    data = {
                        "models": [
                            {"name": m.get("id", DEFAULT_MODEL), "model": m.get("id", DEFAULT_MODEL)}
                            for m in models.get("data", [])
                        ]
                    }
                return self._send_json(200, data)
            return self._send_text(404, "404 page not found")
        except Exception as exc:
            return self._send_json(500, {"error": str(exc)})

    def do_POST(self):
        try:
            path = urlsplit(self.path).path
            if path == "/v1/messages/count_tokens":
                payload = read_json_body(self)
                return self._send_json(200, {"input_tokens": count_text_tokens(payload)})

            if path == "/api/show":
                payload = read_json_body(self)
                payload['name'] = resolve_model(payload.get('name'))
                status, _, data = post_json(f"{UPSTREAM}/api/show", payload)
                return self._send_json(status, data)

            if path in ("/v1/chat/completions", "/chat/completions"):
                payload = read_json_body(self)
                payload["model"] = resolve_model(payload.get("model"))
                payload["stream"] = False
                status, _, data = post_json(f"{UPSTREAM}/v1/chat/completions", payload)
                return self._send_json(status, data)

            if path == "/api/chat":
                payload = read_json_body(self)
                payload["model"] = resolve_model(payload.get("model"))
                payload["stream"] = False
                status, _, data = post_json(f"{UPSTREAM}/api/chat", payload)
                return self._send_json(status, data)

            if path != "/v1/messages":
                return self._send_text(404, "404 page not found")

            payload = read_json_body(self)
            stream_requested = bool(payload.get("stream"))
            upstream_payload = {
                "model": resolve_model(payload.get("model")),
                "max_tokens": payload.get("max_tokens", 1024),
                "messages": normalize_messages(payload.get("messages", [])),
                "stream": False,
            }
            system_text = normalize_system(payload.get("system"))
            if system_text:
                upstream_payload["system"] = system_text
            if "temperature" in payload:
                upstream_payload["temperature"] = payload.get("temperature")
            if payload.get("tools"):
                upstream_payload["tools"] = payload.get("tools")
            status, _, data = post_json(f"{UPSTREAM}/v1/messages", upstream_payload)

            if not stream_requested:
                return self._send_json(status, data)

            self.send_response(200)
            self.send_header("Content-Type", "text/event-stream")
            self.send_header("Cache-Control", "no-cache")
            self.send_header("Connection", "close")
            self.end_headers()

            usage = data.get("usage", {}) or {}
            message_id = data.get("id", f"msg_{uuid.uuid4().hex[:24]}")
            model = data.get("model", payload.get("model", DEFAULT_MODEL))
            send_event(self, "message_start", {
                "type": "message_start",
                "message": {
                    "id": message_id,
                    "type": "message",
                    "role": "assistant",
                    "model": model,
                    "content": [],
                    "stop_reason": None,
                    "stop_sequence": None,
                    "usage": {"input_tokens": usage.get("input_tokens", 0), "output_tokens": 0}
                }
            })

            for index, block in enumerate(data.get("content", [])):
                block_type = block.get("type", "text") if isinstance(block, dict) else "text"
                if block_type == "text":
                    send_event(self, "content_block_start", {
                        "type": "content_block_start",
                        "index": index,
                        "content_block": {"type": "text", "text": ""}
                    })
                    text = extract_text(block)
                    if text:
                        send_event(self, "content_block_delta", {
                            "type": "content_block_delta",
                            "index": index,
                            "delta": {"type": "text_delta", "text": text}
                        })
                    send_event(self, "content_block_stop", {"type": "content_block_stop", "index": index})
                elif block_type == "tool_use":
                    tool_id = block.get("id", f"toolu_{uuid.uuid4().hex[:12]}")
                    tool_name = block.get("name", "tool")
                    tool_input = block.get("input", {})
                    send_event(self, "content_block_start", {
                        "type": "content_block_start",
                        "index": index,
                        "content_block": {"type": "tool_use", "id": tool_id, "name": tool_name, "input": {}}
                    })
                    partial_json = json.dumps(tool_input, separators=(",", ":"))
                    if partial_json and partial_json != "{}":
                        send_event(self, "content_block_delta", {
                            "type": "content_block_delta",
                            "index": index,
                            "delta": {"type": "input_json_delta", "partial_json": partial_json}
                        })
                    send_event(self, "content_block_stop", {"type": "content_block_stop", "index": index})
                else:
                    send_event(self, "content_block_start", {
                        "type": "content_block_start",
                        "index": index,
                        "content_block": {"type": "text", "text": ""}
                    })
                    text = extract_text(block)
                    if text:
                        send_event(self, "content_block_delta", {
                            "type": "content_block_delta",
                            "index": index,
                            "delta": {"type": "text_delta", "text": text}
                        })
                    send_event(self, "content_block_stop", {"type": "content_block_stop", "index": index})

            send_event(self, "message_delta", {
                "type": "message_delta",
                "delta": {
                    "stop_reason": data.get("stop_reason", "end_turn"),
                    "stop_sequence": None
                },
                "usage": {"output_tokens": usage.get("output_tokens", 0)}
            })
            send_event(self, "message_stop", {"type": "message_stop"})
            self.close_connection = True
            return
        except error.HTTPError as exc:
            body = exc.read().decode("utf-8", errors="replace")
            return self._send_json(exc.code, {"error": body})
        except Exception as exc:
            return self._send_json(500, {"error": str(exc)})


if __name__ == "__main__":
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"Ollama Anthropic proxy listening on http://{HOST}:{PORT} -> {UPSTREAM}")
    sys.stdout.flush()
    server.serve_forever()
