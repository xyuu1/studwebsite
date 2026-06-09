// 课程数据结构定义
export interface Exercise {
  id: number;
  type: 'coding';
  question: string;
  starterCode: string;
  solution: string;
  explanation: string;
  hints?: string[];
  commonErrors?: { error: string; description: string; solution: string; }[];
}

export interface Quiz {
  id: number;
  type: 'multiple_choice' | 'true_false';
  question: string;
  options?: string[];
  correctAnswer: string | boolean;
  explanation: string;
  hints?: string[];
}

export interface Chapter {
  id: number;
  title: string;
  content: string;
  codeExamples: { title: string; code: string; }[];
  exercises: Exercise[];
  quiz: { multipleChoice: Quiz[]; trueFalse: Quiz[]; };
}

export interface Course {
  id: number;
  title: string;
  description: string;
  totalDuration: string;
  difficulty: '基础' | '进阶' | '高级';
  chapters: Chapter[];
}

export const courses: Course[] = [
  {
    id: 1,
    title: '数据分析技术',
    description: '学习Python数据分析核心技术，包括Python基础、数据来源、数据采集、数据清洗、数据可视化和统计分析。',
    totalDuration: '24小时',
    difficulty: '基础',
    chapters: [
    {
      id: 1,
      title: "Python基础",
      content: "本章学习Python编程语言的基础知识，包括变量、数据类型、控制流和函数等核心概念，为后续数据分析学习打下坚实基础。",
      codeExamples: [
        { title: "变量与数据类型", code: `name = "张三"
age = 20
height = 1.75
is_student = True
print(f"姓名：{name}")
print(f"年龄：{age}")
print(f"身高：{height}")
print(type(name), type(age), type(height))` },
        { title: "列表与字典操作", code: `numbers = [1, 2, 3, 4, 5]
numbers.append(6)
print(f"长度：{len(numbers)}, 求和：{sum(numbers)}")
student = {"name": "张三", "age": 20, "score": 85.5}
print(f"学生姓名：{student['name']}")
student['grade'] = 'A'
print(f"添加年级后：{student}")` },
        { title: "函数定义与调用", code: `def greet(name):
    """问候函数"""
    return f"你好，{name}！"
def calculate_stats(numbers):
    """计算统计信息"""
    return {"sum": sum(numbers), "avg": sum(numbers)/len(numbers)}
print(greet("数据分析"))
nums = [10, 20, 30, 40, 50]
print(f"统计数据：{calculate_stats(nums)}")` },
      ],
      exercises: [
        {
          id: 1,
          type: "coding",
          question: "猜数字游戏：编写一个函数，让用户猜1-100之间的随机数，给出\"太大了\"或\"太小了\"的提示",
          starterCode: `import random
def guess_number():
    target = random.randint(1, 100)
    attempts = 0
    # 在这里编写代码
guess_number()`,
          solution: `import random
def guess_number():
    target = random.randint(1, 100)
    attempts = 0
    print("欢迎来到猜数字游戏！")
    while True:
        try:
            guess = int(input("请输入你的猜测: "))
            attempts += 1
            if guess < target: print("太小了！再试一次。")
            elif guess > target: print("太大了！再试一次。")
            else:
                print(f"恭喜你，猜对了！用了{attempts}次。")
                break
        except ValueError: print("请输入有效的数字！")
guess_number()`,
          explanation: "使用 random.randint() 生成随机数，用 while 循环让用户持续猜测，根据猜测结果给出提示。try-except 处理非法输入。",
          hints: [
            "需要使用 while True 无限循环，让用户可以反复猜，直到猜对。循环内用 input() 获取用户输入，用 int() 转成整数。",
            "核心逻辑：用 if/elif/else 判断 guess 与 target 的大小关系，分别输出 太小了/太大了/猜对了。猜对后用 break 跳出循环。",
            "在 input() 外面包裹 try-except ValueError，防止用户输入非数字导致程序崩溃。用 attempts 变量记录猜测次数。"
          ],
          commonErrors: [
            { error: "未处理异常", description: "没有处理用户输入非数字的情况", solution: "使用 try-except 捕获 ValueError" },
            { error: "循环无结束条件", description: "忘记在猜对时 break 跳出循环", solution: "在猜对时添加 break" },
          ]
        },
        {
          id: 2,
          type: "coding",
          question: "石头剪刀布游戏：编写一个函数，让玩家和电脑玩石头剪刀布",
          starterCode: `import random
def rock_paper_scissors():
    choices = ['石头', '剪刀', '布']
    # 在这里编写代码
rock_paper_scissors()`,
          solution: `import random
def rock_paper_scissors():
    choices = ['石头', '剪刀', '布']
    print("欢迎来到石头剪刀布！输入退出结束游戏。")
    while True:
        player = input("你的选择（石头/剪刀/布）：")
        if player == '退出': break
        if player not in choices: continue
        computer = random.choice(choices)
        print(f"电脑选择：{computer}")
        if player == computer: print("平局！")
        elif (player=='石头'and computer=='剪刀')or(player=='剪刀'and computer=='布')or(player=='布'and computer=='石头'):
            print("你赢了！")
        else: print("你输了！")
rock_paper_scissors()`,
          explanation: "使用 random.choice() 让电脑随机选择，通过 if-elif 判断胜负关系。",
          hints: [
            "首先用 while True 构建游戏主循环，在循环内用 input() 获取玩家输入。检查玩家输入是否在 choices 列表中，不合法则 continue 跳过。",
            "用 random.choice(choices) 让电脑随机选择。胜负判断：玩家胜的情况只有3种——石头胜剪刀、剪刀胜布、布胜石头，用 or 连接这3个条件。",
            "如果玩家输入'退出'则 break 结束循环。可以用 f-string 打印电脑选择，让界面更友好。"
          ],
          commonErrors: [
            { error: "判断逻辑错误", description: "胜负判断条件有误", solution: "正确列出所有玩家获胜的情况" },
          ]
        },
        {
          id: 3,
          type: "coding",
          question: "斐波那契数列：编写一个函数，生成前n个斐波那契数",
          starterCode: `def fibonacci(n):
    # 在这里编写代码
print(fibonacci(10))`,
          solution: `def fibonacci(n):
    if n <= 0: return []
    elif n == 1: return [0]
    elif n == 2: return [0, 1]
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[i-1] + fib[i-2])
    return fib
print(fibonacci(10))`,
          explanation: "斐波那契数列的每个数是前两个数的和，用列表存储序列，循环逐步生成后续的数。",
          hints: [
            "先处理边界情况：n <= 0 返回空列表 []，n == 1 返回 [0]，n == 2 返回 [0, 1]。",
            "从第3个数开始，每个新数 = 列表中最后一个数 + 列表中倒数第二个数。可以用 for 循环从 2 遍历到 n。",
            "用 fib.append(fib[i-1] + fib[i-2]) 不断追加新元素。最后 return 整个列表。注意 Python 的 range 是左闭右开区间。"
          ],
          commonErrors: [
            { error: "边界情况处理", description: "没有处理n为0或1的情况", solution: "先判断n的大小并返回相应结果" },
          ]
        },
      ],
      quiz: {
        multipleChoice: [
          { id: 1, type: "multiple_choice", question: "Python中，以下哪个是正确的变量命名？", options: ["2name", "my-name", "my_name", "myName"], correctAnswer: "my_name", explanation: "Python变量名必须以字母或下划线开头，不能以数字开头。my_name是推荐的命名方式。" },
          { id: 2, type: "multiple_choice", question: "type()函数的作用是什么？", options: ["修改变量类型", "返回变量的类型", "创建新变量", "删除变量"], correctAnswer: "返回变量的类型", explanation: "type()函数返回变量或值的数据类型。" },
          { id: 3, type: "multiple_choice", question: "以下哪个是浮点数的例子？", options: ["42", "\"3.14\"", "3.14", "True"], correctAnswer: "3.14", explanation: "浮点数（float）是包含小数点的数值类型。" },
          { id: 4, type: "multiple_choice", question: "Python中整数除法使用哪个运算符？", options: ["/", "//", "%", "*"], correctAnswer: "//", explanation: "//是整数除法运算符，返回整数结果。/是普通除法，返回浮点数。" },
          { id: 5, type: "multiple_choice", question: "字符串可以使用什么符号定义？", options: ["只有双引号", "只有单引号", "单引号或双引号", "只有中括号"], correctAnswer: "单引号或双引号", explanation: "Python中字符串可以用单引号或双引号定义。" },
          { id: 6, type: "multiple_choice", question: "len()函数不能用于以下哪个类型？", options: ["字符串", "列表", "字典", "整数"], correctAnswer: "整数", explanation: "len()函数用于获取序列的长度，整数不是序列类型。" },
          { id: 7, type: "multiple_choice", question: "input()函数的返回值类型是什么？", options: ["整数", "浮点数", "字符串", "布尔值"], correctAnswer: "字符串", explanation: "input()函数总是返回字符串类型。需要数值时要用int()或float()转换。" },
          { id: 8, type: "multiple_choice", question: "Python中的布尔值True和False分别等价于？", options: ["1和0", "\"1\"和\"0\"", "10和0", "其他"], correctAnswer: "1和0", explanation: "在Python中，True等价于1，False等价于0。" },
          { id: 9, type: "multiple_choice", question: "str(123)的作用是什么？", options: ["转成整数", "转成浮点数", "转成字符串", "转成布尔值"], correctAnswer: "转成字符串", explanation: "str()函数将其他类型转换为字符串。" },
          { id: 10, type: "multiple_choice", question: "以下哪个是正确的注释符号？", options: ["//", "/* */", "#", "--"], correctAnswer: "#", explanation: "Python中使用#符号创建单行注释。" },
        ],
        trueFalse: [
          { id: 1, type: "true_false", question: "Python中的变量创建时不需要声明类型。", correctAnswer: true, explanation: "Python是动态类型语言，变量在赋值时自动确定类型。" },
          { id: 2, type: "true_false", question: "链式赋值 a = b = c = 0 在Python中是合法的。", correctAnswer: true, explanation: "Python支持链式赋值，可以同时给多个变量赋相同的值。" },
          { id: 3, type: "true_false", question: "字符串在Python中是可变的，可以通过索引直接修改某个字符。", correctAnswer: false, explanation: "Python中的字符串是不可变对象（immutable）。" },
          { id: 4, type: "true_false", question: "浮点数运算可能存在精度问题，例如 0.1 + 0.2 不一定严格等于 0.3。", correctAnswer: true, explanation: "由于浮点数在计算机中以二进制存储，存在精度损失问题。" },
          { id: 5, type: "true_false", question: "Python中可以用下划线作为数字的分隔符，如 1_000_000 表示100万。", correctAnswer: true, explanation: "Python 3.6+支持下划线作为数字的视觉分隔符。" },
          { id: 6, type: "true_false", question: "None 在Python中等价于数字0。", correctAnswer: false, explanation: "None是一个特殊的空值对象，不是0。" },
          { id: 7, type: "true_false", question: "Python区分大小写，变量 Name 和 name 是两个不同的变量。", correctAnswer: true, explanation: "Python是区分大小写的语言。" },
          { id: 8, type: "true_false", question: "在布尔运算中，and 和 or 运算符总是返回布尔值True或False。", correctAnswer: false, explanation: "Python中的and和or运算符返回的是参与运算的实际值，而非布尔值。" },
          { id: 9, type: "true_false", question: "Python变量名可以以字母或下划线开头。", correctAnswer: true, explanation: "变量名必须以字母（a-z, A-Z）或下划线（_）开头。" },
          { id: 10, type: "true_false", question: "type()函数可以用来查看变量的数据类型。", correctAnswer: true, explanation: "type()是Python内置函数，返回对象的类型信息。" },
        ]
      }
    },
    {
      id: 2,
      title: "数据来源与类型",
      content: "本章学习常见数据源的获取方式，以及CSV、JSON、Excel等数据格式的特点，掌握使用Pandas读取各种格式数据的方法。",
      codeExamples: [
        { title: "读取CSV文件", code: `import pandas as pd
df = pd.read_csv('students.csv')
print("数据形状：", df.shape)
print("前5行：")
print(df.head())` },
        { title: "读取Excel文件", code: `import pandas as pd
df = pd.read_excel('sales.xlsx', sheet_name='2024')
print("列名：", df.columns.tolist())
print("数据概览：")
print(df.describe())` },
        { title: "读取JSON数据", code: `import pandas as pd
import json
json_str = """
[
  {"name": "苹果", "price": 5.5, "stock": 100},
  {"name": "香蕉", "price": 3.0, "stock": 200}
]
"""
data = json.loads(json_str)
df = pd.DataFrame(data)
print(df)` },
      ],
      exercises: [
        {
          id: 1,
          type: "coding",
          question: "简单的学生成绩管理：创建包含学生姓名、科目和成绩的DataFrame，并按科目计算平均分",
          starterCode: `import pandas as pd
data = {
    '姓名': ['张三', '李四', '王五', '张三', '李四', '王五'],
    '科目': ['数学', '数学', '数学', '语文', '语文', '语文'],
    '成绩': [85, 92, 78, 90, 88, 82]
}
# 在这里编写代码`,
          solution: `import pandas as pd
data = {
    '姓名': ['张三', '李四', '王五', '张三', '李四', '王五'],
    '科目': ['数学', '数学', '数学', '语文', '语文', '语文'],
    '成绩': [85, 92, 78, 90, 88, 82]
}
df = pd.DataFrame(data)
print(df)
print()
print("按科目平均分：")
print(df.groupby('科目')['成绩'].mean())`,
          explanation: "使用Pandas创建DataFrame，通过 groupby() 进行分组聚合计算。",
          commonErrors: [
            { error: "分组语法错误", description: "忘记指定聚合函数如 mean()", solution: "groupby() 后需要调用聚合函数" },
          ]
        },
        {
          id: 2,
          type: "coding",
          question: "数据筛选：使用Pandas从销售数据中筛选出销售额大于1000且地区为\"华东\"的记录",
          starterCode: `import pandas as pd
sales_data = {
    '产品': ['A', 'B', 'C', 'D', 'E'],
    '销售额': [1500, 800, 2000, 600, 1200],
    '地区': ['华东', '华北', '华东', '华南', '华东']
}
df = pd.DataFrame(sales_data)
# 在这里编写筛选逻辑`,
          solution: `import pandas as pd
sales_data = {
    '产品': ['A', 'B', 'C', 'D', 'E'],
    '销售额': [1500, 800, 2000, 600, 1200],
    '地区': ['华东', '华北', '华东', '华南', '华东']
}
df = pd.DataFrame(sales_data)
filtered = df[(df['销售额'] > 1000) & (df['地区'] == '华东')]
print("筛选结果：")
print(filtered)`,
          explanation: "Pandas支持使用布尔索引进行数据筛选。多个条件需要用 & (与)连接，每个条件必须用括号包裹。",
          commonErrors: [
            { error: "符号错误", description: "使用了 and 而不是 &", solution: "在Pandas筛选中使用 &" },
            { error: "缺少括号", description: "没有给每个条件加括号", solution: "每个条件必须用括号包裹" },
          ]
        },
        {
          id: 3,
          type: "coding",
          question: "统计分析：编写代码计算一组数据的总数、总和、平均值、最大值和最小值",
          starterCode: `import pandas as pd
numbers = [23, 45, 12, 67, 89, 34, 56, 78, 91, 28]
df = pd.DataFrame(numbers, columns=['数值'])
# 在这里编写代码`,
          solution: `import pandas as pd
numbers = [23, 45, 12, 67, 89, 34, 56, 78, 91, 28]
df = pd.DataFrame(numbers, columns=['数值'])
print(f"总数：{len(numbers)}")
print(f"总和：{sum(numbers)}")
print(f"平均值：{sum(numbers)/len(numbers):.2f}")
print(f"最大值：{max(numbers)}")
print(f"最小值：{min(numbers)}")
print()
print("Pandas describe：")
print(df.describe())`,
          explanation: "可以使用Python内置函数进行统计计算，也可以直接使用Pandas的 describe() 方法。",
          commonErrors: [
            { error: "空列表处理", description: "没有处理空列表导致除零错误", solution: "判断列表长度或使用Pandas自动处理" },
          ]
        },
      ],
      quiz: {
        multipleChoice: [
          { id: 1, type: "multiple_choice", question: "Pandas中用于读取CSV文件的函数是？", options: ["pd.read_csv()", "pd.load_csv()", "pd.open_csv()", "pd.csv_read()"], correctAnswer: "pd.read_csv()", explanation: "pd.read_csv() 是Pandas读取CSV文件的标准函数。" },
          { id: 2, type: "multiple_choice", question: "以下哪种文件格式Pandas不支持直接读取？", options: ["CSV", "Excel", "JSON", "PSD"], correctAnswer: "PSD", explanation: "PSD是Photoshop图像格式，Pandas不支持。" },
          { id: 3, type: "multiple_choice", question: "DataFrame的shape属性返回什么？", options: ["元素总数", "(行数, 列数)", "列名列表", "数据类型"], correctAnswer: "(行数, 列数)", explanation: "shape属性返回一个元组(行数, 列数)。" },
          { id: 4, type: "multiple_choice", question: "df.head() 默认返回前几行？", options: ["3行", "5行", "10行", "全部"], correctAnswer: "5行", explanation: "head()方法默认返回前5行。" },
          { id: 5, type: "multiple_choice", question: "df.dtypes 的作用是？", options: ["返回所有数据", "返回各列数据类型", "删除数据", "修改类型"], correctAnswer: "返回各列数据类型", explanation: "dtypes属性返回DataFrame中每一列的数据类型。" },
          { id: 6, type: "multiple_choice", question: "读取 .xlsx 文件通常需要安装哪个库？", options: ["numpy", "openpyxl", "scipy", "sklearn"], correctAnswer: "openpyxl", explanation: "pandas读取 .xlsx 文件需要openpyxl作为引擎。" },
          { id: 7, type: "multiple_choice", question: "JSON数据中键值对之间用什么符号分隔？", options: ["分号", "逗号", "冒号", "空格"], correctAnswer: "逗号", explanation: "JSON中键值对之间用逗号分隔，键和值之间用冒号分隔。" },
          { id: 8, type: "multiple_choice", question: "Pandas中将DataFrame保存为CSV的方法是？", options: ["df.save_csv()", "df.write_csv()", "df.to_csv()", "df.export_csv()"], correctAnswer: "df.to_csv()", explanation: "df.to_csv() 是保存为CSV文件的标准方法。" },
          { id: 9, type: "multiple_choice", question: "Series和DataFrame的主要区别是什么？", options: ["没有区别", "Series是一维，DataFrame是二维", "Series更快", "DataFrame只能存数字"], correctAnswer: "Series是一维，DataFrame是二维", explanation: "Series是一维带标签的数据结构，DataFrame是二维表格结构。" },
          { id: 10, type: "multiple_choice", question: "读取CSV文件遇到中文乱码时，通常可以尝试设置什么参数？", options: ["header", "index_col", "encoding", "sep"], correctAnswer: "encoding", explanation: "encoding参数指定文件编码，中文文件常使用 utf-8、gbk 等编码。" },
        ],
        trueFalse: [
          { id: 1, type: "true_false", question: "CSV文件只能使用逗号作为字段分隔符。", correctAnswer: false, explanation: "CSV虽然名称是逗号分隔值，但分隔符可以是制表符、分号等。" },
          { id: 2, type: "true_false", question: "一个DataFrame中的不同列可以是不同的数据类型。", correctAnswer: true, explanation: "DataFrame的每一列可以有独立的数据类型。" },
          { id: 3, type: "true_false", question: "pd.read_json() 只能读取JSON文件，不能解析JSON字符串。", correctAnswer: false, explanation: "pd.read_json() 可以读取JSON文件，也可以传入JSON字符串。" },
          { id: 4, type: "true_false", question: "df.info() 方法可以显示每列的非空值数量和内存使用情况。", correctAnswer: true, explanation: "info() 是数据探索的常用方法，显示索引、列名、非空计数、数据类型和内存使用。" },
          { id: 5, type: "true_false", question: "Excel文件可以包含多个工作表（Sheet），Pandas可以指定读取某个工作表。", correctAnswer: true, explanation: "read_excel() 可以通过 sheet_name 参数指定要读取的工作表。" },
          { id: 6, type: "true_false", question: "JSON格式支持在数据中添加注释（类似 // 或 /* */）。", correctAnswer: false, explanation: "标准JSON不支持注释。" },
          { id: 7, type: "true_false", question: "df.describe() 只对数值列生成统计摘要。", correctAnswer: true, explanation: "describe() 默认只对数值类型列输出统计量。" },
          { id: 8, type: "true_false", question: "Pandas主要用于处理结构化的表格类数据。", correctAnswer: true, explanation: "Pandas专门设计用于处理结构化表格数据。" },
          { id: 9, type: "true_false", question: "read_csv() 的 usecols 参数可以只读取指定的列，减少内存占用。", correctAnswer: true, explanation: "usecols 参数接受列名列表或索引列表，只加载需要的列。" },
          { id: 10, type: "true_false", question: "df.columns 属性返回DataFrame的所有行索引。", correctAnswer: false, explanation: "df.columns 返回列名，df.index 返回行索引。" },
        ]
      }
    },
    {
      id: 3,
      title: "数据采集",
      content: "本章学习如何使用Python进行数据采集，包括文件读取、API调用、网络爬虫基础和数据库连接，掌握多源数据获取能力。",
      codeExamples: [
        { title: "使用requests获取网页数据", code: `import requests
response = requests.get('https://api.github.com')
print(f"状态码：{response.status_code}")
print(response.text[:200])` },
        { title: "调用RESTful API", code: `import requests
url = 'https://jsonplaceholder.typicode.com/posts/1'
response = requests.get(url)
if response.status_code == 200:
    data = response.json()
    print(f"标题：{data['title']}")` },
        { title: "数据库连接查询", code: `import sqlite3
import pandas as pd
conn = sqlite3.connect('example.db')
query = "SELECT * FROM users LIMIT 10"
df = pd.read_sql(query, conn)
print(df.head())
conn.close()` },
      ],
      exercises: [
        {
          id: 1,
          type: "coding",
          question: "待办事项管理：编写一个简单的待办事项管理程序，支持添加、查看和删除任务",
          starterCode: `def todo_manager():
    todos = []
    # 在这里编写代码
todo_manager()`,
          solution: `def todo_manager():
    todos = []
    while True:
        print("\\n=== 待办事项管理 ===")
        print("1. 添加任务")
        print("2. 查看任务")
        print("3. 删除任务")
        print("4. 退出")
        choice = input("请选择操作：")
        if choice == '1':
            task = input("请输入任务内容：")
            todos.append(task)
            print(f"已添加：{task}")
        elif choice == '2':
            if not todos: print("暂无任务")
            else:
                for i, task in enumerate(todos, 1):
                    print(f"{i}. {task}")
        elif choice == '3':
            idx = int(input("请输入要删除的任务编号：")) - 1
            if 0 <= idx < len(todos):
                removed = todos.pop(idx)
                print(f"已删除：{removed}")
        elif choice == '4':
            print("再见！")
            break
todo_manager()`,
          explanation: "通过列表存储任务，使用循环提供菜单选择，列表的 append() 和 pop() 方法实现添加和删除功能。",
          hints: [
            "先用 todos = [] 初始化一个空列表存储任务。然后用 while True 构建菜单循环，让用户反复操作。菜单用 print() 显示选项编号。",
            "用 input() 获取用户选择，然后用 if/elif 分别处理：'1' 添加任务用 todos.append()；'2' 查看任务用 for 循环配合 enumerate(, 1) 从1开始编号；'3' 删除任务用 todos.pop(idx)。",
            "删除前先检查索引是否有效（0 <= idx < len(todos)），避免 IndexError。用户选择 '4' 时 break 退出循环。用 if not todos 判断列表为空的情况。"
          ],
          commonErrors: [
            { error: "索引越界", description: "删除时没有检查用户输入的编号是否有效", solution: "判断索引是否在有效范围内" },
          ]
        },
        {
          id: 2,
          type: "coding",
          question: "简单的用户输入处理：编写代码收集用户基本信息并以字典形式保存",
          starterCode: `def collect_user_info():
    # 在这里编写代码
collect_user_info()`,
          solution: `def collect_user_info():
    user = {}
    user['name'] = input("请输入姓名：")
    while True:
        try:
            user['age'] = int(input("请输入年龄："))
            break
        except ValueError:
            print("请输入有效数字！")
    user['email'] = input("请输入邮箱：")
    print("\\n用户信息：")
    for k, v in user.items():
        print(f"{k}: {v}")
    return user
collect_user_info()`,
          explanation: "使用字典存储用户信息，通过 input() 收集数据，使用 try-except 验证年龄输入的有效性。",
          hints: [
            "先创建一个空字典 user = {}。用 user['name'] = input(...) 收集姓名，类似地收集邮箱。",
            "年龄需要转成整数，用 try-except 包裹：try 内写 user['age'] = int(input(...)) 然后 break；except ValueError 时提示用户重输。因为需要反复尝试，所以把这一段放进 while True 循环里。",
            "最后用 for k, v in user.items() 遍历字典打印每个字段。可以用 \\n 换行让输出更清晰。"
          ],
          commonErrors: [
            { error: "输入未验证", description: "数字类型输入没有做异常处理", solution: "使用 try-except 捕获 ValueError" },
          ]
        },
        {
          id: 3,
          type: "coding",
          question: "数据存储与展示：编写一个保存学生成绩到JSON文件并从文件读取展示的程序",
          starterCode: `import json
def save_and_load_scores():
    scores = {
        '张三': {'数学': 85, '语文': 90},
        '李四': {'数学': 92, '语文': 88}
    }
    # 在这里编写代码
save_and_load_scores()`,
          solution: `import json
def save_and_load_scores():
    scores = {
        '张三': {'数学': 85, '语文': 90},
        '李四': {'数学': 92, '语文': 88}
    }
    with open('scores.json', 'w', encoding='utf-8') as f:
        json.dump(scores, f, ensure_ascii=False, indent=2)
    print("已保存到 scores.json")
    with open('scores.json', 'r', encoding='utf-8') as f:
        loaded = json.load(f)
    print("\\n从文件读取：")
    for name, subjects in loaded.items():
        print(f"{name}: {subjects}")
save_and_load_scores()`,
          explanation: "使用 json.dump() 将字典保存为JSON文件，json.load() 从文件读取数据。with 语句自动管理文件的打开和关闭。",
          hints: [
            "用 with open('scores.json', 'w', encoding='utf-8') as f: 打开文件用于写入。在 with 块内调用 json.dump(scores, f, ensure_ascii=False, indent=2) 保存数据。",
            "ensure_ascii=False 让中文字符正常显示，indent=2 让JSON文件格式美观有缩进。写入后打印提示信息。",
            "读取时用 with open('scores.json', 'r', encoding='utf-8') as f: 配合 loaded = json.load(f) 获取数据。用 for name, subjects in loaded.items(): 遍历并打印每个学生的成绩。"
          ],
          commonErrors: [
            { error: "中文乱码", description: "未设置 encoding 和 ensure_ascii 参数", solution: "设置 encoding=utf-8 和 ensure_ascii=False" },
          ]
        },
      ],
      quiz: {
        multipleChoice: [
          { id: 1, type: "multiple_choice", question: "发送POST请求应该使用requests库的哪个方法？", options: ["requests.get()", "requests.post()", "requests.put()", "requests.send()"], correctAnswer: "requests.post()", explanation: "requests.post() 用于发送POST请求。" },
          { id: 2, type: "multiple_choice", question: "HTTP响应状态码200表示什么？", options: ["重定向", "客户端错误", "服务器错误", "请求成功"], correctAnswer: "请求成功", explanation: "200是标准的\"成功\"状态码。" },
          { id: 3, type: "multiple_choice", question: "GET请求通常用于什么场景？", options: ["修改数据", "删除数据", "获取/查询数据", "上传文件"], correctAnswer: "获取/查询数据", explanation: "GET是最常用的HTTP方法，用于从服务器获取数据。" },
          { id: 4, type: "multiple_choice", question: "以下哪个是用于测试的公共JSON API？", options: ["jsonplaceholder.typicode.com", "testapi.google.com", "json.test", "api.demo"], correctAnswer: "jsonplaceholder.typicode.com", explanation: "JSONPlaceholder是一个免费的公共API，提供测试用的假数据。" },
          { id: 5, type: "multiple_choice", question: "requests请求中设置请求头信息使用哪个参数？", options: ["params", "headers", "body", "meta"], correctAnswer: "headers", explanation: "headers 参数接收一个字典，用于设置请求头。" },
          { id: 6, type: "multiple_choice", question: "如何从requests响应中获取解析后的JSON数据？", options: ["response.text", "response.json()", "response.data", "response.content"], correctAnswer: "response.json()", explanation: "response.json() 会自动将JSON格式的响应内容解析为Python字典或列表。" },
          { id: 7, type: "multiple_choice", question: "Python中操作SQLite数据库使用哪个标准库？", options: ["mysql", "psycopg2", "sqlite3", "pymongo"], correctAnswer: "sqlite3", explanation: "sqlite3 是Python标准库中的模块，提供SQLite数据库操作接口。" },
          { id: 8, type: "multiple_choice", question: "requests中设置请求超时时间使用哪个参数？", options: ["time", "timeout", "delay", "wait"], correctAnswer: "timeout", explanation: "timeout 参数设置请求的超时秒数。" },
          { id: 9, type: "multiple_choice", question: "HTTP状态码404表示什么？", options: ["服务器内部错误", "资源未找到", "请求成功", "需要登录"], correctAnswer: "资源未找到", explanation: "404表示客户端请求的资源在服务器上不存在。" },
          { id: 10, type: "multiple_choice", question: "执行SQL查询后，获取所有结果的方法是？", options: ["cursor.getone()", "cursor.fetchall()", "cursor.read()", "cursor.all()"], correctAnswer: "cursor.fetchall()", explanation: "cursor.fetchall() 获取所有查询结果行。" },
        ],
        trueFalse: [
          { id: 1, type: "true_false", question: "POST请求发送的数据比GET请求更安全，因为数据不会出现在URL中。", correctAnswer: true, explanation: "GET请求的数据在URL中可见，POST数据放在请求体中，相对更隐蔽。" },
          { id: 2, type: "true_false", question: "可以通过 response.status_code 检查HTTP请求的状态码。", correctAnswer: true, explanation: "status_code 属性返回响应的HTTP状态码。" },
          { id: 3, type: "true_false", question: "robots.txt 文件规定了网站哪些内容允许被爬虫抓取。", correctAnswer: true, explanation: "robots.txt 告诉爬虫哪些页面可以或不可以访问。" },
          { id: 4, type: "true_false", question: "cursor.fetchone() 返回查询结果中的所有行。", correctAnswer: false, explanation: "fetchone() 只返回下一行数据，fetchall() 才返回所有行。" },
          { id: 5, type: "true_false", question: "URL查询参数（?key=value形式）通常用于GET请求。", correctAnswer: true, explanation: "查询参数是GET请求传递数据的标准方式。" },
          { id: 6, type: "true_false", question: "数据库操作中，conn.commit() 用于回滚事务。", correctAnswer: false, explanation: "commit() 提交事务使更改永久生效，rollback() 才是回滚。" },
          { id: 7, type: "true_false", question: "response.text 返回字符串形式的响应内容。", correctAnswer: true, explanation: "response.text 返回解码后的文本字符串。" },
          { id: 8, type: "true_false", question: "爬虫可以无限制地抓取任何网站的内容。", correctAnswer: false, explanation: "爬取数据需要遵守网站的robots.txt和服务条款，过度抓取可能导致IP被封或法律风险。" },
          { id: 9, type: "true_false", question: "操作数据库后应该调用 conn.close() 关闭连接。", correctAnswer: true, explanation: "及时关闭数据库连接是良好的实践。" },
          { id: 10, type: "true_false", question: "API返回的数据格式通常只有JSON一种。", correctAnswer: false, explanation: "API可以返回多种格式，包括JSON、XML、YAML、CSV等。" },
        ]
      }
    },
    {
      id: 4,
      title: "数据清洗",
      content: "本章学习数据清洗的核心技术，包括缺失值处理、异常值检测、数据去重和数据类型转换，让数据变得干净可用。",
      codeExamples: [
        { title: "处理缺失值", code: `import pandas as pd
import numpy as np
data = {
    'A': [1, 2, np.nan, 4, 5],
    'B': [np.nan, 2, 3, np.nan, 5],
    'C': [1, 2, 3, 4, 5]
}
df = pd.DataFrame(data)
print(df.isnull().sum())
df_filled = df.fillna(df.mean())
print("填充后：")
print(df_filled)` },
        { title: "数据去重", code: `import pandas as pd
data = {
    'name': ['张三', '李四', '张三', '王五', '李四'],
    'age': [20, 25, 20, 30, 25],
    'score': [85, 90, 85, 88, 90]
}
df = pd.DataFrame(data)
print(f"重复行数：{df.duplicated().sum()}")
df_unique = df.drop_duplicates()
print("去重后：")
print(df_unique)` },
        { title: "数据类型转换", code: `import pandas as pd
data = {
    'price': ['￥100', '￥200', '￥300'],
    'date': ['2024-01-01', '2024-01-02', '2024-01-03'],
    'sales': ['1000', '2000', '3000']
}
df = pd.DataFrame(data)
print("原始类型：")
print(df.dtypes)
df['price'] = df['price'].str.replace('￥', '').astype(float)
df['date'] = pd.to_datetime(df['date'])
df['sales'] = pd.to_numeric(df['sales'])
print("\\n转换后类型：")
print(df.dtypes)` },
      ],
      exercises: [
        {
          id: 1,
          type: "coding",
          question: "购物车管理：编写一个管理购物车的程序，支持添加商品、计算总价、删除商品",
          starterCode: `def shopping_cart():
    cart = {}
    # 在这里编写代码
shopping_cart()`,
          solution: `def shopping_cart():
    cart = {}
    while True:
        print("\\n=== 购物车管理 ===")
        print("1. 添加商品")
        print("2. 查看购物车")
        print("3. 删除商品")
        print("4. 计算总价")
        print("5. 退出")
        choice = input("请选择：")
        if choice == '1':
            name = input("商品名：")
            price = float(input("价格："))
            qty = int(input("数量："))
            if name in cart: cart[name]['qty'] += qty
            else: cart[name] = {'price': price, 'qty': qty}
            print(f"已添加 {name} x{qty}")
        elif choice == '2':
            if not cart: print("购物车为空")
            else:
                total = 0
                for name, info in cart.items():
                    subtotal = info['price'] * info['qty']
                    total += subtotal
                    print(f"{name}: {info['price']}元 x{info['qty']} = {subtotal}元")
                print(f"合计：{total}元")
        elif choice == '3':
            name = input("要删除的商品名：")
            if name in cart:
                del cart[name]
                print(f"已删除 {name}")
        elif choice == '4':
            total = sum(i['price']*i['qty'] for i in cart.values())
            print(f"购物车总价：{total}元")
        elif choice == '5':
            print("再见！")
            break
shopping_cart()`,
          explanation: "使用嵌套字典存储购物车数据，键为商品名，值为包含价格和数量的字典。通过循环和条件语句实现菜单功能。",
          hints: [
            "cart = {} 作为主容器，每个商品名是键，值为 {'price': 价格浮点数, 'qty': 数量整数}。用 while True 菜单循环。",
            "添加商品时：先用 float(input()) 输入价格，int(input()) 输入数量。然后判断 if name in cart: 累加数量，否则 cart[name] = {'price': price, 'qty': qty}。删除用 del cart[name]。",
            "总价计算可以用 sum(info['price']*info['qty'] for info in cart.values())。查看购物车时用 for name, info in cart.items() 遍历并计算小计。别忘了检查 if not cart: 购物车为空的情况。"
          ],
          commonErrors: [
            { error: "重复商品处理", description: "添加已有商品时没有累加数量而是覆盖", solution: "先判断是否存在，存在则增加数量" },
          ]
        },
        {
          id: 2,
          type: "coding",
          question: "数据去重练习：创建一个含重复元素的列表，实现去重并保持原有顺序",
          starterCode: `def deduplicate():
    items = ['苹果', '香蕉', '苹果', '橙子', '香蕉', '葡萄', '苹果']
    # 在这里编写代码
deduplicate()`,
          solution: `def deduplicate():
    items = ['苹果', '香蕉', '苹果', '橙子', '香蕉', '葡萄', '苹果']
    print(f"原始列表：{items}")
    # 方法一：使用 dict.fromkeys() 保持顺序
    unique1 = list(dict.fromkeys(items))
    print(f"去重后（保持顺序）：{unique1}")
    # 方法二：使用 set
    unique2 = list(set(items))
    print(f"去重后（set方法）：{unique2}")
deduplicate()`,
          explanation: "Python 3.7+中 dict.fromkeys() 保持插入顺序。如果不关心顺序，直接使用 set() 是最高效的方法。",
          hints: [
            "最简单的去重方法是 list(set(items))，但 set 是无序的，可能会改变元素顺序。如果要保持顺序不能用它。",
            "在 Python 3.7+，dict.fromkeys(items) 会创建一个字典，键来自 items 且保持顺序，再用 list() 转成列表就得到有序去重结果。这是最简洁的写法。",
            "另一种方法：手动遍历，用一个辅助集合记录已见过的元素。for item in items: 如果 item not in seen: 就 append 到结果列表，并 add 到 seen。可以同时展示两种方法做对比。"
          ],
          commonErrors: [
            { error: "顺序丢失", description: "使用 set() 去重后元素顺序被打乱", solution: "需要保持顺序时使用 dict.fromkeys() 或手动遍历" },
          ]
        },
        {
          id: 3,
          type: "coding",
          question: "简单的数据统计：编写代码统计列表中各元素出现的次数并排序",
          starterCode: `from collections import Counter
def count_items():
    fruits = ['苹果', '香蕉', '苹果', '橙子', '香蕉', '苹果', '葡萄', '苹果', '香蕉', '橙子']
    # 在这里编写代码
count_items()`,
          solution: `from collections import Counter
def count_items():
    fruits = ['苹果', '香蕉', '苹果', '橙子', '香蕉', '苹果', '葡萄', '苹果', '香蕉', '橙子']
    counter = Counter(fruits)
    print("各元素出现次数：")
    for fruit, count in counter.items():
        print(f"  {fruit}: {count}次")
    print("\\n按次数排序：")
    for i, (f, c) in enumerate(counter.most_common(), 1):
        print(f"  第{i}名：{f}（{c}次）")
count_items()`,
          explanation: "collections.Counter 是Python内置的高效计数器，most_common() 方法可以直接返回排序结果。",
          hints: [
            "Counter 是 collections 模块中的类，只需 Counter(列表) 就能自动统计每个元素出现次数。counter 可以像字典一样用 items() 遍历键值对。",
            "counter.most_common() 返回按次数从多到少排序的 (元素, 次数) 元组列表。可以传入参数指定返回前N个，例如 counter.most_common(3) 返回前3名。",
            "遍历时可以用 enumerate(, 1) 加上排名编号。for i, (fruit, count) in enumerate(counter.most_common(), 1): 同时拿到名次、水果名和次数。"
          ],
          commonErrors: [
            { error: "字典键不存在", description: "手动统计时直接访问未初始化的键", solution: "使用 get(key, 0) 或 defaultdict(int)" },
          ]
        },
      ],
      quiz: {
        multipleChoice: [
          { id: 1, type: "multiple_choice", question: "检查DataFrame中缺失值使用哪个方法？", options: ["df.empty()", "df.isnull()", "df.missing()", "df.nan()"], correctAnswer: "df.isnull()", explanation: "isnull() 返回布尔值的DataFrame，缺失值位置为True。" },
          { id: 2, type: "multiple_choice", question: "填充缺失值使用哪个方法？", options: ["df.replace()", "df.fillna()", "df.setna()", "df.clean()"], correctAnswer: "df.fillna()", explanation: "fillna() 用指定值或策略填充缺失值。" },
          { id: 3, type: "multiple_choice", question: "df.dropna() 默认行为是什么？", options: ["删除含有缺失值的列", "删除含有缺失值的行", "填充缺失值", "不做任何操作"], correctAnswer: "删除含有缺失值的行", explanation: "dropna() 默认删除任何含有缺失值的行。" },
          { id: 4, type: "multiple_choice", question: "检测重复行使用哪个方法？", options: ["df.unique()", "df.duplicated()", "df.repeated()", "df.count_dup()"], correctAnswer: "df.duplicated()", explanation: "duplicated() 返回布尔Series，标记重复的行。" },
          { id: 5, type: "multiple_choice", question: "将列转换为整数类型使用哪个方法？", options: [".to_int()", ".astype(int)", ".convert(int)", ".asint()"], correctAnswer: ".astype(int)", explanation: "astype() 是Pandas数据类型转换的标准方法。" },
          { id: 6, type: "multiple_choice", question: "处理异常值的第一步通常是什么？", options: ["直接删除", "识别和分析", "用均值替换", "忽略不管"], correctAnswer: "识别和分析", explanation: "发现异常值后首先要分析其来源，再决定处理方式。" },
          { id: 7, type: "multiple_choice", question: "IQR（四分位距）在异常值检测中的作用是什么？", options: ["计算均值", "定义异常值的边界", "替代缺失值", "转换数据类型"], correctAnswer: "定义异常值的边界", explanation: "IQR = Q3 - Q1，常用规则：小于 Q1-1.5*IQR 或大于 Q3+1.5*IQR 的值视为异常值。" },
          { id: 8, type: "multiple_choice", question: "去除DataFrame中的重复行使用哪个方法？", options: ["df.drop_duplicates()", "df.unique()", "df.dedup()", "df.remove_dup()"], correctAnswer: "df.drop_duplicates()", explanation: "drop_duplicates() 删除完全相同的重复行。" },
          { id: 9, type: "multiple_choice", question: "将字符串日期转换为日期类型使用哪个函数？", options: ["pd.Date()", "pd.to_datetime()", "pd.convert_date()", "pd.date()"], correctAnswer: "pd.to_datetime()", explanation: "pd.to_datetime() 可以智能解析各种格式的日期字符串。" },
          { id: 10, type: "multiple_choice", question: "df.describe() 输出中不包含哪个统计量？", options: ["mean", "count", "median", "std"], correctAnswer: "median", explanation: "describe() 输出 count、mean、std、min、25%、50%、75%、max，其中 50%就是中位数，但名称不叫 median。" },
        ],
        trueFalse: [
          { id: 1, type: "true_false", question: "缺失值是指数据中不存在的值，空字符串也算作缺失值。", correctAnswer: false, explanation: "Pandas中默认只将 NaN 和 None 视作缺失值。空字符串不被视为缺失值。" },
          { id: 2, type: "true_false", question: "fillna() 可以用均值、中位数或前一个有效值来填充缺失值。", correctAnswer: true, explanation: "fillna() 接受具体值，也可以使用 method=ffill 前向填充等策略。" },
          { id: 3, type: "true_false", question: "drop_duplicates() 保留首次出现的行，删除后续重复的行。", correctAnswer: true, explanation: "默认保留第一次出现的行，可以通过 keep=last 保留最后一行。" },
          { id: 4, type: "true_false", question: "发现异常值后必须将其删除，否则分析结果一定不准确。", correctAnswer: false, explanation: "异常值不一定是错误，可能是真实存在的极端情况，需要先分析原因。" },
          { id: 5, type: "true_false", question: "包含非数字字符的字符串可以直接通过 astype(int) 转换为整数。", correctAnswer: false, explanation: "含有非数字字符的字符串必须先清理掉非数字字符，才能进行类型转换。" },
          { id: 6, type: "true_false", question: "df.replace() 可以用来替换数据中的特定值。", correctAnswer: true, explanation: "replace() 可以替换指定的值，支持一对一、多对一和字典映射替换。" },
          { id: 7, type: "true_false", question: "一个DataFrame中不同列可以有不同的数据类型。", correctAnswer: true, explanation: "DataFrame是二维表格结构，每一列有独立的数据类型。" },
          { id: 8, type: "true_false", question: "drop_duplicates() 只删除所有列都相同的重复行。", correctAnswer: true, explanation: "默认比较所有列判断重复，可以通过 subset 参数指定只比较某些列。" },
          { id: 9, type: "true_false", question: "ffill() 前向填充是用上一个非缺失值来填充当前缺失位置。", correctAnswer: true, explanation: "ffill (forward fill) 用前一个有效值填充。" },
          { id: 10, type: "true_false", question: "df['col'].unique() 会删除DataFrame中的重复行。", correctAnswer: false, explanation: "unique() 返回列中唯一值的数组（一维），它不会修改DataFrame。删除重复行应该用 drop_duplicates()。" },
        ]
      }
    },
    {
      id: 5,
      title: "数据可视化",
      content: "本章学习使用Matplotlib和Seaborn创建专业的数据可视化图表，掌握折线图、柱状图、散点图等常用图表的绘制方法。",
      codeExamples: [
        { title: "创建折线图", code: `import matplotlib.pyplot as plt
months = ['1月', '2月', '3月', '4月', '5月', '6月']
sales = [120, 150, 180, 160, 200, 230]
plt.figure(figsize=(10, 6))
plt.plot(months, sales, marker='o', linewidth=2, color='blue')
plt.title('2024年上半年销售趋势', fontsize=14)
plt.xlabel('月份', fontsize=12)
plt.ylabel('销售额（万元）', fontsize=12)
plt.grid(True, alpha=0.3)
plt.show()` },
        { title: "创建柱状图", code: `import matplotlib.pyplot as plt
categories = ['产品A', '产品B', '产品C', '产品D', '产品E']
values = [350, 280, 420, 180, 300]
plt.figure(figsize=(10, 6))
bars = plt.bar(categories, values, color=['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0'])
plt.title('各产品销售额对比', fontsize=14)
for bar in bars:
    height = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2., height + 5,
             f'{height}', ha='center', fontsize=10)
plt.show()` },
        { title: "创建散点图", code: `import matplotlib.pyplot as plt
import numpy as np
np.random.seed(42)
x = np.random.rand(100) * 10
y = 2 * x + np.random.randn(100) * 3 + 5
plt.figure(figsize=(10, 6))
plt.scatter(x, y, alpha=0.6, c='red', s=50)
plt.title('广告投入与销售额关系', fontsize=14)
plt.xlabel('广告投入（万元）', fontsize=12)
plt.ylabel('销售额（万元）', fontsize=12)
plt.grid(True, alpha=0.3)
plt.show()` },
      ],
      exercises: [
        {
          id: 1,
          type: "coding",
          question: "骰子游戏：编写模拟掷骰子游戏，统计各种点数出现次数并用柱状图展示",
          starterCode: `import random
import matplotlib.pyplot as plt
def dice_game(rolls=1000):
    # 在这里编写代码
dice_game()`,
          solution: `import random
import matplotlib.pyplot as plt
from collections import Counter
def dice_game(rolls=1000):
    results = [random.randint(1, 6) for _ in range(rolls)]
    counter = Counter(results)
    print(f"投掷 {rolls} 次骰子结果：")
    for num in range(1, 7):
        count = counter.get(num, 0)
        print(f"点数 {num}: {count}次")
    nums = list(range(1, 7))
    counts = [counter.get(num, 0) for num in nums]
    plt.figure(figsize=(10, 6))
    plt.bar(nums, counts, color='steelblue')
    plt.title(f'骰子模拟结果（共{rolls}次）', fontsize=14)
    plt.xlabel('点数', fontsize=12)
    plt.ylabel('出现次数', fontsize=12)
    plt.xticks(nums)
    plt.show()
dice_game()`,
          explanation: "使用列表推导式和 random.randint() 模拟掷骰子，Counter 统计各点数次数，用柱状图可视化。",
          hints: [
            "用列表推导式 [random.randint(1, 6) for _ in range(rolls)] 生成 rolls 次骰子结果。然后用 Counter(results) 统计各点数出现次数。",
            "打印结果时遍历 range(1, 7) 用 counter.get(num, 0) 获取每个点数的次数，这样即使某点数没出现也不会报错。",
            "绘图部分：x轴用 nums = list(range(1, 7))，y轴用列表推导 [counter.get(num, 0) for num in nums]。plt.bar() 画柱状图，plt.xticks(nums) 确保每个点数都有刻度标签。"
          ],
          commonErrors: [
            { error: "未设置随机种子", description: "结果不可复现", solution: "可添加 random.seed() 使结果固定" },
          ]
        },
        {
          id: 2,
          type: "coding",
          question: "简单统计计算：编写代码生成随机数据并计算基础统计量，然后绘制折线图",
          starterCode: `import random
import matplotlib.pyplot as plt
def stats_and_plot():
    # 在这里编写代码
stats_and_plot()`,
          solution: `import random
import matplotlib.pyplot as plt
def stats_and_plot():
    random.seed(42)
    months = list(range(1, 13))
    sales = [random.randint(50, 200) for _ in range(12)]
    total = sum(sales)
    avg = total / len(sales)
    print(f"月度销售：总数={total}, 平均={avg:.1f}")
    plt.figure(figsize=(12, 6))
    plt.plot(months, sales, marker='o', linewidth=2, color='orange', label='销售额')
    plt.axhline(y=avg, color='red', linestyle='--', label=f'平均值={avg:.1f}')
    plt.title('月度销售走势图', fontsize=14)
    plt.xlabel('月份', fontsize=12)
    plt.ylabel('销售额', fontsize=12)
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.xticks(months)
    plt.show()
stats_and_plot()`,
          explanation: "使用 random.randint() 生成随机数据，计算统计量，然后用折线图展示趋势。",
          hints: [
            "random.seed(42) 固定随机种子让结果可复现。months = list(range(1, 13)) 生成1-12月，sales = [random.randint(50, 200) for _ in range(12)] 生成12个随机销售数据。",
            "计算：total = sum(sales), avg = total / len(sales)。然后 plt.plot() 绘制折线，marker='o' 让每个数据点显示为圆圈。",
            "plt.axhline(y=avg, color='red', linestyle='--') 画一条红色虚线代表平均值。plt.legend() 显示图例，plt.xticks(months) 确保12个月都有刻度。"
          ],
          commonErrors: [
            { error: "刻度不清晰", description: "未设置 xticks 导致横坐标显示不全", solution: "使用 plt.xticks() 设置清晰的刻度" },
          ]
        },
        {
          id: 3,
          type: "coding",
          question: "列表操作：编写代码将两个列表中的数据绘制成对比柱状图",
          starterCode: `import matplotlib.pyplot as plt
def compare_chart():
    subjects = ['语文', '数学', '英语', '物理', '化学']
    class_a = [85, 78, 92, 70, 80]
    class_b = [80, 88, 85, 75, 86]
    # 在这里编写代码
compare_chart()`,
          solution: `import matplotlib.pyplot as plt
import numpy as np
def compare_chart():
    subjects = ['语文', '数学', '英语', '物理', '化学']
    class_a = [85, 78, 92, 70, 80]
    class_b = [80, 88, 85, 75, 86]
    x = np.arange(len(subjects))
    width = 0.35
    fig, ax = plt.subplots(figsize=(12, 6))
    bars1 = ax.bar(x - width/2, class_a, width, label='A班', color='#4CAF50')
    bars2 = ax.bar(x + width/2, class_b, width, label='B班', color='#2196F3')
    ax.set_xlabel('科目', fontsize=12)
    ax.set_ylabel('平均分', fontsize=12)
    ax.set_title('两班成绩对比', fontsize=14)
    ax.set_xticks(x)
    ax.set_xticklabels(subjects)
    ax.legend()
    plt.grid(axis='y', alpha=0.3)
    plt.tight_layout()
    plt.show()
compare_chart()`,
          explanation: "使用 numpy.arange() 创建位置索引，通过调整柱子位置实现并排柱状图。",
          hints: [
            "并排柱状图的关键是给两组柱子分配不同的x位置。用 x = np.arange(len(subjects)) 生成0,1,2,...作为每组柱子的中心位置。",
            "设置 width = 0.35，然后第一组柱子放在 x - width/2，第二组放在 x + width/2。这样两组柱子彼此相邻且不重叠。",
            "使用 ax.bar() 而不是 plt.bar() 配合 fig, ax = plt.subplots() 能更精确地控制。ax.set_xticks(x) 和 ax.set_xticklabels(subjects) 设置刻度。plt.tight_layout() 自动调整间距防标签被截。"
          ],
          commonErrors: [
            { error: "柱子重叠", description: "两班柱子位置设置错误导致完全重叠", solution: "使用 x +/- width/2 分别设置两组柱子位置" },
          ]
        },
      ],
      quiz: {
        multipleChoice: [
          { id: 1, type: "multiple_choice", question: "Matplotlib中用于创建新画布的函数是？", options: ["plt.new()", "plt.figure()", "plt.canvas()", "plt.create()"], correctAnswer: "plt.figure()", explanation: "plt.figure() 创建一个新的画布对象，figsize 参数可以设置画布大小。" },
          { id: 2, type: "multiple_choice", question: "绘制折线图使用哪个函数？", options: ["plt.line()", "plt.plot()", "plt.linechart()", "plt.draw()"], correctAnswer: "plt.plot()", explanation: "plt.plot() 是Matplotlib最基础的绘图函数，用于绘制折线图和线条。" },
          { id: 3, type: "multiple_choice", question: "设置图表标题使用哪个函数？", options: ["plt.title()", "plt.name()", "plt.label()", "plt.header()"], correctAnswer: "plt.title()", explanation: "plt.title() 设置图表的主标题。" },
          { id: 4, type: "multiple_choice", question: "绘制柱状图使用哪个函数？", options: ["plt.bar()", "plt.column()", "plt.barplot()", "plt.hist()"], correctAnswer: "plt.bar()", explanation: "plt.bar() 绘制柱状图。" },
          { id: 5, type: "multiple_choice", question: "绘制散点图使用哪个函数？", options: ["plt.point()", "plt.scatter()", "plt.dot()", "plt.spread()"], correctAnswer: "plt.scatter()", explanation: "plt.scatter() 专门用于绘制散点图。" },
          { id: 6, type: "multiple_choice", question: "添加图例使用哪个函数？", options: ["plt.legend()", "plt.key()", "plt.note()", "plt.explain()"], correctAnswer: "plt.legend()", explanation: "plt.legend() 添加图例，需要配合绘图函数中的 label 参数使用。" },
          { id: 7, type: "multiple_choice", question: "设置图形元素透明度使用哪个参数？", options: ["trans", "alpha", "beta", "opacity"], correctAnswer: "alpha", explanation: "alpha 参数设置透明度，取值范围 0-1。" },
          { id: 8, type: "multiple_choice", question: "设置折线图中数据点标记样式使用哪个参数？", options: ["mark", "symbol", "marker", "dot"], correctAnswer: "marker", explanation: "marker 参数设置数据点的形状标记，如 'o' 圆形、's' 方形等。" },
          { id: 9, type: "multiple_choice", question: "设置线条粗细使用哪个参数？", options: ["thickness", "linewidth", "width", "lw2"], correctAnswer: "linewidth", explanation: "linewidth（或简写为 lw）设置线条的粗细。" },
          { id: 10, type: "multiple_choice", question: "Seaborn库与Matplotlib的关系是什么？", options: ["完全无关", "Seaborn基于Matplotlib", "Matplotlib基于Seaborn", "两者互相竞争"], correctAnswer: "Seaborn基于Matplotlib", explanation: "Seaborn是在Matplotlib基础上构建的高级绘图库，提供更美观的默认样式。" },
        ],
        trueFalse: [
          { id: 1, type: "true_false", question: "使用 plt.show() 可以在终端或Notebook中显示绘制的图形。", correctAnswer: true, explanation: "plt.show() 是显示图形的标准方式。" },
          { id: 2, type: "true_false", question: "plt.grid(True) 可以在图表中添加网格线。", correctAnswer: true, explanation: "grid(True) 显示网格线。" },
          { id: 3, type: "true_false", question: "在一个图中只能绘制一条折线，不能同时绘制多条。", correctAnswer: false, explanation: "可以在同一个 figure 中多次调用 plt.plot() 绘制多条线。" },
          { id: 4, type: "true_false", question: "plt.tight_layout() 可以自动调整子图布局防止重叠。", correctAnswer: true, explanation: "tight_layout() 自动调整子图间距，优化标签位置。" },
          { id: 5, type: "true_false", question: "Matplotlib的 color 参数只能接受英文颜色名。", correctAnswer: false, explanation: "color 支持多种格式：颜色名、十六进制代码、RGB元组、灰度值等。" },
          { id: 6, type: "true_false", question: "箱线图（Box Plot）可以展示数据的中位数、四分位数和异常值。", correctAnswer: true, explanation: "箱线图通过箱体展示四分位距，线条展示中位数和极值范围。" },
          { id: 7, type: "true_false", question: "饼图适合展示数据的时间序列变化趋势。", correctAnswer: false, explanation: "饼图用于展示各部分占整体的比例，时间趋势应该用折线图或柱状图。" },
          { id: 8, type: "true_false", question: "seaborn的 histplot() 可以绘制直方图展示数据分布。", correctAnswer: true, explanation: "histplot() 是Seaborn绘制直方图的函数。" },
          { id: 9, type: "true_false", question: "plt.savefig() 可以将图表保存为PNG、JPG、PDF等格式文件。", correctAnswer: true, explanation: "savefig() 根据文件扩展名自动确定格式。" },
          { id: 10, type: "true_false", question: "设置横坐标标签使用 plt.xlabel()，纵坐标标签使用 plt.ylabel()。", correctAnswer: true, explanation: "xlabel() 和 ylabel() 分别设置x轴和y轴的标签文字。" },
        ]
      }
    },
    {
      id: 6,
      title: "统计分析基础",
      content: "本章学习统计分析基础知识，包括描述性统计、假设检验、相关分析和回归分析基础，掌握用数据进行科学推断的能力。",
      codeExamples: [
        { title: "描述性统计", code: `import pandas as pd
import numpy as np
np.random.seed(42)
data = pd.Series(np.random.randn(1000) * 10 + 50)
print(f"平均值: {data.mean():.2f}")
print(f"中位数: {data.median():.2f}")
print(f"标准差: {data.std():.2f}")
print(f"最大值: {data.max():.2f}")
print(f"最小值: {data.min():.2f}")
print("\\nPandas describe：")
print(data.describe())` },
        { title: "相关性分析", code: `import pandas as pd
import numpy as np
np.random.seed(42)
x = np.random.rand(100) * 10
y = 2 * x + np.random.randn(100) * 2
df = pd.DataFrame({'广告投入': x, '销售额': y})
corr_matrix = df.corr()
print("相关系数矩阵：")
print(corr_matrix)` },
        { title: "假设检验示例", code: `import numpy as np
from scipy import stats
np.random.seed(42)
group_a = np.random.normal(85, 5, 30)
group_b = np.random.normal(80, 6, 30)
print(f"A班平均分: {group_a.mean():.2f}")
print(f"B班平均分: {group_b.mean():.2f}")
t_stat, p_value = stats.ttest_ind(group_a, group_b)
print(f"t统计量: {t_stat:.4f}")
print(f"p值: {p_value:.4f}")
if p_value < 0.05:
    print("结论: p < 0.05，两班成绩存在显著差异")
else:
    print("结论: p >= 0.05，两班成绩无显著差异")` },
      ],
      exercises: [
        {
          id: 1,
          type: "coding",
          question: "猜数字2.0电脑猜：编写让电脑自动猜测数字的程序，用二分法优化效率",
          starterCode: `import random
def computer_guess():
    # 在这里编写代码
computer_guess()`,
          solution: `import random
def computer_guess():
    print("请在心中想一个1-1000之间的数字")
    low = 1
    high = 1000
    attempts = 0
    while low <= high:
        guess = (low + high) // 2
        attempts += 1
        print(f"\\n电脑猜测第{attempts}次：{guess}")
        feedback = input("请回答(>/</=)：").strip()
        if feedback == '=':
            print(f"电脑用{attempts}次猜中了你的数字！")
            break
        elif feedback == '>':
            high = guess - 1
        elif feedback == '<':
            low = guess + 1
        else:
            print("请输入有效的符号")
            continue
    print(f"共尝试 {attempts} 次")
computer_guess()`,
          explanation: "二分法每次将搜索范围缩小一半，时间复杂度为 O(log n)。在1-1000范围内，最多只需10次猜测。",
          hints: [
            "初始化 low = 1, high = 1000，每次猜测 guess = (low + high) // 2 取中间值。根据用户反馈调整搜索范围。",
            "如果用户输入 '>'（表示答案比 guess 大，即猜小了），则 low = guess + 1；如果输入 '<'，则 high = guess - 1；输入 '=' 表示猜中。",
            "用 attempts 变量记录猜测次数。注意输入非预期符号时提示用户重输，用 continue 跳过本轮循环。循环条件 while low <= high 防止无限循环。"
          ],
          commonErrors: [
            { error: "边界更新错误", description: "更新 low/high 时忘记加减1导致死循环", solution: "太大时 high=guess-1，太小时 low=guess+1" },
          ]
        },
        {
          id: 2,
          type: "coding",
          question: "简单的统计计算：编写代码生成数据并计算偏度和峰度，理解数据分布特征",
          starterCode: `import numpy as np
from scipy import stats
def distribution_analysis():
    # 在这里编写代码
distribution_analysis()`,
          solution: `import numpy as np
from scipy import stats
def distribution_analysis():
    np.random.seed(42)
    normal_data = np.random.normal(50, 10, 1000)
    skewed_data = np.random.exponential(20, 1000) + 20
    uniform_data = np.random.uniform(20, 80, 1000)
    datasets = {'正态分布': normal_data, '右偏分布': skewed_data, '均匀分布': uniform_data}
    print("=== 分布特征分析 ===")
    for name, data in datasets.items():
        mean = np.mean(data)
        median = np.median(data)
        std = np.std(data)
        skewness = stats.skew(data)
        kurtosis = stats.kurtosis(data)
        print(f"{name}: 均值={mean:.1f}, 中位数={median:.1f}, 标准差={std:.1f}, 偏度={skewness:.2f}, 峰度={kurtosis:.2f}")
distribution_analysis()`,
          explanation: "偏度衡量分布的对称性，峰度衡量分布的陡峭程度。结合均值和中位数关系可以判断分布形状。",
          hints: [
            "用 np.random.seed(42) 设置随机种子。生成3种不同分布的数据：normal() 正态分布、exponential() 指数分布（右偏）、uniform() 均匀分布。",
            "把3个数据集放到一个字典 datasets 中，键是中文名，值是数据数组。然后用 for name, data in datasets.items(): 循环遍历逐个计算。",
            "每数据集计算：np.mean(data) 均值、np.median(data) 中位数、np.std(data) 标准差、stats.skew(data) 偏度、stats.kurtosis(data) 峰度。用 f-string 统一格式化输出。"
          ],
          commonErrors: [
            { error: "样本与总体混淆", description: "未注意某些库默认计算的是样本统计量", solution: "注意查看文档是否需要调整参数（如 ddof）" },
          ]
        },
        {
          id: 3,
          type: "coding",
          question: "数据分析练习：编写代码计算两组数据的相关系数并进行线性回归拟合",
          starterCode: `import numpy as np
from scipy import stats
import matplotlib.pyplot as plt
def regression_analysis():
    # 在这里编写代码
regression_analysis()`,
          solution: `import numpy as np
from scipy import stats
import matplotlib.pyplot as plt
def regression_analysis():
    hours = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    scores = np.array([45, 55, 60, 68, 75, 82, 88, 92, 95, 98])
    corr, _ = stats.pearsonr(hours, scores)
    print(f"Pearson相关系数: {corr:.4f}")
    slope, intercept, r_value, p_val, std_err = stats.linregress(hours, scores)
    print(f"回归方程: 分数 = {slope:.2f} x 时长 + {intercept:.2f}")
    print(f"R^2: {r_value**2:.4f}")
    for h in [3.5, 7.5]:
        pred = slope * h + intercept
        print(f"学习{h}小时，预测得分: {pred:.1f}分")
    plt.figure(figsize=(10, 6))
    plt.scatter(hours, scores, color='blue', s=100, label='实际数据')
    x_line = np.linspace(min(hours), max(hours), 100)
    plt.plot(x_line, slope * x_line + intercept, 'r-', linewidth=2, label='回归线')
    plt.xlabel('学习时长（小时）', fontsize=12)
    plt.ylabel('考试分数', fontsize=12)
    plt.title('学习时长与分数关系（线性回归）', fontsize=14)
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.show()
regression_analysis()`,
          explanation: "使用 scipy.stats.linregress() 进行最小二乘线性回归，得到斜率、截距和R^2。R^2越接近1，模型拟合越好。",
          hints: [
            "先用 np.array() 把学习时长和分数转换成NumPy数组。stats.pearsonr(hours, scores) 计算Pearson相关系数，返回 (相关系数, p值)。",
            "stats.linregress() 返回5个值：slope 斜率、intercept 截距、r_value 相关系数、p_val p值、std_err 标准误。R^2 = r_value 的平方。",
            "预测：用 y = slope * x + intercept 公式。绘图：plt.scatter() 画实际数据点，plt.plot() 用 np.linspace() 生成100个平滑点画回归线。别忘了用 label 参数配合 plt.legend() 显示图例。"
          ],
          commonErrors: [
            { error: "因果误解", description: "把相关性误判为因果关系", solution: "相关不代表因果，需谨慎解读回归结果" },
          ]
        },
      ],
      quiz: {
        multipleChoice: [
          { id: 1, type: "multiple_choice", question: "以下哪个统计量最能反映数据的集中趋势？", options: ["标准差", "均值", "方差", "相关系数"], correctAnswer: "均值", explanation: "均值、中位数、众数都是描述数据集中趋势的统计量。" },
          { id: 2, type: "multiple_choice", question: "标准差描述的是什么？", options: ["数据的平均值", "数据的分散程度", "数据的最大值", "数据的个数"], correctAnswer: "数据的分散程度", explanation: "标准差衡量数据与其均值的平均距离，反映数据的离散程度。" },
          { id: 3, type: "multiple_choice", question: "相关系数的取值范围是？", options: ["0 到 1", "-1 到 1", "0 到 100", "-100 到 100"], correctAnswer: "-1 到 1", explanation: "相关系数取值范围为 -1 到 1。1表示完全正相关，-1表示完全负相关。" },
          { id: 4, type: "multiple_choice", question: "在假设检验中，通常以什么标准判断结果是否显著？", options: ["p < 0.5", "p < 0.05", "p > 0.05", "p = 0"], correctAnswer: "p < 0.05", explanation: "通常将显著性水平 α 设为 0.05，当 p < 0.05 时拒绝原假设。" },
          { id: 5, type: "multiple_choice", question: "如果一组数据服从标准正态分布，其均值、中位数、众数的关系是？", options: ["均值 > 中位数 > 众数", "三者相等", "均值 < 中位数 < 众数", "没有固定关系"], correctAnswer: "三者相等", explanation: "正态分布是对称分布，均值、中位数和众数完全相同。" },
          { id: 6, type: "multiple_choice", question: "在t检验中，原假设(H0)通常是什么？", options: ["两组存在显著差异", "两组没有显著差异", "一定存在差异", "无法判断"], correctAnswer: "两组没有显著差异", explanation: "原假设通常假设无效应、无差异、无关联，即默认没有显著效果。" },
          { id: 7, type: "multiple_choice", question: "t检验主要用于什么？", options: ["比较多组均值", "比较两组均值的差异", "分析相关性", "描述数据分布"], correctAnswer: "比较两组均值的差异", explanation: "t检验用于比较两组的均值是否存在显著差异。" },
          { id: 8, type: "multiple_choice", question: "相关分析可以揭示变量之间的什么关系？", options: ["因果关系", "线性关系的强度", "时间顺序", "确定性关系"], correctAnswer: "线性关系的强度", explanation: "相关系数仅衡量线性关系的强度和方向，不代表因果关系。" },
          { id: 9, type: "multiple_choice", question: "置信水平 95% 意味着什么？", options: ["有95%的概率真实值在置信区间内", "数据有95%的准确率", "95%的数据在范围内", "误差为5%"], correctAnswer: "有95%的概率真实值在置信区间内", explanation: "95%置信水平意味着重复抽样时，约95%的区间会包含真实的总体参数。" },
          { id: 10, type: "multiple_choice", question: "方差与标准差的关系是什么？", options: ["方差 = 标准差", "方差 = 标准差的平方", "方差 = 标准差的平方根", "没有直接关系"], correctAnswer: "方差 = 标准差的平方", explanation: "方差是标准差的平方，两者都是衡量数据离散程度的指标。" },
        ],
        trueFalse: [
          { id: 1, type: "true_false", question: "均值对异常值非常敏感，极端值会显著影响均值结果。", correctAnswer: true, explanation: "均值受所有数据影响，极端值会将均值拉向它们。相比之下，中位数对异常值更稳健。" },
          { id: 2, type: "true_false", question: "相关系数为0说明两个变量之间完全没有关系。", correctAnswer: false, explanation: "相关系数为0仅说明无线性关系，但可能存在非线性关系。" },
          { id: 3, type: "true_false", question: "大数定律表明样本量越大，样本均值越接近总体均值。", correctAnswer: true, explanation: "大数定律保证样本量足够大时，样本统计量会稳定地接近总体参数。" },
          { id: 4, type: "true_false", question: "拒绝原假设意味着原假设一定是错误的。", correctAnswer: false, explanation: "拒绝原假设只表示统计证据不足以支持它，并不意味着它绝对错误。" },
          { id: 5, type: "true_false", question: "z分数（标准分数）表示一个值距离均值有多少个标准差。", correctAnswer: true, explanation: "z = (x - 均值) / 标准差，表示x相对于均值的位置。" },
          { id: 6, type: "true_false", question: "显著性水平 α 是犯第一类错误（假阳性）的概率上限。", correctAnswer: true, explanation: "α 是预先设定的显著性阈值，代表愿意容忍的假阳性错误率。" },
          { id: 7, type: "true_false", question: "线性回归分析可以确定变量之间的因果关系。", correctAnswer: false, explanation: "回归分析展示变量之间的预测关系，但不能确定因果方向。因果关系需要实验设计或逻辑推断。" },
          { id: 8, type: "true_false", question: "中位数是将数据排序后位于中间位置的值。", correctAnswer: true, explanation: "中位数将数据分为两半，50%的数据小于中位数，50%大于中位数。" },
          { id: 9, type: "true_false", question: "变异系数（CV）= 标准差 / 均值，用于比较不同数据组的离散程度。", correctAnswer: true, explanation: "变异系数消除了量纲和均值大小的影响，可用于比较不同量级数据的离散程度。" },
          { id: 10, type: "true_false", question: "数据清洗和数据预处理不属于数据分析的必要步骤。", correctAnswer: false, explanation: "数据清洗是数据分析的基础和核心步骤。低质量数据会导致错误结论。" },
        ]
      }
    }
    ]
  }
];

export default courses;
