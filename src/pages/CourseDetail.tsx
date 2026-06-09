import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, Copy, Play, Award, Code, BookOpen, RefreshCw, Lightbulb, Terminal, X } from 'lucide-react';
import { courses } from '../data/courses';

interface HintState {
  hintCount: number;
  showHint: boolean;
  hintIndex: number;
}

type HintStates = Record<string, HintState>;

interface ExerciseAnswerState {
  expanded: boolean;
  hints: string[];
}

interface PyodideResult {
  text: string;
  image?: string;
  steps?: number;
  time?: number;
}

export default function CourseDetail() {
  const { courseId } = useParams();
  const course = courses.find(c => c.id === parseInt(courseId!));

  const [activeChapter, setActiveChapter] = useState(0);
  const [completedChapters, setCompletedChapters] = useState<number[]>([]);

  // 编程练习状态
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<number, ExerciseAnswerState>>({});
  const [exerciseCode, setExerciseCode] = useState<Record<number, string>>({});
  const [exerciseOutput, setExerciseOutput] = useState<Record<number, string>>({});
  const [exerciseImages, setExerciseImages] = useState<Record<number, string>>({});
  const [runningExercise, setRunningExercise] = useState<number | null>(null);

  // 提示状态（编程题 + 选择题 + 判断题共用）
  const [hintStates, setHintStates] = useState<HintStates>({});

  // 选择题状态
  const [mcAnswers, setMcAnswers] = useState<Record<number, string>>({});
  const [mcResults, setMcResults] = useState<Record<number, boolean>>({});

  // 判断题状态
  const [tfAnswers, setTfAnswers] = useState<Record<number, boolean>>({});
  const [tfResults, setTfResults] = useState<Record<number, boolean>>({});

  // 定时器引用
  const hintTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  // Pyodide 实例缓存
  const pyodideRef = useRef<any>(null);
  const pyodideLoadingRef = useRef(false);
  const [pyodideReady, setPyodideReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`course_${courseId}_progress`);
    if (saved) {
      const progress = JSON.parse(saved);
      setCompletedChapters(progress.completedChapters || []);
    }
  }, [courseId]);

  useEffect(() => {
    return () => {
      const timers = hintTimersRef.current as Record<string, ReturnType<typeof setTimeout>>;
      Object.values(timers).forEach(timer => clearTimeout(timer));
    };
  }, []);

  // ============ 页面加载时预加载 Pyodide ============
  useEffect(() => {
    if (!(window as any).loadPyodide && !document.getElementById('pyodide-script-tag')) {
      const script = document.createElement('script');
      script.id = 'pyodide-script-tag';
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js';
      script.async = true;
      script.onload = () => {
        // 脚本已加载到 window，懒加载实际实例（点击运行时再初始化，节省内存）
      };
      document.head.appendChild(script);
    }
  }, []);

  const loadPyodide = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (pyodideRef.current) {
        resolve(pyodideRef.current);
        return;
      }
      if (pyodideLoadingRef.current) {
        const tries = { count: 0 };
        const checkInterval = setInterval(() => {
          tries.count++;
          if (pyodideRef.current) {
            clearInterval(checkInterval);
            resolve(pyodideRef.current);
          } else if (tries.count > 600) {
            clearInterval(checkInterval);
            reject(new Error('加载超时（60秒）'));
          }
        }, 100);
        return;
      }
      if (!(window as any).loadPyodide) {
        reject(new Error('Pyodide 脚本还未加载完成，请稍后再试或刷新页面'));
        return;
      }
      pyodideLoadingRef.current = true;
      (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/' })
        .then((py: any) => {
          pyodideRef.current = py;
          setPyodideReady(true);
          // 预加载 sys/io 以便后续重写 stdout
          try { py.runPythonSync('import sys, io'); } catch (e) {}
          resolve(py);
        })
        .catch((err: any) => {
          pyodideLoadingRef.current = false;
          reject(err);
        });
    });
  };

  // ============ 内置 JavaScript 简易 Python 解释器（备用） ============
  // 支持: print / 基本运算 / 变量 / if / for range / while / list / dict / len
  // / str / int / float / range / input (直接返回空字符串避免阻塞)
  const runPythonJS = (code: string): string => {
    try {
      const lines = code.split('\n');

      let jsCode = '';
      const stripInlineComment = (l: string): string => {
        let inStr: string | null = null;
        for (let i = 0; i < l.length; i++) {
          const c = l[i];
          if (inStr) { if (c === inStr && l[i - 1] !== '\\') inStr = null; }
          else if (c === '"' || c === "'") inStr = c;
          else if (c === '#') return l.substring(0, i);
        }
        return l;
      };

      const pyExprToJS = (expr: string): string => {
        let s = expr.trim();
        s = s.replace(/\bTrue\b/g, 'true').replace(/\bFalse\b/g, 'false').replace(/\bNone\b/g, 'null');
        s = s.replace(/\blen\s*\(([^)]+)\)/g, '(function(_x){return (Array.isArray(_x))?_x.length:String(_x).length;})($1)');
        s = s.replace(/\bstr\s*\(([^)]+)\)/g, 'String($1)');
        s = s.replace(/\bint\s*\(([^)]+)\)/g, 'parseInt($1,10)');
        s = s.replace(/\bfloat\s*\(([^)]+)\)/g, 'parseFloat($1)');
        s = s.replace(/\binput\s*\(([^)]*)\)/g, '(__prompt($1))');
        s = s.replace(/\brange\s*\(([^)]+)\)/g, '__range($1)');
        s = s.replace(/\band\b/g, '&&').replace(/\bor\b/g, '||').replace(/\bnot\b/g, '!');
        s = s.replace(/\s+in\s+/g, ' in ');
        return s;
      };

      // ========== 循环/步数保护 ==========
      const helpers = `
        var __out = [];
        var __loop_count = 0;
        var __max_loops = 10000;
        function __tick(){
          __loop_count++;
          if (__loop_count > __max_loops) {
            throw new Error("⚠️ 循环步数超过限制 (10000步)，可能存在死循环。程序已自动中断。");
          }
        }
        function print(){
          var args = Array.prototype.slice.call(arguments);
          __out.push(args.map(function(x){return (x===null)?'None':(typeof x==='boolean'?(x?'True':'False'):String(x));}).join(' '));
        }
        function __prompt(msg){
          try {
            var v = window.prompt(msg || '');
            return (v===null)?'':v;
          } catch(e) { return ''; }
        }
        function __range(){
          var args = Array.prototype.slice.call(arguments);
          var start=0, stop=0, step=1;
          if (args.length===1) stop=args[0];
          else if (args.length===2){ start=args[0]; stop=args[1]; }
          else if (args.length>=3){ start=args[0]; stop=args[1]; step=args[2]; }
          // 防止无限/超大数组：限制最多10000个元素
          var res = [];
          if (step > 0) {
            // 递增
            if (stop - start > 10000) stop = start + 10000;
            for (var i=start; i<stop; i+=step) res.push(i);
          } else if (step < 0) {
            if (start - stop > 10000) stop = start - 10000;
            for (var i=start; i>stop; i+=step) res.push(i);
          }
          return res;
        }
      `;

      let pyStatements: string[] = [];
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let stripped = stripInlineComment(line).replace(/\s+$/, '');
        if (!stripped.trim()) continue;
        pyStatements.push(stripped);
      }

      const indentOf = (l: string): number => {
        let n = 0;
        while (n < l.length && l[n] === ' ') n++;
        return n;
      };
      const emit = (line: string) => { jsCode += line + '\n'; };

      let openBlocks: number[] = [0];

      for (let i = 0; i < pyStatements.length; i++) {
        const raw = pyStatements[i];
        const indent = indentOf(raw);
        const content = raw.trim();

        while (openBlocks.length > 1 && indent < openBlocks[openBlocks.length - 1]) {
          openBlocks.pop();
          emit('}');
        }

        let blockMatch = content.match(/^(for|while|if|elif|else)\b(.*):\s*$/);
        let isBlock = !!blockMatch;

        if (isBlock) {
          const keyword = blockMatch![1];
          let rest = blockMatch![2].trim();

          if (keyword === 'for') {
            const m = rest.match(/^(\w+)\s+in\s+(.+)$/);
            if (m) {
              const v = m[1];
              const iterExpr = pyExprToJS(m[2]);
              // 给 for 循环加 tick 保护
              emit(`for (var ${v} of (function(){ __tick(); return ${iterExpr}; })()) {`);
              openBlocks.push(indent);
              continue;
            }
          } else if (keyword === 'while') {
            emit(`while (__tick() || (${pyExprToJS(rest)})) {`);
            openBlocks.push(indent);
            continue;
          } else if (keyword === 'if') {
            emit(`if (__tick() || (${pyExprToJS(rest)})) {`);
            openBlocks.push(indent);
            continue;
          } else if (keyword === 'elif') {
            emit(`} else if (__tick() || (${pyExprToJS(rest)})) {`);
            continue;
          } else if (keyword === 'else') {
            emit(`} else {`);
            continue;
          }
        }

        const printMatch = content.match(/^print\s*\((.*)\)\s*$/);
        if (printMatch) {
          emit(`print(${pyExprToJS(printMatch[1])});`);
          continue;
        }
        const assignMatch = content.match(/^(\w+(?:\s*,\s*\w+)*)\s*=\s*(.+)$/);
        if (assignMatch) {
          const lhs = assignMatch[1];
          const rhs = pyExprToJS(assignMatch[2]);
          emit(`var ${lhs} = ${rhs};`);
          continue;
        }
        emit(pyExprToJS(content) + ';');
      }

      while (openBlocks.length > 1) {
        openBlocks.pop();
        emit('}');
      }

      const fullCode = helpers + jsCode + '\nreturn __out.join("\\n") + "\\n\\n[系统提示] 内置解释器共执行 " + __loop_count + " 步循环/判断";';

      // eslint-disable-next-line no-new-func
      const fn = new Function(fullCode);
      const result = fn();
      return result || '(代码运行成功，没有输出内容)';
    } catch (err: any) {
      return `⚠️ 内置解释器执行失败：\n${err?.message || err}\n\n提示：检查Python缩进(4空格)、循环边界；或在本地Python环境运行。`;
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">课程未找到</h2>
          <Link to="/" className="btn-cyber">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  const chapter = course.chapters[activeChapter];
  const progress = (completedChapters.length / course.chapters.length) * 100;

  // ============ 提示系统核心逻辑 ============
  const getHintKey = (prefix: string, id: number) => `${prefix}_${id}`;

  const getHintState = (key: string): HintState => {
    return hintStates[key] || { hintCount: 0, showHint: false, hintIndex: 0 };
  };

  const handleGetHint = (key: string, hints: string[]) => {
    const current = getHintState(key);
    if (current.hintCount >= 3) return;

    if (hintTimersRef.current[key]) {
      clearTimeout(hintTimersRef.current[key]);
    }

    const newHintIndex = current.hintCount;
    const newHintCount = current.hintCount + 1;

    setHintStates(prev => ({
      ...prev,
      [key]: {
        hintCount: newHintCount,
        showHint: true,
        hintIndex: newHintIndex
      }
    }));

    hintTimersRef.current[key] = setTimeout(() => {
      setHintStates(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          showHint: false
        }
      }));
      delete hintTimersRef.current[key];
    }, 5000);
  };

  // 为选择题、判断题智能生成提示
  const generateMcHints = (quiz: any): string[] => {
    // 如果题目自带定制化 hints，使用它
    if (quiz.hints && quiz.hints.length >= 3) return quiz.hints;

    // 否则基于题目内容、选项、正确答案智能生成
    const correctAnswer = quiz.correctAnswer;
    const options = quiz.options || [];
    const q = quiz.question || '';

    return [
      `仔细审题：「${q.substring(0, 30)}${q.length > 30 ? '...' : ''}」`,
      `选项有 ${options.length} 个，先排除明显错误的选项。正确答案是：${correctAnswer.substring(0, 20)}${correctAnswer.length > 20 ? '...' : ''}`,
      `正确答案与知识点紧密相关。答案是：${correctAnswer}。如果不确定，可以结合章节内容回顾。`
    ];
  };

  const generateTfHints = (quiz: any): string[] => {
    if (quiz.hints && quiz.hints.length >= 3) return quiz.hints;

    const correctAnswer = quiz.correctAnswer;
    const q = quiz.question || '';

    return [
      `判断这句话的正确性：「${q.substring(0, 40)}${q.length > 40 ? '...' : ''}」`,
      `想想这个知识点的定义和适用场景。正确答案是：${correctAnswer ? '正确' : '错误'}。`,
      `如果陈述中包含绝对化词语（如"一定"、"只能"）要特别警惕。正确答案是：${correctAnswer ? '正确' : '错误'}。`
    ];
  };

  const generateExerciseHints = (exercise: any): string[] => {
    if (exercise.hints && exercise.hints.length >= 3) return exercise.hints;
    return [
      '先理解题目要求，明确输入和输出。',
      '想想核心算法思路，再逐步实现。',
      '如果卡住，可以先查看参考答案的思路。'
    ];
  };

  // ============ 答题逻辑 ============
  const handleMcSelect = (quizId: number, answer: string) => {
    if (mcResults[quizId] !== undefined) return;
    setMcAnswers(prev => ({ ...prev, [quizId]: answer }));
  };

  const submitMcAnswer = (quiz: any) => {
    setMcResults(prev => ({ ...prev, [quiz.id]: (prev as any)[quiz.id] === quiz.correctAnswer }));
  };

  const handleTfSelect = (quizId: number, answer: boolean) => {
    if (tfResults[quizId] !== undefined) return;
    setTfAnswers(prev => ({ ...prev, [quizId]: answer }));
  };

  const submitTfAnswer = (quiz: any) => {
    const userAnswer = tfAnswers[quiz.id];
    if (userAnswer === undefined) return;
    setTfResults(prev => ({ ...prev, [quiz.id]: userAnswer === quiz.correctAnswer }));
  };

  // ============ 重置功能 ============
  const resetExercises = () => {
    setExerciseAnswers({});
    setExerciseCode({});
    setExerciseOutput({});
    setExerciseImages({});
    resetHintsByPrefix('exercise');
  };

  const resetMultipleChoice = () => {
    setMcAnswers({});
    setMcResults({});
    resetHintsByPrefix('mc');
  };

  const resetTrueFalse = () => {
    setTfAnswers({});
    setTfResults({});
    resetHintsByPrefix('tf');
  };

  const resetHintsByPrefix = (prefix: string) => {
    setHintStates(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(key => {
        if (key.startsWith(`${prefix}_`)) {
          if (hintTimersRef.current[key]) {
            clearTimeout(hintTimersRef.current[key]);
            delete hintTimersRef.current[key];
          }
          delete next[key];
        }
      });
      return next;
    });
  };

  const resetAllProgress = () => {
    if (confirm('确定要重置所有学习进度吗？这将清空所有章节的完成状态和测验答案。')) {
      setCompletedChapters([]);
      setExerciseAnswers({});
      setExerciseCode({});
      setExerciseOutput({});
      setExerciseImages({});
      setMcAnswers({});
      setMcResults({});
      setTfAnswers({});
      setTfResults({});
      const allTimers = hintTimersRef.current as Record<string, ReturnType<typeof setTimeout>>;
      Object.values(allTimers).forEach(timer => clearTimeout(timer));
      hintTimersRef.current = {};
      setHintStates({});
      localStorage.removeItem(`course_${courseId}_progress`);
    }
  };

  const toggleExerciseAnswer = (exerciseId: number) => {
    setExerciseAnswers(prev => ({
      ...prev,
      [exerciseId]: {
        expanded: !(prev[exerciseId]?.expanded ?? false),
        hints: prev[exerciseId]?.hints || []
      }
    }));
  };

  // ============ UI 渲染函数 ============
  const renderHintButton = (hintKey: string, hints: string[]) => {
    const state = getHintState(hintKey);
    const isExhausted = state.hintCount >= 3;
    const currentHint = state.showHint && state.hintCount > 0 ? hints[state.hintIndex] : null;

    return (
      <div className="mt-3">
        <button
          onClick={() => !isExhausted && handleGetHint(hintKey, hints)}
          disabled={isExhausted}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            isExhausted
              ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed border border-gray-600'
              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 cursor-pointer'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          {isExhausted ? `提示已用完 (3/3)` : `获取提示 (${state.hintCount}/3)`}
        </button>
        {currentHint && (
          <div className="mt-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-200 text-sm animate-fade-in">
            💡 提示 {state.hintIndex + 1}/3：{currentHint}
          </div>
        )}
      </div>
    );
  };

  // ============ 运行代码 ============
  const handleRunCode = async (exerciseId: number) => {
    const code = exerciseCode[exerciseId] || '';
    if (!code.trim()) {
      setExerciseOutput(prev => ({ ...prev, [exerciseId]: '⚠️ 请先编写代码再运行' }));
      return;
    }

    setRunningExercise(exerciseId);
    setExerciseOutput(prev => ({ ...prev, [exerciseId]: '⏳ 正在加载 Python 解释器...（首次需要10-20秒，最长执行10秒）\n' }));

    // 将用户代码编码为 base64，避免字符串嵌入问题
    let codeB64 = '';
    try {
      codeB64 = btoa(unescape(encodeURIComponent(code)));
    } catch {
      codeB64 = btoa(code);
    }

    // ============ 策略 1：Pyodide（首选，带步数/超时限制 + matplotlib 支持） ============
    try {
      const pyodide = await loadPyodide();

      // 关键改进：通过 sys.settrace + time.time() 在 Python 层面限制步数与时间
      // 默认最多执行 50000 条字节码 / 最长 10 秒，避免卡死浏览器
      const runScript = `
import sys, io, base64, time, js

__code_b64 = "${codeB64}"
__max_steps = 50000
__max_time = 10.0  # 秒
__step_count = 0
__start_time = time.time()

# 捕获 stdout/stderr
__buf = io.StringIO()
sys.stdout = __buf
sys.stderr = __buf

# 安全 input()：使用浏览器的 prompt 获取用户输入
def __safe_input(prompt=''):
    if prompt:
        print(prompt, end='', flush=True)
    # 临时恢复 stdout 让 prompt 文字正常显示
    sys.stdout = sys.__stdout__
    result = js.window.prompt(prompt)
    sys.stdout = __buf
    if result is None:
        return ''
    return str(result)

try:
    import builtins
    builtins.input = __safe_input
except:
    pass

# 用 trace 函数监控步数与执行时间，超时就抛异常
def __trace(frame, event, arg):
    global __step_count
    __step_count += 1
    if __step_count > __max_steps:
        sys.stdout = sys.__stdout__
        raise RuntimeError("⚠️ 代码执行步数超过限制 (50000步)，可能存在死循环。程序已自动中断。")
    if time.time() - __start_time > __max_time:
        sys.stdout = sys.__stdout__
        raise RuntimeError("⚠️ 代码执行时间超过 10 秒，已自动中断。")
    return __trace

sys.settrace(__trace)

# 执行用户代码
try:
    exec(base64.b64decode(__code_b64).decode('utf-8'), {
        '__builtins__': __builtins__ if '__builtins__' in dir() else builtins,
        'print': print,
        'input': __safe_input
    })
except Exception as __e:
    import traceback
    traceback.print_exc()
finally:
    sys.settrace(None)

# 尝试捕获 matplotlib 图像
__image_b64 = ''
try:
    import matplotlib.pyplot as plt
    __fig = plt.gcf()
    # 检查是否有实际绘制的内容（有 axes 且至少有内容）
    if __fig.axes and any(len(ax.get_children()) > 2 for ax in __fig.axes):
        __img_buf = io.BytesIO()
        plt.savefig(__img_buf, format='png', dpi=100, bbox_inches='tight')
        __img_buf.seek(0)
        __image_b64 = base64.b64encode(__img_buf.read()).decode('utf-8')
        plt.close('all')
except:
    pass

sys.stdout = sys.__stdout__
__txt = __buf.getvalue()
if not __txt.strip():
    __txt = '(代码运行成功，没有输出内容)\\n共执行 ' + str(__step_count) + ' 步，用时 ' + str(round(time.time() - __start_time, 3)) + ' 秒'
else:
    __txt = __txt + '\\n\\n[系统提示] 共执行 ' + str(__step_count) + ' 步，用时 ' + str(round(time.time() - __start_time, 3)) + ' 秒'

# 返回字典对象（Pyodide 会自动转换为 JS 对象）
{'text': __txt, 'image': __image_b64, 'steps': __step_count, 'time': round(time.time() - __start_time, 3)}
`;

      try {
        // 也尝试 setStdout 作为备份
        let fallbackOutput = '';
        try {
          pyodide.setStdout({ batched: (s: string) => { fallbackOutput += s; } });
        } catch (e) {}

        // 给 pyodide 加一个 Promise 超时：JS 层面也监控 15 秒
        const timeoutMs = 15000;
        const runPromise = pyodide.runPythonAsync(runScript);
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('⚠️ JS层超时(15秒)，执行被强制中断。可能存在死循环或复杂计算。')), timeoutMs);
        });

        const result = await Promise.race([runPromise, timeoutPromise]) as any;

        // 解析结果：可能是 dict 对象（Pyodide 返回的 ProxyMap/dict），也可能是 string
        let textOutput = '';
        let imageB64 = '';

        if (result && typeof result === 'object' && 'text' in result) {
          // 从 dict 中提取 text 和 image
          textOutput = String(result.text || '');
          imageB64 = String(result.image || '');
        } else if (typeof result === 'string') {
          textOutput = result;
        }

        const finalOutput = textOutput || fallbackOutput || '(代码运行成功，没有输出内容)';
        setExerciseOutput(prev => ({ ...prev, [exerciseId]: finalOutput }));
        if (imageB64) {
          setExerciseImages(prev => ({ ...prev, [exerciseId]: imageB64 }));
        } else {
          setExerciseImages(prev => {
            const next = { ...prev };
            delete next[exerciseId];
            return next;
          });
        }
        setRunningExercise(null);
        return;
      } catch (err: any) {
        const errorMsg = err?.message || String(err) || '未知错误';
        setExerciseOutput(prev => ({ ...prev, [exerciseId]: `❌ Pyodide 执行错误：\n${errorMsg}\n\n--- 尝试使用内置解释器 ---\n` }));
        // 继续尝试内置解释器
      }
    } catch (err: any) {
      setExerciseOutput(prev => ({ ...prev, [exerciseId]: `⚠️ Pyodide 加载失败：${err?.message || err}\n\n--- 切换到内置解释器 ---\n` }));
      // 继续尝试内置解释器
    }

    // ============ 策略 2：内置 JS 简易 Python 解释器（备用，带循环保护） ============
    try {
      const result = runPythonJS(code);
      setExerciseOutput(prev => ({
        ...prev,
        [exerciseId]: (prev[exerciseId] || '') + result
      }));
    } catch (err: any) {
      setExerciseOutput(prev => ({
        ...prev,
        [exerciseId]: (prev[exerciseId] || '') + `\n⚠️ 内置解释器也失败：${err?.message || err}\n\n建议：检查语法（Python 用4空格缩进），或在本地 Python 环境运行。`
      }));
    } finally {
      setRunningExercise(null);
    }
  };

  const handleCopyCode = (exerciseId: number) => {
    const code = exerciseCode[exerciseId] || '';
    navigator.clipboard.writeText(code);
  };

  const handleResetCode = (exerciseId: number, starterCode: string) => {
    setExerciseCode(prev => ({ ...prev, [exerciseId]: starterCode || '' }));
    setExerciseOutput(prev => ({ ...prev, [exerciseId]: '' }));
    setExerciseImages(prev => {
      const next = { ...prev };
      delete next[exerciseId];
      return next;
    });
  };

  // ============ 完成章节 ============
  const handleCompleteChapter = () => {
    if (!completedChapters.includes(chapter.id)) {
      const newCompleted = [...completedChapters, chapter.id];
      setCompletedChapters(newCompleted);
      localStorage.setItem(`course_${courseId}_progress`, JSON.stringify({
        completedChapters: newCompleted,
        lastVisit: new Date().toISOString()
      }));
    }
  };

  // ============ 渲染 ============
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* 顶部导航与进度 */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> 返回首页
          </Link>

          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{course.title}</h1>
              <p className="text-gray-400">{course.description}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400 mb-2">学习进度</div>
              <div className="text-teal-400 font-bold">{Math.round(progress)}% ({completedChapters.length}/{course.chapters.length}章)</div>
            </div>
          </div>
        </div>

        {/* 章节切换 */}
        <div className="mb-8 flex flex-wrap gap-2">
          {course.chapters.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => setActiveChapter(idx)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeChapter === idx
                  ? 'bg-teal-500 text-white'
                  : completedChapters.includes(ch.id)
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                    : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
              }`}
            >
              第{idx + 1}章 · {ch.title}
            </button>
          ))}
        </div>

        {/* ========== 章节 1：知识讲解 ========== */}
        <section className="glass rounded-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
            <BookOpen className="w-6 h-6 text-blue-400" />
            📖 章节内容：{chapter.title}
          </h3>
          <p className="text-gray-300 leading-relaxed mb-3">{chapter.content}</p>

          {/* 代码示例 */}
          {chapter.codeExamples && chapter.codeExamples.length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-white mb-4">💻 代码示例</h4>
              <div className="space-y-4">
                {chapter.codeExamples.map((ex, idx) => (
                  <div key={idx} className="border border-gray-700 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between bg-gray-800/50 px-4 py-2 border-b border-gray-700">
                      <div className="text-teal-300 font-medium text-sm">例 {idx + 1}：{ex.title}</div>
                      <button
                        onClick={() => navigator.clipboard.writeText(ex.code)}
                        className="px-3 py-1 text-xs text-gray-400 hover:text-white border border-gray-600 rounded hover:bg-gray-700 flex items-center gap-1 transition-all"
                      >
                        <Copy className="w-3 h-3" /> 复制
                      </button>
                    </div>
                    <pre className="p-4 text-gray-200 font-mono text-sm overflow-x-auto bg-gray-900/60 whitespace-pre-wrap break-words">{ex.code}</pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ========== 章节 2：编程练习 ========== */}
        <section className="glass rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Code className="w-6 h-6 text-teal-400" />
              🎯 编程练习（{chapter.exercises.length} 题）
            </h3>
            <button
              onClick={resetExercises}
              className="px-4 py-2 border border-gray-600 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white transition-all text-sm flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> 重置
            </button>
          </div>

          <div className="space-y-6">
            {chapter.exercises.map((exercise) => {
              const hintKey = getHintKey('exercise', exercise.id);
              const isExpanded = exerciseAnswers[exercise.id]?.expanded ?? false;
              const hints = generateExerciseHints(exercise);
              const currentCode = exerciseCode[exercise.id] ?? (exercise as any).starterCode ?? '';
              const output = exerciseOutput[exercise.id];
              const image = exerciseImages[exercise.id];
              const isRunning = runningExercise === exercise.id;

              return (
                <div key={exercise.id} className="border border-teal-500/30 rounded-xl overflow-hidden">
                  {/* 题目头部 */}
                  <div className="p-5 bg-teal-500/10 border-b border-teal-500/30">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-[200px]">
                        <div className="text-teal-400 text-sm font-semibold mb-2">练习 {exercise.id}</div>
                        <p className="text-white font-medium">{(exercise as any).question}</p>
                      </div>
                      <button
                        onClick={() => toggleExerciseAnswer(exercise.id)}
                        className="px-4 py-2 bg-teal-500/20 text-teal-400 rounded-lg hover:bg-teal-500/30 transition-colors text-sm font-medium whitespace-nowrap"
                      >
                        {isExpanded ? '收起答案' : '查看答案/解析'}
                      </button>
                    </div>
                    {renderHintButton(hintKey, hints)}
                  </div>

                  {/* 代码编辑器 */}
                  <div className="p-5 bg-gray-900/40 border-b border-gray-700">
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                        <Terminal className="w-4 h-4" />
                        你的代码编辑器
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => handleResetCode(exercise.id, (exercise as any).starterCode || '')}
                          className="px-3 py-1 text-xs border border-gray-600 text-gray-400 rounded hover:bg-gray-700 hover:text-white transition-all flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" /> 重置
                        </button>
                        <button
                          onClick={() => handleCopyCode(exercise.id)}
                          className="px-3 py-1 text-xs border border-gray-600 text-gray-400 rounded hover:bg-gray-700 hover:text-white transition-all flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" /> 复制
                        </button>
                        <button
                          onClick={() => handleRunCode(exercise.id)}
                          disabled={isRunning}
                          className="px-4 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1 font-semibold"
                        >
                          <Play className="w-3 h-3" /> {isRunning ? '运行中...' : `▶ 运行代码${pyodideReady ? '' : ' (首次需加载)'}`}
                        </button>
                      </div>
                    </div>

                    <textarea
                      value={currentCode}
                      onChange={(e) => setExerciseCode(prev => ({ ...prev, [exercise.id]: e.target.value }))}
                      spellCheck={false}
                      className="w-full h-56 bg-black text-green-300 font-mono text-sm p-4 border border-gray-700 rounded-lg focus:outline-none focus:border-teal-500/60 resize-y"
                      placeholder="# 在这里编写代码，点击▶运行按钮执行...
# 例如：
print('Hello, Python!')
for i in range(5):
    print('第', i+1, '次循环')
"
                    />
                    <div className="mt-2 text-xs text-gray-500">
                      💡 提示：支持 Python 标准库（print、for、while、list、dict、int、str、random、math 等）。复杂的库（如 pandas）需先用 micropip 安装。
                    </div>

                    {/* 运行输出区 */}
                    {(output || image) && (
                      <div className="mt-4 border border-gray-700 rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between bg-gray-800/60 px-4 py-2 border-b border-gray-700">
                          <div className="text-cyan-300 font-medium text-sm flex items-center gap-2">
                            <Terminal className="w-4 h-4" /> 运行输出
                          </div>
                          <button
                            onClick={() => {
                              setExerciseOutput(prev => ({ ...prev, [exercise.id]: '' }));
                              setExerciseImages(prev => {
                                const next = { ...prev };
                                delete next[exercise.id];
                                return next;
                              });
                            }}
                            className="text-gray-400 hover:text-white transition-colors text-xs flex items-center gap-1"
                          >
                            <X className="w-3 h-3" /> 清空
                          </button>
                        </div>
                        {image && (
                          <div className="p-4 bg-gray-900/60 border-b border-gray-700 flex justify-center">
                            <img
                              src={`data:image/png;base64,${image}`}
                              alt="matplotlib 输出"
                              className="max-w-full h-auto rounded"
                              style={{ maxHeight: '400px' }}
                            />
                          </div>
                        )}
                        {output && (
                          <pre className="p-4 bg-black text-gray-300 font-mono text-sm whitespace-pre-wrap break-words max-h-64 overflow-y-auto">
                            {output}
                          </pre>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 答案与解析 */}
                  {isExpanded && (
                    <div className="divide-y divide-gray-700">
                      {(exercise as any).starterCode && (
                        <div className="p-4 bg-gray-800/20">
                          <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-3 text-sm">
                            <Code className="w-5 h-5" /> 起始代码
                          </div>
                          <pre className="p-3 bg-gray-900/60 text-gray-200 font-mono text-sm rounded-lg whitespace-pre-wrap break-words">{(exercise as any).starterCode}</pre>
                        </div>
                      )}
                      <div className="p-4 bg-green-500/10">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 text-green-400 font-semibold text-sm">
                            <Check className="w-5 h-5" /> 参考答案
                          </div>
                          <button
                            onClick={() => navigator.clipboard.writeText((exercise as any).solution)}
                            className="px-3 py-1 text-xs border border-green-700/50 text-green-400 rounded hover:bg-green-500/10 transition-colors flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" /> 复制
                          </button>
                        </div>
                        <pre className="p-3 bg-gray-900/60 text-gray-100 font-mono text-sm rounded-lg whitespace-pre-wrap break-words">{(exercise as any).solution}</pre>
                      </div>
                      <div className="p-4 bg-blue-500/10">
                        <div className="flex items-center gap-2 text-blue-400 font-semibold mb-2 text-sm">
                          <BookOpen className="w-5 h-5" /> 答案解析
                        </div>
                        <p className="text-gray-300 text-sm">{(exercise as any).explanation}</p>
                      </div>
                      {(exercise as any).commonErrors && (exercise as any).commonErrors.length > 0 && (
                        <div className="p-4 bg-red-500/10">
                          <div className="flex items-center gap-2 text-red-400 font-semibold mb-3 text-sm">
                            <Award className="w-5 h-5" /> 常见错误
                          </div>
                          <div className="space-y-3">
                            {(exercise as any).commonErrors.map((err: any, idx: number) => (
                              <div key={idx} className="bg-gray-800/50 rounded-lg p-3 border border-red-500/20">
                                <div className="text-red-400 font-medium text-sm mb-1">{err.error}</div>
                                <div className="text-gray-400 text-xs mb-2">问题：{err.description}</div>
                                <div className="text-green-400 text-xs font-medium">解决：{err.solution}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ========== 章节 3：选择题 ========== */}
        <section className="glass rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-purple-400" />
              📝 选择题（{chapter.quiz.multipleChoice.length} 题）
            </h3>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="text-sm text-gray-400">
                已答：{Object.keys(mcAnswers).length} / {chapter.quiz.multipleChoice.length}
              </div>
              <button
                onClick={resetMultipleChoice}
                className="px-4 py-2 border border-gray-600 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white transition-all text-sm flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> 重置选择题
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {chapter.quiz.multipleChoice.map((quiz, idx) => {
              const hintKey = getHintKey('mc', quiz.id);
              const hints = generateMcHints(quiz);
              const userAnswer = mcAnswers[quiz.id];
              const result = mcResults[quiz.id];
              const isSubmitted = result !== undefined;

              return (
                <div key={quiz.id} className="quiz-card">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded mb-2 mr-2 bg-purple-500/20 text-purple-400 border border-purple-500/30">选择题</span>
                      <h4 className="text-white font-medium text-lg">{quiz.question}</h4>
                      {renderHintButton(hintKey, hints)}
                    </div>
                  </div>

                  <div className="space-y-2 ml-11">
                    {quiz.options?.map((option, optIdx) => {
                      const optionSelected = userAnswer === option;
                      const optionCorrect = option === quiz.correctAnswer;

                      let optionClass = 'quiz-option';
                      if (isSubmitted) {
                        if (optionCorrect) optionClass += ' correct';
                        else if (optionSelected) optionClass += ' incorrect';
                      } else if (optionSelected) {
                        optionClass += ' selected';
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleMcSelect(quiz.id, option)}
                          disabled={isSubmitted}
                          className={optionClass}
                        >
                          <span className="font-semibold mr-2">{String.fromCharCode(65 + optIdx).concat('.')}</span>
                          {option}
                          {isSubmitted && optionCorrect && <Check className="w-5 h-5 text-green-400 ml-auto inline" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 ml-11">
                    {!isSubmitted ? (
                      <button
                        onClick={() => submitMcAnswer(quiz)}
                        disabled={!userAnswer}
                        className="btn-cyber text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >提交答案</button>
                    ) : (
                      <div className={`p-4 rounded-lg ${result ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
                        <div className="flex items-center gap-2 font-semibold mb-2">
                          {result ? (
                            <><Check className="w-5 h-5 text-green-400" /><span className="text-green-400">✓ 回答正确！</span></>
                          ) : (
                            <><span className="text-red-400">✗ 回答错误</span><span className="text-gray-300">，正确答案是：<b className="text-green-400">{quiz.correctAnswer}</b></span></>
                          )}
                        </div>
                        <div className="text-gray-300 text-sm"><span className="text-blue-300 font-semibold">📖 解析：</span>{quiz.explanation}</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========== 章节 4：判断题 ========== */}
        <section className="glass rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-pink-400" />
              ✅ 判断题（{chapter.quiz.trueFalse.length} 题）
            </h3>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="text-sm text-gray-400">
                已答：{Object.keys(tfAnswers).length} / {chapter.quiz.trueFalse.length}
              </div>
              <button
                onClick={resetTrueFalse}
                className="px-4 py-2 border border-gray-600 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white transition-all text-sm flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> 重置判断题
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {chapter.quiz.trueFalse.map((quiz, idx) => {
              const hintKey = getHintKey('tf', quiz.id);
              const hints = generateTfHints(quiz);
              const userAnswer = tfAnswers[quiz.id];
              const result = tfResults[quiz.id];
              const isSubmitted = result !== undefined;

              return (
                <div key={quiz.id} className="quiz-card">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded mb-2 mr-2 bg-pink-500/20 text-pink-400 border border-pink-500/30">判断题</span>
                      <h4 className="text-white font-medium text-lg">{quiz.question}</h4>
                      {renderHintButton(hintKey, hints)}
                    </div>
                  </div>

                  <div className="flex gap-4 ml-11">
                    {[true, false].map((option) => {
                      const isSelected = userAnswer === option;
                      const isCorrect = option === quiz.correctAnswer;

                      let btnClass = 'quiz-option flex-1 justify-center !py-3';
                      if (isSubmitted) {
                        if (isCorrect) btnClass += ' correct';
                        else if (isSelected) btnClass += ' incorrect';
                      } else if (isSelected) {
                        btnClass += ' selected';
                      }

                      return (
                        <button
                          key={String(option)}
                          onClick={() => handleTfSelect(quiz.id, option)}
                          disabled={isSubmitted}
                          className={btnClass}
                        >
                          <span className="font-bold text-lg mr-2">{option ? '✓' : '✗'}</span>
                          {option ? '正确' : '错误'}
                          {isSubmitted && isCorrect && <Check className="w-5 h-5 text-green-400 ml-2 inline" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 ml-11">
                    {!isSubmitted ? (
                      <button
                        onClick={() => submitTfAnswer(quiz)}
                        disabled={userAnswer === undefined}
                        className="btn-cyber text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >提交答案</button>
                    ) : (
                      <div className={`p-4 rounded-lg ${result ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
                        <div className="flex items-center gap-2 font-semibold mb-2">
                          {result ? (
                            <><Check className="w-5 h-5 text-green-400" /><span className="text-green-400">✓ 回答正确！</span></>
                          ) : (
                            <><span className="text-red-400">✗ 回答错误</span><span className="text-gray-300">，正确答案是：<b className="text-green-400">{quiz.correctAnswer ? '正确' : '错误'}</b></span></>
                          )}
                        </div>
                        <div className="text-gray-300 text-sm"><span className="text-blue-300 font-semibold">📖 解析：</span>{quiz.explanation}</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========== 章节控制 ========== */}
        <section className="glass rounded-xl p-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setActiveChapter(Math.max(0, activeChapter - 1))}
                disabled={activeChapter === 0}
                className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >← 上一章</button>
              <button
                onClick={handleCompleteChapter}
                className={`px-5 py-2 rounded-lg transition-all ${
                  completedChapters.includes(chapter.id)
                    ? 'bg-green-500/20 text-green-300 border border-green-500/40'
                    : 'bg-teal-500 text-white hover:bg-teal-600'
                }`}
              >{completedChapters.includes(chapter.id) ? '✓ 已完成本章' : '标记完成本章'}</button>
              <button
                onClick={() => setActiveChapter(Math.min(course.chapters.length - 1, activeChapter + 1))}
                disabled={activeChapter === course.chapters.length - 1}
                className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >下一章 →</button>
            </div>
            <button
              onClick={resetAllProgress}
              className="px-4 py-2 border border-red-500/40 text-red-400 rounded-lg hover:bg-red-500/10 transition-all text-sm"
            >⚠ 重置所有进度</button>
          </div>
        </section>
      </div>
    </div>
  );
}
