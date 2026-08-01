/* ============================================================
   晋楹记 · 数据层
   - PARTS    : 榫卯构件（精准绑定题型掉落）
   - LEVELS   : 分层关卡题库（基础试炼 / 朝代专题 / 建筑Boss）
   - BUILDINGS: 古建图纸（分层结构 + 历史弹窗 + 所需零件）
   - REGIONS  : 地区古建群（集齐解锁牌匾）
   ============================================================ */

/* ---------- 榫卯构件目录 ---------- */
const PARTS = {
  // 基础通用件（青瓦试炼掉落）
  zhisun:   { id:'zhisun',   name:'直榫',     tier:'通用', color:'#b5763b', icon:'丨', desc:'最基础的榫头，一头插入榫槽，是所有木构的通用连接件。' },
  pingsun:  { id:'pingsun',  name:'平榫',     tier:'通用', color:'#c0884a', icon:'＝', desc:'端面平接的榫，用于板材、枋材的对接连接。' },
  hengliang:{ id:'hengliang',name:'普通横梁', tier:'通用', color:'#a9682f', icon:'—', desc:'承重的水平构件，搭在立柱之上传递屋面荷载。' },
  muzhu:    { id:'muzhu',    name:'基础木柱', tier:'通用', color:'#8a5a2b', icon:'‖', desc:'竖向承重构件，把屋顶重量传到台基。' },
  wajian:   { id:'wajian',   name:'瓦件',     tier:'通用', color:'#7d8471', icon:'△', desc:'屋面青瓦，通关青瓦试炼解锁的辅助装饰零件。' },

  // 朝代特色件
  tang_dougong:{ id:'tang_dougong', name:'唐代粗大斗拱榫件', tier:'唐构', color:'#c0392b', icon:'丼', desc:'唐代斗拱硕大、出檐深远，采用直卯大栌斗，是唐构的标志性构件。' },
  liao_xiegong:{ id:'liao_xiegong', name:'辽金斜拱榫件',     tier:'辽金', color:'#9c4a2f', icon:'彡', desc:'辽金建筑独创的斜拱（抹角拱），45°出跳，装饰与受力兼具。' },
  muota_anchen:{ id:'muota_anchen', name:'木塔暗层榫件',     tier:'辽金', color:'#7a5230', icon:'囗', desc:'应县木塔“明五暗四”中的暗层，双层套筒榫卯，是抗震柔性的关键。' },
  geshan:      { id:'geshan',       name:'格扇榫',           tier:'晋商', color:'#a8743b', icon:'卄', desc:'晋商大院隔断花罩所用的格扇榫，雕刻繁复、可拆卸。' },

  // Boss核心限定主件（没有它无法搭建整座建筑）
  core_nanchai: { id:'core_nanchai', name:'南禅寺大殿核心主件', tier:'核心', color:'#d4a017', icon:'★', desc:'南禅寺大殿的脊槫与核心梁架主件，限定掉落。' },
  core_foguang:{ id:'core_foguang', name:'佛光寺东大殿核心主件', tier:'核心', color:'#d4a017', icon:'★', desc:'佛光寺东大殿七间庑殿的核心主梁与铺作主件，限定掉落。' },
  core_muta:   { id:'core_muta',    name:'应县木塔核心主件', tier:'核心', color:'#d4a017', icon:'★', desc:'应县木塔的塔心柱与暗层主件，限定掉落，整塔的灵魂。' },
  core_xuankong:{id:'core_xuankong',name:'悬空寺核心主件',   tier:'核心', color:'#d4a017', icon:'★', desc:'悬空寺的悬臂梁与栈道主件，限定掉落。' },
  core_qiao:   { id:'core_qiao',    name:'乔家大院核心主件', tier:'核心', color:'#d4a017', icon:'★', desc:'乔家大院“双喜”院落轴线的核心厢房主件，限定掉落。' },
};

/* ---------- 分层关卡题库 ----------
   每题 reward 精准绑定掉落零件；level 字段决定归属。
   basic  -> 基础试炼关（青瓦试炼）
   tang / liaojin / jinshang -> 朝代专题关
   boss_* -> 建筑专项Boss关
*/
const LEVELS = [
  {
    id:'basic', group:'basic', name:'基础试炼关 · 青瓦试炼',
    subtitle:'山西古建基础常识：名称 / 城市 / 朝代',
    unlockReward:'wajian', unlockText:'通关青瓦试炼，解锁「瓦件」辅助装饰零件！',
    questions:[
      { q:'中国现存最古老的木结构建筑是哪一座？', options:['南禅寺大殿','佛光寺东大殿','应县木塔','悬空寺'], answer:0, reward:'muzhu',   explain:'南禅寺大殿（唐建中三年，782年）是中国现存最古老的木结构建筑，位于山西忻州五台县。' },
      { q:'应县木塔位于山西省哪座城市？', options:['大同','朔州','忻州','太原'], answer:1, reward:'hengliang',explain:'应县木塔（佛宫寺释迦塔）位于山西朔州应县。' },
      { q:'佛光寺东大殿被梁思成先生誉为什么？', options:['中国第一国宝','东方金字塔','木构之王','唐代之冠'], answer:0, reward:'zhisun', explain:'梁思成称佛光寺东大殿为“中国第一国宝”，1937年与林徽因发现。' },
      { q:'悬空寺位于山西哪座城市？', options:['大同浑源县','朔州','忻州','晋中'], answer:0, reward:'pingsun', explain:'悬空寺位于山西大同浑源县，悬挂于恒山金龙峡西侧峭壁。' },
      { q:'晋祠位于山西哪座城市？', options:['太原','平遥','祁县','大同'], answer:0, reward:'muzhu',   explain:'晋祠在山西太原，以圣母殿、难老泉、鱼沼飞梁闻名。' },
      { q:'乔家大院位于山西哪个县？', options:['祁县','平遥','太谷','灵石'], answer:0, reward:'hengliang',explain:'乔家大院位于山西晋中祁县，是清代晋商大院代表。' },
    ]
  },
  {
    id:'tang', group:'tang', name:'朝代专题关 · 唐构',
    subtitle:'南禅寺 / 佛光寺：结构特征 · 斗拱形制 · 历史典故',
    questions:[
      { q:'南禅寺大殿建于哪个朝代？', options:['唐','宋','辽','明'], answer:0, reward:'tang_dougong', explain:'南禅寺大殿建于唐建中三年（782年）。' },
      { q:'佛光寺东大殿的屋顶形式是？', options:['歇山顶','庑殿顶','攒尖顶','悬山顶'], answer:1, reward:'tang_dougong', explain:'东大殿为单檐庑殿顶（五脊顶），等级最高的屋顶形式。' },
      { q:'唐代斗拱的典型特征是？', options:['小巧纤细','硕大、出檐深远','彩绘繁复','用铁钉固定'], answer:1, reward:'tang_dougong', explain:'唐代斗拱硕大、出跳多、出檐深远，体现雄浑气势。' },
      { q:'佛光寺东大殿的确切建造年份是？', options:['唐贞观年间','唐大中十一年（857年）','唐开元年间','隋代'], answer:1, reward:'tang_dougong', explain:'东大殿建于唐大中十一年（857年），题记可考。' },
    ]
  },
  {
    id:'liaojin', group:'liaojin', name:'朝代专题关 · 辽金古建',
    subtitle:'应县木塔 / 善化寺：结构 · 斜拱 · 抗震原理',
    questions:[
      { q:'应县木塔建于哪个朝代？', options:['唐','辽','宋','明'], answer:1, reward:'liao_xiegong', explain:'应县木塔建于辽清宁二年（1056年）。' },
      { q:'应县木塔的“明五暗四”指的是什么？', options:['五层明层、四层暗层，共九层','五进院落','四根明柱','五座暗塔'], answer:0, reward:'muota_anchen', explain:'木塔外观五层，内部夹有四处暗层，实为九层结构。' },
      { q:'应县木塔全塔约有多高？', options:['约40米','约67.31米','约80米','约50米'], answer:1, reward:'muota_anchen', explain:'木塔高67.31米，是世界上最高的纯木结构楼阁式塔。' },
      { q:'善化寺位于哪座城市？', options:['朔州','大同','忻州','太原'], answer:1, reward:'liao_xiegong', explain:'善化寺位于山西大同，是辽金寺院建筑群。' },
    ]
  },
  {
    id:'jinshang', group:'jinshang', name:'朝代专题关 · 明清晋商大院',
    subtitle:'乔家大院 / 平遥民居：院落 · 格扇 · 砖雕',
    questions:[
      { q:'乔家大院属于哪种建筑类型？', options:['皇家园林','晋商大院','寺庙','军事堡垒'], answer:1, reward:'geshan', explain:'乔家大院是清代晋商大院民居的代表。' },
      { q:'平遥古城以什么闻名？', options:['唐代木构','明清民居与票号','皇家离宫','石窟'], answer:1, reward:'geshan', explain:'平遥保存了大量明清民居院落与票号旧址。' },
      { q:'晋商大院隔断花罩常用的可拆卸构件是？', options:['格扇榫','直榫','斜拱','暗层榫'], answer:0, reward:'geshan', explain:'格扇（隔扇）是晋商大院隔断与门窗的主要构件，便于拆卸通风。' },
    ]
  },
  {
    id:'boss_muta', group:'boss', name:'建筑Boss关 · 应县木塔',
    subtitle:'整关围绕应县木塔出题，通关掉落核心主件',
    questions:[
      { q:'应县木塔的全称是？', options:['佛宫寺释迦塔','大雁塔','嵩岳寺塔','六和塔'], answer:0, reward:'core_muta', explain:'全称“佛宫寺释迦塔”。' },
      { q:'应县木塔是否使用铁钉？', options:['大量用钉','不用钉，全为木榫卯','部分用钉','用铁箍'], answer:1, reward:'core_muta', explain:'全塔不用一颗铁钉，靠榫卯咬合，故称“斗拱博物馆”。' },
      { q:'应县木塔被称为什么博物馆？', options:['瓦当博物馆','斗拱博物馆','佛像博物馆','匾额博物馆'], answer:1, reward:'core_muta', explain:'全塔有54种斗拱，被誉为“斗拱博物馆”。' },
      { q:'应县木塔抗震的关键结构是？', options:['石材地基','暗层 + 榫卯柔性连接','铁链拉结','混凝土芯'], answer:1, reward:'core_muta', explain:'明五暗四的暗层与柔性榫卯连接，使木塔在地震中能“摇摆而不倒”。' },
      { q:'应县木塔外观可见的明层数是？', options:['三层','五层','七层','九层'], answer:1, reward:'core_muta', explain:'外观五层明层，加四暗层，实为九层。' },
    ]
  },
  {
    id:'boss_foguang', group:'boss', name:'建筑Boss关 · 佛光寺东大殿',
    subtitle:'整关围绕佛光寺东大殿出题，通关掉落核心主件',
    questions:[
      { q:'佛光寺东大殿面阔几间？', options:['三间','五间','七间','九间'], answer:2, reward:'core_foguang', explain:'东大殿面阔七间，进深四间，规模宏大。' },
      { q:'发现并考证佛光寺东大殿的学者是？', options:['梁思成、林徽因','李四光','竺可桢','茅以升'], answer:0, reward:'core_foguang', explain:'1937年梁思成、林徽因野外调查时发现并断代。' },
      { q:'东大殿内保存有哪个朝代的彩塑？', options:['唐代','明代','清代','宋代'], answer:0, reward:'core_foguang', explain:'殿内保存唐代彩塑三十余尊，极为珍贵。' },
      { q:'东大殿的屋顶形式为？', options:['庑殿顶','硬山顶','卷棚顶','盔顶'], answer:0, reward:'core_foguang', explain:'单檐庑殿顶，等级最高的古建屋顶。' },
    ]
  },
  {
    id:'boss_nanchai', group:'boss', name:'建筑Boss关 · 南禅寺大殿',
    subtitle:'整关围绕南禅寺大殿出题，通关掉落核心主件',
    questions:[
      { q:'南禅寺大殿建于哪一年？', options:['唐建中三年（782年）','唐贞观年','隋代','元代'], answer:0, reward:'core_nanchai', explain:'建于唐建中三年（782年），最古老木构。' },
      { q:'南禅寺大殿的规模是？', options:['七间大殿','三间小殿','九层塔','廊庑'], answer:1, reward:'core_nanchai', explain:'仅为面阔三间的小殿，却是我国最古老的木构遗存。' },
      { q:'南禅寺大殿的历史地位是？', options:['最高古塔','现存最古老木结构建筑','最大石窟','最长廊桥'], answer:1, reward:'core_nanchai', explain:'是我国乃至亚洲最古老的现存木结构建筑。' },
    ]
  },
  {
    id:'boss_xuankong', group:'boss', name:'建筑Boss关 · 悬空寺',
    subtitle:'整关围绕悬空寺出题，通关掉落核心主件',
    questions:[
      { q:'悬空寺始建于哪个朝代？', options:['北魏','唐','宋','明'], answer:0, reward:'core_xuankong', explain:'悬空寺始建于北魏，距今约1500年。' },
      { q:'悬空寺最独特的文化特征是？', options:['纯藏传','三教合一（儒释道）','纯道教','伊斯兰风格'], answer:1, reward:'core_xuankong', explain:'悬空寺三教殿内儒释道三教圣人同居一室，三教合一。' },
      { q:'悬空寺悬挂于哪座山？', options:['恒山','泰山','华山','五台山'], answer:0, reward:'core_xuankong', explain:'位于山西大同浑源县恒山金龙峡西侧峭壁。' },
    ]
  },
  {
    id:'boss_qiao', group:'boss', name:'建筑Boss关 · 乔家大院',
    subtitle:'整关围绕乔家大院出题，通关掉落核心主件',
    questions:[
      { q:'乔家大院是哪一时期的建筑？', options:['明代','清代晋商','唐代','民国西洋'], answer:1, reward:'core_qiao', explain:'乔家大院为清代晋商乔氏宅院。' },
      { q:'乔家大院院落布局常被形容为？', options:['品字','双喜（囍）字','回字','田字'], answer:1, reward:'core_qiao', explain:'乔家大院整体布局呈“双喜”字形，构思巧妙。' },
      { q:'乔家大院以哪种装饰工艺见长？', options:['砖雕、木雕、石雕','油画','马赛克','琉璃瓦'], answer:0, reward:'core_qiao', explain:'乔家大院以砖雕、木雕、石雕“三雕”精美著称。' },
    ]
  },
];

/* ---------- 古建图纸（分层建造） ----------
   每层 requires:[{part,count}]；layer 必须自下而上完成（结构判定）。
   popup 为完成该层弹出的历史/结构讲解。
*/
const BUILDINGS = [
  {
    id:'shuangta', name:'永祚寺双塔', city:'太原', stars:1, region:'太原',
    core:null,
    desc:'明代砖砌双塔，太原地标。一星简易图纸，适合入门复刻。',
    doc:'双塔名“宣文佛塔”，为明代砖构，是太原的城市象征。',
    layers:[
      { name:'台基', requires:[{part:'muzhu',count:2}], popup:{title:'夯土台基', text:'山西古建多筑夯土台基，既防潮又显威仪，是整座木构稳定的根基。'} },
      { name:'立柱', requires:[{part:'muzhu',count:3}], popup:{title:'立柱承重', text:'木柱把屋顶重量垂直传到台基，是“墙倒屋不塌”的关键。'} },
      { name:'横梁', requires:[{part:'hengliang',count:3}], popup:{title:'梁架体系', text:'横梁与立柱以榫卯咬合，形成柔性框架，可随地震轻微摇摆。'} },
      { name:'瓦面', requires:[{part:'wajian',count:4}], popup:{title:'青瓦屋面', text:'筒瓦与板瓦相扣，举折出檐，既排水又遮阳。'} },
    ]
  },
  {
    id:'pingyao', name:'平遥民居院落', city:'平遥', stars:2, region:'晋中',
    core:null,
    desc:'明清晋商民居四合院，二星进阶图纸。',
    doc:'平遥民居以四合院为主，砖券窑洞与木构厢房结合，体现晋中民居智慧。',
    layers:[
      { name:'台基', requires:[{part:'muzhu',count:2}], popup:{title:'院落台基', text:'四合院以青砖台基围合，中轴对称，长幼有序。'} },
      { name:'立柱', requires:[{part:'muzhu',count:4}], popup:{title:'木柱与砖券', text:'平遥多见“外木内砖”，厢房用木柱，正房用砖券窑洞。'} },
      { name:'格扇', requires:[{part:'geshan',count:3}], popup:{title:'格扇门窗', text:'晋商大院的格扇可拆卸，夏日卸下通风，冬日装上保暖。'} },
      { name:'横梁', requires:[{part:'hengliang',count:3}], popup:{title:'抬梁式梁架', text:'抬梁式构架以梁承重，空间开敞，适合起居。'} },
      { name:'瓦面', requires:[{part:'wajian',count:4}], popup:{title:'合瓦屋面', text:'平民院落用“合瓦”（阴阳瓦），等级低于皇家筒瓦。'} },
    ]
  },
  {
    id:'nanchai', name:'南禅寺大殿', city:'忻州五台', stars:3, region:'忻州',
    core:'core_nanchai',
    desc:'中国最古老木构，唐建中三年。三星高阶图纸。',
    doc:'南禅寺大殿为我国现存最古老木结构建筑，单檐歇山，规模虽小却唐风十足。',
    layers:[
      { name:'台基', requires:[{part:'muzhu',count:2}], popup:{title:'唐代台基', text:'低矮素平的台基，体现唐代古拙之风。'} },
      { name:'立柱', requires:[{part:'muzhu',count:4},{part:'zhisun',count:2}], popup:{title:'直榫立柱', text:'檐柱以直榫入础，柱身有“侧脚”“生起”，更显稳健。'} },
      { name:'斗拱', requires:[{part:'tang_dougong',count:3}], popup:{title:'唐代斗拱', text:'硕大的斗拱承托出檐，出跳深远，是唐构最醒目的标志。'} },
      { name:'横梁', requires:[{part:'hengliang',count:3},{part:'pingsun',count:2}], popup:{title:'梁架与平榫', text:'平梁、平榫连接槫枋，举折平缓，屋面舒展。'} },
      { name:'核心主梁', requires:[{part:'core_nanchai',count:1}], popup:{title:'脊槫主件', text:'脊槫（核心主件）锁住整座殿宇的轴线，缺它则殿不成形。'} },
      { name:'瓦面', requires:[{part:'wajian',count:4}], popup:{title:'青瓦歇山', text:'单檐歇山顶，戗脊舒展，唐韵悠长。'} },
    ]
  },
  {
    id:'foguang', name:'佛光寺东大殿', city:'忻州五台', stars:3, region:'忻州',
    core:'core_foguang',
    desc:'梁思成“中国第一国宝”，七间庑殿。三星高阶图纸。',
    doc:'佛光寺东大殿面阔七间、单檐庑殿，集唐代建筑、雕塑、壁画、题记“四绝”于一身。',
    layers:[
      { name:'台基', requires:[{part:'muzhu',count:3}], popup:{title:'高阶台基', text:'东大殿台基高敞，前设月台，气度恢宏。'} },
      { name:'立柱', requires:[{part:'muzhu',count:6},{part:'zhisun',count:3}], popup:{title:'七间列柱', text:'七间面阔需列柱成排，柱有侧脚生起，稳固而灵动。'} },
      { name:'斗拱', requires:[{part:'tang_dougong',count:5}], popup:{title:'七铺作斗拱', text:'柱头铺作达七铺作，出跳四跳，斗拱雄大如朵云。'} },
      { name:'横梁', requires:[{part:'hengliang',count:4},{part:'pingsun',count:3}], popup:{title:'抬梁草栿', text:'殿内用“草栿”减柱，空间阔大，梁架精简。'} },
      { name:'核心主梁', requires:[{part:'core_foguang',count:1}], popup:{title:'庑殿主梁', text:'核心主梁锁定七间庑殿的正脊与推山，是整殿灵魂。'} },
      { name:'瓦面', requires:[{part:'wajian',count:6}], popup:{title:'庑殿青瓦', text:'庑殿顶四面坡，等级至高，出檐如翼。'} },
    ]
  },
  {
    id:'muta', name:'应县木塔', city:'朔州', stars:5, region:'大同',
    core:'core_muta',
    desc:'世界最高纯木楼阁式塔，67.31米，明五暗四。五星史诗图纸。',
    doc:'应县木塔（佛宫寺释迦塔）高67.31米，纯木榫卯、无钉，54种斗拱，千年不倒。',
    layers:[
      { name:'台基', requires:[{part:'muzhu',count:4}], popup:{title:'砖石台基', text:'厚重的砖石台基为木塔提供稳定底盘。'} },
      { name:'底层立柱', requires:[{part:'muzhu',count:6},{part:'zhisun',count:3}], popup:{title:'双层套筒', text:'外柱环内柱，形成双层套筒框架，是抗侧力的基础。'} },
      { name:'暗层', requires:[{part:'muota_anchen',count:4}], popup:{title:'暗层斜撑', text:'暗层内以斜撑榫卯加固，像现代圈梁，约束塔身变形。'} },
      { name:'斗拱', requires:[{part:'liao_xiegong',count:6}], popup:{title:'54种斗拱', text:'全塔54种斗拱，逐层收分，既承重又耗能减震。'} },
      { name:'核心主件', requires:[{part:'core_muta',count:1}], popup:{title:'塔心柱主件', text:'塔心柱（核心主件）贯通暗层，是木塔“柔中带刚”的灵魂。'} },
      { name:'瓦面', requires:[{part:'wajian',count:8}], popup:{title:'攒尖塔顶', text:'塔顶攒尖覆以青瓦，铁刹直指苍穹。'} },
    ]
  },
  {
    id:'xuankong', name:'悬空寺', city:'大同浑源', stars:5, region:'大同',
    core:'core_xuankong',
    desc:'恒山峭壁上的三教合一奇观。五星史诗图纸。',
    doc:'悬空寺始建于北魏，悬于恒山金龙峡西壁，三教殿儒释道同室，巧借岩铆与悬臂梁。',
    layers:[
      { name:'岩铆基础', requires:[{part:'muzhu',count:4}], popup:{title:'横木插岩', text:'悬空寺以粗木插入岩石孔洞为基，借山体之力承重。'} },
      { name:'悬臂梁', requires:[{part:'muzhu',count:4},{part:'zhisun',count:2}], popup:{title:'悬臂出挑', text:'悬臂梁探出崖外，上铺楼板，形成“半插飞梁”的奇观。'} },
      { name:'立柱', requires:[{part:'muzhu',count:3}], popup:{title:'暗柱支顶', text:'下方立有看似承重的木柱，实则“平时不受力，震时方咬合”，巧夺天工。'} },
      { name:'横梁', requires:[{part:'hengliang',count:3}], popup:{title:'栈道梁架', text:'廊道以横梁相连，迂回曲折，如悬空楼阁。'} },
      { name:'核心主件', requires:[{part:'core_xuankong',count:1}], popup:{title:'三教主殿', text:'核心主件锁定三教殿轴线，儒释道同处一室。'} },
      { name:'瓦面', requires:[{part:'wajian',count:4}], popup:{title:'崖壁青瓦', text:'小青瓦覆于崖壁之上，远望如空中楼阁。'} },
    ]
  },
  {
    id:'qiao', name:'乔家大院', city:'晋中祁县', stars:5, region:'晋中',
    core:'core_qiao',
    desc:'“双喜”字形晋商大院建筑群。五星史诗图纸。',
    doc:'乔家大院为清代晋商宅院，整体呈“囍”字布局，砖木石三雕精美，院落6院。',
    layers:[
      { name:'院墙台基', requires:[{part:'muzhu',count:3}], popup:{title:'城堡式院墙', text:'乔家大院外围高墙深巷，兼具防御与私密。'} },
      { name:'立柱', requires:[{part:'muzhu',count:6},{part:'zhisun',count:3}], popup:{title:'厢房木柱', text:'各院厢房以木柱抬梁，规整对称。'} },
      { name:'格扇', requires:[{part:'geshan',count:6}], popup:{title:'精雕格扇', text:'全院格扇雕“葡萄”“冰裂”等纹样，寓意富贵绵长。'} },
      { name:'横梁', requires:[{part:'hengliang',count:5},{part:'pingsun',count:3}], popup:{title:'砖雕墀头', text:'墀头、影壁砖雕繁复，是晋商炫富亦炫文的载体。'} },
      { name:'核心主件', requires:[{part:'core_qiao',count:1}], popup:{title:'中轴主院', text:'核心主件锁住“双喜”中轴主院，统率六院。'} },
      { name:'瓦面', requires:[{part:'wajian',count:6}], popup:{title:'合瓦硬山', text:'大院多为硬山顶合瓦，规整森严，等级分明。'} },
    ]
  },
    {
      id:'jinci', name:'晋祠圣母殿', city:'太原', stars:2, region:'太原',
      core:null,
      desc:'晋祠主殿圣母殿，北宋木构，副阶周匝、重檐歇山。',
      doc:'晋祠圣母殿（北宋天圣年间）面阔七间、重檐歇山，前廊八根木雕盘龙柱为宋代原物，副阶周匝，是宋代建筑典范。',
      layers:[
        { name:'台基', requires:[{part:'muzhu',count:2}], popup:{title:'鱼沼飞梁', text:'晋祠以难老泉、宋代彩塑、周柏与圣母殿并称胜迹。'} },
        { name:'立柱', requires:[{part:'muzhu',count:4}], popup:{title:'盘龙木柱', text:'前廊八根木柱雕盘龙，为宋代原物，极为罕见。'} },
        { name:'横梁', requires:[{part:'hengliang',count:3}], popup:{title:'副阶周匝', text:'圣母殿副阶周匝（一圈回廊），扩大体量，气势恢宏。'} },
        { name:'瓦面', requires:[{part:'wajian',count:4}], popup:{title:'重檐歇山', text:'重檐歇山顶，出檐深远，宋风舒展。'} }
      ]
    }
  ];

/* ---------- 地区古建群（集齐解锁牌匾） ---------- */
const REGIONS = {
  '太原':   { name:'太原古建群',   buildings:['shuangta'] },
  '晋中':   { name:'晋中晋商大院群', buildings:['pingyao','qiao'] },
  '大同':   { name:'大同辽金古建群', buildings:['muta','xuankong'] },
};

/* ---------- 榫卯咬合判定数据 ----------
   每个“层角色”向上提供 out 接口、向下需要 in 接口；
   每个零件定义 bottom(带来的凸榫) / top(提供的卯眼)。
   接口不匹配则无法强行拼接（贴合真实榫卯严谨性）。
*/
const ROLE_JOINT = {
  '台基':{in:'GROUND',     out:'COL_TOP'},
  '立柱':{in:'COL_TOP',    out:'COL_TOP'},
  '暗层':{in:'COL_TOP',    out:'BEAM_TOP'},
  '格扇':{in:'COL_TOP',    out:'COL_TOP'},
  '横梁':{in:'BEAM_TENON', out:'BEAM_TOP'},
  '斗拱':{in:'BEAM_TENON', out:'DOU_TOP'},
  '核心':{in:'DOU_IN',     out:'DOU_TOP'},
  '瓦面':{in:'ROOF_BASE',  out:'ROOF'}
};
const PART_JOINT = {
  muzhu:        {bottom:'COL_TOP',    top:'COL_TOP'},
  hengliang:    {bottom:'BEAM_TENON', top:'BEAM_TOP'},
  zhisun:       {bottom:'TENON',      top:'MORTISE'},
  pingsun:      {bottom:'FLAT',       top:'FLAT'},
  wajian:       {bottom:'ROOF_BASE',  top:'ROOF'},
  tang_dougong: {bottom:'DOU_IN',     top:'DOU_TOP'},
  liao_xiegong: {bottom:'DOU_IN',     top:'DOU_TOP'},
  muota_anchen: {bottom:'BEAM_TENON', top:'BEAM_TOP'},
  geshan:       {bottom:'COL_TOP',    top:'ROOF'},
  core_nanchai: {bottom:'DOU_IN',     top:'DOU_TOP'},
  core_foguang: {bottom:'DOU_IN',     top:'DOU_TOP'},
  core_muta:    {bottom:'DOU_IN',     top:'DOU_TOP'},
  core_xuankong:{bottom:'DOU_IN',     top:'DOU_TOP'},
  core_qiao:    {bottom:'DOU_IN',     top:'DOU_TOP'}
};
/* 每层与上层的咬合科普（落在该层之上构件的连接原理） */
const JOINT_SCIENCE = {
  '立柱':'立柱以直榫入础，柱身有“侧脚”“生起”，把屋顶重量稳稳传到台基。',
  '横梁':'横梁两端的榫头插入柱顶卯眼，梁柱咬合形成“墙倒屋不塌”的柔性框架。',
  '暗层':'暗层以斜撑榫卯加固，像现代圈梁约束塔身，是抗震柔性的关键（应县木塔即明五暗四）。',
  '格扇':'格扇以榫卯可拆卸拼装，夏日卸下通风、冬日装上保暖。',
  '斗拱':'斗拱层层出跳、全为榫卯咬合，把屋檐重量传到立柱，又如弹簧般耗能减震（应县木塔“斗拱博物馆”即此理）。',
  '核心':'核心主梁锁死整座殿宇的轴线，没有它建筑便不成形——这也是 Boss 关限定掉落的原因。',
  '瓦面':'青瓦压在梁架之上，举折出檐，既排水遮阳，又把荷载均匀传下。'
};
