import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Database, Code, FileText, TrendingUp, Sparkles, BarChart3, LineChart, BookOpen, Target, Users, ChevronDown, ChevronUp } from 'lucide-react';

function Home() {
  const [showIntro, setShowIntro] = useState(false);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* 背景动画 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent animate-gradient">
                数据分析技术
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              系统学习Python数据分析核心技能
              <br />
              <span className="text-blue-400">从数据采集到可视化分析</span>
            </p>

            {/* 课程标签 */}
            <div className="flex flex-wrap gap-3 justify-center max-w-3xl mx-auto">
              {['Python基础', '数据采集', '数据清洗', '数据可视化', '统计分析', '6大章节', '54+练习题'].map((tag, i) => (
                <span key={i} className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-full text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Link to="/course/1" className="btn-cyber text-lg px-8 py-4 animate-pulse-glow">
                开始学习 →
              </Link>
              <button
                onClick={() => setShowIntro(!showIntro)}
                className="px-8 py-4 border-2 border-blue-500/50 text-blue-400 rounded-lg font-semibold hover:bg-blue-500/10 transition-all flex items-center gap-2 justify-center"
              >
                了解课程
                {showIntro ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 课程详细介绍 */}
      {showIntro && (
        <section className="py-20 px-4 bg-gradient-to-b from-transparent via-gray-900/50 to-transparent">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                <span className="neon-text-cyan">课程详细介绍</span>
              </h2>
              <p className="text-gray-400 text-lg">全面系统，面向实战的数据分析学习路径</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">课程目标</h3>
                </div>
                <p className="text-gray-300 leading-relaxed mb-4">
                  本课程专为数据分析初学者设计，以 Python 编程语言为主线，系统讲解数据获取、数据清洗、数据分析与数据可视化的完整工作流程。
                </p>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex gap-2"><span className="text-teal-400">✦</span> 掌握 Python 核心语法与常用数据处理库</li>
                  <li className="flex gap-2"><span className="text-teal-400">✦</span> 学会从文件、API、数据库等多种来源获取数据</li>
                  <li className="flex gap-2"><span className="text-teal-400">✦</span> 熟练使用 Pandas 进行数据清洗与分析</li>
                  <li className="flex gap-2"><span className="text-teal-400">✦</span> 能够用 Matplotlib/Seaborn 绘制专业图表</li>
                </ul>
              </div>

              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">适合人群</h3>
                </div>
                <p className="text-gray-300 leading-relaxed mb-4">
                  无论你是学生、职场人士，还是希望转型数据方向的从业者，都能通过本课程建立扎实的数据分析基础。
                </p>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex gap-2"><span className="text-teal-400">✦</span> 商务、统计、财经等专业的在校学生</li>
                  <li className="flex gap-2"><span className="text-teal-400">✦</span> 希望提升办公效率的职场人士</li>
                  <li className="flex gap-2"><span className="text-teal-400">✦</span> 对数据分析感兴趣的编程初学者</li>
                  <li className="flex gap-2"><span className="text-teal-400">✦</span> 需要系统化学习路径的自学者</li>
                </ul>
              </div>

              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-teal-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">学习方式</h3>
                </div>
                <p className="text-gray-300 leading-relaxed mb-4">
                  采用「知识讲解 + 代码示例 + 编程练习 + 选择题判断」的四位一体教学方式，边学边练，确保每章知识点真正掌握。
                </p>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex gap-2"><span className="text-teal-400">✦</span> 每章配套代码示例，可直接运行参考</li>
                  <li className="flex gap-2"><span className="text-teal-400">✦</span> 3道编程练习题，内置代码编辑器，动手实战</li>
                  <li className="flex gap-2"><span className="text-teal-400">✦</span> 10道选择题 + 10道判断题，检验知识掌握</li>
                  <li className="flex gap-2"><span className="text-teal-400">✦</span> 渐进式提示系统，引导思考而不是直接给答案</li>
                </ul>
              </div>

              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">课程结构</h3>
                </div>
                <p className="text-gray-300 leading-relaxed mb-4">
                  课程共分为 6 大章节，从 Python 基础语法开始，循序渐进地带你掌握数据处理全流程。
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <span className="text-blue-400 font-bold">第1章</span>
                    <p className="text-gray-300">Python基础</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <span className="text-cyan-400 font-bold">第2章</span>
                    <p className="text-gray-300">数据来源与类型</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <span className="text-teal-400 font-bold">第3章</span>
                    <p className="text-gray-300">数据采集</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <span className="text-purple-400 font-bold">第4章</span>
                    <p className="text-gray-300">数据清洗</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <span className="text-pink-400 font-bold">第5章</span>
                    <p className="text-gray-300">数据可视化</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <span className="text-orange-400 font-bold">第6章</span>
                    <p className="text-gray-300">统计分析基础</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 课程模块 */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="neon-text-cyan">课程模块</span>
            </h2>
            <p className="text-gray-400 text-lg">循序渐进，系统掌握数据分析技术</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 模块1 */}
            <div className="glass rounded-2xl p-6 card-hover group">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-xl flex items-center justify-center mb-4 group-hover:animate-float">
                <Code className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Python基础</h3>
              <p className="text-gray-400 text-sm mb-4">掌握Python编程基础，包括变量、数据类型、流程控制和函数等核心概念。</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="tag tag-cyan">变量</span>
                <span className="tag tag-cyan">函数</span>
                <span className="tag tag-cyan">循环</span>
              </div>
              <Link to="/course/1" className="text-blue-400 hover:text-blue-300 font-medium text-sm flex items-center gap-2">
                开始学习 →
              </Link>
            </div>

            {/* 模块2 */}
            <div className="glass rounded-2xl p-6 card-hover group">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/30 to-teal-500/30 rounded-xl flex items-center justify-center mb-4 group-hover:animate-float">
                <Database className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">数据来源和类型</h3>
              <p className="text-gray-400 text-sm mb-4">了解常见数据源、数据格式（CSV、JSON、Excel）以及数据存储方式。</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="tag tag-teal">CSV</span>
                <span className="tag tag-teal">JSON</span>
                <span className="tag tag-teal">Excel</span>
              </div>
              <Link to="/course/1" className="text-cyan-400 hover:text-cyan-300 font-medium text-sm flex items-center gap-2">
                开始学习 →
              </Link>
            </div>

            {/* 模块3 */}
            <div className="glass rounded-2xl p-6 card-hover group">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500/30 to-blue-500/30 rounded-xl flex items-center justify-center mb-4 group-hover:animate-float">
                <FileText className="w-7 h-7 text-teal-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">数据采集</h3>
              <p className="text-gray-400 text-sm mb-4">学习文件读取、网络数据获取和API数据接口的使用方法。</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="tag tag-blue">API</span>
                <span className="tag tag-blue">爬虫</span>
                <span className="tag tag-blue">数据库</span>
              </div>
              <Link to="/course/1" className="text-teal-400 hover:text-teal-300 font-medium text-sm flex items-center gap-2">
                开始学习 →
              </Link>
            </div>

            {/* 模块4 */}
            <div className="glass rounded-2xl p-6 card-hover group">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-xl flex items-center justify-center mb-4 group-hover:animate-float">
                <Sparkles className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">数据清洗</h3>
              <p className="text-gray-400 text-sm mb-4">掌握缺失值处理、数据类型转换、数据去重和异常值处理技术。</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="tag tag-purple">清洗</span>
                <span className="tag tag-purple">去重</span>
                <span className="tag tag-purple">转换</span>
              </div>
              <Link to="/course/1" className="text-purple-400 hover:text-purple-300 font-medium text-sm flex items-center gap-2">
                开始学习 →
              </Link>
            </div>

            {/* 模块5 */}
            <div className="glass rounded-2xl p-6 card-hover group">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-xl flex items-center justify-center mb-4 group-hover:animate-float">
                <BarChart3 className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">数据可视化</h3>
              <p className="text-gray-400 text-sm mb-4">学习Matplotlib和Seaborn，创建专业的统计图表和数据展示。</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="tag tag-cyan">图表</span>
                <span className="tag tag-cyan">Matplotlib</span>
                <span className="tag tag-cyan">Seaborn</span>
              </div>
              <Link to="/course/1" className="text-blue-400 hover:text-blue-300 font-medium text-sm flex items-center gap-2">
                开始学习 →
              </Link>
            </div>

            {/* 模块6 */}
            <div className="glass rounded-2xl p-6 card-hover group">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/30 to-purple-500/30 rounded-xl flex items-center justify-center mb-4 group-hover:animate-float">
                <LineChart className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">统计分析</h3>
              <p className="text-gray-400 text-sm mb-4">掌握描述性统计、假设检验、相关分析等统计分析方法。</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="tag tag-teal">统计</span>
                <span className="tag tag-teal">相关</span>
                <span className="tag tag-teal">回归</span>
              </div>
              <Link to="/course/1" className="text-cyan-400 hover:text-cyan-300 font-medium text-sm flex items-center gap-2">
                开始学习 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 学习特色 */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="neon-text-blue">学习特色</span>
            </h2>
            <p className="text-gray-400 text-lg">沉浸式学习体验，高效掌握技能</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-xl flex items-center justify-center mx-auto mb-4 glow-cyan">
                <Code className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">代码练习</h3>
              <p className="text-gray-400 text-sm">在线编写Python代码，即时获得反馈和解析</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/30 to-teal-500/30 rounded-xl flex items-center justify-center mx-auto mb-4 glow-teal">
                <BarChart3 className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">课后测验</h3>
              <p className="text-gray-400 text-sm">20道测验题（10选择+10判断）巩固知识点</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500/30 to-purple-500/30 rounded-xl flex items-center justify-center mx-auto mb-4 glow-blue">
                <Sparkles className="w-8 h-8 text-teal-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">详细解析</h3>
              <p className="text-gray-400 text-sm">完整的答案解析和常见错误分析</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
