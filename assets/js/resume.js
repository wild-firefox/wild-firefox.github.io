(() => {
  const root = document.documentElement;
  const page = document.body.dataset.page;
  document.querySelectorAll('.desktop-nav, .mobile-nav').forEach((nav) => {
    const resumeLink = nav.querySelector('a[href="/resume"]');
    if (!resumeLink) return;
    if (!nav.querySelector('[data-page-link="outputs"]')) {
      const outputsLink = document.createElement('a');
      outputsLink.href = '/publications';
      outputsLink.dataset.pageLink = 'outputs';
      outputsLink.dataset.zh = '科研成果';
      outputsLink.dataset.en = 'Publications';
      outputsLink.textContent = '科研成果';
      resumeLink.before(outputsLink);
    }
    if (!nav.querySelector('[data-page-link="blog"]')) {
      const blogLink = document.createElement('a');
      blogLink.href = '/blog';
      blogLink.dataset.pageLink = 'blog';
      blogLink.dataset.zh = '博客';
      blogLink.dataset.en = 'Blog';
      blogLink.textContent = '博客';
      resumeLink.before(blogLink);
    }
  });
  const languageButton = document.querySelector('.language-toggle');
  const themeButton = document.querySelector('.theme-toggle');
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const bilingualPages = new Set(['home', 'about', 'projects', 'research', 'outputs', 'blog', 'resume', 'contact']);
  const navigationLabels = new Map([
    ['/', ['首页', 'Home']],
    ['/about', ['关于', 'About']],
    ['/projects', ['项目经历', 'Projects']],
    ['/research', ['研究', 'Research']],
    ['/publications', ['科研成果', 'Publications']],
    ['/blog', ['博客', 'Blog']],
    ['/resume', ['简历', 'Resume']],
    ['/contact', ['联系', 'Contact']],
  ]);
  const textTranslations = new Map([
    ['顾家成', 'Jiacheng Gu'],
    ['顾家成 · 强化学习 · AI 工程', 'Reinforcement Learning · Quant Research · AI Engineering'],
    ['菜单', 'Menu'],
    ['2026.06 — 至今', '2026.06 — Present'],
    ['项目经历', 'Projects'],
    ['量化强化学习、分布式系统、工业世界模型、机器人视觉与游戏 AI 实践。', 'Projects in quantitative reinforcement learning, distributed systems, industrial world models, robot vision, and game AI.'],
    ['全部', 'All'],
    ['实习项目', 'Internship'],
    ['研究项目', 'Research'],
    ['个人项目', 'Personal'],
    ['竞赛项目', 'Competition'],
    ['ETF 动量 PPO 轮动策略', 'ETF Momentum Rotation with PPO'],
    ['杭州零界演化科技有限公司 · Quantitative R&D', 'Hangzhou Zero-Boundary Evolution Technology · Quantitative R&D'],
    ['设计 8 个离散动作（7 种持仓配置与现金），持续迭代状态、奖励和交易环境；回测纳入手续费、整手交易、现金约束与目标配置不变时不重复调仓。', 'Designed eight discrete actions covering seven portfolio allocations and cash; iterated on state, reward, and trading environments while modeling fees, board lots, cash constraints, and no-op rebalancing.'],
    ['搭建 11 折 WFO 流程，每折使用 120 日预热、750 日训练和 60 日样本外测试，并对 5 个随机种子进行 MWU 动态加权。', 'Built an 11-fold walk-forward optimization pipeline with 120-day warm-up, 750-day training, and 60-day out-of-sample testing per fold, dynamically weighting five random seeds with MWU.'],
    ['2023.10.10—2026.06.30 连续 660 个样本外交易日中，累计收益', 'Across 660 consecutive out-of-sample trading days from 2023.10.10 to 2026.06.30, cumulative return was'],
    ['、年化收益', ', annualized return'],
    ['、最大回撤', ', maximum drawdown'],
    ['；同期沪深 300 收益', '; the CSI 300 returned'],
    ['基于 QMT 完成模型加载、每日行情更新、账户状态保存和先卖后买委托，补充停牌延迟执行、手续费与资金检查；2026.08.24 接入真实资金运行，并通过聚宽与本地回测逐笔核对成交。', 'Implemented model loading, daily market updates, account-state persistence, and sell-before-buy execution in QMT, with suspended-security handling, fee and cash checks; connected to live capital on 2026.08.24 and reconciled fills against JoinQuant and local backtests.'],
    ['ETF 量化强化学习策略原型', 'ETF Quantitative Reinforcement Learning Prototype'],
    ['开源策略原型', 'Open-source Strategy Prototype'],
    ['实习前独立完成 ETF 轮动原型，设计规则动作空间、状态表示和奖励函数。', 'Independently built an ETF rotation prototype before the internship, designing a rule-based action space, state representation, and reward function.'],
    ['基于 Python、PyTorch、PPO 与 Gymnasium 搭建训练和样本外评估流程，为后续策略迭代提供基础。', 'Built training and out-of-sample evaluation pipelines with Python, PyTorch, PPO, and Gymnasium, providing a foundation for later strategy iterations.'],
    ['污水处理环境世界模型', 'World Model for Wastewater Treatment'],
    ['昕彤赋能（长沙）人工智能有限公司 · 研发算法岗', 'Xintong AI (Changsha) · R&D Algorithm Engineer'],
    ['基于历史水务数据构建可交互的虚拟污水处理环境，用于强化学习策略训练与工业场景验证。', 'Built an interactive virtual wastewater-treatment environment from historical water data for reinforcement-learning policy training and industrial validation.'],
    ['将环境状态解耦为动作关联维度和环境自身演化维度，使环境网络聚焦预测会被控制动作改变的状态。', 'Decoupled environment state into action-related and autonomous-evolution dimensions so the environment network could focus on states affected by control actions.'],
    ['设计两阶段 GAIL/BC/PPO 框架：前置阶段联合训练判别器、策略/环境生成器和价值网络，后置阶段固定环境网络并继续训练控制策略。', 'Designed a two-stage GAIL/BC/PPO framework: jointly trained the discriminator, policy/environment generators, and value network, then froze the environment network to continue policy training.'],
    ['搭建训练集/验证集双环境，通过 Rollout MAE、专家轨迹特征对比和离线归一化结果进行多维评估；在低信噪比数据上的预测效果优于 LSTM 时序方案。', 'Built separate training and validation environments and evaluated them using rollout MAE, expert-trajectory feature comparisons, and offline normalized results; outperformed an LSTM time-series baseline on low-SNR data.'],
    ['竞彩足球决策系统', 'Football Lottery Decision System'],
    ['PPO · 自建赔率数据集', 'PPO · Custom Odds Dataset'],
    ['使用强化学习方法研究竞彩足球决策问题，基于自建赔率数据集完成训练与评估流程。', 'Studied football-lottery decision making with reinforcement learning and built a complete training and evaluation pipeline on a custom odds dataset.'],
    ['Actor–Learner 分布式强化学习框架', 'Actor–Learner Distributed Reinforcement Learning Framework'],
    ['北京智信卫通科技有限责任公司 · 强化学习算法岗', 'Beijing Zhixin Weitong Technology · Reinforcement Learning Algorithm Engineer'],
    ['面向多环境并行采样与训练吞吐需求，基于 Ray 设计并实现 Actor–Learner 分离的分布式强化学习框架。', 'Designed and implemented a Ray-based distributed reinforcement-learning framework with separated Actors and Learners for parallel environment sampling and higher training throughput.'],
    ['结合 PyTorch Distributed 与 Linux 完成多 GPU 训练，支持混合动作 PPO、自博弈和并行采样；单机双卡训练速度达到单卡约', 'Implemented multi-GPU training with PyTorch Distributed on Linux, supporting hybrid-action PPO, self-play, and parallel sampling; dual-GPU throughput reached approximately'],
    ['2 倍', '2×'],
    ['使用 ActiveMQ 发布/订阅模式打通训练端机器与环境部署端机器，实现同网段内的任务下发、轨迹回传与训练协同。', 'Connected training and environment-host machines through ActiveMQ publish/subscribe messaging for task dispatch, trajectory return, and coordinated training on the same network.'],
    ['非侵入式像素小鸟智能体', 'Non-Invasive Flappy Bird Agent'],
    ['仅使用屏幕截图作为状态输入，不读取游戏内部数据，并以键鼠操作作为动作，实现稳定得分与持续运行。', 'Used only screen captures as state input and keyboard/mouse actions, without reading internal game data, achieving stable scoring and continuous operation.'],
    ['文章 ↗', 'Article ↗'],
    ['多智能体强化学习联合科研项目', 'Joint Multi-Agent Reinforcement Learning Research Project'],
    ['南京某研究所 · 研究员', 'Nanjing Research Institute · Researcher'],
    ['围绕复杂环境中的多智能体任务表现开展联合研究，参与算法方案设计与实验验证。', 'Conducted joint research on multi-agent performance in complex environments and contributed to algorithm design and experimental validation.'],
    ['负责动作掩码与并行环境方案，提升复杂动作空间下的训练有效性与环境采样效率。', 'Developed action-masking and parallel-environment solutions to improve training effectiveness and sampling efficiency in complex action spaces.'],
    ['PettingZoo Pong 自博弈', 'PettingZoo Pong Self-Play'],
    ['基于 IPPO 在 PettingZoo Pong v3 环境中完成双智能体自博弈训练。', 'Trained two agents through self-play with IPPO in the PettingZoo Pong v3 environment.'],
    ['Atari Pong 强化学习智能体', 'Atari Pong Reinforcement Learning Agent'],
    ['基于 PPO 完成 Atari Pong v0 环境的训练与评估。', 'Trained and evaluated a PPO agent in the Atari Pong v0 environment.'],
    ['激光追踪二维云台系统', 'Laser-Tracking Pan-Tilt System'],
    ['全国大学生电子设计竞赛 · 全国一等奖', 'National Undergraduate Electronics Design Contest · National First Prize'],
    ['组建 3 人团队，搭建二维云台与激光笔追踪系统，使激光沿旋转黑边矩形完成一周追踪，并满足激光点不超出黑色边框的约束。', 'Worked in a three-person team to build a pan-tilt laser-tracking system that completed one full pass around a rotating black-bordered rectangle while keeping the laser within the border.'],
    ['负责矩形识别与定位，使用 OpenCV 完成实时图像处理、轮廓提取和目标坐标计算，为云台控制提供视觉输入。', 'Owned rectangle detection and localization, using OpenCV for real-time image processing, contour extraction, and target-coordinate calculation for pan-tilt control.'],
    ['后车跟随前车系统', 'Leader–Follower Smart Car System'],
    ['江苏省大学生电子设计竞赛 · 省级二等奖', 'Jiangsu Undergraduate Electronics Design Contest · Provincial Second Prize'],
    ['组建 3 人团队，以 TI 芯片为主处理器，实现后车跟随前车、循迹与弯道超车，并控制两车距离以避免碰撞。', 'Worked in a three-person team using a TI controller to implement leader following, line tracking, and overtaking on curves while maintaining safe distance.'],
    ['负责小车循迹控制逻辑、状态机设计和 PID 调速，根据道路与前车状态切换跟随、转弯和超车行为。', 'Owned line-following control logic, state-machine design, and PID speed control, switching among following, turning, and overtaking behaviors.'],
    ['高速寻铁丝智能车', 'High-Speed Wire-Tracking Smart Car'],
    ['使用 C/C++、状态机与 PID 完成单片机实物开发和高速寻铁丝控制。', 'Built the embedded prototype and high-speed wire-tracking control using C/C++, a state machine, and PID.'],
    ['实车视频 ↗', 'Demo Video ↗'],
    ['机器人先进视觉赛 3D 识别项目', 'Advanced Robot Vision 3D Recognition Project'],
    ['中国机器人大赛暨 RoboCup 机器人世界杯中国赛 · 国家三等奖', 'China Robot Competition & RoboCup China Open · National Third Prize'],
    ['组建 3 人团队，使用 Jetson Nano 与深度摄像头识别静止及旋转状态下的食品、水果，并区分真实水果与水果贴图。', 'Worked in a three-person team using Jetson Nano and a depth camera to recognize food and fruit in static and rotating states and distinguish real fruit from printed images.'],
    ['负责 YOLOv5 开源项目学习、数据集制作与训练、模型调试和端侧部署，最终实现 90%+ 识别准确率。', 'Owned YOLOv5 adoption, dataset preparation and training, model tuning, and edge deployment, achieving over 90% recognition accuracy.'],
    ['研究方向', 'Research'],
    ['围绕强化学习策略、训练系统、环境建模与真实场景验证展开。', 'Research on reinforcement-learning policies, training systems, environment modeling, and real-world validation.'],
    ['量化强化学习', 'Quantitative Reinforcement Learning'],
    ['研究 ETF 动量 PPO 轮动策略与交易落地：设计 8 个离散动作，使用 11 折 WFO 和 5 个随机种子的 MWU 动态加权控制过拟合，并通过 QMT 接入真实资金运行。660 个样本外交易日累计收益 216.4%、年化收益 54.7%、Sharpe 1.927。', 'Developed and deployed an ETF momentum PPO rotation strategy with eight discrete actions, 11-fold WFO, and MWU dynamic weighting across five random seeds; connected the strategy to live capital through QMT. Across 660 out-of-sample trading days, cumulative return was 216.4%, annualized return 54.7%, and Sharpe 1.927.'],
    ['分布式强化学习', 'Distributed Reinforcement Learning'],
    ['基于 Ray 实现 Actor–Learner 分离架构，支持混合动作 PPO、自博弈和并行采样；单机双卡训练速度达到单卡约 2 倍，并通过 ActiveMQ 连接训练端与环境端。', 'Implemented a Ray-based Actor–Learner architecture supporting hybrid-action PPO, self-play, and parallel sampling; dual-GPU throughput reached about twice that of a single GPU, with ActiveMQ connecting training and environment hosts.'],
    ['世界模型与模仿学习', 'World Models & Imitation Learning'],
    ['面向低信噪比水务数据设计状态解耦与两阶段 GAIL/MAIL 框架，通过 Rollout MAE、专家轨迹对比和双环境验证评估模型，预测效果优于 LSTM 时序方案。', 'Designed state decomposition and a two-stage GAIL/MAIL framework for low-SNR water data, evaluated through rollout MAE, expert-trajectory comparison, and dual-environment validation; prediction outperformed an LSTM time-series baseline.'],
    ['多智能体与纯视觉智能体', 'Multi-Agent and Vision-Only Agents'],
    ['研究复杂环境下的 MARL、动作掩码与并行环境加速；同时开发仅依赖屏幕截图、通过键鼠交互的非侵入式游戏智能体。', 'Studied MARL, action masking, and parallel-environment acceleration in complex environments, while developing non-invasive game agents that rely only on screenshots and keyboard/mouse interaction.'],
    ['科研成果', 'Publications & Patents'],
    ['第一作者期刊论文 1 篇、发明专利 3 项；其中 1 项为主要完成，2 项参与。以下均提供公开检索链接。', 'One first-author journal paper and three invention patents, including one as a primary contributor and two as a participant. Public lookup links are provided below.'],
    ['融合预测与学习的智慧家庭在线高效能量管理方法', 'An Online High-Efficiency Energy Management Method for Smart Homes Integrating Prediction and Learning'],
    ['《信息与控制》· 第一作者 · 最新录用', 'Information and Control · First Author · Accepted'],
    ['作者：顾家成、陈志强、余亮、方景', 'Authors: Jiacheng Gu, Zhiqiang Chen, Liang Yu, Jing Fang'],
    ['融合模型预测控制与深度强化学习，构建智慧家庭能量管理策略，在兼顾室内热舒适的同时优化系统运行成本。', 'Integrated model predictive control with deep reinforcement learning to optimize smart-home operating cost while maintaining indoor thermal comfort.'],
    ['期刊官网 ↗', 'Journal Page ↗'],
    ['一种长期碳排放约束下电氢多能源系统在线运行优化方法', 'Online Operational Optimization for Electricity–Hydrogen Multi-Energy Systems under Long-Term Carbon Constraints'],
    ['授权发明专利 · CN120832988B', 'Granted Invention Patent · CN120832988B'],
    ['发明人：余亮、王菲、陈志强、顾家成、岳东、张廷军', 'Inventors: Liang Yu, Fei Wang, Zhiqiang Chen, Jiacheng Gu, Dong Yue, Tingjun Zhang'],
    ['申请号：CN202511334749.4；专利权人：南京邮电大学。', 'Application No. CN202511334749.4; Patentee: Nanjing University of Posts and Telecommunications.'],
    ['多能源系统', 'Multi-Energy Systems'],
    ['碳排放约束', 'Carbon Constraints'],
    ['在线优化', 'Online Optimization'],
    ['专利详情 ↗', 'Patent Details ↗'],
    ['一种融合预测与学习思想的智慧家庭在线能量管理方法', 'Online Energy Management for Smart Homes Integrating Prediction and Learning'],
    ['发明专利申请（已公开）· CN120781716A', 'Published Invention Patent Application · CN120781716A'],
    ['发明人：余亮、顾家成、陈志强、李杨、岳东', 'Inventors: Liang Yu, Jiacheng Gu, Zhiqiang Chen, Yang Li, Dong Yue'],
    ['申请号：CN202511289737.4；申请人：南京邮电大学。', 'Application No. CN202511289737.4; Applicant: Nanjing University of Posts and Telecommunications.'],
    ['智慧家庭', 'Smart Homes'],
    ['强化学习', 'Reinforcement Learning'],
    ['能量管理', 'Energy Management'],
    ['一种离网模式下含氢建筑能源系统可靠经济运行优化方法', 'Reliable and Economical Operation of Hydrogen-Integrated Building Energy Systems in Off-Grid Mode'],
    ['发明专利申请（已公开）· CN119472282A', 'Published Invention Patent Application · CN119472282A'],
    ['发明人：余亮、陈志强、顾家成、王梓丹、岳东、张廷军', 'Inventors: Liang Yu, Zhiqiang Chen, Jiacheng Gu, Zidan Wang, Dong Yue, Tingjun Zhang'],
    ['申请号：CN202411530830.5；申请人：南京邮电大学。', 'Application No. CN202411530830.5; Applicant: Nanjing University of Posts and Telecommunications.'],
    ['含氢能源系统', 'Hydrogen-Integrated Energy Systems'],
    ['可靠运行', 'Reliable Operation'],
    ['经济优化', 'Economic Optimization'],
    ['官方检索', 'Official Lookup'],
    ['专利状态以国家知识产权局公开信息为准。', 'Patent status is subject to the official records of the China National Intellectual Property Administration.'],
    ['国家知识产权局专利检索 ↗', 'CNIPA Patent Search ↗'],
    ['博客', 'Blog'],
    ['技术文章、量化研究记录与策略社区主页。', 'Technical articles, quantitative research notes, and strategy community profiles.'],
    ['联系我', 'Contact Me'],
    ['欢迎交流量化研究、强化学习算法及相关合作机会。', 'Open to opportunities and collaboration in quantitative research and reinforcement-learning algorithms.'],
    ['目标方向', 'Target Roles'],
    ['量化研究 / 强化学习算法', 'Quantitative Research / RL Algorithms'],
    ['预计毕业', 'Expected Graduation'],
    ['2027 年', '2027'],
    ['工作地点', 'Work Location'],
    ['不限', 'Flexible'],
    ['技术博客 ↗', 'Technical Blog ↗'],
    ['聚宽主页 ↗', 'JoinQuant Profile ↗'],
    ['强化学习 · 量化研发 · AI 工程', 'Reinforcement Learning · Quant Research · AI Engineering'],
    ['2027 届 · 求职方向：量化研究 / 强化学习算法', 'Class of 2027 · Target Roles: Quantitative Research / RL Algorithms'],
    ['打印 / 保存 PDF', 'Print / Save PDF'],
    ['个人简介', 'Profile'],
    ['南京邮电大学电子信息硕士在读，机器人工程本科背景。聚焦深度强化学习及其工程化落地，实践覆盖量化交易策略、Actor–Learner 分布式训练框架、多智能体算法、工业世界模型与纯视觉游戏智能体。', 'M.E. candidate in Electronic Information at Nanjing University of Posts and Telecommunications with a B.E. in Robotics Engineering. Focused on deep reinforcement learning and engineering deployment across quantitative strategies, Actor–Learner distributed training, multi-agent algorithms, industrial world models, and vision-only agents.'],
    ['核心项目', 'Selected Projects'],
    ['ETF 量化强化学习策略原型（个人开源项目）', 'ETF Quantitative Reinforcement Learning Prototype (Open Source)'],
    ['实习前独立完成 ETF 轮动原型，设计规则动作空间、状态表示与奖励函数。', 'Independently built an ETF rotation prototype before the internship, designing its rule-based action space, state representation, and reward function.'],
    ['搭建 PPO 训练与样本外评估流程，并开源代码及实验结果。', 'Built PPO training and out-of-sample evaluation pipelines and open-sourced the code and experimental results.'],
    ['代码与实验 ↗', 'Code & Experiments ↗'],
    ['MARL · 动作掩码 · 环境并行加速', 'MARL · Action Masking · Parallel Environments'],
    ['围绕复杂环境中的智能体任务表现开展研究，负责算法设计、动作掩码与并行环境方案。', 'Studied agent performance in complex environments, owning algorithm design, action masking, and parallel-environment solutions.'],
    ['实习经历', 'Internship Experience'],
    ['量化研发实习生', 'Quantitative R&D Intern'],
    ['杭州零界演化科技有限公司', 'Hangzhou Zero-Boundary Evolution Technology'],
    ['负责 ETF 动量 PPO 轮动策略，设计 8 个离散动作（7 种持仓配置与现金），完成状态、奖励和交易环境迭代；纳入手续费、整手交易、现金约束与避免重复调仓。', 'Developed an ETF momentum PPO rotation strategy with eight discrete actions covering seven allocations and cash; iterated on state, reward, and the trading environment while modeling fees, board lots, cash constraints, and avoiding redundant rebalancing.'],
    ['搭建 11 折 WFO，每折采用 120 日预热、750 日训练与 60 日样本外测试，对 5 个随机种子进行 MWU 动态加权。', 'Built an 11-fold WFO pipeline with 120-day warm-up, 750-day training, and 60-day out-of-sample testing per fold, dynamically weighting five random seeds with MWU.'],
    ['2023.10.10—2026.06.30 连续 660 个样本外交易日累计收益', 'Across 660 consecutive out-of-sample trading days from 2023.10.10 to 2026.06.30, cumulative return was'],
    ['基于 QMT 完成模型加载、每日行情更新、账户状态保存和先卖后买委托，处理停牌延迟、手续费与资金检查；2026.08.24 接入真实资金运行，并通过聚宽与本地回测逐笔核对成交。', 'Implemented model loading, daily market updates, account-state persistence, and sell-before-buy execution in QMT, handling suspensions, fees, and cash checks; connected to live capital on 2026.08.24 and reconciled fills against JoinQuant and local backtests.'],
    ['聚宽', 'JoinQuant'],
    ['研发算法岗', 'R&D Algorithm Engineer'],
    ['昕彤赋能（长沙）人工智能有限公司', 'Xintong AI (Changsha)'],
    ['基于 MAGAIL 与水务数据构建高保真虚拟污水处理厂，将状态解耦为动作关联维度与环境自身演化维度，使环境网络聚焦动作影响的状态。', 'Built a high-fidelity virtual wastewater-treatment plant with MAGAIL and water data, decoupling action-related and autonomous state dimensions so the environment network focused on action-affected states.'],
    ['设计两阶段强化学习与模仿学习框架：前置阶段结合判别器、策略/环境生成器、价值网络、BC 损失和 PPO 进行对抗训练；后置阶段在固定环境网络上训练策略。', 'Designed a two-stage reinforcement and imitation-learning framework: adversarially trained the discriminator, policy/environment generators, value network, BC loss, and PPO, then trained the policy on a frozen environment network.'],
    ['搭建训练集/验证集双环境验证与多维评估体系，追踪 Rollout MAE、专家轨迹特征和离线归一化结果；低信噪比环境预测效果优于 LSTM 时序预测方案。', 'Built separate training/validation environments and a multidimensional evaluation system tracking rollout MAE, expert-trajectory features, and offline normalized results; outperformed an LSTM baseline in low-SNR prediction.'],
    ['强化学习算法岗', 'Reinforcement Learning Algorithm Engineer'],
    ['北京智信卫通科技有限责任公司', 'Beijing Zhixin Weitong Technology'],
    ['基于 Ray 设计并实现 Actor–Learner 分离的分布式强化学习框架，单机双卡训练速度达到单卡约', 'Designed and implemented a Ray-based distributed Actor–Learner framework; dual-GPU throughput reached approximately'],
    ['支持混合动作 PPO 与自博弈训练；结合 PyTorch 分布式、Linux 和消息队列完成框架搭建。', 'Supported hybrid-action PPO and self-play training, integrating PyTorch Distributed, Linux, and message queues.'],
    ['使用 ActiveMQ 发布/订阅模式，实现训练端机器与环境部署端机器在同网段内通信。', 'Used ActiveMQ publish/subscribe messaging to connect training and environment hosts on the same network.'],
    ['教育经历', 'Education'],
    ['南京邮电大学', 'Nanjing University of Posts and Telecommunications'],
    ['电子信息 · 硕士研究生', 'Electronic Information · Master of Engineering Candidate'],
    ['研究生阶段成果：发明专利 3 项、第一作者期刊论文 1 篇。相关课程：深度强化学习、深度学习理论及应用。', 'Graduate research outputs: three invention patents and one first-author journal paper. Coursework: Deep Reinforcement Learning; Deep Learning Theory and Applications.'],
    ['论文与专利详情 →', 'Publications & Patents →'],
    ['南京工程学院', 'Nanjing Institute of Technology'],
    ['机器人工程 · 工学学士', 'Robotics Engineering · Bachelor of Engineering'],
    ['一等奖学金、校级三好学生、优秀毕业生。相关课程：程序设计技术与应用、机器人视觉、人工智能基础、微处理器及其应用。', 'First-class scholarship, Outstanding Student, and Outstanding Graduate. Coursework: Programming, Robot Vision, AI Fundamentals, and Microprocessor Applications.'],
    ['竞赛荣誉', 'Competition Honors'],
    ['3 人团队完成激光追踪二维云台系统，使激光沿旋转黑边矩形完成一周追踪且不超出边框；负责 OpenCV 实时识别、轮廓提取与目标定位。', 'In a three-person team, built a pan-tilt laser system that traced a rotating black-bordered rectangle without leaving the border; owned OpenCV-based real-time detection, contour extraction, and localization.'],
    ['3 人团队基于 TI 芯片实现后车跟随、循迹和弯道超车；负责循迹控制逻辑、状态机设计与 PID 调速，并控制跟随距离、防止碰撞。', 'In a three-person team, used a TI controller to implement leader following, line tracking, and curve overtaking; owned control logic, state-machine design, PID speed control, and collision avoidance.'],
    ['中国机器人及人工智能大赛（智慧农业）· 国家三等奖', 'China Robot and AI Competition (Smart Agriculture) · National Third Prize'],
    ['3 人团队使用 Jetson Nano 与深度摄像头识别静止和旋转状态下的食品、水果，并区分真实水果与贴图；负责 YOLOv5 数据集制作、训练、调试和端侧部署。', 'In a three-person team, used Jetson Nano and a depth camera to recognize food and fruit in static and rotating states and distinguish real fruit from images; owned YOLOv5 dataset preparation, training, tuning, and edge deployment.'],
    ['专业能力', 'Technical Skills'],
    ['强化学习：', 'Reinforcement Learning:'],
    ['PPO、MARL、GAIL、BC、自博弈、动作掩码', 'PPO, MARL, GAIL, BC, Self-Play, Action Masking'],
    ['工程框架：', 'Engineering:'],
    ['环境建模：', 'Environment Modeling:'],
    ['世界模型、低信噪比预测、仿真交易环境', 'World Models, Low-SNR Prediction, Simulated Trading Environments'],
    ['计算机视觉：', 'Computer Vision:'],
    ['OpenCV、YOLOv5、纯视觉智能体', 'OpenCV, YOLOv5, Vision-Only Agents'],
    ['嵌入式：', 'Embedded Systems:'],
    ['C/C++、状态机、PID、Jetson Nano', 'C/C++, State Machines, PID, Jetson Nano'],
    ['证书：', 'Certificates:'],
    ['FreeRL 强化学习库 ↗', 'FreeRL Library ↗'],
    ['stock_policy 策略项目 ↗', 'stock_policy Strategy Project ↗'],
  ]);
  const pageTitles = new Map([
    ['home', ['顾家成｜强化学习研究与 AI 工程', 'Jiacheng Gu | Reinforcement Learning & AI Engineering']],
    ['about', ['关于｜顾家成', 'About | Jiacheng Gu']],
    ['projects', ['项目经历｜顾家成', 'Projects | Jiacheng Gu']],
    ['research', ['研究｜顾家成', 'Research | Jiacheng Gu']],
    ['outputs', ['科研成果｜顾家成', 'Publications & Patents | Jiacheng Gu']],
    ['blog', ['博客｜顾家成', 'Blog | Jiacheng Gu']],
    ['resume', ['简历｜顾家成', 'Resume | Jiacheng Gu']],
    ['contact', ['联系｜顾家成', 'Contact | Jiacheng Gu']],
  ]);
  document.querySelectorAll('.desktop-nav a, .mobile-nav a').forEach((link) => {
    const labels = navigationLabels.get(link.getAttribute('href'));
    if (!labels) return;
    link.dataset.zh = labels[0];
    link.dataset.en = labels[1];
  });
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) { skipLink.dataset.zh = '跳至正文'; skipLink.dataset.en = 'Skip to content'; }
  const siteName = document.querySelector('.site-name');
  if (siteName) { siteName.dataset.zh = '顾家成'; siteName.dataset.en = 'Jiacheng Gu'; }
  const menuLabel = document.querySelector('.menu-toggle .sr-only');
  if (menuLabel) { menuLabel.dataset.zh = '菜单'; menuLabel.dataset.en = 'Menu'; }
  const footerTagline = document.querySelector('.site-footer > div:first-child p');
  if (footerTagline) { footerTagline.dataset.zh = '顾家成 · 强化学习 · AI 工程'; footerTagline.dataset.en = 'Reinforcement Learning · Quant Research · AI Engineering'; }
  const homeHeroName = document.querySelector('.home-hero h1');
  const homeHeroNameZh = homeHeroName?.innerHTML || '';
  const projectEntries = [...document.querySelectorAll('main > article.entry')];
  projectEntries.forEach((entry) => { entry.dataset.projectType = entry.querySelector('.project-kind')?.textContent.trim() || ''; });
  document.querySelectorAll(`[data-page-link="${page}"]`).forEach((link) => { link.classList.add('active'); link.setAttribute('aria-current', 'page'); });
  const translatableElements = document.querySelectorAll('[data-zh][data-en]');
  const translatedTextNodes = [];
  const textWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (textWalker.nextNode()) {
    const node = textWalker.currentNode;
    const key = node.nodeValue.trim();
    if (!textTranslations.has(key)) continue;
    if (node.parentElement?.closest('[data-zh][data-en]')) continue;
    if (page === 'home' && node.parentElement?.closest('.home-hero h1')) continue;
    translatedTextNodes.push({ node, zh: node.nodeValue, en: textTranslations.get(key) });
  }
  const supportsLanguageSwitch = bilingualPages.has(page);
  let language = supportsLanguageSwitch ? (localStorage.getItem('site-language') || 'zh') : 'zh';
  const applyLanguage = () => {
    root.lang = language === 'zh' ? 'zh-CN' : 'en';
    translatableElements.forEach((element) => { element.textContent = element.dataset[language]; });
    translatedTextNodes.forEach(({ node, zh, en }) => {
      if (language === 'zh') { node.nodeValue = zh; return; }
      const leadingSpace = zh.match(/^\s*/)?.[0] || '';
      const trailingSpace = zh.match(/\s*$/)?.[0] || '';
      node.nodeValue = `${leadingSpace}${en}${trailingSpace}`;
    });
    const activeTitle = pageTitles.get(page);
    if (activeTitle) document.title = language === 'zh' ? activeTitle[0] : activeTitle[1];
    if (homeHeroName) homeHeroName.innerHTML = language === 'zh' ? homeHeroNameZh : 'Jiacheng Gu';
    languageButton.textContent = language === 'zh' ? 'EN' : '中';
    languageButton.setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换到中文');
    themeButton.setAttribute('aria-label', language === 'zh' ? '切换主题' : 'Toggle theme');
  };
  if (supportsLanguageSwitch) {
    applyLanguage();
    languageButton.addEventListener('click', () => { language = language === 'zh' ? 'en' : 'zh'; localStorage.setItem('site-language', language); applyLanguage(); });
  } else {
    root.lang = 'zh-CN';
    languageButton.hidden = true;
  }
  const savedTheme = localStorage.getItem('site-theme');
  if (savedTheme) root.dataset.theme = savedTheme;
  themeButton.addEventListener('click', () => { const nextTheme = root.dataset.theme === 'light' ? 'dark' : 'light'; root.dataset.theme = nextTheme; localStorage.setItem('site-theme', nextTheme); });
  document.querySelectorAll('[data-project-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      const selectedType = button.dataset.projectFilter;
      document.querySelectorAll('[data-project-filter]').forEach((item) => { const selected = item === button; item.classList.toggle('active', selected); item.setAttribute('aria-pressed', String(selected)); });
      projectEntries.forEach((entry) => { entry.hidden = selectedType !== 'all' && entry.dataset.projectType !== selectedType; });
    });
  });
  menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') === 'true'; menuButton.setAttribute('aria-expanded', String(!open)); mobileNav.hidden = open; });
  document.querySelector('[data-print]')?.addEventListener('click', () => window.print());
  document.querySelector('#year').textContent = new Date().getFullYear();
})();
