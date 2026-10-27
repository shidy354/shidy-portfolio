import http.server
import json
import os
import re
import socketserver

PORT = 8080
BASE_DIR = '/Users/shidynurkholish/.gemini/antigravity/scratch/shidy-portfolio'
INDEX_PATH = os.path.join(BASE_DIR, 'index.html')
UPLOADS_PATH = os.path.join(BASE_DIR, 'uploads.json')
TEXT_EDITS_PATH = os.path.join(BASE_DIR, 'text_edits.json')


class AutoSaveHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def translate_custom_path(self):
        clean_path = self.path.split('?')[0].strip('/')
        target_file = os.path.join(BASE_DIR, clean_path)
        query = ('?' + self.path.split('?', 1)[1]) if '?' in self.path else ''
        if clean_path == 'v2':
            self.path = '/v2-home.html' + query
        elif clean_path == 'v2/work':
            self.path = '/v2-work.html' + query
        elif clean_path == 'v2/about':
            self.path = '/v2-about.html' + query
        elif clean_path == 'v2/contact':
            self.path = '/v2-contact.html' + query
        elif clean_path.startswith('v2/project/') or clean_path.startswith('v2/'):
            self.path = '/v2-project.html' + query
        elif clean_path and not os.path.exists(target_file):
            self.path = '/index.html' + query

    def do_GET(self):
        self.translate_custom_path()
        return super().do_GET()

    def do_HEAD(self):
        self.translate_custom_path()
        return super().do_HEAD()

    def do_POST(self):
        if self.path == '/api/auto-save':
            try:
                length = int(self.headers.get('Content-Length', 0))
                body = self.rfile.read(length).decode('utf-8')
                payload = json.loads(body)
                slot = payload.get('slot')
                data_url = payload.get('dataUrl')
                if not slot or not data_url:
                    self.send_response(400)
                    self.end_headers()
                    return

                # 1. Save to uploads.json
                uploads = {}
                if os.path.exists(UPLOADS_PATH):
                    try:
                        with open(UPLOADS_PATH, 'r', encoding='utf-8') as f:
                            uploads = json.load(f)
                    except Exception:
                        uploads = {}
                uploads[slot] = data_url
                with open(UPLOADS_PATH, 'w', encoding='utf-8') as f:
                    json.dump(uploads, f)

                # 2. Directly update index.html on disk
                if os.path.exists(INDEX_PATH):
                    with open(INDEX_PATH, 'r', encoding='utf-8') as f:
                        html = f.read()
                    pattern = re.compile(
                        r'(<img\b[^>]*data-upload-slot="' + re.escape(slot) + r'"[^>]*>)',
                        flags=re.S
                    )

                    def replace_slot_img(m):
                        tag = m.group(1)
                        tag = re.sub(r'\s+srcset="[^"]*"', '', tag)
                        tag = re.sub(r'\bsrc="[^"]*"', lambda _: f'src="{data_url}"', tag)
                        return tag

                    new_html = pattern.sub(replace_slot_img, html)
                    with open(INDEX_PATH, 'w', encoding='utf-8') as f:
                        f.write(new_html)

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(b'{"ok":true}')
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))

        elif self.path == '/api/auto-save-text':
            try:
                length = int(self.headers.get('Content-Length', 0))
                body = self.rfile.read(length).decode('utf-8')
                payload = json.loads(body)

                # 1. Save full text & font-size state to text_edits.json
                with open(TEXT_EDITS_PATH, 'w', encoding='utf-8') as f:
                    json.dump(payload, f, ensure_ascii=False, indent=2)

                # 2. Embed directly into index.html inside <script id="shidy-saved-text-edits" type="application/json">
                if os.path.exists(INDEX_PATH):
                    with open(INDEX_PATH, 'r', encoding='utf-8') as f:
                        html = f.read()
                    safe_json = json.dumps(payload, ensure_ascii=False).replace('</script>', '<\\/script>')
                    script_tag = f'<script id="shidy-saved-text-edits" type="application/json">{safe_json}</script>'
                    pattern = re.compile(
                        r'<script id="shidy-saved-text-edits" type="application/json">.*?</script>',
                        flags=re.S
                    )
                    if pattern.search(html):
                        new_html = pattern.sub(lambda _: script_tag, html)
                    else:
                        new_html = html.replace('</body>', script_tag + '\n</body>')
                    with open(INDEX_PATH, 'w', encoding='utf-8') as f:
                        f.write(new_html)

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(b'{"ok":true}')
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
        elif self.path == '/api/auto-save-modal-images':
            try:
                length = int(self.headers.get('Content-Length', 0))
                body = self.rfile.read(length).decode('utf-8')
                payload = json.loads(body)

                modal_images_path = os.path.join(BASE_DIR, 'modal_images.json')
                with open(modal_images_path, 'w', encoding='utf-8') as f:
                    json.dump(payload, f, ensure_ascii=False)

                if os.path.exists(INDEX_PATH):
                    with open(INDEX_PATH, 'r', encoding='utf-8') as f:
                        html = f.read()
                    safe_json = json.dumps(payload, ensure_ascii=False).replace('</script>', '<\\/script>')
                    script_tag = f'<script id="shidy-saved-modal-images" type="application/json">{safe_json}</script>'
                    pattern = re.compile(
                        r'<script id="shidy-saved-modal-images" type="application/json">.*?</script>',
                        flags=re.S
                    )
                    if pattern.search(html):
                        new_html = pattern.sub(lambda _: script_tag, html)
                    else:
                        new_html = html.replace('</body>', script_tag + '\n</body>')
                    with open(INDEX_PATH, 'w', encoding='utf-8') as f:
                        f.write(new_html)

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(b'{"ok":true}')
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()


if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(('', PORT), AutoSaveHTTPRequestHandler) as httpd:
        print(f'Serving Shidy Portfolio with Auto-Save HTML at http://localhost:{PORT}')
        httpd.serve_forever()
