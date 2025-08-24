import os
import re

def update_markdown_images(repo_root_path, base_url):
    """
    遍历仓库中的所有 Markdown 文件，并将相对图片链接更新为绝对 URL。

    :param repo_root_path: Git 仓库在本地的绝对路径。
    :param base_url: 图片链接的基础 URL (例如 'https://username.github.io/')。
    """
    # 正则表达式匹配 Markdown 图片链接: ![alt](path)
    # - alt 部分 `(.*?)`
    # - path 部分 `(.*?)`
    #   - `(?<!http)` 是一个负向先行断言，确保路径不是以 http 开头
    image_pattern = re.compile(r'!\[(.*?)\]\(((?!https|http|ftp|/).*?)\)')

    print(f"开始扫描目录: {repo_root_path}")

    for dirpath, _, filenames in os.walk(repo_root_path):
        # 忽略 .git 目录
        if '.git' in dirpath.split(os.sep):
            continue

        for filename in filenames:
            if filename.endswith('.md'):
                md_file_path = os.path.join(dirpath, filename)
                print(f"  处理文件: {md_file_path}")

                try:
                    with open(md_file_path, 'r', encoding='utf-8') as f:
                        content = f.read()

                    original_content = content

                    # 获取 Markdown 文件相对于仓库根目录的路径
                    md_file_rel_dir = os.path.relpath(dirpath, repo_root_path)
                    # 将 Windows 路径分隔符替换为 URL 分隔符
                    md_file_rel_dir_url = md_file_rel_dir.replace('\\', '/')

                    def replace_path(match):
                        alt_text = match.group(1)
                        relative_image_path = match.group(2)
                        # 将相对图片路径中的反斜杠也替换为正斜杠，以确保URL格式正确
                        relative_image_path = relative_image_path.replace('\\', '/')
                        
                        # 构建完整的 URL
                        # os.path.normpath('.') 会返回 '.', 在 URL 中不需要
                        if md_file_rel_dir_url == '.':
                            full_url = f"{base_url}/{relative_image_path}"
                        else:
                            full_url = f"{base_url}/{md_file_rel_dir_url}/{relative_image_path}"
                        
                        print(f"    - 找到相对路径: {relative_image_path} -> 替换为: {full_url}")
                        return f"![{alt_text}]({full_url})"

                    content = image_pattern.sub(replace_path, content)

                    if content != original_content:
                        with open(md_file_path, 'w', encoding='utf-8') as f:
                            f.write(content)
                        print(f"  文件 {filename} 已更新。")
                    else:
                        print(f"  文件 {filename} 无需更新。")

                except Exception as e:
                    print(f"处理文件 {md_file_path} 时出错: {e}")

    print("处理完成。")

if __name__ == '__main__':
    # --- 请根据您的设置修改以下变量 ---

    # 1. 您项目的根目录路径
    #    在您的例子中是 'c:\\Users\\REM\\Desktop\\short\\wild-firefox.github.io'
    #    使用 os.path.dirname(__file__) 可以自动获取脚本所在目录，如果脚本在根目录则很方便
    repo_root_path = os.path.dirname(os.path.abspath(__file__))

    # 2. 您的 GitHub Pages 基础 URL
    base_url = 'https://wild-firefox.github.io'

    # --- 修改结束 ---

    # 确保 URL 结尾没有斜杠
    if base_url.endswith('/'):
        base_url = base_url[:-1]

    update_markdown_images(repo_root_path, base_url)