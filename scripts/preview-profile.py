"""Serve public profile files locally, with GitHub Pages-style extensionless routes."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]


class ProfileHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        path = unquote(urlsplit(self.path).path)
        if path == '/':
            path = '/index.html'
        elif not Path(path).suffix:
            path += '.html'
        target = (ROOT / path.lstrip('/')).resolve()
        allowed = target.parent == ROOT and target.suffix == '.html'
        allowed = allowed or any(target.is_relative_to(ROOT / name) for name in ('assets', 'images', 'videos', 'games'))
        if not target.is_relative_to(ROOT) or not allowed or not target.is_file():
            self.send_error(404)
            return
        self.path = '/' + target.relative_to(ROOT).as_posix()
        return super().do_GET()


if __name__ == '__main__':
    server = ThreadingHTTPServer(('127.0.0.1', 4173), lambda *a, **k: ProfileHandler(*a, directory=str(ROOT), **k))
    print('Profile preview: http://127.0.0.1:4173/', flush=True)
    server.serve_forever()
