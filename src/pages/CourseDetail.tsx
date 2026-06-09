import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, Copy, Play, Award, Code, BookOpen, RefreshCw, Lightbulb } from 'lucide-react';
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

export default function CourseDetail() {
  const { courseId } = useParams();
  const course = courses.find(c => c.id === parseInt(courseId!));

  const [activeChapter, setActiveChapter] = useState(0);
  const [completedChapters, setCompletedChapters] = useState<number[]>([]);

  // 编程练习状态
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<number, ExerciseAnswerState>>({});
  const [exerciseCode, setExerciseCode] = useState<Record<number, string>>({});

  // 提示状态（编程题 + 选择题 + 判断题共用）
  const [hintStates, setHintStates] = useState<HintStates>({});

  // 选择题状态
  const [mcAnswers, setMcAnswers] = useState<Record<number, string>>({});
  const [mcResults, setMcResults] = useState<Record<number, boolean>>({});

  // 判断题状态
  const [tfAnswers, setTfAnswers] = useState<Record<number, boolean>>({});
  const [tfResults, setTfResults] = useState<Record<number, boolean>>({});

  // 定时器引用（用于清理5秒自动隐藏的提示）
  const hintTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    const saved = localStorage.getItem(`course_${courseId}_progress`);
    if (saved) {
      const progress = JSON.parse(saved);
      setCompletedChapters(progress.completedChapters || []);
    }
  }, [courseId]);

  // 组件卸载时清理所有定时器
  useEffect(() => {
    return () => {
      const timers = hintTimersRef.current as Record<string, ReturnType<typeof setTimeout>>;
      Object.values(timers).forEach(timer => clearTimeout(timer));
    };
  }, []);

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

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

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

  // ============ 提示系统核心逻辑 ============
  const getHintKey = (prefix: string, id: number) => `${prefix}_${id}`;

  const getHintState = (key: string): HintState => {
    return hintStates[key] || { hintCount: 0, showHint: false, hintIndex: 0 };
  };

  const handleGetHint = (key: string, hints: string[]) => {
    const current = getHintState(key);

    // 如果已经用完3次提示，不做任何操作
    if (current.hintCount >= 3) return;

    // 清除之前的自动隐藏定时器（如果有）
    if (hintTimersRef.current[key]) {
      clearTimeout(hintTimersRef.current[key]);
    }

    const newHintIndex = current.hintCount; // 0, 1, 2
    const newHintCount = current.hintCount + 1;

    // 更新状态：显示提示
    setHintStates(prev => ({
      ...prev,
      [key]: {
        hintCount: newHintCount,
        showHint: true,
        hintIndex: newHintIndex
      }
    }));

    // 5秒后自动隐藏提示
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

  // 根据解析内容智能生成3条渐进式提示
  const generateHintsFromExplanation = (explanation: string, correctAnswer: string | boolean, type: 'mc' | 'tf', customHints?: string[]): string[] => {
    if (customHints && customHints.length >= 3) {
      return customHints;
    }
    if (type === 'mc') {
      return [
        `这道题考察的是相关知识点的理解。仔细阅读题目，回忆相关概念的核心定义。`,
        `可以先尝试排除明显错误的选项。注意选项之间的细微差别。`,
        `正确答案与"${String(correctAnswer).substring(0, 10)}..."相关。再仔细思考一下！`
      ];
    } else {
      return [
        `这道题需要判断陈述是否正确。先回忆相关概念的准确定义。`,
        `注意题目中的关键词，有些陈述看似正确但可能存在陷阱。`,
        `正确答案是"${correctAnswer ? '正确' : '错误'}"。请根据解析验证你的判断。`
      ];
    }
  };

  // ============ 答题逻辑 ============
  const handleMcSelect = (quizId: number, answer: string) => {
    if (mcResults[quizId] !== undefined) return; // 已提交的题不能改
    setMcAnswers(prev => ({ ...prev, [quizId]: answer }));
  };

  const handleTfSelect = (quizId: number, answer: boolean) => {
    if (tfResults[quizId] !== undefined) return;
    setTfAnswers(prev => ({ ...prev, [quizId]: answer }));
  };

  const submitMcAnswer = (quiz: any) => {
    const userAnswer = mcAnswers[quiz.id];
    if (!userAnswer) return;
    setMcResults(prev => ({ ...prev, [quiz.id]: userAnswer === quiz.correctAnswer }));
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
      setMcAnswers({});
      setMcResults({});
      setTfAnswers({});
      setTfResults({});
      // 清理所有提示定时器
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
              : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/40'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          {isExhausted
            ? `提示已用完 (3/3)`
            : `获取提示 (${state.hintCount}/3)`}
        </button>

        {currentHint && (
          <div className="mt-3 p-4 rounded-lg bg-amber-500/15 border border-amber-500/40 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/30 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-amber-400 font-semibold text-sm">
                    提示 {state.hintIndex + 1} / 3
                  </span>
                  <span className="text-gray-400 text-xs">(5秒后自动隐藏)</span>
                </div>
                <p className="text-gray-200 text-sm leading-relaxed">{currentHint}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const multipleChoice = chapter.quiz?.multipleChoice || [];
  const trueFalse = chapter.quiz?.trueFalse || [];

  return (
    <div className="pt-20 min-h-screen">
      {/* 顶部导航 */}
      <div className="glass border-b border-blue-500/15 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-gray-400 hover:text-blue-400 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-bold text-white">{course.title}</h1>
              <span className="tag tag-cyan">{course.difficulty}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">{course.totalDuration}</span>
              <button
                onClick={resetAllProgress}
                className="px-4 py-2 border border-gray-600 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white transition-all text-sm flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                重置进度
              </button>
              <button onClick={handleCompleteChapter} className="btn-cyber text-sm">
                {completedChapters.includes(chapter.id) ? '已完成 ✓' : '标记完成'}
              </button>
            </div>
          </div>

          {/* 进度条 */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">学习进度</span>
              <span className="text-sm font-semibold text-blue-400">{Math.round(progress)}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* 左侧目录 */}
          <div className="lg:col-span-1">
            <div className="glass rounded-xl p-6 sticky top-40">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                章节列表
              </h3>
              <div className="space-y-2">
                {course.chapters.map((chap, idx) => (
                  <button
                    key={chap.id}
                    onClick={() => setActiveChapter(idx)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                      activeChapter === idx
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                        : 'text-gray-400 hover:bg-gray-800 border border-transparent'
                    }`}
                  >
                    {completedChapters.includes(chap.id) ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-600 flex items-center justify-center text-xs">
                        {idx + 1}
                      </div>
                    )}
                    <span className="text-sm font-medium">{chap.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧内容 */}
          <div className="lg:col-span-3 space-y-6">
            {/* 1. 章节标题和内容介绍 */}
            <div className="glass rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Code className="w-7 h-7 text-blue-400" />
                第 {activeChapter + 1} 章：{chapter.title}
              </h2>
              <p className="text-gray-300 leading-relaxed">{chapter.content}</p>
            </div>

            {/* 2. 代码示例区域 */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Play className="w-6 h-6 text-cyan-400" />
                代码示例
              </h3>
              <div className="space-y-4">
                {chapter.codeExamples.map((example, idx) => (
                  <div key={idx} className="border border-blue-500/20 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-800/50 border-b border-blue-500/20">
                      <span className="text-blue-400 font-medium">{example.title}</span>
                      <button
                        onClick={() => handleCopyCode(example.code)}
                        className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        复制
                      </button>
                    </div>
                    <div className="code-block">
                      <pre className="text-gray-100">{example.code}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. 代码练习题 */}
            <div className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Code className="w-6 h-6 text-teal-400" />
                  代码练习题
                </h3>
                <button
                  onClick={resetExercises}
                  className="px-4 py-2 border border-gray-600 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white transition-all text-sm flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  重置题目
                </button>
              </div>
              <div className="space-y-4">
                {chapter.exercises.map((exercise) => {
                  const hintKey = getHintKey('exercise', exercise.id);
                  const isExpanded = exerciseAnswers[exercise.id]?.expanded ?? false;
                  const hints: string[] = exercise.hints && exercise.hints.length >= 3
                    ? exercise.hints
                    : [
                        `先理解题目要求，确定需要使用的主要模块或函数。`,
                        `思考核心逻辑：输入是什么，输出是什么，中间需要哪些步骤？`,
                        `参考代码示例中的写法，注意边界情况的处理。`
                      ];

                  const currentCode = exerciseCode[exercise.id] ?? exercise.starterCode ?? '';
                  const handleCodeChange = (val: string) => {
                    setExerciseCode(prev => ({ ...prev, [exercise.id]: val }));
                  };
                  const handleResetCode = () => {
                    setExerciseCode(prev => ({ ...prev, [exercise.id]: exercise.starterCode ?? '' }));
                  };
                  const handleCopyCode = () => {
                    navigator.clipboard.writeText(currentCode);
                  };

                  return (
                    <div key={exercise.id} className="border border-teal-500/20 rounded-lg overflow-hidden">
                      <div className="p-4 bg-teal-500/10 border-b border-teal-500/20">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="text-teal-400 text-sm font-semibold mb-2">
                              练习 {exercise.id}
                            </div>
                            <p className="text-white font-medium">{exercise.question}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleExerciseAnswer(exercise.id)}
                              className="px-4 py-2 bg-teal-500/20 text-teal-400 rounded-lg hover:bg-teal-500/30 transition-colors text-sm font-medium"
                            >
                              {isExpanded ? '收起' : '查看答案'}
                            </button>
                          </div>
                        </div>
                        {renderHintButton(hintKey, hints)}
                      </div>

                      {/* 可编辑代码编辑器 - 始终展示 */}
                      <div className="p-4 bg-gray-900/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                            <Code className="w-4 h-4" />
                            你的代码
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={handleResetCode}
                              className="px-3 py-1 text-xs border border-gray-600 text-gray-400 rounded hover:bg-gray-700 hover:text-white transition-all flex items-center gap-1"
                            >
                              <RefreshCw className="w-3 h-3" />
                              重置为起始代码
                            </button>
                            <button
                              onClick={handleCopyCode}
                              className="px-3 py-1 text-xs border border-gray-600 text-gray-400 rounded hover:bg-gray-700 hover:text-white transition-all flex items-center gap-1"
                            >
                              <Copy className="w-3 h-3" />
                              复制代码
                            </button>
                          </div>
                        </div>
                        <textarea
                          value={currentCode}
                          onChange={(e) => handleCodeChange(e.target.value)}
                          spellCheck={false}
                          className="w-full h-48 bg-gray-950 text-green-300 font-mono text-sm p-3 border border-gray-700 rounded-lg focus:outline-none focus:border-teal-500/60 resize-y"
                          placeholder="# 在这里编写你的代码..."
                        />
                        <div className="mt-2 text-xs text-gray-500">
                          💡 提示：编写完代码后，可复制到 Python 环境中运行，也可以点击右侧「查看答案」对比参考答案。
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="divide-y divide-gray-700">
                          {/* 起始代码 */}
                          {exercise.starterCode && (
                            <div className="p-4 bg-gray-800/30">
                              <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-3">
                                <Code className="w-5 h-5" />
                                起始代码
                              </div>
                              <div className="code-block">
                                <pre className="text-gray-100">{exercise.starterCode}</pre>
                              </div>
                            </div>
                          )}

                          {/* 参考答案 */}
                          <div className="p-4 bg-green-500/10">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2 text-green-400 font-semibold">
                                <Check className="w-5 h-5" />
                                参考答案
                              </div>
                              <button
                                onClick={() => navigator.clipboard.writeText(exercise.solution)}
                                className="px-3 py-1 text-xs border border-green-700/50 text-green-400 rounded hover:bg-green-500/10 transition-colors flex items-center gap-1"
                              >
                                <Copy className="w-3 h-3" />
                                复制
                              </button>
                            </div>
                            <div className="code-block">
                              <pre className="text-gray-100">{exercise.solution}</pre>
                            </div>
                          </div>

                          {/* 解析 */}
                          <div className="p-4 bg-blue-500/10">
                            <div className="flex items-center gap-2 text-blue-400 font-semibold mb-3">
                              <BookOpen className="w-5 h-5" />
                              答案解析
                            </div>
                            <p className="text-gray-300">{exercise.explanation}</p>
                          </div>

                          {/* 常见错误 */}
                          {exercise.commonErrors && exercise.commonErrors.length > 0 && (
                            <div className="p-4 bg-red-500/10">
                              <div className="flex items-center gap-2 text-red-400 font-semibold mb-3">
                                <Award className="w-5 h-5" />
                                常见错误与解决方案
                              </div>
                              <div className="space-y-3">
                                {exercise.commonErrors.map((error, idx) => (
                                  <div key={idx} className="bg-gray-800/50 rounded-lg p-3 border border-red-500/20">
                                    <div className="text-red-400 font-medium mb-1">{error.error}</div>
                                    <div className="text-gray-400 text-sm mb-2">问题：{error.description}</div>
                                    <div className="text-green-400 text-sm font-medium">解决：{error.solution}</div>
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
            </div>

            {/* 4. 选择题区域 */}
            {multipleChoice.length > 0 && (
              <div className="glass rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Award className="w-6 h-6 text-purple-400" />
                    选择题 ({multipleChoice.length} 题)
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-400">
                      已答：{Object.keys(mcAnswers).length} / {multipleChoice.length}
                    </div>
                    <button
                      onClick={resetMultipleChoice}
                      className="px-4 py-2 border border-gray-600 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white transition-all text-sm flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      重置选择题
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {multipleChoice.map((quiz, idx) => {
                    const hintKey = getHintKey('mc', quiz.id);
                    const hints = generateHintsFromExplanation(quiz.explanation, quiz.correctAnswer, 'mc', quiz.hints);
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
                            <span className="inline-block px-2 py-1 text-xs font-medium rounded mb-2 mr-2 bg-purple-500/20 text-purple-400 border border-purple-500/30">
                              选择题
                            </span>
                            <h4 className="text-white font-medium text-lg">{quiz.question}</h4>
                            {renderHintButton(hintKey, hints)}
                          </div>
                        </div>

                        <div className="space-y-2 ml-11">
                          {quiz.options?.map((option, optIdx) => {
                            const isSelected = userAnswer === option;
                            const isCorrect = option === quiz.correctAnswer;

                            let buttonClass = 'quiz-option';
                            if (isSubmitted) {
                              if (isCorrect) {
                                buttonClass += ' correct';
                              } else if (isSelected) {
                                buttonClass += ' incorrect';
                              }
                            } else if (isSelected) {
                              buttonClass += ' selected';
                            }

                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleMcSelect(quiz.id, option)}
                                disabled={isSubmitted}
                                className={buttonClass}
                              >
                                <span className="font-semibold mr-2">{String.fromCharCode(65 + optIdx).concat('.')}</span>
                                {option}
                                {isSubmitted && isCorrect && <Check className="w-5 h-5 text-green-400 ml-auto inline" />}
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
                            >
                              提交答案
                            </button>
                          ) : (
                            <div className={`p-4 rounded-lg ${result ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
                              <div className="flex items-center gap-2 font-semibold mb-2">
                                {result ? (
                                  <>
                                    <Check className="w-5 h-5 text-green-400" />
                                    <span className="text-green-400">回答正确！</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="text-red-400">回答错误，正确答案是：</span>
                                    <span className="text-green-400 font-bold">
                                      {String(quiz.correctAnswer)}
                                    </span>
                                  </>
                                )}
                              </div>
                              <div className="text-gray-300">
                                <span className="text-blue-400 font-medium">解析：</span>
                                {quiz.explanation}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. 判断题区域 */}
            {trueFalse.length > 0 && (
              <div className="glass rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Award className="w-6 h-6 text-pink-400" />
                    判断题 ({trueFalse.length} 题)
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-400">
                      已答：{Object.keys(tfAnswers).length} / {trueFalse.length}
                    </div>
                    <button
                      onClick={resetTrueFalse}
                      className="px-4 py-2 border border-gray-600 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white transition-all text-sm flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      重置判断题
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {trueFalse.map((quiz, idx) => {
                    const hintKey = getHintKey('tf', quiz.id);
                    const hints = generateHintsFromExplanation(quiz.explanation, quiz.correctAnswer, 'tf', quiz.hints);
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
                            <span className="inline-block px-2 py-1 text-xs font-medium rounded mb-2 mr-2 bg-pink-500/20 text-pink-400 border border-pink-500/30">
                              判断题
                            </span>
                            <h4 className="text-white font-medium text-lg">{quiz.question}</h4>
                            {renderHintButton(hintKey, hints)}
                          </div>
                        </div>

                        <div className="flex gap-4 ml-11">
                          {[true, false].map((option) => {
                            const isSelected = userAnswer === option;
                            const isCorrect = option === quiz.correctAnswer;

                            let buttonClass = 'quiz-option flex-1 justify-center';
                            if (isSubmitted) {
                              if (isCorrect) {
                                buttonClass += ' correct';
                              } else if (isSelected) {
                                buttonClass += ' incorrect';
                              }
                            } else if (isSelected) {
                              buttonClass += ' selected';
                            }

                            return (
                              <button
                                key={String(option)}
                                onClick={() => handleTfSelect(quiz.id, option)}
                                disabled={isSubmitted}
                                className={buttonClass}
                              >
                                {option ? '✓ 正确' : '✗ 错误'}
                                {isSubmitted && isCorrect && <Check className="w-5 h-5 text-green-400 ml-auto" />}
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
                            >
                              提交答案
                            </button>
                          ) : (
                            <div className={`p-4 rounded-lg ${result ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
                              <div className="flex items-center gap-2 font-semibold mb-2">
                                {result ? (
                                  <>
                                    <Check className="w-5 h-5 text-green-400" />
                                    <span className="text-green-400">回答正确！</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="text-red-400">回答错误，正确答案是：</span>
                                    <span className="text-green-400 font-bold">
                                      {quiz.correctAnswer ? '正确' : '错误'}
                                    </span>
                                  </>
                                )}
                              </div>
                              <div className="text-gray-300">
                                <span className="text-blue-400 font-medium">解析：</span>
                                {quiz.explanation}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 章节导航 */}
            <div className="glass rounded-xl p-6 flex items-center justify-between">
              <button
                onClick={() => activeChapter > 0 && setActiveChapter(activeChapter - 1)}
                disabled={activeChapter === 0}
                className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                ← 上一章
              </button>

              {activeChapter === course.chapters.length - 1 ? (
                <Link to="/" className="btn-cyber">
                  完成学习，返回首页
                </Link>
              ) : (
                <button
                  onClick={() => {
                    handleCompleteChapter();
                    setActiveChapter(activeChapter + 1);
                  }}
                  className="btn-cyber"
                >
                  下一章 →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
