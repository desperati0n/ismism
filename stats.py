import re

with open(r'd:\study\口订\vibecoding\ismism\data\isms.ts', encoding='utf-8') as f:
    content = f.read()

# 统计
total = content.count('code: "')
with_four_grid = len(re.findall(r'fourGrid: \{ ontology:', content))
with_extensions = len(re.findall(r'extensions: \[\{', content))
with_qa = len(re.findall(r'qa: \[\{', content))

print(f'Total isms: {total}')
print(f'With fourGrid: {with_four_grid}')
print(f'With extensions: {with_extensions}')
print(f'With QA: {with_qa}')
