import re

content = open(r'd:\study\口订\vibecoding\未明子\主义主义\1-1 科学实在论\1-1-1 物理主义\1-1-1-1 科学独断论.md', encoding='utf-8').read()

# 打印实际字符编码
idx = content.find('场域之')
if idx > 0:
    substr = content[idx:idx+20]
    print('Substring:', repr(substr))
    print('Hex:', substr.encode('utf-8').hex())
    
    # 检查引号字符
    for i, ch in enumerate(substr):
        if ch in '""\'"\'':
            print(f'  Char {i}: {repr(ch)} -> {ord(ch)}')
