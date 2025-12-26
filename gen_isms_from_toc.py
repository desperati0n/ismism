import re
import json
from pathlib import Path

"""
从《主义主义》目录 txt 中自动抽取 4 段编码的模块，生成 JSON。

使用说明：
1. 确保本脚本与 `主义主义.txt` 在同一目录（通常是 works/vibecoding/ismism）。
2. 在该目录下运行：  python gen_isms_from_toc.py
3. 将会生成 `isms-from-toc.json`，结构为：
   {
     "modules": [
       { "code": "1-1-1-1", "name": "科学独断论", "rawText": "" },
       ...
     ]
   }
"""

INPUT_FILE = "主义主义.txt"        # 目录 txt 文件名
OUTPUT_FILE = "isms-from-toc.json"  # 输出 JSON 文件名


# 粗过滤：行首是 1–4 或 $ 开头的四段编码
rough_pattern = re.compile(
    r"^[ \t]*(\$|[1-4])-\d-\d-\d"  # 如 1-1-1-1 / 2-3-4-2 / $-1-2-3
)

# 精确提取：code + name
# 说明：
# - 有的行是 `1-1-3-1功能主义`（code 与名称紧贴），有的中间有空格
# - 行尾通常有页码数字，需要去掉
extract_pattern = re.compile(
    r"^[ \t]*"
    r"(?P<code>(?:\$|[1-4])-\d-\d-\d)"  # code
    r"[ \t]*"
    r"(?P<name>.+?)"                    # 名称（先贪婪抓取）
    r"[ \t]*\d*[ \t]*$"                 # 结尾可能有页码数字
)


def main() -> None:
    input_path = Path(INPUT_FILE)
    if not input_path.exists():
        raise SystemExit(f"找不到输入文件: {input_path}")

    modules = []

    with input_path.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.rstrip("\n")
            if not rough_pattern.match(line):
                continue

            m = extract_pattern.match(line)
            if not m:
                continue

            code = m.group("code").strip()
            name = m.group("name").strip()
            # 去掉名称末尾可能残留的页码数字
            name = re.sub(r"\s*\d+$", "", name).strip()
            # 规范化名称中的多余空白
            name = re.sub(r"\s+", " ", name)

            modules.append(
                {
                    "code": code,
                    "name": name,
                    "rawText": "",
                }
            )

    # 按 code 去重，后出现的覆盖前面的
    unique = {}
    for m in modules:
        unique[m["code"]] = m
    modules = list(unique.values())

    output = {"modules": modules}

    out_path = Path(OUTPUT_FILE)
    out_path.write_text(
        json.dumps(output, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    print(f"已从 {input_path} 抽取 {len(modules)} 条模块，写入 {out_path}")


if __name__ == "__main__":
    main()


