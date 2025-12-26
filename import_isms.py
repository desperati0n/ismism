"""
从未明子的主义主义 markdown 文件夹导入数据到 isms.ts
提取丰富的信息：核心论断、四格分析、知识延伸等
"""
import os
import re
import json

def clean_markdown(text):
    """清理 markdown 格式"""
    # 清理 markdown 链接 [[xxx]]
    text = re.sub(r'\[\[([^\]]+)\]\]', r'\1', text)
    # 清理加粗
    text = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)
    # 清理多余空白
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def extract_section(content, section_name):
    """提取指定章节的内容"""
    # 尝试匹配 "### xxx" 或 "#### xxx" 开头的章节
    pattern = rf'#{2,4}\s*\*?\*?{section_name}\*?\*?.*?\n(.*?)(?=\n#{2,4}\s|\n---|\Z)'
    match = re.search(pattern, content, re.DOTALL)
    if match:
        return match.group(1).strip()
    return ""

def extract_four_grid(content):
    """提取四格分析"""
    grids = {}
    
    # 格式: 1.  **场域之"1" (Ontology)**：xxx
    # 注意中文弯引号 "" (U+201C, U+201D) 和英文引号
    quote_left = r'["\u201c\u201e\u0022]'   # 左引号
    quote_right = r'["\u201d\u201f\u0022]'  # 右引号
    
    # 场域
    match = re.search(rf'\d+\.\s+\*\*场域之{quote_left}(\d){quote_right}\s*\(Ontology\)\*\*[：:]\s*(.+?)(?=\n\n\d+\.\s+\*\*|\n###|\n---|\Z)', content, re.DOTALL)
    if match:
        text = match.group(2).strip()
        # 限制长度
        if len(text) > 300:
            text = text[:297] + "..."
        grids['ontology'] = {'value': match.group(1), 'text': clean_markdown(text)}
    
    # 本体
    match = re.search(rf'\d+\.\s+\*\*本体之{quote_left}(\d){quote_right}\s*\(Body\)\*\*[：:]\s*(.+?)(?=\n\n\d+\.\s+\*\*|\n###|\n---|\Z)', content, re.DOTALL)
    if match:
        text = match.group(2).strip()
        if len(text) > 300:
            text = text[:297] + "..."
        grids['body'] = {'value': match.group(1), 'text': clean_markdown(text)}
    
    # 现象
    match = re.search(rf'\d+\.\s+\*\*现象之{quote_left}(\d){quote_right}\s*\(Phenomenon\)\*\*[：:]\s*(.+?)(?=\n\n\d+\.\s+\*\*|\n###|\n---|\Z)', content, re.DOTALL)
    if match:
        text = match.group(2).strip()
        if len(text) > 300:
            text = text[:297] + "..."
        grids['phenomenon'] = {'value': match.group(1), 'text': clean_markdown(text)}
    
    # 目的
    match = re.search(rf'\d+\.\s+\*\*目的之{quote_left}(\d){quote_right}\s*\(Purpose\)\*\*[：:]\s*(.+?)(?=\n\n\d+\.\s+\*\*|\n###|\n---|\Z)', content, re.DOTALL)
    if match:
        text = match.group(2).strip()
        if len(text) > 300:
            text = text[:297] + "..."
        grids['purpose'] = {'value': match.group(1), 'text': clean_markdown(text)}
    
    return grids

def extract_extensions(content):
    """提取知识延伸"""
    extensions = []
    # 查找五、知识延伸章节
    section_match = re.search(r'###\s*\*?\*?五、知识延伸\*?\*?\s*\n(.*?)(?=\n###|\n---|\Z)', content, re.DOTALL)
    if section_match:
        section = section_match.group(1)
        # 匹配 - **《xxx》** 或 - **xxx** 开头的条目
        items = re.findall(r'-\s*\*\*\[?\[?([^\]]*?)\]?\]?\*\*[：:]\s*(.+?)(?=\n-\s*\*\*|\Z)', section, re.DOTALL)
        for title, desc in items:
            extensions.append({
                'title': clean_markdown(title),
                'description': clean_markdown(desc)[:200]
            })
    return extensions[:4]  # 最多4个

def extract_qa(content):
    """提取问答"""
    qa_list = []
    # 查找四、知识点问答章节
    section_match = re.search(r'###\s*\*?\*?四、知识点问答\*?\*?\s*\n(.*?)(?=\n###|\n---|\Z)', content, re.DOTALL)
    if section_match:
        section = section_match.group(1)
        # 匹配 #### Q1: xxx\nA: xxx
        items = re.findall(r'####\s*Q\d+[：:]\s*(.+?)\nA[：:]\s*(.+?)(?=\n####|\Z)', section, re.DOTALL)
        for q, a in items:
            qa_list.append({
                'question': clean_markdown(q),
                'answer': clean_markdown(a)[:300]
            })
    return qa_list[:3]  # 最多3个

def extract_key_points(content):
    """提取关键观点"""
    points = []
    section_match = re.search(r'###\s*\*?\*?三、关键观点提取\*?\*?\s*\n(.*?)(?=\n###|\n---|\Z)', content, re.DOTALL)
    if section_match:
        section = section_match.group(1)
        # 匹配 - "xxx" 格式
        items = re.findall(r'-\s*"(.+?)"', section, re.DOTALL)
        for item in items:
            points.append(clean_markdown(item)[:200])
    return points[:4]  # 最多4个

def extract_ism_from_md(filepath):
    """从 markdown 文件中提取主义信息"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return None
    
    # 从文件名提取编码和名称
    filename = os.path.basename(filepath)
    match = re.match(r'^(\d-\d-\d-\d)\s+(.+)\.md$', filename)
    if not match:
        print(f"Skipping {filename} - doesn't match pattern")
        return None
    
    code = match.group(1)
    name = match.group(2)
    
    # 提取核心论断
    description = ""
    desc_match = re.search(r'\*\*核心论断\*\*[：:]\s*(.+?)(?:\n-|\n\*\*|\n---|\n###)', content, re.DOTALL)
    if desc_match:
        description = clean_markdown(desc_match.group(1))
    
    if not description:
        description = f"{name}的哲学思想体系。"
    
    # 提取别名
    aliases = []
    alias_match = re.search(r'\*\*意识形态命名\*\*[：:]\s*(.+?)(?:\n)', content)
    if alias_match:
        alias_text = clean_markdown(alias_match.group(1))
        # 分割 "/" 或 "、"
        aliases = [a.strip() for a in re.split(r'[/、]', alias_text) if a.strip() and a.strip() != name]
    
    # 提取四格分析
    four_grid = extract_four_grid(content)
    
    # 提取知识延伸
    extensions = extract_extensions(content)
    
    # 提取问答
    qa = extract_qa(content)
    
    # 提取关键观点
    key_points = extract_key_points(content)
    
    return {
        'code': code,
        'name': name,
        'aliases': aliases,
        'description': description,
        'fourGrid': four_grid,
        'extensions': extensions,
        'qa': qa,
        'keyPoints': key_points
    }

def scan_folder(base_path):
    """扫描文件夹中的所有 md 文件"""
    isms = []
    
    for root, dirs, files in os.walk(base_path):
        for file in files:
            if file.endswith('.md') and re.match(r'^\d-\d-\d-\d', file):
                filepath = os.path.join(root, file)
                ism = extract_ism_from_md(filepath)
                if ism:
                    isms.append(ism)
    
    return isms

def escape_ts_string(s):
    """转义 TypeScript 字符串"""
    return s.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')

def generate_ts(isms, output_path):
    """生成 TypeScript 文件"""
    
    ts_content = '''// 由 import_isms.py 自动生成
// 主义主义数据库 - 来自未明子主义主义笔记

export interface FourGridItem {
  value: string;
  text: string;
}

export interface FourGrid {
  ontology?: FourGridItem;   // 场域
  body?: FourGridItem;       // 本体
  phenomenon?: FourGridItem; // 现象
  purpose?: FourGridItem;    // 目的
}

export interface Extension {
  title: string;
  description: string;
}

export interface QA {
  question: string;
  answer: string;
}

export interface Ism {
  code: string;
  name: string;
  aliases: string[];
  description: string;
  fourGrid: FourGrid;
  extensions: Extension[];
  qa: QA[];
  keyPoints: string[];
}

export const ismsDatabase: Ism[] = [
'''
    
    for ism in sorted(isms, key=lambda x: x['code']):
        aliases_str = ', '.join([f'"{escape_ts_string(a)}"' for a in ism['aliases']])
        
        # 四格分析
        fg = ism['fourGrid']
        fg_parts = []
        for key in ['ontology', 'body', 'phenomenon', 'purpose']:
            if key in fg:
                fg_parts.append(f'{key}: {{ value: "{fg[key]["value"]}", text: "{escape_ts_string(fg[key]["text"])}" }}')
        fg_str = ', '.join(fg_parts)
        
        # 知识延伸
        ext_parts = []
        for ext in ism['extensions']:
            ext_parts.append(f'{{ title: "{escape_ts_string(ext["title"])}", description: "{escape_ts_string(ext["description"])}" }}')
        ext_str = ', '.join(ext_parts)
        
        # 问答
        qa_parts = []
        for qa in ism['qa']:
            qa_parts.append(f'{{ question: "{escape_ts_string(qa["question"])}", answer: "{escape_ts_string(qa["answer"])}" }}')
        qa_str = ', '.join(qa_parts)
        
        # 关键观点
        kp_str = ', '.join([f'"{escape_ts_string(kp)}"' for kp in ism['keyPoints']])
        
        ts_content += f'''  {{
    code: "{ism['code']}",
    name: "{escape_ts_string(ism['name'])}",
    aliases: [{aliases_str}],
    description: "{escape_ts_string(ism['description'])}",
    fourGrid: {{ {fg_str} }},
    extensions: [{ext_str}],
    qa: [{qa_str}],
    keyPoints: [{kp_str}],
  }},
'''
    
    ts_content += '''];

// 搜索函数：支持精确匹配和通配符匹配
export function searchIsms(searchCode: string): Ism[] {
  const searchParts = searchCode.split('-');

  const results = ismsDatabase.filter((ism) => {
    const ismParts = ism.code.split('-');

    if (ismParts.length !== searchParts.length) return false;

    for (let i = 0; i < ismParts.length; i++) {
      const searchPart = searchParts[i];
      const ismPart = ismParts[i];

      // $ 作为通配符匹配任何值
      if (searchPart === '$') continue;
      if (ismPart === '$') continue;

      if (searchPart !== ismPart) return false;
    }

    return true;
  });

  return results;
}

// 获取单个主义详情
export function getIsmByCode(code: string): Ism | undefined {
  return ismsDatabase.find(ism => ism.code === code);
}

// 获取相关主义（同一大类）
export function getRelatedIsms(code: string, limit: number = 4): Ism[] {
  const prefix = code.split('-').slice(0, 2).join('-');
  return ismsDatabase
    .filter(ism => ism.code.startsWith(prefix) && ism.code !== code)
    .slice(0, limit);
}
'''
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(ts_content)
    
    print(f"Generated {output_path} with {len(isms)} isms")

if __name__ == '__main__':
    base_folders = [
        r'd:\study\口订\vibecoding\未明子\主义主义',
        r'd:\study\口订\vibecoding\未明子\主义主义2字头',
        r'd:\study\口订\vibecoding\未明子\主义主义3字头',
    ]
    
    all_isms = []
    for folder in base_folders:
        if os.path.exists(folder):
            isms = scan_folder(folder)
            all_isms.extend(isms)
            print(f"Found {len(isms)} isms in {folder}")
    
    print(f"\nTotal: {len(all_isms)} isms")
    
    # 输出到两个位置
    generate_ts(all_isms, r'd:\study\口订\vibecoding\ismism\data\isms.ts')
    generate_ts(all_isms, r'd:\study\口订\vibecoding\ismism\src\data\isms.ts')

