document.documentElement.classList.add('js');
// Reveal the first screen on the next frame even if a later step of this script fails.
requestAnimationFrame(() => document.documentElement.classList.add('is-loaded'));
// The archive and source registries are separate files; a failed download must not stop the case studies.
const catalogData = typeof portfolioCatalog !== 'undefined' ? portfolioCatalog : { labels: { en: {}, ar: {} }, items: [] };
const sourceData = typeof portfolioSources !== 'undefined' ? portfolioSources : {};

const copy = {
  en: {
    skip: 'Skip to content', navWork: 'Work', navLab: 'The lab', navAbout: 'About', navContact: 'Contact',
    heroEyebrow: 'BASED IN CAIRO, EGYPT',
    heroLine1: 'Abdelrahman', heroLine2: 'Hesham', heroRole: 'AI Engineer & Software Engineer',
    heroDescription: 'I build web experiences and AI tools, from training the model to the final interface.',
    exploreWork: 'View my work', portraitAlt: 'Portrait of Abdelrahman Hesham',
    workKicker: 'PORTFOLIO', workTitle: 'Selected work',
    workIntro: 'A few things I have designed, built, and shipped.',
    starType: 'LIVE E-COMMERCE', starTitleExtra: 'Bilingual storefront',
    starSummary: 'A bilingual car-accessories storefront with a responsive shopping flow, an admin dashboard, and visual editing for the team behind it.',
    viewStory: 'View the story', visitLive: 'Visit live site', interviewType: 'VOICE AI · LOCAL APP',
    interviewSummary: 'A private voice interview simulator and German conversation coach, with local speech models and feedback you can act on.',
    talentType: 'AI COURSE CAPSTONE',
    talentSummary: 'An explainable CV screening and candidate-ranking tool. Four models trained; one selected on validation data and tested separately.',
    deutscherType: 'LANGUAGE LEARNING PLATFORM', deutscherSummary: 'A German learning platform in development, with A1 lessons, progress and review features in the local codebase.', deutscherPreviewNote: 'A1 lesson · word practice',
    englishType: 'ENGLISH LEARNING TOOL', englishSummary: 'An offline practice app for grammar and sentence building, with guided examples and immediate feedback.',
    ic3Type: 'TWO-PART LEARNING SYSTEM', ic3Summary: 'Two coordinated learning apps: an in-class presentation for teachers and an interactive study experience for students.',
    fitnessType: 'FITNESS INTERFACES', fitnessTitle: 'Training, simplified.',
    fitnessSummary: 'A collection of workout-planning interfaces with clear session structure, exercise guidance, visual movement references, and Arabic/English support. Selected plans include 3bdo, Ahmed, and Doda.',
    builderType: 'UNIVERSITY GRADUATION PROJECT · AI COMPONENT', builderSummary: 'I was responsible for the AI component of Thalorix, from model orchestration and the generation pipeline to serving the engine through a RunPod endpoint.',
    builderPreviewNote: 'Conceptual diagram · not an app screenshot',
    estimatorType: 'OFFLINE DESKTOP SYSTEM', estimatorTitle: 'Quoting, without the wait.', estimatorSummary: 'A Windows quotation tool for aluminium products, with editable product catalogs, pricing rules, employee workflows, and administration. Business identity and price data are withheld.',
    estimatePreviewBadge: 'ANONYMIZED', estimatePreviewEyebrow: 'NEW ESTIMATE', estimatePreviewTitle: 'Product quote', estimatePreviewItem: 'Product catalog', estimatePreviewRules: 'Admin pricing rules', estimatePreviewTotal: 'QUOTE READY',
    fitnessPreviewNote: 'Selected plans: 3bdo · Ahmed · Doda', labKicker: 'DATA & MACHINE LEARNING', labTitle: 'From data to decisions.',
    labIntro: 'Explore my data analysis, Power BI reports, model-training projects, and software experiments.',
    dataCourseLabel: 'DATA ANALYSIS', mlCourseLabel: 'MACHINE LEARNING',
    discussWork: 'Discuss a project', labPanelLabel: 'A PRACTICAL PROCESS', stepOneTitle: 'Understand the data',
    stepOneText: 'Cleaning, preprocessing, Pandas exploration, and visual analysis.', stepTwoTitle: 'Train & compare',
    stepTwoText: 'Classical models, neural-network exercises, and a held-out validation set.', stepThreeTitle: 'Test & explain',
    stepThreeText: 'Choose a model on validation performance; report results on separate test data.', labFoot: 'TALENTMATCH CAPSTONE',
    modelsCompared: 'models compared', aboutKicker: 'A LITTLE ABOUT ME', aboutTitle: 'Software. AI.\nA curious mind.',
    aboutParagraph: 'I’m Abdelrahman, a Computer Science graduate. My work spans machine learning, API integration, web and desktop development, and data analysis. I use Codex and Claude Code to support development, with code review and testing throughout. I learn new tools quickly and enjoy turning unfamiliar problems into clear, usable solutions.',
    educationLabel: 'EDUCATION', educationValue: 'BSc in Computer Science\nCairo Higher Institute of Engineering & Computer Science',
    focusLabel: 'FOCUS', focusValue: 'Python · Web apps · Machine learning · Product thinking',
    contactKicker: 'GET IN TOUCH', contactTitle: 'Let’s build something.',
    emailMe: 'Email me', callMe: 'Call me', backTop: 'Back to top',
    closeCase: 'Close project details', galleryPrev: 'Previous image', galleryNext: 'Next image',
    liveLink: 'Open live website', privateBuild: 'Local / private build', privacyNote: 'First names only; private measurements stay hidden.',
    facts: { challenge: 'The brief', built: 'What I built', evidence: 'What you can see', method: 'Method', result: 'Result', delivery: 'Delivery', scope: 'Scope', privacy: 'Privacy',
      problem: 'Problem', role: 'My part', decision: 'Key decision', verification: 'How it was checked', results: 'Results', limits: 'Limits', next: 'Next step',
      models: 'Models', pipeline: 'Pipeline', serving: 'Serving', stack: 'Stack', variants: 'Builds' }
  },
  ar: {
    skip: 'تجاوز إلى المحتوى', navWork: 'الأعمال', navLab: 'المختبر', navAbout: 'عني', navContact: 'تواصل',
    heroEyebrow: 'القاهرة، مصر',
    heroLine1: 'عبدالرحمن', heroLine2: 'هشام', heroRole: 'مطور برمجيات وذكاء اصطناعي',
    heroDescription: 'أبني تجارب ويب وأدوات ذكاء اصطناعي، من تدريب النموذج إلى الواجهة النهائية.',
    exploreWork: 'شاهد أعمالي', portraitAlt: 'صورة شخصية لعبدالرحمن هشام',
    workKicker: 'معرض الأعمال', workTitle: 'أعمال مختارة',
    workIntro: 'نماذج من المنتجات والأنظمة التي صممتها وطورتها.',
    starType: 'متجر إلكتروني منشور', starTitleExtra: 'متجر بالعربية والإنجليزية',
    starSummary: 'متجر لإكسسوارات السيارات بالعربية والإنجليزية، مع رحلة شراء متجاوبة ولوحة تحكم ومحرر مرئي للمحتوى.',
    viewStory: 'تفاصيل العمل', visitLive: 'افتح الموقع', interviewType: 'ذكاء اصطناعي صوتي · تطبيق محلي',
    interviewSummary: 'محاكي مقابلات ومدرّب محادثة ألمانية بنماذج صوتية محلية وتقييم يساعد المستخدم على التحسن.',
    talentType: 'مشروع تخرج كورس الذكاء الاصطناعي',
    talentSummary: 'أداة لتصنيف السير الذاتية وترتيب المرشحين مع تفسير النتائج. درّبت أربعة نماذج واخترت الأفضل على بيانات التحقق ثم اختبرته مستقلاً.',
    deutscherType: 'منصة لتعلّم اللغات', deutscherSummary: 'منصة لتعلّم الألمانية، تضم دورة A1 ومتابعة التقدم وأدوات للمراجعة وحفظ الدروس.', deutscherPreviewNote: 'درس A1 · تدريب على الكلمات',
    englishType: 'أداة لتعلّم الإنجليزية', englishSummary: 'تطبيق تدريب يعمل دون إنترنت للقواعد وبناء الجمل، مع أمثلة إرشادية وتصحيح فوري.',
    ic3Type: 'نظام تعلّم من جزأين', ic3Summary: 'تطبيقان متكاملان: عرض تفاعلي للمدرس داخل الفصل، وتجربة تعلم للطالب بعد الحصة.',
    fitnessType: 'واجهات لياقة بدنية', fitnessTitle: 'تمرينك، ببساطة.',
    fitnessSummary: 'مجموعة واجهات لتنظيم جلسات التدريب وشرح التمارين وعرض الحركات، مع دعم العربية والإنجليزية. تشمل النماذج خطط عبده وأحمد ودودا.',
    builderType: 'مشروع تخرج جامعي · مكوّن الذكاء الاصطناعي', builderSummary: 'كنت مسؤولًا عن مكوّن الذكاء الاصطناعي في Thalorix، من تنظيم النماذج وخط التوليد حتى تشغيله عبر RunPod.',
    builderPreviewNote: 'رسم توضيحي للمراحل · ليس صورة فعلية للتطبيق',
    estimatorType: 'تطبيق مكتبي يعمل دون إنترنت', estimatorTitle: 'تسعير أسرع، بخطوات أوضح.', estimatorSummary: 'تطبيق ويندوز لإعداد عروض أسعار منتجات الألومنيوم، مع كتالوج قابل للتعديل وقواعد تسعير وصلاحيات للموظفين والإدارة. أخفيت اسم الشركة وبيانات الأسعار.',
    estimatePreviewBadge: 'بيانات مجهولة', estimatePreviewEyebrow: 'عرض سعر جديد', estimatePreviewTitle: 'تسعير منتج', estimatePreviewItem: 'كتالوج المنتجات', estimatePreviewRules: 'قواعد التسعير', estimatePreviewTotal: 'العرض جاهز',
    fitnessPreviewNote: 'نماذج خطط: عبده · أحمد · دودا', labKicker: 'البيانات وتعلّم الآلة', labTitle: 'من البيانات إلى القرار.',
    labIntro: 'استكشف مشاريع تحليل البيانات وتقارير Power BI وتدريب النماذج، مع تجارب برمجية أخرى.',
    dataCourseLabel: 'تحليل البيانات', mlCourseLabel: 'تعلّم الآلة',
    discussWork: 'لنتحدث عن مشروع', labPanelLabel: 'منهج عملي', stepOneTitle: 'فهم البيانات',
    stepOneText: 'تنظيفها وتجهيزها واستكشافها بـ Pandas والتحليل المرئي.', stepTwoTitle: 'التدريب والمقارنة',
    stepTwoText: 'نماذج تقليدية وتجارب شبكات عصبية ومجموعة تحقق منفصلة.', stepThreeTitle: 'الاختبار والتفسير',
    stepThreeText: 'اختيار النموذج على أداء التحقق، ثم عرض النتيجة على بيانات اختبار منفصلة.', labFoot: 'مشروع TALENTMATCH',
    modelsCompared: 'نماذج تمت مقارنتها', aboutKicker: 'نبذة عني', aboutTitle: 'برمجيات وذكاء اصطناعي.\nوفضول للتجربة.',
    aboutParagraph: 'أنا عبدالرحمن، خريج علوم الحاسب من القاهرة. أعمل بين البرمجة والذكاء الاصطناعي: أصمم واجهات واضحة، وأربط الخدمات، وأختبر ما إذا كان النموذج يساعد الشخص الذي يستخدمه فعلاً.',
    educationLabel: 'التعليم', educationValue: 'بكالوريوس علوم الحاسب\nمعهد القاهرة العالي للهندسة وعلوم الحاسب',
    focusLabel: 'مجالات العمل', focusValue: 'Python · تطبيقات ويب · تعلم الآلة · تصميم المنتج',
    contactKicker: 'تواصل معي', contactTitle: 'لنبنِ شيئًا معًا.',
    emailMe: 'راسلني', callMe: 'اتصل بي', backTop: 'العودة للأعلى',
    closeCase: 'إغلاق تفاصيل العمل', galleryPrev: 'الصورة السابقة', galleryNext: 'الصورة التالية',
    liveLink: 'افتح الموقع المباشر', privateBuild: 'تطبيق محلي / خاص', privacyNote: 'الأسماء الأولى فقط؛ القياسات الخاصة مخفية.',
    facts: { challenge: 'المطلوب', built: 'ما نفذته', evidence: 'ما يمكنك مشاهدته', method: 'المنهج', result: 'النتيجة', delivery: 'التنفيذ', scope: 'النطاق', privacy: 'الخصوصية' }
  }
};

// Case studies. English-only site: the `ar` fields mirror the English text so the archived data shape still works.
const both = text => ({ en: text, ar: text });
const facts = rows => ({ en: rows, ar: rows });
const shot = (src, alt, caption) => [src, alt, alt, 'result', caption || alt];
const projects = {
  talent: {
    kicker: both('AI COURSE CAPSTONE · CASE STUDY'),
    title: both('TalentMatch'),
    lead: both('Explainable CV screening and candidate ranking. It suggests a CV’s job field and ranks candidates for a job, showing the matching skills and gaps. Classification and ranking use separate evaluation datasets.'),
    facts: facts([
      ['problem', 'Screening many CVs by hand is slow and inconsistent. TalentMatch gives a reviewer a suggested field per CV and a ranked shortlist per job, with the matching skills and gaps visible.'],
      ['role', 'AI course capstone. Shown here: the data audit and cleaning, the classifier comparison, the ranking score, a Streamlit app with FastAPI services, and a Power BI report.'],
      ['decision', 'For classification, duplicate CVs and category names in headings were removed; keeping the heading shortcut would have inflated validation macro-F1 from 0.617 to 0.657. For ranking, 9,516 retained candidate–job pairs cover 343 candidates, split by candidate (240 / 51 / 52) to prevent the same person appearing in training and test. A column that copied job text was excluded.'],
      ['verification', 'The classifier uses 2,468 CVs after checks: 1,727 training, 370 validation and 371 test. Four classifiers were compared on validation macro-F1: Linear SVM 0.617, Random Forest 0.590, Logistic Regression 0.579, Naive Bayes 0.487. The calibrated Linear SVM was then evaluated on the separate test set. The saved-model app passes 48 local tests, including upload encodings and notebook-to-app agreement.'],
      ['results', 'Test accuracy 70.1% and macro-F1 0.646 (5-fold CV on development data 0.604 ± 0.017). Ranking on 52 held-out candidates × 28 jobs: NDCG@10 0.912 against 0.873 for TF-IDF and 0.779 for random order.'],
      ['limits', 'Ranking labels are the dataset’s supplied match scores — undocumented and noisy — so NDCG measures agreement with those labels, not hiring success. The combined score leads on NDCG@10, but single signals win Precision@5 (skills) and Spearman (embeddings). Keyword stuffing can still raise a score.'],
      ['next', 'Collect documented relevance judgements and add a keyword-stuffing check before the ranking supports real decisions.']
    ]),
    links: [
      { href: 'assets/evidence/talentmatch/technical-report.md', label: 'Technical report' },
      { href: 'assets/evidence/talentmatch/classification-metrics.json', label: 'Saved classification metrics' },
      { href: 'assets/evidence/talentmatch/ranking-metrics.json', label: 'Saved ranking metrics' }
    ],
    images: [
      shot('assets/talentmatch/01-cv-classification.png', 'TalentMatch CV classification screen'),
      shot('assets/talentmatch/02-ranked-candidates.png', 'TalentMatch ranked candidates for a job'),
      shot('assets/talentmatch/06-training-model-selection.png', 'Training and model comparison results'),
      shot('assets/coursework/talent-skills.png', 'TalentMatch skills supply versus demand'),
      shot('assets/coursework/talent-quality.png', 'TalentMatch missing values and cleaning decisions')
    ]
  },
  interview: {
    kicker: both('VOICE AI · LOCAL APP · CASE STUDY'),
    title: both('Interview Desk & Jonas'),
    lead: both('A voice interview simulator and a German conversation coach. Speech recognition, a language model and speech synthesis run on the user’s own machine, in one practice loop that ends with written feedback.'),
    facts: facts([
      ['problem', 'Practising interviews or German conversation usually needs another person, and recordings of your voice are personal.'],
      ['role', 'Built the interview flow, the German coach (Jonas), the assessment screens and the PDF feedback report.'],
      ['decision', 'Local models instead of a cloud API — faster-whisper for speech to text, Gemma through llama.cpp for the dialogue, Piper for the reply — trading speed on weaker laptops for privacy and no per-minute cost.'],
      ['verification', 'Existing screens are from the local app. Twelve dependency-light tests pass for the request guard and feedback handling; unexpected Host/Origin requests are rejected, and the no-model fallback is clearly labelled as a completion baseline. No recordings or microphone were used in this review.'],
      ['limits', 'Response time and hardware needs were not measured, and feedback quality has not been scored against a rubric. The request guard does not authenticate other software on the same machine. Source fixes need a new installer build before distribution.'],
      ['next', 'Measure turn latency on a reference laptop and rate feedback against a short rubric with sample answers.']
    ]),
    images: [
      shot('assets/interview/04-lobby-questions.png', 'Interview Desk question selection'),
      shot('assets/interview/03-jonas-coach.png', 'Jonas German conversation coach'),
      shot('assets/interview/05-assessment.png', 'Interview assessment report')
    ]
  },
  builder: {
    kicker: both('UNIVERSITY GRADUATION PROJECT · AI COMPONENT'),
    title: both('Thalorix — AI Generation Engine'),
    lead: both('I was responsible for the AI component of Thalorix, from model orchestration and the generation pipeline to serving the engine through a RunPod endpoint.'),
    facts: facts([
      ['role', 'AI Engineer — AI component. Scope ends at the RunPod endpoint: the engine takes a request and hands back a reply, a project manifest and file-retrieval paths. Files the engine generates are its output, not hand-written app code.'],
      ['problem', 'Turn a plain-language app brief into a structured web project, then keep changing it in conversation instead of starting over.'],
      ['models', 'Role-specialised Qwen2.5 models: 7B for conversation, 14B for planning (architect) and technical Q&A, a Coder model for files, plus optional remote repair and chat models. Source defaults differ — the registry and local loader use Coder-14B, the RunPod handler defaults to Coder-32B — and deployments can override them with environment settings that were not inspected.'],
      ['decision', 'The local loader uses 4-bit NF4 with double quantisation and bfloat16 compute. The worker is configured with a 20 GiB GPU memory budget; actual VRAM use and inference were not benchmarked. Files are generated in dependency tiers — types and data, then App and state, then components, then tests — and each tier sees a snapshot of the files already written.'],
      ['pipeline', 'A request becomes a UserIntent; the architect writes a plan with file and API contracts before any code; static checks, required-file and dependency checks and a repair step follow. Edit and debug flows patch the existing project instead of regenerating it.'],
      ['serving', 'RunPod worker: handler(event) reads input.message, session_id and optional attachments and session_context, restores the session, runs the pipeline and returns { ok, result } — or { ok: false, error }. The linked contract is derived from the source, not captured from a live endpoint.'],
      ['verification', '20 local tests cover the handler boundary, planning names, storage paths and session-aware cache reuse; models and endpoints are stubbed. The pipeline helper smoke test also passes 11 of 11 assertions. These source fixes were not deployed; no GPU generation, live endpoint, latency or success-rate benchmark was run.'],
      ['limits', 'Image attachments are accepted, but no vision model is wired by default, so image understanding is not claimed. The RAG modules are empty and fine-tuning is future work — no trained models are claimed. Prototype maturity.'],
      ['next', 'Wire a vision client behind a clear “unavailable” message, and save one generate-then-edit run with its check results as a shareable sample.']
    ]),
    links: [{ href: 'assets/evidence/thalorix/runpod-contract.json', label: 'Endpoint contract (from source)' }],
    images: []
  },
  star: {
    kicker: both('LIVE E-COMMERCE · CASE STUDY'),
    title: both('STAR storefront'),
    lead: both('A bilingual car-accessories store designed for shoppers and the people running it. The live site brings together the storefront, ordering flow, product management, and a visual content editor.'),
    facts: facts([
      ['problem', 'A store that works in Arabic and English and that the team can update without editing code.'],
      ['role', 'Built the responsive storefront, product and order flows, the admin dashboard and the visual editor.'],
      ['decision', 'Content and products are edited through an admin dashboard and a visual editor, so routine changes never need a developer.'],
      ['verification', 'Existing storefront/editor screenshots and a public site link. Ten local tests exercise the real Worker router against a synthetic SQLite stand-in for D1, including authoritative product prices, promo rules, rate limits and 72 browser/server pricing comparisons. No live orders were placed.'],
      ['limits', 'The checkout repair is saved in source and has not been deployed. Concurrency limits on promo-code usage and stock reservation still need work; the local suite is not a live checkout or deployment test.']
    ]),
    images: [
      shot('assets/star/01-homepage.png', 'STAR storefront home page'),
      shot('assets/star/03-admin-visual-editor.png', 'STAR visual editor and admin interface'),
      shot('assets/star/02-mobile-products.png', 'STAR products on a mobile screen')
    ],
    link: 'https://www.starshop97.com'
  },
  estimator: {
    kicker: both('OFFLINE DESKTOP APP · ANONYMIZED'),
    title: both('Aluminium quotation app'),
    lead: both('A Windows app for preparing aluminium window and door quotations from an editable catalogue. An admin maintains products and prices, while staff prepare and export estimates offline.'),
    facts: facts([
      ['built', 'Estimate screen (product, series, width × height, glass, colour), quotation cart with PDF export, quotation history, and an admin area for markups, profiles, glass, products, users, price-list import with a review step, and backup.'],
      ['decision', 'An editable catalogue feeds a deterministic pricing engine with a restricted formula evaluator. Reference-workbook tests check the calculations; proprietary prices and calculation rules stay private.'],
      ['verification', '14 local tests pass, including golden pricing-engine checks and mocked Electron permission tests. Non-interface settings now require admin rights in the main process. No private database was used; the installed delivery has not been rebuilt in this review.'],
      ['stack', 'Electron · React · TypeScript · SQLite (libSQL) · Prisma · Vitest. Fully offline.'],
      ['privacy', 'Genuine captures from the installed app. Company name and logo, prices, supplier series, glass brand, quote numbers and customer names are covered with solid blocks.']
    ]),
    images: [
      shot('assets/quotation/01-estimate.png', 'New estimate: product, width × height, glass and colour', 'New estimate — product, width × height, glass and colour (Arabic interface; private details covered)'),
      shot('assets/quotation/02-quotation-cart.png', 'Quotation cart before saving or exporting a PDF', 'Quotation cart, ready to save or export as PDF'),
      shot('assets/quotation/03-quotation-history.png', 'Saved quotation history', 'Saved quotations — numbers, customers and totals covered'),
      shot('assets/quotation/04-admin-overview.png', 'Admin overview with catalog counts', 'Admin overview: products, series, materials, glass and accessories'),
      shot('assets/quotation/06-price-list-import.png', 'Price-list import with a review step', 'Excel price-list import, reviewed before it reaches the database')
    ]
  },
  fitness: {
    kicker: both('TRAINING INTERFACES · FOUR LIVE PROGRAMS'),
    status: both('Choose a live program below. Home mobility is shown through local project evidence.'),
    title: both('Training interfaces'),
    lead: both('One approach applied to five workout and mobility builds: a clear week, readable exercise cards and Arabic/English layouts. They are grouped here as one project because they share the same structure.'),
    facts: facts([
      ['variants', '3bdo · 7-day program — Ahmed · gym plan with a nutrition guide — Doda · training with warm-up and stretching routines — FORM · push / pull / legs — Home mobility · a gentle seated routine (two builds of the same program).'],
      ['built', 'React, TypeScript and Vite; right-to-left and left-to-right layouts with a language switch, day navigation, expandable exercise cards and routine media.'],
      ['evidence', 'Source excerpts from four builds and project-generated home-mobility illustrations. Five installed variants pass TypeScript and production builds; 25 pure checks exercise optional storage and malformed progress recovery. The alternate mobility build lacks local dependencies and was not built.'],
      ['delivery', '3bdo, Ahmed, Doda and FORM have existing Vercel deployments. Home mobility remains a local build; no public deployment is claimed for it.'],
      ['privacy', 'The original source repositories remain private. This portfolio shows source excerpts and project-generated illustrations without reproducing personal measurements or health notes. Existing program sites open separately.']
    ]),
    links: [
      { href: 'https://3bdo-plan.vercel.app', label: '3bdo — live program' },
      { href: 'https://ahmed-gym-plan.vercel.app', label: 'Ahmed — live program' },
      { href: 'https://doda-plan.vercel.app', label: 'Doda — live program' },
      { href: 'https://ppl-workout-app.vercel.app', label: 'FORM — live program' },
      { href: 'assets/code/fitness.png', label: '3bdo — source evidence' },
      { href: 'assets/code/fitness-ahmed.png', label: 'Ahmed — source evidence' },
      { href: 'assets/code/fitness-doda.png', label: 'Doda — source evidence' },
      { href: 'assets/code/fitness-form.png', label: 'FORM — source evidence' },
      { href: 'assets/fitness/home-mobility-illustrations.png', label: 'Home mobility — illustrations' }
    ],
    images: [
      shot('assets/fitness/home-mobility-illustrations.png', 'Seven seated movement illustrations generated by the home-mobility build', 'Home mobility — illustrations generated by the project’s own Python script')
    ]
  },
  deutscher: {
    kicker: both('GERMAN LEARNING PLATFORM · IN DEVELOPMENT'),
    title: both('Deutscher'),
    lead: both('A German learning platform in development. The local codebase includes A1 lesson flows, learner progress, review and saved items; full learning-product deployment is not claimed here.'),
    facts: facts([
      ['built', 'A lesson-based learning experience with progress tracking, review, and saved items.'],
      ['verification', 'A read-only local audit ran 950 tests: 887 passed, 58 failed and 5 were skipped. All 58 failures are exact-source hash checks affected by Windows line endings; an independent comparison found the expected LF content. The suite is not reported as fully passing.'],
      ['delivery', 'Modular Next.js application with Cloudflare deployment tooling. The learning app remains in development; this review made no lesson, authentication or deployment changes.'],
      ['scope', 'Development-stage product. The preview here is a drawn concept, not a captured application screen. The project website is separate from evidence of the local learning features.']
    ]),
    images: [], links: [{ href: 'https://deutscherapp.com', label: 'Project website' }]
  }
};

catalogData.labels.en.prototypeStatus = 'Prototype';
catalogData.labels.ar.prototypeStatus = 'نموذج أولي';
for (const item of catalogData.items) {
  const statusKey = item.status === 'prototype' ? 'prototypeStatus' : item.status;
  projects[item.id] = {
    title: item.title, lead: item.summary,
    kicker: { en: catalogData.labels.en[item.category], ar: catalogData.labels.ar[item.category] },
    facts: Object.fromEntries(['en', 'ar'].map(lang => [lang, [
      ['method', item.method[lang]],
      ['delivery', item.tools.join(' · ')],
      ['artifacts', item.artifacts.join(' · ')],
      ...(item.images.length ? [['evidence', item.category === 'powerbi' ? (lang === 'ar' ? 'صفحات محفوظة من تقرير Power BI.' : 'Saved pages from the Power BI report.') : catalogData.labels[lang].chartLabel]] : []),
      ['scope', catalogData.labels[lang][statusKey]]
    ]])),
    images: item.images, links: item.links || [], artifactNames: item.artifacts, tools: item.tools, statusKey: item.status,
    status: { en: catalogData.labels.en[statusKey], ar: catalogData.labels.ar[statusKey] }
  };
}
// Public source links are added after both selected and archived cases exist.
// Private project source remains private; its case evidence stays available here.
const publicSourceRepositories = {
  "talent": "https://github.com/AbdElrhman-Hesham/talentmatch",
  "talent-bi": "https://github.com/AbdElrhman-Hesham/talentmatch",
  "interview": "https://github.com/AbdElrhman-Hesham/interview-desk-jonas",
  "builder": "https://github.com/AbdElrhman-Hesham/thalorix-ai-engine",
  "star": "https://github.com/AbdElrhman-Hesham/star-storefront",
  "ic3": "https://github.com/AbdElrhman-Hesham/ic3-spark"
};
for (const [key, href] of Object.entries(publicSourceRepositories)) {
  if (projects[key]) {
    projects[key].links = [...(projects[key].links || []), { href, label: 'Source on GitHub' }];
  }
}

copy.en.facts.artifacts = 'Work files';
copy.ar.facts.artifacts = 'ملفات العمل';

for (const [key, images] of Object.entries(sourceData)) {
  if (projects[key]) projects[key].images.push(...images);
}
Object.assign(copy.en, { searchWork: 'Find a project', galleryHint: 'Results, interfaces, and the code behind them.', openImage: 'Full resolution', zoomImage: 'Zoom image', fitImage: 'Fit image', loadingImage: 'Loading image…', resultsTab: 'Results & interface', codeTab: 'Source code', imageLabel: 'Project image', noMatches: 'No matching projects', clearSearch: 'Clear search', heroEyebrow: 'Cairo, Egypt' });
Object.assign(copy.ar, { searchWork: 'ابحث عن عمل', galleryHint: 'النتائج والواجهات والكود وراءها.', openImage: 'الدقة الأصلية', zoomImage: 'تكبير الصورة', fitImage: 'احتواء الصورة', loadingImage: 'تحميل الصورة…', resultsTab: 'النتائج والواجهة', codeTab: 'الكود', imageLabel: 'صورة من العمل', noMatches: 'لا توجد أعمال مطابقة', clearSearch: 'مسح البحث', heroEyebrow: 'القاهرة، مصر' });
// Reference-redesign copy (owner-chosen reference world). Overrides the base copy above.
Object.assign(copy.en, {
  navAbout: 'About', navWork: 'Work', navContact: 'Contact',
  heroHello: 'Hello! I’m', heroFirst: 'Abdelrahman', heroLast: 'Hesham',
  heroRoles: ['AI Engineer', 'Software Engineer', 'Data Analyst'], heroRolesText: 'AI Engineer, Software Engineer and Data Analyst',
  heroCta: 'Get in touch', portraitAlt: 'Portrait of Abdelrahman Hesham', viewStory: 'Open the project',
  aboutTitleA: 'About', aboutTitleB: 'me',
  aboutStatement: 'I’m Abdelrahman Hesham, an AI engineer and software engineer. I build practical tools that turn data and ideas into usable applications.',
  aboutParagraph: 'My work spans machine learning, API integration, web and desktop development, and data analysis. I use Codex and Claude Code to support development, with code review and testing throughout. I learn new tools quickly and enjoy turning unfamiliar problems into clear, usable solutions.',
  educationLabel: 'Education', educationValue: 'BSc in Computer Science, Cairo Higher Institute of Engineering & Computer Science',
  basedLabel: 'Based in', basedValue: 'Cairo, Egypt', languagesLabel: 'Languages', languagesValue: 'Arabic · English · German',
  doTitleA: 'What', doTitleB: 'I do',
  doWebTitle: 'Web products', doWebText: 'Bilingual storefronts, learning platforms and dashboards that a team can update without touching code.',
  doAiTitle: 'AI engineering', doAiText: 'Explainable CV screening, a local voice pipeline, and the AI engine of my university graduation project — served through a RunPod endpoint.',
  doDataTitle: 'Data analysis & machine learning', doDataText: 'Cleaning, exploratory analysis and model comparison, with validation kept separate from the final test.',
  doDataStop: 'Data analysis', doMlStop: 'Machine learning',
  doBiTitle: 'Power BI reports', doBiText: 'Report pages and data models that turn CSV sources into overviews, comparisons and data-quality checks.', doLaptopStop: 'Laptop pricing',
  doToolsTitle: 'Learning & business tools', doToolsText: 'Offline practice apps, workout planners and a desktop quotation system.',
  englishShort: 'English Coach', doQuoteStop: 'Quotation app', doFitStop: 'Training plans',
  workTitleA: 'Selected', workTitleB: 'work', workIntro: 'Seven projects. Four case studies lead with the problem, my contribution, key decisions and evidence. Three supporting builds follow; smaller experiments live in the learning archive.',
  railPrev: 'Previous projects', railNext: 'Next projects', railLabel: 'Selected projects',
  starTitleExtra: 'Bilingual car-accessories store', talentSub: 'Explainable CV screening & ranking', interviewSub: 'Private voice AI for interview practice',
  talentAcc: 'Test accuracy', talentF1: 'Test macro-F1', talentNdcg: 'Ranking NDCG@10',
  statusLive: 'Live', statusPilot: 'In development', statusCapstone: 'AI course capstone', statusLocal: 'Local app', statusSample: 'Sample data', statusPrototype: 'Prototype', statusDesktop: 'Offline desktop',
  englishName: 'English Thinking Coach', deutscherPreviewNote: 'Drawn preview · A1 word practice',
  fitnessTitle: 'Training interfaces', fitnessSummary: 'Five workout and mobility builds with day navigation, exercise cards and Arabic/English layouts. Four programs are available live.',
  estimatorTitle: 'Quotation desktop app',
  labTitleA: 'Data', labTitleB: 'lab', labIntro: 'Data analysis, Power BI reports, model training and software experiments — each with saved results or source code.',
  legendLabel: 'Scope:',
  stackTitleA: 'Tech', stackTitleB: 'stack', stackIntro: 'Tools used in the projects on this page.',
  stackData: 'Data & analysis', stackMl: 'Machine learning & AI', stackWeb: 'Web & apps', stackBi: 'Reporting',
  contactTitleA: 'Let’s build', contactTitleB: 'something.', contactIntro: 'Tell me about the product, the data or the report you need.',
  emailLabel: 'Email', phoneLabel: 'Phone', linkedinValue: 'Abdelrahman Hesham', emailMe: 'Email me', callMe: 'Call me',
  footerCity: 'Cairo, Egypt'
});
Object.assign(copy.ar, {
  navAbout: 'عني', navWork: 'الأعمال', navContact: 'تواصل',
  heroHello: 'مرحبًا! أنا', heroFirst: 'عبدالرحمن', heroLast: 'هشام', heroBased: 'من القاهرة',
  heroRoles: ['مطور برمجيات', 'مطور ذكاء اصطناعي', 'محلل بيانات'], heroRolesText: 'مطور برمجيات ومطور ذكاء اصطناعي ومحلل بيانات',
  heroCta: 'تواصل معي', portraitAlt: 'صورة شخصية لعبدالرحمن هشام', viewStory: 'افتح المشروع',
  aboutTitleA: 'من', aboutTitleB: 'أنا',
  aboutStatement: 'أنا خريج علوم حاسب من القاهرة، أعمل على المسار كاملًا: تنظيف البيانات، وتدريب النموذج والتحقق منه، وبناء التقرير، ثم تسليم الشاشة التي يستخدمها الناس فعلًا.',
  aboutParagraph: 'أعمل بين البرمجة والذكاء الاصطناعي: أصمم واجهات واضحة، وأربط الخدمات، وأختبر ما إذا كان النموذج يساعد الشخص الذي يستخدمه فعلًا.',
  educationLabel: 'التعليم', educationValue: 'بكالوريوس علوم الحاسب، معهد القاهرة العالي للهندسة وعلوم الحاسب',
  basedLabel: 'المدينة', basedValue: 'القاهرة، مصر', languagesLabel: 'اللغات', languagesValue: 'العربية · الإنجليزية',
  doTitleA: 'ماذا', doTitleB: 'أقدّم',
  doWebTitle: 'منتجات ويب', doWebText: 'متاجر ثنائية اللغة ومنصات تعليمية ولوحات تحكم يحدّثها الفريق دون تعديل الكود.',
  doAiTitle: 'هندسة الذكاء الاصطناعي', doAiText: 'فرز السير الذاتية مع تفسير النتائج، ومعالجة صوتية محلية، ومكوّن الذكاء الاصطناعي في مشروع التخرج الجامعي عبر RunPod.',
  doDataTitle: 'تحليل البيانات وتعلّم الآلة', doDataText: 'تنظيف البيانات واستكشافها ومقارنة النماذج، مع فصل بيانات التحقق عن الاختبار النهائي.',
  doDataStop: 'تحليل البيانات', doMlStop: 'تعلّم الآلة',
  doBiTitle: 'تقارير Power BI', doBiText: 'صفحات تقارير ونماذج بيانات تحوّل ملفات CSV إلى ملخصات ومقارنات وفحص لجودة البيانات.', doLaptopStop: 'أسعار اللابتوبات',
  doToolsTitle: 'أدوات تعليمية وعملية', doToolsText: 'تطبيقات تدريب تعمل دون إنترنت، ومخططات تمارين، ونظام تسعير مكتبي.',
  englishShort: 'مدرّب الإنجليزية', doQuoteStop: 'تطبيق التسعير', doFitStop: 'خطط التدريب',
  workTitleA: 'أعمال', workTitleB: 'مختارة', workIntro: 'ثمانية مشاريع: أربع دراسات حالة ثم أربعة أعمال داعمة.',
  railPrev: 'المشاريع السابقة', railNext: 'المشاريع التالية', railLabel: 'أعمال مختارة',
  starTitleExtra: 'متجر إكسسوارات سيارات بلغتين', talentSub: 'فرز وترتيب السير الذاتية مع تفسير النتائج', interviewSub: 'ذكاء اصطناعي صوتي خاص للتدرب على المقابلات',
  talentAcc: 'دقة الاختبار', talentF1: 'Macro-F1 للاختبار', talentNdcg: 'ترتيب NDCG@10',
  statusLive: 'منشور', statusPilot: 'نسخة تجريبية منشورة', statusCapstone: 'مشروع تخرج كورس الذكاء الاصطناعي', statusLocal: 'تطبيق محلي', statusSample: 'بيانات تجريبية', statusPrototype: 'نموذج أولي', statusDesktop: 'تطبيق مكتبي',
  englishName: 'مدرّب التفكير بالإنجليزية', deutscherPreviewNote: 'رسم توضيحي · تدريب كلمات A1',
  fitnessTitle: 'واجهات تنظيم التدريب', fitnessSummary: 'واجهات لتنظيم جلسات التدريب وشرح التمارين مع دعم العربية والإنجليزية. البيانات الخاصة بالخطط غير معروضة.',
  estimatorTitle: 'تطبيق التسعير المكتبي',
  labTitleA: 'مختبر', labTitleB: 'البيانات', labIntro: 'تحليل بيانات وتقارير Power BI وتدريب نماذج وتجارب برمجية — لكل منها نتائج محفوظة أو كود.',
  legendLabel: 'النطاق:',
  stackTitleA: 'الأدوات', stackTitleB: 'والتقنيات', stackIntro: 'أدوات استخدمتها في المشاريع المعروضة هنا.',
  stackData: 'البيانات والتحليل', stackMl: 'تعلّم الآلة والذكاء الاصطناعي', stackWeb: 'الويب والتطبيقات', stackBi: 'التقارير',
  contactTitleA: 'لنبنِ', contactTitleB: 'شيئًا معًا.', contactIntro: 'احكِ لي عن المنتج أو البيانات أو التقرير الذي تحتاجه.',
  emailLabel: 'البريد', phoneLabel: 'الهاتف', linkedinValue: 'عبدالرحمن هشام', emailMe: 'راسلني', callMe: 'اتصل بي',
  footerCity: 'القاهرة، مصر'
});
const statusRamp = ['capstone', 'course', 'prototype'];
const selectedStatus = { star: 'live', deutscher: 'pilot', talent: 'capstone', interview: 'local', fitness: 'live', estimator: 'local', builder: 'university' };
// Drawn previews shown on the "Results & interface" tab when a project has no captured screens; always labeled as drawings.
const conceptualPreviews = { fitness: '.fitness-preview', builder: '.builder-preview', deutscher: '.deutscher-preview' };

const html = document.documentElement;
const dialog = document.getElementById('case-dialog');
const stage = document.getElementById('gallery-stage');
const prevButton = document.getElementById('gallery-prev');
const nextButton = document.getElementById('gallery-next');
let language = 'en';
let currentProject = null;
let slideIndex = 0;
let returnFocus = null;
let catalogFilter = 'all';
let catalogExpanded = false;
let catalogQuery = '';
let mediaKind = 'results';
let galleryZoomed = false;
let galleryRetry = 0;
let lastSlideKey = '';

// The site is English-only (owner decision). Clear the obsolete language preference so an old
// Arabic setting can never switch the page to RTL. Archived Arabic copy in the data stays unused.
try { localStorage.removeItem('portfolio-language'); } catch (_) {}

function renderLanguage() {
  html.lang = 'en';
  html.dir = 'ltr';
  const t = copy.en;
  document.title = 'Abdelrahman Hesham — AI Engineer & Software Engineer';
  // The English markup is the single source of visible copy; the archived data-i18n keys are no longer rewritten,
  // so the page reads the same with or without this script.
  document.getElementById('case-close').setAttribute('aria-label', t.closeCase);
  document.getElementById('rail-prev').setAttribute('aria-label', t.railPrev);
  document.getElementById('rail-next').setAttribute('aria-label', t.railNext);
  document.getElementById('work-rail').setAttribute('aria-label', t.railLabel);
  roleIndex = 0; showRole();
  prevButton.setAttribute('aria-label', t.galleryPrev);
  nextButton.setAttribute('aria-label', t.galleryNext);
  document.getElementById('catalog-search').placeholder = t.searchWork;
  document.getElementById('catalog-search').setAttribute('aria-label', t.searchWork);
  renderCatalog();
  if (currentProject) renderCase();
}

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function makeArrowIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('class', 'icon'); svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path'); path.setAttribute('d', 'M7 17 17 7M7 7h10v10'); svg.append(path); return svg;
}

function createArtifactPreview(project) {
  const labels = catalogData.labels[language];
  const preview = makeElement('div', 'artifact-preview');
  preview.append(makeElement('span', 'artifact-label', project.tools.includes('Power BI') ? labels.reportLabel : labels.artifactLabel));
  preview.append(makeElement('strong', 'artifact-title', project.title[language]));
  const tools = makeElement('div', 'artifact-tools');
  project.tools.forEach(tool => tools.append(makeElement('span', '', tool)));
  preview.append(tools);
  const files = makeElement('div', 'artifact-files');
  project.artifactNames.forEach(name => files.append(makeElement('span', '', name)));
  preview.append(files);
  return preview;
}

function renderCatalog() {
  const labels = catalogData.labels[language];
  const filters = document.getElementById('catalog-filters');
  filters.replaceChildren();
  filters.setAttribute('aria-label', language === 'ar' ? 'تصفية الأعمال' : 'Filter projects');
  for (const key of ['all', 'data', 'powerbi', 'ml', 'prototype']) {
    const button = makeElement('button', 'catalog-filter', labels[key]);
    button.type = 'button'; button.dataset.category = key;
    button.setAttribute('aria-pressed', String(catalogFilter === key));
    filters.append(button);
  }
  const query = catalogQuery.trim().toLocaleLowerCase();
  const matches = catalogData.items.filter(item => (catalogFilter === 'all' || item.category === catalogFilter) && (!query || [item.title.en, item.title.ar, item.summary.en, item.summary.ar, ...item.tools].join(' ').toLocaleLowerCase().includes(query)));
  const limit = catalogFilter === 'all' && !query ? 7 : 6;
  const visible = catalogExpanded ? matches : matches.slice(0, limit);
  const grid = document.getElementById('catalog-grid');
  grid.replaceChildren();
  for (const item of visible) {
    const project = projects[item.id];
    const card = makeElement('article', 'catalog-card' + (item.id === 'talent-bi' && catalogFilter === 'all' && !catalogQuery ? ' catalog-featured' : ''));
    const cover = project.images.find(image => image[3] !== 'code') || project.images[0];
    const visual = makeElement('button', cover ? 'catalog-visual ' + (cover[3] === 'code' ? 'code-visual' : 'chart-visual') : 'catalog-visual file-visual');
    visual.type = 'button'; visual.dataset.project = item.id;
    visual.setAttribute('aria-label', `${labels.details}: ${item.title[language]}`);
    if (cover) {
      const img = makeElement('img');
      // Inside the horizontal story the archive is clipped by the stage, where native lazy loading would only
      // start when a card is already on screen; load eagerly there instead.
      img.src = cover[0]; img.alt = cover[language === 'ar' ? 2 : 1]; img.loading = window.portfolioStory?.isActive() ? 'eager' : 'lazy';
      visual.append(img);
    } else {
      visual.append(makeElement('span', 'file-type', item.tools[0]));
      visual.append(makeElement('span', 'file-title', item.title[language]));
      visual.append(makeElement('span', 'file-name', item.artifacts[0]));
    }
    const body = makeElement('div', 'catalog-body');
    const meta = makeElement('div', 'catalog-meta');
    meta.append(makeElement('span', 'status status-' + item.status, project.status[language]), makeElement('span', 'catalog-category', labels[item.category]));
    body.append(meta, makeElement('h3', '', item.title[language]), makeElement('p', '', item.summary[language]));
    const action = makeElement('button', 'project-link');
    action.type = 'button'; action.dataset.project = item.id;
    action.append(makeElement('span', '', labels.details), makeArrowIcon());
    action.lastElementChild.setAttribute('aria-hidden', 'true');
    const tools = makeElement('div', 'catalog-tools');
    item.tools.slice(0,3).forEach(tool => tools.append(makeElement('span', '', tool)));
    body.append(tools, action); card.append(visual, body); grid.append(card);
  }
  if (!matches.length) {
    const empty = makeElement('div', 'catalog-empty');
    empty.append(makeElement('h3', '', copy[language].noMatches));
    const clear = makeElement('button', 'catalog-toggle', copy[language].clearSearch); clear.type = 'button'; clear.dataset.clearSearch = 'true';
    empty.append(clear); grid.append(empty);
  }
  document.getElementById('catalog-count').textContent = `${matches.length} ${labels.projects}`;
  const legend = document.getElementById('status-legend');
  legend.replaceChildren(makeElement('span', 'legend-label', copy[language].legendLabel));
  statusRamp.forEach(status => legend.append(makeElement('span', 'status status-' + status, labels[status === 'prototype' ? 'prototypeStatus' : status])));
  const toggle = document.getElementById('catalog-toggle');
  toggle.hidden = matches.length <= limit;
  toggle.textContent = catalogExpanded ? labels.showLess : `${labels.showAll} (${matches.length})`;
  toggle.setAttribute('aria-expanded', String(catalogExpanded));
}

function createFact(label, value) {
  const row = document.createElement('div');
  const heading = document.createElement('span');
  const text = document.createElement('p');
  heading.textContent = copy[language].facts[label] || label;
  text.textContent = value;
  row.append(heading, text);
  return row;
}

function galleryImages() {
  return projects[currentProject].images.filter(image => (image[3] === 'code') === (mediaKind === 'code'));
}

function renderGallery() {
  const slideKey = `${currentProject}:${mediaKind}:${slideIndex}`;
  if (slideKey !== lastSlideKey) { galleryRetry = 0; lastSlideKey = slideKey; }
  stage.replaceChildren();
  const project = projects[currentProject];
  const images = galleryImages();
  const tabs = document.getElementById('gallery-tabs');
  const thumbnails = document.getElementById('gallery-thumbnails');
  const navigation = document.querySelector('.gallery-navigation');
  const open = document.getElementById('gallery-open');
  const zoom = document.getElementById('gallery-zoom');
  stage.classList.toggle('source-stage', mediaKind === 'code');
  stage.classList.toggle('is-zoomed', galleryZoomed);
  stage.dataset.loading = copy[language].loadingImage;
  zoom.setAttribute('aria-pressed', String(galleryZoomed));
  zoom.textContent = galleryZoomed ? copy[language].fitImage : copy[language].zoomImage;
  const hasResults = project.images.some(image => image[3] !== 'code') || !!conceptualPreviews[currentProject];
  const hasCode = project.images.some(image => image[3] === 'code');
  tabs.replaceChildren(); thumbnails.replaceChildren();
  tabs.setAttribute('aria-label', language === 'ar' ? 'اختيار نوع الصور' : 'Choose image type');
  for (const [kind, available, text] of [['results', hasResults, copy[language].resultsTab], ['code', hasCode, copy[language].codeTab]]) {
    if (!available) continue;
    const button = makeElement('button', 'gallery-tab', text); button.type = 'button'; button.dataset.mediaKind = kind;
    button.setAttribute('aria-pressed', String(mediaKind === kind)); tabs.append(button);
  }
  const status = document.getElementById('gallery-status');
  if (!images.length) {
    const selector = conceptualPreviews[currentProject];
    const source = selector && document.querySelector(selector);
    const preview = source ? source.cloneNode(true) : createArtifactPreview(project);
    preview.removeAttribute('role'); preview.removeAttribute('aria-label');
    stage.append(preview); navigation.hidden = true; open.hidden = true; zoom.hidden = true; stage.setAttribute('aria-busy','false');
    document.getElementById('gallery-count').textContent = '';
    document.getElementById('gallery-caption').textContent = '';
    status.textContent = source ? 'Drawn preview, not a screenshot' : '';
    return;
  }
  slideIndex = Math.min(slideIndex, images.length - 1);
  navigation.hidden = images.length === 1; open.hidden = false; zoom.hidden = false;
  const current = images[slideIndex];
  const caption = current[4] || current[language === 'ar' ? 2 : 1];
  const img = makeElement('img'); stage.setAttribute('aria-busy', 'true');
  img.onload = () => stage.setAttribute('aria-busy', 'false');
  // A failed image gets a visible explanation, a Retry button and a direct link instead of an empty, silent stage.
  img.onerror = () => {
    stage.setAttribute('aria-busy', 'false');
    const box = makeElement('div', 'gallery-error');
    box.append(makeElement('p', '', `“${caption}” could not be loaded.`));
    const retry = makeElement('button', 'gallery-retry', 'Retry'); retry.type = 'button';
    retry.addEventListener('click', () => { galleryRetry++; renderGallery(); stage.focus({ preventScroll: true }); });
    const direct = makeElement('a', 'gallery-direct', 'Open the file directly'); direct.href = current[0]; direct.target = '_blank'; direct.rel = 'noopener';
    box.append(retry, direct);
    stage.replaceChildren(box);
    status.textContent = `Image ${slideIndex + 1} of ${images.length} could not be loaded. Retry is available.`;
  };
  img.src = galleryRetry ? `${current[0]}?retry=${galleryRetry}` : current[0];
  img.alt = current[language === 'ar' ? 2 : 1];
  stage.classList.toggle('source-stage', mediaKind === 'code');
  stage.append(img); if (galleryZoomed) { stage.scrollLeft = 0; stage.scrollTop = 0; } open.href = current[0];
  document.getElementById('gallery-caption').textContent = caption;
  document.getElementById('gallery-count').textContent = `${slideIndex + 1} / ${images.length}`;
  status.textContent = `${mediaKind === 'code' ? 'Source code' : 'Image'} ${slideIndex + 1} of ${images.length}: ${caption}`;
  prevButton.disabled = slideIndex === 0; nextButton.disabled = slideIndex === images.length - 1;
  images.forEach((image, index) => {
    const button = makeElement('button', 'gallery-thumb'); button.type = 'button'; button.dataset.slide = index;
    button.setAttribute('aria-label', image[language === 'ar' ? 2 : 1]); button.setAttribute('aria-pressed', String(slideIndex === index));
    const thumbnail = makeElement('img'); thumbnail.src = image[0]; thumbnail.alt = ''; thumbnail.loading = 'lazy';
    button.append(thumbnail); thumbnails.append(button);
  });
}

function caseUrl(key) {
  return `${location.href.split('#')[0]}#case=${encodeURIComponent(key)}`;
}

function renderCase() {
  const project = projects[currentProject];
  if (!project) return;
  const kicker = document.getElementById('case-kicker');
  kicker.textContent = project.kicker[language];
  kicker.className = 'status status-' + (project.statusKey || selectedStatus[currentProject] || 'local');
  document.getElementById('case-title').textContent = project.title[language];
  document.getElementById('case-lead').textContent = project.lead[language];
  const facts = document.getElementById('case-facts');
  facts.replaceChildren(...project.facts[language].map(([label, value]) => createFact(label, value)));
  const footer = document.getElementById('case-footer');
  footer.replaceChildren();
  if (project.link) {
    const link = document.createElement('a');
    link.href = project.link;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.append(makeElement('span', '', copy[language].liveLink), makeArrowIcon());
    footer.append(link);
  } else {
    const status = document.createElement('span');
    status.className = 'eyebrow';
    status.textContent = project.status ? project.status[language] : copy[language].privateBuild;
    footer.append(status);
  }
  for (const item of project.links || []) {
    const link = makeElement('a', 'evidence-link');
    link.href = item.href; link.target = '_blank'; link.rel = 'noopener';
    link.append(makeElement('span', '', item.label), makeArrowIcon());
    footer.append(link);
  }
  // Every case has its own shareable address (#case=<id>); copying falls back to showing the address.
  const share = makeElement('button', 'case-share', 'Copy link to this case'); share.type = 'button';
  const shareStatus = makeElement('span', 'case-share-status'); shareStatus.setAttribute('role', 'status');
  share.addEventListener('click', async () => {
    const url = caseUrl(currentProject);
    try { await navigator.clipboard.writeText(url); shareStatus.textContent = 'Link copied.'; }
    catch (_) { shareStatus.textContent = `Case link: ${url}`; }
  });
  footer.append(share, shareStatus);
  renderGallery();
}

let hashBeforeCase = '';
function openCase(key, trigger, fromAddress = false) {
  if (!projects[key]) return;
  returnFocus = trigger;
  currentProject = key;
  slideIndex = 0; galleryZoomed = false; galleryRetry = 0;
  mediaKind = projects[key].images.some(image => image[3] !== 'code') || conceptualPreviews[key] ? 'results' : 'code';
  renderCase();
  if (!fromAddress) {
    hashBeforeCase = location.hash;
    try { history.replaceState(null, '', `#case=${encodeURIComponent(key)}`); } catch (_) {}
  }
  // Lock the page behind the dialog so wheel, trackpad and zoom scrolling inside it never move the story.
  document.body.classList.add('modal-open');
  if (!dialog.open) dialog.showModal();
  document.getElementById('case-close').focus();
}

function caseFromAddress() {
  const match = /^#case=([\w-]+)$/.exec(location.hash);
  return match && projects[match[1]] ? match[1] : null;
}

// Scrolls to a section in either layout: the horizontal story positions it on its track, the vertical page scrolls.
function scrollToSection(element) {
  if (window.portfolioStory?.isActive()) return window.portfolioStory.goTo(element);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  element.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

document.getElementById('catalog-search').addEventListener('input', event => {
  catalogQuery = event.target.value; catalogExpanded = false; renderCatalog();
});
document.getElementById('catalog-grid').addEventListener('click', event => {
  if (!event.target.closest('[data-clear-search]')) return;
  catalogQuery = ''; document.getElementById('catalog-search').value = ''; renderCatalog();
  document.getElementById('catalog-search').focus();
});
document.getElementById('gallery-zoom').addEventListener('click', () => {
  galleryZoomed = !galleryZoomed; renderGallery();
});
document.getElementById('gallery-tabs').addEventListener('click', event => {
  const button = event.target.closest('[data-media-kind]'); if (!button) return;
  mediaKind = button.dataset.mediaKind; slideIndex = 0; renderGallery();
  document.querySelector(`[data-media-kind="${mediaKind}"]`).focus();
});
document.getElementById('gallery-thumbnails').addEventListener('click', event => {
  const button = event.target.closest('[data-slide]'); if (!button) return;
  slideIndex = Number(button.dataset.slide); renderGallery();
  document.querySelector(`[data-slide="${slideIndex}"]`).focus();
});

document.getElementById('catalog-filters').addEventListener('click', event => {
  const button = event.target.closest('[data-category]');
  if (!button) return;
  catalogFilter = button.dataset.category; catalogExpanded = false;
  renderCatalog();
  document.querySelector(`[data-category="${catalogFilter}"]`).focus();
});
document.getElementById('catalog-toggle').addEventListener('click', () => {
  catalogExpanded = !catalogExpanded;
  renderCatalog();
  document.getElementById('catalog-toggle').focus();
});

document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-project]');
  if (trigger) openCase(trigger.dataset.project, trigger);
  const labLink = event.target.closest('[data-lab-filter]');
  if (labLink) {
    catalogFilter = labLink.dataset.labFilter; catalogExpanded = false; catalogQuery = '';
    document.getElementById('catalog-search').value = '';
    renderCatalog();
    scrollToSection(document.getElementById('lab'));
    document.querySelector(`[data-category="${catalogFilter}"]`).focus({ preventScroll: true });
  }
});
document.getElementById('case-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('close', () => {
  currentProject = null;
  if (caseFromAddress()) { try { history.replaceState(null, '', hashBeforeCase || location.pathname + location.search); } catch (_) {} }
  hashBeforeCase = '';
  document.body.classList.remove('modal-open');
  if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
});
prevButton.addEventListener('click', () => { if (slideIndex > 0) { slideIndex--; renderGallery(); } });
nextButton.addEventListener('click', () => { if (currentProject && slideIndex < galleryImages().length - 1) { slideIndex++; renderGallery(); } });
document.addEventListener('keydown', event => {
  if (!dialog.open || !currentProject || !galleryImages().length) return;
  if (event.key === 'ArrowLeft' && slideIndex > 0) { slideIndex--; renderGallery(); }
  if (event.key === 'ArrowRight' && slideIndex < galleryImages().length - 1) { slideIndex++; renderGallery(); }
});

const progress = document.querySelector('.scroll-progress');
const header = document.querySelector('.site-header');
let progressQueued = false;
window.addEventListener('scroll', () => {
  if (progressQueued) return;
  progressQueued = true;
  requestAnimationFrame(() => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max).toFixed(4) : 0})`;
    header.classList.toggle('is-scrolled', scrollY > 24);
    progressQueued = false;
  });
}, { passive: true });

if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
  }, { threshold: .08, rootMargin: '0px 0px 40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  html.classList.add('reveal-on');
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
}

// ---------- Hero: rotating roles and staged intro (the character itself lives in interactions.js) ----------
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const roleEl = document.getElementById('role-current');
let roleIndex = 0;
function showRole() {
  const roles = copy[language].heroRoles;
  roleEl.textContent = roles[roleIndex % roles.length];
}
// Roles no longer rotate automatically (stable text, no motion to pause): AI Engineer leads, the others sit beneath it.

const avatar = document.getElementById('hero-avatar');
const markAvatar = () => document.documentElement.classList.toggle('avatar-missing', !(avatar.complete && avatar.naturalWidth));
// The responsive WebP render falls back once to the original PNG before the character is hidden.
const avatarFallback = () => {
  const png = avatar.dataset.fallbackSrc;
  if (!png || avatar.dataset.fellBack) return markAvatar();
  avatar.dataset.fellBack = 'true';
  avatar.removeAttribute('srcset'); avatar.removeAttribute('sizes');
  avatar.src = png;
};
avatar.addEventListener('error', avatarFallback); avatar.addEventListener('load', markAvatar);
if (avatar.complete) { if (avatar.naturalWidth) markAvatar(); else avatarFallback(); }

// ---------- Selected-work rail: real previous/next buttons ----------
// In the horizontal story the rail is unrolled onto the story track, so the buttons step the story by one project.
const rail = document.getElementById('work-rail');
function railStep(direction) {
  if (window.portfolioWork?.isActive()) { window.portfolioWork.step(direction); return; }
  if (window.portfolioStory?.isActive()) { window.portfolioStory.stepProject(direction); return; }
  const panel = rail.querySelector('.work-panel');
  const step = panel ? panel.getBoundingClientRect().width + (parseFloat(getComputedStyle(rail).columnGap) || 0) : rail.clientWidth * .8;
  rail.scrollBy({ left: step * direction, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
}
function updateRailButtons() {
  if (window.portfolioWork?.isActive()) return;
  if (window.portfolioStory?.isActive()) return;
  const max = rail.scrollWidth - rail.clientWidth;
  const position = Math.abs(rail.scrollLeft);
  document.getElementById('rail-prev').disabled = position <= 2;
  document.getElementById('rail-next').disabled = position >= max - 2;
}
document.getElementById('rail-prev').addEventListener('click', () => railStep(-1));
document.getElementById('rail-next').addEventListener('click', () => railStep(1));
rail.addEventListener('scroll', () => requestAnimationFrame(updateRailButtons), { passive: true });
window.addEventListener('resize', updateRailButtons);
document.addEventListener('storymodechange', updateRailButtons);
document.addEventListener('workscrollmodechange', updateRailButtons);

renderLanguage();
updateRailButtons();

// Shareable case addresses: #case=<id> opens that case on load and when the address changes.
stage.tabIndex = -1;
const addressCase = caseFromAddress();
if (addressCase) openCase(addressCase, null, true);
window.addEventListener('hashchange', () => { const key = caseFromAddress(); if (key && key !== currentProject) openCase(key, null, true); });
