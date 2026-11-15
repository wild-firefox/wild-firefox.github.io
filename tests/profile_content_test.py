"""Content consistency checks for the public resume update (no network calls)."""
from pathlib import Path
from hashlib import sha256
import unittest
from lxml import html
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
PAGES = ['index', 'about', 'projects', 'research', 'publications', 'blog', 'resume', 'contact', 'etf-dashboard']


def document(name):
    return html.fromstring((ROOT / f'{name}.html').read_text(encoding='utf-8'))


class ProfileContentTest(unittest.TestCase):
    def test_shared_assets_footer_and_valid_bilingual_attributes(self):
        for name in PAGES:
            with self.subTest(page=name):
                tree = document(name)
                self.assertEqual(len(tree.xpath('//footer[contains(@class,"site-footer")]')), 1)
                self.assertEqual(len(tree.xpath('//*[@id="year"]')), 1)
                self.assertTrue(tree.xpath('//script[contains(@src,"resume.js?v=20261116")]'))
                for node in tree.xpath('//*[@data-zh or @data-en]'):
                    self.assertTrue(node.get('data-zh'))
                    self.assertTrue(node.get('data-en'))
                    self.assertFalse(node.xpath('.//*[@data-zh or @data-en]'))
                for asset in tree.xpath('//script/@src | //link[@rel="stylesheet"]/@href'):
                    if asset.startswith('/'):
                        self.assertTrue((ROOT / asset.lstrip('/').split('?')[0]).is_file(), asset)

    def test_resume_dates_employer_target_and_projects(self):
        resume, projects = document('resume'), document('projects')
        self.assertIn('2026.05 — 2026.09', resume.text_content())
        self.assertEqual(projects.xpath('string(//*[@id="live-etf"]/time)'), '2026.05 — 2026.09')
        self.assertIn('2026.05 — 2026.09', document('index').text_content())
        for tree in (resume, projects):
            self.assertIn('昕彤赋能（长沙）人工智能行业应用系统有限公司', tree.text_content())
            self.assertIn('智慧家庭能量管理 TD-MPC 世界模型', tree.text_content())
            for metric in ('246.34%', '60.09%', '2.185', '18.65%', '35.1%'):
                self.assertIn(metric, tree.text_content())
        self.assertIn('强化学习算法工程师', document('contact').text_content())
        self.assertIn('ROS2', resume.text_content())
        self.assertIn('32 万+', resume.text_content())
        self.assertIn('200+ stars', resume.text_content())
        self.assertEqual(len(resume.xpath('//section[h2="竞赛荣誉"]/article')), 4)

    def test_download_is_exact_user_pdf(self):
        source = Path('C:/Users/REM3/OneDrive/person/gjc/简历/简历重构3.5.pdf')
        target = ROOT / 'assets/files/jiacheng-gu-resume-3.5.pdf'
        self.assertEqual(sha256(source.read_bytes()).digest(), sha256(target.read_bytes()).digest())
        self.assertEqual(len(PdfReader(target).pages), 1)
        self.assertEqual(len(document('resume').xpath('//a[@href="/assets/files/jiacheng-gu-resume-3.5.pdf"]')), 1)

    def test_profile_internal_links_resolve(self):
        for name in PAGES:
            for href in document(name).xpath('//a/@href'):
                if not href.startswith('/') or href.startswith('//'):
                    continue
                route, _, anchor = href.partition('#')
                route = route.split('?')[0]
                if route == '/':
                    target = ROOT / 'index.html'
                else:
                    target = ROOT / route.lstrip('/')
                    if target.is_dir():
                        target /= 'index.html'
                    elif not target.suffix:
                        target = target.with_suffix('.html')
                self.assertTrue(target.is_file(), (name, href))
                if anchor and target.suffix == '.html':
                    target_tree = html.fromstring(target.read_text(encoding='utf-8'))
                    self.assertTrue(target_tree.xpath('//*[@id=$id]', id=anchor), (name, href))


if __name__ == '__main__':
    unittest.main()
