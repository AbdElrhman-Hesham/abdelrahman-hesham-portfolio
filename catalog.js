const portfolioCatalog = {
  "labels": {
    "en": {
      "all": "All work",
      "data": "Data analysis",
      "powerbi": "Power BI",
      "ml": "Machine learning",
      "prototype": "More experiments",
      "showAll": "Show all projects",
      "showLess": "Show fewer",
      "projects": "projects",
      "details": "View details",
      "course": "Course project",
      "exercise": "Introductory exercise",
      "capstone": "Part of a capstone",
      "study": "Design / content study",
      "artifactLabel": "Work files",
      "chartLabel": "Saved notebook output",
      "reportLabel": "Report contents"
    },
    "ar": {
      "all": "كل الأعمال",
      "data": "تحليل البيانات",
      "powerbi": "Power BI",
      "ml": "تعلّم الآلة",
      "prototype": "تجارب أخرى",
      "showAll": "عرض كل الأعمال",
      "showLess": "عرض أقل",
      "projects": "عمل",
      "details": "شاهد التفاصيل",
      "course": "مشروع كورس",
      "exercise": "تمرين مبدئي",
      "capstone": "جزء من مشروع التخرج",
      "study": "دراسة تصميم / محتوى",
      "artifactLabel": "ملفات العمل",
      "chartLabel": "نتائج محفوظة من الدفتر",
      "reportLabel": "محتوى التقرير"
    }
  },
  "items": [
    {
      "id": "talent-bi",
      "category": "powerbi",
      "title": {
        "en": "TalentMatch Power BI",
        "ar": "لوحة Power BI لمشروع TalentMatch"
      },
      "summary": {
        "en": "The Power BI report from the TalentMatch capstone: jobs, skills and data-quality pages.",
        "ar": "The Power BI report from the TalentMatch capstone: jobs, skills and data-quality pages."
      },
      "method": {
        "en": "Four report pages cover candidates and jobs, job-level matching, skills supply versus demand, and data-quality decisions. CSV sources are linked through a configurable DataFolder parameter.",
        "ar": "أربع صفحات لتلخيص المرشحين والوظائف والمطابقة والمهارات المتاحة والمطلوبة وقرارات جودة البيانات. ترتبط ملفات CSV بالتقرير عبر معامل DataFolder قابل للضبط."
      },
      "tools": [
        "Power BI",
        "Data modeling"
      ],
      "artifacts": [
        "TalentMatch.pbix",
        "TalentMatch.pbip",
        "TalentMatch-report.pdf"
      ],
      "images": [
        [
          "assets/coursework/talent-bi-overview.png",
          "TalentMatch Power BI — overview",
          "تقرير Power BI لمشروع TalentMatch — نظرة عامة"
        ],
        [
          "assets/coursework/talent-bi-jobs.png",
          "TalentMatch Power BI — jobs",
          "تقرير Power BI لمشروع TalentMatch — الوظائف"
        ],
        [
          "assets/coursework/talent-bi-skills.png",
          "TalentMatch Power BI — skills",
          "تقرير Power BI لمشروع TalentMatch — المهارات"
        ],
        [
          "assets/coursework/talent-bi-data_quality.png",
          "TalentMatch Power BI — data_quality",
          "تقرير Power BI لمشروع TalentMatch — جودة البيانات"
        ]
      ],
      "status": "capstone"
    },
    {
      "id": "laptop-bi",
      "category": "powerbi",
      "title": {
        "en": "Laptop pricing report",
        "ar": "تقرير أسعار اللابتوبات"
      },
      "summary": {
        "en": "Compare laptop brands, prices, and hardware specifications in Power BI.",
        "ar": "تقرير Power BI لمقارنة أسعار اللابتوبات وشركاتها ومواصفاتها."
      },
      "method": {
        "en": "Report visuals use company, price, RAM, memory, operating system, screen resolution, and device type.",
        "ar": "يعرض التقرير الشركة والأسعار والرام والذاكرة ونظام التشغيل ودقة الشاشة ونوع الجهاز."
      },
      "tools": [
        "Power BI",
        "CSV"
      ],
      "artifacts": [
        "1st.pbix",
        "laptop_data (1).csv"
      ],
      "images": [],
      "status": "course"
    },
    {
      "id": "titanic-eda",
      "category": "data",
      "title": {
        "en": "Titanic survival analysis",
        "ar": "تحليل بيانات Titanic"
      },
      "summary": {
        "en": "Explore survival, passenger class, age, family size, and fares.",
        "ar": "استكشاف النجاة وفئات الركاب والعمر وحجم الأسرة وأسعار التذاكر."
      },
      "method": {
        "en": "Data-quality checks, derived passenger features, univariate and bivariate analysis, and descriptive KPIs.",
        "ar": "فحص جودة البيانات واشتقاق خصائص للركاب وتحليل المتغيرات منفردة والعلاقات بينها ومؤشرات وصفية."
      },
      "tools": [
        "Pandas",
        "Seaborn"
      ],
      "artifacts": [
        "Titanic_Analysis_Notebook.ipynb",
        "Titanic_EDA.ipynb"
      ],
      "images": [
        [
          "assets/coursework/titanic-1.png",
          "Titanic survival analysis — saved chart output",
          "تحليل بيانات Titanic — رسم من نتائج العمل"
        ],
        [
          "assets/coursework/titanic-2.png",
          "Titanic survival analysis — saved chart output",
          "تحليل بيانات Titanic — رسم من نتائج العمل"
        ],
        [
          "assets/coursework/titanic-17.png",
          "Titanic survival analysis — saved chart output",
          "تحليل بيانات Titanic — رسم من نتائج العمل"
        ]
      ],
      "status": "course"
    },
    {
      "id": "housing-regression",
      "category": "ml",
      "title": {
        "en": "California housing",
        "ar": "أسعار المنازل في كاليفورنيا"
      },
      "summary": {
        "en": "Compare regression models for district house prices with a leak-free protocol.",
        "ar": "Compare regression models for district house prices with a leak-free protocol."
      },
      "method": {
        "en": "Preprocessing and model in one pipeline, 10-fold cross-validation and GridSearchCV for Ridge/Lasso alpha on training data only, then one final test: Ridge (alpha 1) RMSE 69,135, R² 0.635. A second notebook compares SVR and KNN.",
        "ar": "Preprocessing and model in one pipeline, 10-fold cross-validation and GridSearchCV for Ridge/Lasso alpha on training data only, then one final test: Ridge (alpha 1) RMSE 69,135, R² 0.635. A second notebook compares SVR and KNN."
      },
      "tools": [
        "Scikit-learn",
        "Regression"
      ],
      "artifacts": [
        "ass/14/14.ipynb",
        "ass/14/14.2.ipynb"
      ],
      "images": [
        [
          "assets/coursework/housing-cv-alpha.png",
          "California housing — cross-validated RMSE for each alpha (test set untouched)",
          "California housing — cross-validated RMSE for each alpha (test set untouched)"
        ],
        [
          "assets/coursework/housing-final.png",
          "California housing — final Ridge model, actual vs predicted on the test set",
          "California housing — final Ridge model, actual vs predicted on the test set"
        ],
        [
          "assets/coursework/housing-1.png",
          "California housing — the target is capped at 500,001",
          "California housing — the target is capped at 500,001"
        ]
      ],
      "status": "course"
    },
    {
      "id": "bank-marketing",
      "category": "ml",
      "title": {
        "en": "Bank marketing",
        "ar": "تحليل حملة تسويق مصرفية"
      },
      "summary": {
        "en": "Analyze term-deposit subscription and compare classification models.",
        "ar": "تحليل الاشتراك في الودائع ومقارنة نماذج التصنيف."
      },
      "method": {
        "en": "Train-only imputation and encoding inside pipelines; stratified 60/20/20 split. Choose Random forest by validation positive-class F1, refit on development data, then evaluate the chosen candidate on the final holdout. Test macro-F1 0.673 (prior baseline 0.470). Historical coursework/dataset reuse, not a new independent benchmark. Pre-call experiment excludes call duration; random row splitting does not establish performance on future campaigns.",
        "ar": "تحليل عدم توازن الفئات ومتغيرات الحملة، ومقارنة الانحدار اللوجستي وKNN وSVC وأشجار القرار وRandom Forest وXGBoost وMLP."
      },
      "tools": [
        "Python",
        "Pandas",
        "Scikit-learn",
        "Validation pipelines"
      ],
      "artifacts": [
        "banking.ipynb",
        "build_banking_nb.py"
      ],
      "images": [
        [
          "assets/coursework/review-bank-validation.png",
          "Validation comparison — corrected modelling run, October 2026",
          "Validation comparison — corrected modelling run, October 2026"
        ]
      ],
      "status": "course",
      "links": [
        {
          "href": "assets/evidence/coursework/bank-metrics.json",
          "label": "Reviewed evaluation (JSON)"
        }
      ]
    },
    {
      "id": "customer-churn",
      "category": "ml",
      "title": {
        "en": "Customer churn",
        "ar": "توقّع مغادرة العملاء"
      },
      "summary": {
        "en": "Prepare customer data and evaluate churn classifiers.",
        "ar": "تجهيز بيانات العملاء وتقييم نماذج توقع مغادرتهم."
      },
      "method": {
        "en": "Train-only imputation and encoding inside pipelines; stratified 60/20/20 split. Choose Random forest by validation macro-F1, refit on development data, then evaluate the chosen candidate on the final holdout. Test macro-F1 0.751 (prior baseline 0.443). Historical coursework/dataset reuse, not a new independent benchmark.",
        "ar": "ترميز الخصائص وضبط مقياسها واستخدام تقسيم طبقي للتدريب والاختبار، ومقارنة نتائج التصنيف على بيانات مغادرة العملاء."
      },
      "tools": [
        "Python",
        "Pandas",
        "Scikit-learn",
        "Validation pipelines"
      ],
      "artifacts": [
        "3.ipynb",
        "Churn_Modelling.csv"
      ],
      "images": [
        [
          "assets/coursework/review-churn-validation.png",
          "Validation comparison — corrected modelling run, October 2026",
          "Validation comparison — corrected modelling run, October 2026"
        ]
      ],
      "status": "course",
      "links": [
        {
          "href": "assets/evidence/coursework/churn-metrics.json",
          "label": "Reviewed evaluation (JSON)"
        }
      ]
    },
    {
      "id": "hr-analysis",
      "category": "data",
      "title": {
        "en": "Workforce patterns",
        "ar": "تحليل بيانات الموظفين"
      },
      "summary": {
        "en": "Explore hiring patterns, departments, leave, and salaries.",
        "ar": "تحليل اتجاهات التوظيف والأقسام والإجازات والرواتب."
      },
      "method": {
        "en": "Grouped comparisons and visual analysis by hiring date, department, country, and center. Only aggregate charts are displayed. The department-count chart now preserves department names on its categorical axis. Only that aggregate chart was re-executed in the engineering review; other notebook outputs remain historical. No employee-level data is published.",
        "ar": "مقارنات ورسوم حسب تاريخ التعيين والقسم والدولة والمركز، مع عرض نتائج مجمعة."
      },
      "tools": [
        "Pandas",
        "Seaborn"
      ],
      "artifacts": [
        "3st.ipynb",
        "Employees.xlsx"
      ],
      "images": [
        [
          "assets/coursework/review-workforce-departments.png",
          "Department counts — corrected categorical labels, from the companion workbook",
          "Department counts — corrected categorical labels, from the companion workbook"
        ]
      ],
      "status": "course"
    },
    {
      "id": "student-ai",
      "category": "data",
      "title": {
        "en": "AI & student performance",
        "ar": "الذكاء الاصطناعي وأداء الطلاب"
      },
      "summary": {
        "en": "Explore AI usage, study habits, GPA, and skill retention.",
        "ar": "استكشاف استخدام الذكاء الاصطناعي وعادات الدراسة والمعدل الدراسي والاحتفاظ بالمهارات."
      },
      "method": {
        "en": "Descriptive analysis of student cohorts, before/after GPA, AI usage patterns, and study behavior; observations are not causal claims.",
        "ar": "تحليل وصفي لمجموعات الطلاب والمعدل قبل الفصل وبعده وأنماط استخدام الأدوات وعادات الدراسة، دون استنتاج علاقة سببية."
      },
      "tools": [
        "Pandas",
        "EDA"
      ],
      "artifacts": [
        "AI_Student_Impact_EDA.ipynb"
      ],
      "images": [
        [
          "assets/coursework/students-1.png",
          "AI & student performance — saved chart output",
          "الذكاء الاصطناعي وأداء الطلاب — رسم من نتائج العمل"
        ],
        [
          "assets/coursework/students-2.png",
          "AI & student performance — saved chart output",
          "الذكاء الاصطناعي وأداء الطلاب — رسم من نتائج العمل"
        ],
        [
          "assets/coursework/students-10.png",
          "AI & student performance — saved chart output",
          "الذكاء الاصطناعي وأداء الطلاب — رسم من نتائج العمل"
        ]
      ],
      "status": "course"
    },
    {
      "id": "sql-python",
      "category": "data",
      "title": {
        "en": "Vehicle sales with SQL & Python",
        "ar": "بيانات مبيعات المركبات بـSQL وPython"
      },
      "summary": {
        "en": "Read SQL Server vehicle-sales data into Pandas.",
        "ar": "قراءة بيانات مبيعات المركبات من SQL Server داخل Pandas."
      },
      "method": {
        "en": "Use pyodbc for a local SQL Server connection, query vehicle-sales records, and inspect database tables.",
        "ar": "الاتصال بقاعدة SQL Server محلية باستخدام pyodbc والاستعلام عن مبيعات المركبات وفحص جداول القاعدة."
      },
      "tools": [
        "SQL Server",
        "pyodbc",
        "Pandas"
      ],
      "artifacts": [
        "car proj/Database with python.ipynb",
        "courses.ipynb"
      ],
      "images": [],
      "status": "course"
    },
    {
      "id": "mushroom-classifiers",
      "category": "ml",
      "title": {
        "en": "Mushroom classification",
        "ar": "تصنيف الفطر"
      },
      "summary": {
        "en": "Prepare categorical data and compare edible/poisonous classifiers.",
        "ar": "تجهيز بيانات فئوية ومقارنة تصنيف الفطر الصالح للأكل والسام."
      },
      "method": {
        "en": "Train-only imputation and encoding inside pipelines; stratified 60/20/20 split. Choose Logistic regression by validation macro-F1, refit on development data, then evaluate the chosen candidate on the final holdout. Test macro-F1 0.999 (prior baseline 0.341). Historical coursework/dataset reuse, not a new independent benchmark. Dataset classification only; no identification or food-safety claim.",
        "ar": "معالجة علامات القيم المفقودة وحذف الخصائص الثابتة وترميز الفئات ومقارنة مصفوفات الالتباس ومنحنيات ROC."
      },
      "tools": [
        "Python",
        "Pandas",
        "Scikit-learn",
        "Validation pipelines"
      ],
      "artifacts": [
        "mushrooms.ipynb",
        "build_mushrooms_nb.py"
      ],
      "images": [
        [
          "assets/coursework/review-mushroom-validation.png",
          "Validation comparison — corrected modelling run, October 2026",
          "Validation comparison — corrected modelling run, October 2026"
        ]
      ],
      "status": "course",
      "links": [
        {
          "href": "assets/evidence/coursework/mushroom-metrics.json",
          "label": "Reviewed evaluation (JSON)"
        }
      ]
    },
    {
      "id": "heart-classifiers",
      "category": "ml",
      "title": {
        "en": "Heart classification models",
        "ar": "نماذج تصنيف بيانات القلب"
      },
      "summary": {
        "en": "Compare SVC, KNN, and logistic regression in a course experiment.",
        "ar": "مقارنة SVC وKNN والانحدار اللوجستي في تمرين كورس."
      },
      "method": {
        "en": "Train-only imputation and encoding inside pipelines; stratified 60/20/20 split. Choose SVM by validation macro-F1, refit on development data, then evaluate the chosen candidate on the final holdout. Test macro-F1 0.890 (prior baseline 0.357). Historical coursework/dataset reuse, not a new independent benchmark. Educational classification only; no clinical validation.",
        "ar": "تقسيم طبقي للتدريب والاختبار وضبط مقياس الخصائص وتقييم النماذج ومصفوفات الالتباس ومنحنيات ROC."
      },
      "tools": [
        "Python",
        "Pandas",
        "Scikit-learn",
        "Validation pipelines"
      ],
      "artifacts": [
        "machine learning course/1st.ipynb",
        "machine learning course/2st.ipynb"
      ],
      "images": [
        [
          "assets/coursework/review-heart-validation.png",
          "Validation comparison — corrected modelling run, October 2026",
          "Validation comparison — corrected modelling run, October 2026"
        ]
      ],
      "status": "course",
      "links": [
        {
          "href": "assets/evidence/coursework/heart-metrics.json",
          "label": "Reviewed evaluation (JSON)"
        }
      ]
    },
    {
      "id": "airline-satisfaction",
      "category": "ml",
      "title": {
        "en": "Airline satisfaction",
        "ar": "رضا ركاب الطيران"
      },
      "summary": {
        "en": "Explore passenger survey data and compare satisfaction classifiers.",
        "ar": "استكشاف بيانات استبيان الركاب ومقارنة مصنفات الرضا."
      },
      "method": {
        "en": "Train-only imputation and encoding inside pipelines; stratified 60/20/20 split. Choose Random forest by validation macro-F1, refit on development data, then evaluate the chosen candidate on the final holdout. Test macro-F1 0.962 (prior baseline 0.362). Historical coursework/dataset reuse, not a new independent benchmark.",
        "ar": "فهم البيانات ومعالجة القيم المفقودة وتجهيز الخصائص والتدريب وتقييم التصنيف."
      },
      "tools": [
        "Python",
        "Pandas",
        "Scikit-learn",
        "Validation pipelines"
      ],
      "artifacts": [
        "ass/16/16.ipynb"
      ],
      "images": [
        [
          "assets/coursework/review-airline-validation.png",
          "Validation comparison — corrected modelling run, October 2026",
          "Validation comparison — corrected modelling run, October 2026"
        ]
      ],
      "status": "course",
      "links": [
        {
          "href": "assets/evidence/coursework/airline-metrics.json",
          "label": "Reviewed evaluation (JSON)"
        }
      ]
    },
    {
      "id": "german-desktop",
      "category": "prototype",
      "title": {
        "en": "Offline German learner",
        "ar": "تعلّم الألمانية بتطبيق مكتبي"
      },
      "summary": {
        "en": "A pre-release offline-oriented German learning monorepo with a learner app, services and content management.",
        "ar": "تطبيق مكتبي للتعلّم مع دعم العمل دون إنترنت ونظام لإدارة المحتوى."
      },
      "method": {
        "en": "Electron, Fastify, local SQLite and sync architecture. The A1–B2 seed has 24 modules and 192 lessons, with human review still pending. Thirty-three pure local tests pass; desktop/API builds, audio readiness and learning outcomes were not validated in this review.",
        "ar": "واجهة تعلم بـElectron وخدمات Fastify وتخزين SQLite محلي وبنية مزامنة. نطاق المنهج A1–B2، وتختلف جاهزية محتواه."
      },
      "tools": [
        "Electron",
        "Fastify",
        "SQLite"
      ],
      "artifacts": [
        "german course"
      ],
      "images": [],
      "status": "prototype"
    },
    {
      "id": "english",
      "category": "prototype",
      "title": {
        "en": "English Thinking Coach",
        "ar": "English Thinking Coach"
      },
      "summary": {
        "en": "An offline practice app that builds a sentence one decision at a time, then checks each answer.",
        "ar": "An offline practice app that builds a sentence one decision at a time, then checks each answer."
      },
      "method": {
        "en": "React and TypeScript; rule-based lessons, worked examples and an answer checker that aligns the learner’s words with the expected sentence. Runs without an account or internet. Source review only: the local TypeScript dependency is missing, so a fresh typecheck/build was not run. Learning outcomes have not been measured.",
        "ar": "React and TypeScript; rule-based lessons, worked examples and an answer checker that aligns the learner’s words with the expected sentence. Runs without an account or internet."
      },
      "tools": [
        "React",
        "TypeScript",
        "Offline"
      ],
      "artifacts": [
        "english course"
      ],
      "images": [],
      "status": "prototype"
    },
    {
      "id": "ic3",
      "category": "prototype",
      "status": "prototype",
      "title": {
        "en": "IC3 Spark",
        "ar": "IC3 Spark"
      },
      "summary": {
        "en": "A classroom prototype with separate teacher and student interfaces for computer fundamentals.",
        "ar": "A classroom prototype with separate teacher and student interfaces for computer fundamentals."
      },
      "method": {
        "en": "React teacher and student apps share lesson content. TypeScript checks pass locally; no automated behaviour tests, classroom trial or measured learning results were found. The preview is a genuine saved student lesson screen.",
        "ar": "React teacher and student apps share lesson content. TypeScript checks pass locally; no automated behaviour tests, classroom trial or measured learning results were found. The preview is a genuine saved student lesson screen."
      },
      "tools": [
        "React",
        "TypeScript",
        "Vite"
      ],
      "artifacts": [
        "Teacher app",
        "Student app",
        "Shared lesson content"
      ],
      "images": [
        [
          "assets/ic3-spark/session-01-preview.png",
          "IC3 Spark Computer Fundamentals student lesson preview",
          "IC3 Spark Computer Fundamentals student lesson preview"
        ]
      ]
    }
  ]
};
