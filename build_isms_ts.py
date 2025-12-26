import json
from pathlib import Path

"""
根据 JSON 源数据自动生成 `data/isms.ts`：

- 读入：
  - `isms-from-toc.json`：从《主义主义》目录中解析出的 code + name
  - 可选 `isms-source.json`：手工/AI 已编辑过的条目（优先使用这里的 name/rawText）
- 输出：
  - 覆盖生成 `data/isms.ts`，只包含：
    - `Ism` 接口
    - `ismsDatabase: Ism[]`（description 暂时用 rawText 或空字符串）
    - `searchIsms` 搜索函数（保持原有匹配规则）

使用方式（在 works/vibecoding/ismism 目录下）：
  python build_isms_ts.py
"""

ROOT = Path(__file__).parent

TOC_JSON = ROOT / "isms-from-toc.json"
SOURCE_JSON = ROOT / "isms-source.json"
OUTPUT_TS = ROOT / "data" / "isms.ts"


def load_json(path: Path) -> dict:
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def main() -> None:
    toc = load_json(TOC_JSON)
    if "modules" not in toc:
        raise SystemExit(f"{TOC_JSON} 中缺少 'modules' 字段")

    source = load_json(SOURCE_JSON)
    source_modules = {m["code"]: m for m in source.get("modules", [])}

    merged: dict[str, dict] = {}

    # 先放入 toc 中的条目
    for m in toc["modules"]:
        code = m.get("code")
        if not code:
            continue
        merged[code] = {
            "code": code,
            "name": m.get("name", "").strip(),
            "rawText": m.get("rawText", "").strip(),
        }

    # 再用 isms-source 覆盖（保留我们之前手写的更精细内容）
    for code, m in source_modules.items():
        merged[code] = {
            "code": code,
            "name": m.get("name", "").strip(),
            "rawText": m.get("rawText", "").strip(),
        }

    # 按 code 排序，保证生成文件稳定
    ordered = [merged[c] for c in sorted(merged.keys())]

    # 生成 TypeScript 内容
    lines: list[str] = []
    lines.append("// 由 build_isms_ts.py 自动生成，请勿手工编辑大段内容。")
    lines.append("// 主义主义数据库 - 来自目录与 isms-source.json 的合并结果")
    lines.append("")
    lines.append("export interface Ism {")
    lines.append("  code: string;")
    lines.append("  name: string;")
    lines.append("  description: string;")
    lines.append("}")
    lines.append("")
    lines.append("export const ismsDatabase: Ism[] = [")

    for m in ordered:
        code = m["code"]
        name = m["name"]
        raw = m["rawText"]
        # description 先用 rawText，占位用空字符串也可以
        desc = raw or ""

        # 简单转义
        name_ts = name.replace("\\", "\\\\").replace('"', '\\"')
        desc_ts = desc.replace("\\", "\\\\").replace('"', '\\"')

        lines.append("  {")
        lines.append(f'    code: "{code}",')
        lines.append(f'    name: "{name_ts}",')
        lines.append(f'    description: "{desc_ts}",')
        lines.append("  },")

    lines.append("];")
    lines.append("")
    lines.append("// 搜索函数：支持精确匹配和通配符匹配")
    lines.append("// 重要：第一个格子的 $ 代表\"主体性缺失\"，应该匹配所有 $-x-x-x 格式的模块")
    lines.append("// 其他格子的 $ 作为通配符，匹配任意值（1-4）")
    lines.append("export function searchIsms(searchCode: string): Ism[] {")
    lines.append("  const searchParts = searchCode.split('-');")
    lines.append("")
    lines.append("  // 如果长度不是 4，返回空数组")
    lines.append("  if (searchParts.length !== 4) return [];")
    lines.append("")
    lines.append("  const results = ismsDatabase.filter((ism) => {")
    lines.append("    const ismParts = ism.code.split('-');")
    lines.append("")
    lines.append("    // 如果数据库模块的长度不是 4，跳过")
    lines.append("    if (ismParts.length !== 4) return false;")
    lines.append("")
    lines.append("    // 特殊处理：第一个格子为 $ 的情况")
    lines.append("    if (searchParts[0] === '$') {")
    lines.append("      // 第一个格子的 $ 代表\"主体性缺失\"，必须匹配数据库中以 $- 开头的模块")
    lines.append("      if (ismParts[0] !== '$') return false;")
    lines.append("")
    lines.append("      // 对于剩余的 3 位，进行匹配（$ 在其他位置作为通配符）")
    lines.append("      for (let i = 1; i < 4; i++) {")
    lines.append("        const searchPart = searchParts[i];")
    lines.append("        const ismPart = ismParts[i];")
    lines.append("")
    lines.append("        // 如果搜索码的这一位是 $，匹配任何值")
    lines.append("        if (searchPart === '$') continue;")
    lines.append("")
    lines.append("        // 否则必须精确匹配")
    lines.append("        if (searchPart !== ismPart) return false;")
    lines.append("      }")
    lines.append("")
    lines.append("      return true;")
    lines.append("    }")
    lines.append("")
    lines.append("    // 第一个格子不是 $ 的情况：第一个格子必须精确匹配（不能是 $）")
    lines.append("    if (ismParts[0] === '$') return false;")
    lines.append("    if (searchParts[0] !== ismParts[0]) return false;")
    lines.append("")
    lines.append("    // 对于剩余的 3 位，进行匹配")
    lines.append("    for (let i = 1; i < 4; i++) {")
    lines.append("      const searchPart = searchParts[i];")
    lines.append("      const ismPart = ismParts[i];")
    lines.append("")
    lines.append("      // 如果搜索码的这一位是 $，匹配任何值（1-4）")
    lines.append("      if (searchPart === '$') continue;")
    lines.append("")
    lines.append("      // 否则必须精确匹配")
    lines.append("      if (searchPart !== ismPart) return false;")
    lines.append("    }")
    lines.append("")
    lines.append("    return true;")
    lines.append("  });")
    lines.append("")
    lines.append("  return results;")
    lines.append("}")
    lines.append("")

    OUTPUT_TS.write_text("\n".join(lines), encoding="utf-8")
    print(f"已生成 {len(ordered)} 条主义到 {OUTPUT_TS}")


if __name__ == "__main__":
    main()


