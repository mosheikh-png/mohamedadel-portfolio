(function (global) {
  "use strict";

  var ASSET = "assets/";

  var CONTENT = {
    en: {
      homeKicker: "Hello, I'm",
      homeTitle: "portfolio",
      homeName: "mohamed adel",
      homeRole: "Graphic Designer",
      homeDescription: "I create visual identities, social media designs, and print materials that make brands clear, distinctive, and memorable.",
      homeStartYear: "2024",
      homeEndYear: "2026",
      footerEmail: "ma6631879@gmail.com",
      footerYear: "2026",
      aboutLabel: "02 / About Me",
      aboutTitle: "Shaping brands with purpose.",
      aboutLead: "<p>I’m Mohamed Adel, a graphic designer who turns ideas into clear visual systems, expressive campaigns, and thoughtful printed pieces.</p>",
      aboutPointOne: "Visual identities that feel distinctive and consistent.",
      aboutPointTwo: "Social media visuals built for attention and recognition.",
      aboutPointThree: "Print materials that turn a brand into something tangible.",
      aboutFocus: "Brand identity, social media &amp; print design",
      aboutLocation: "Cairo, Egypt",
      aboutAvailability: "Freelance projects",
      contactLabel: "03 / Contact Me",
      contactTitle: "Let's make something.",
      contactDescription: "Have a brand identity, campaign, social media, or print project in mind? Let’s start with a simple conversation.",
      contactEmail: "ma6631879@gmail.com",
      contactResponseTime: "Within 2 working days",
      contactLocation: "Cairo, Egypt",
      workLabel: "01 / My Work",
      workTitle: "Selected work.",
      workDescription: "I create visual identities, social media systems, and print pieces that are clear, memorable, and designed to be seen."
    },
    ar: {
      homeKicker: "مرحبًا، أنا",
      homeTitle: "بورتفوليو",
      homeName: "محمد عادل",
      homeRole: "مصمم جرافيك",
      homeDescription: "<p>أصمم هويات بصرية وتصميمات سوشيال ميديا ومطبوعات تمنح العلامات التجارية وضوحًا وتميّزًا وحضورًا لا يُنسى.</p>",
      homeStartYear: "",
      homeEndYear: "",
      footerEmail: "ma6631879@gmail.com",
      footerYear: "2026",
      aboutLabel: "02 / نبذة عني",
      aboutTitle: "أصمم العلامات بهدف.",
      aboutLead: "<p>أنا محمد عادل، مصمم جرافيك أحوّل الأفكار إلى أنظمة بصرية واضحة وحملات معبّرة ومطبوعات مدروسة.</p>",
      aboutPointOne: "هويات بصرية مميزة ومتسقة.",
      aboutPointTwo: "تصميمات سوشيال ميديا مصممة لجذب الانتباه وبناء التعرّف.",
      aboutPointThree: "مطبوعات تجعل العلامة التجارية ملموسة وحاضرة.",
      aboutFocus: "الهوية البصرية والسوشيال ميديا والمطبوعات",
      aboutLocation: "القاهرة، مصر",
      aboutAvailability: "مشاريع العمل الحر",
      contactLabel: "03 / تواصل معي",
      contactTitle: "لنصنع شيئًا مميزًا.",
      contactDescription: "هل لديك هوية بصرية أو حملة أو مشروع سوشيال ميديا أو مطبوعات؟ لنبدأ محادثة بسيطة.",
      contactEmail: "ma6631879@gmail.com",
      contactResponseTime: "خلال يومي عمل",
      contactLocation: "القاهرة، مصر",
      workLabel: "01 / أعمالي",
      workTitle: "مختارات أعمالي.",
      workDescription: "أصمم هويات بصرية وأنظمة سوشيال ميديا ومطبوعات واضحة ومميزة ومصممة لتُرى."
    }
  };

  var UI_COPY = {
    en: {
      home: "Home", work: "My Work", about: "About", contact: "Contact", letsTalk: "Let's Talk",
      myWork: "My Work", aboutMe: "About Me", contactMe: "Contact Me", portfolioNavigation: "Portfolio page navigation",
      exploreCategory: "Explore category", moreProjects: "More visual projects coming soon.", graphicDesigner: "Graphic Designer",
      responseTime: "Response time", basedIn: "Based in", availableProjects: "Available for selected projects.",
      software: "Software", skills: "Skills", languages: "Languages", experience: "Work Experience", curriculumVitae: "Curriculum Vitae",
      requestCv: "Request My CV", requestCvDetail: "Get the full résumé by email", focus: "Focus", availableFor: "Available for",
      allCategories: "All categories", categoryMissing: "Category not found.", categoryMissingDetail: "Choose a valid portfolio category from the My Work page.",
      noProjects: "No projects here yet.", noProjectsDetail: "This category has no published projects yet."
    },
    ar: {
      home: "الرئيسية", work: "أعمالي", about: "نبذة", contact: "تواصل", letsTalk: "تواصل معي",
      myWork: "أعمالي", aboutMe: "نبذة عني", contactMe: "تواصل معي", portfolioNavigation: "التنقل بين صفحات البورتفوليو",
      exploreCategory: "استكشف القسم", moreProjects: "المزيد من المشاريع البصرية قريبًا.", graphicDesigner: "مصمم جرافيك",
      responseTime: "وقت الرد", basedIn: "الموقع", availableProjects: "متاح لمشاريع مختارة.",
      software: "البرامج", skills: "المهارات", languages: "اللغات", experience: "الخبرة العملية", curriculumVitae: "السيرة الذاتية",
      requestCv: "اطلب سيرتي الذاتية", requestCvDetail: "احصل على السيرة الكاملة عبر البريد", focus: "التخصص", availableFor: "متاح لـ",
      allCategories: "كل الأقسام", categoryMissing: "القسم غير موجود.", categoryMissingDetail: "اختر قسمًا صحيحًا من صفحة الأعمال.",
      noProjects: "لا توجد مشاريع هنا بعد.", noProjectsDetail: "هذا القسم لا يحتوي على مشاريع منشورة بعد."
    }
  };

  var WORK_CATEGORIES = [
    { slug: "social-media", title: "Social Media", titleAr: "السوشيال ميديا", image: ASSET + "mohamed-adel-project-motion.webp" },
    { slug: "photo-manipulation", title: "Photo Manipulation", titleAr: "معالجة الصور", image: ASSET + "mohamed-adel-project-editorial.webp" },
    { slug: "book-cover", title: "Book Cover", titleAr: "غلاف كتاب", image: ASSET + "mohamed-adel-project-product.webp" },
    { slug: "powerpoint-presentation", title: "PowerPoint Presentation", titleAr: "عروض باوربوينت", image: ASSET + "mohamed-adel-project-motion.webp" },
    { slug: "photo-retouching", title: "Photo Retouching", titleAr: "ريتاتش الصور", image: ASSET + "mohamed-adel-project-editorial.webp" },
    { slug: "youtube-thumbnail", title: "YouTube Thumbnail", titleAr: "صور مصغرة ليوتيوب", image: ASSET + "mohamed-adel-project-product.webp" }
  ];

  var PORTFOLIO = [
    { heroPortrait: ASSET + "mohamed-adel-hero-portrait_8ea5ea10.webp" },
    { texture: ASSET + "mohamed-adel-global-texture.webp" },
    { star: ASSET + "mohamed-adel-rotating-star.webp" }
  ];

  var PROJECTS = [
    { id: 1, title: ".", titleAr: null, category: "Social Media", summary: ".", summaryAr: null, image: ASSET + "mohamed-adel-project-motion.webp", url: null }
  ];

  var CONTACT_LINKS = [
    { id: 1, label: "phone", labelAr: null, type: "phone", url: "tel:01061750542" },
    { id: 30001, label: "whatsapp", labelAr: null, type: "whatsapp", url: "https://wa.me/qr/KSEILVH4RCCHN1" }
  ];

  var CV = {
    en: {
      software: [
        ["Ps", "Photoshop"], ["Ai", "Illustrator"], ["Pr", "Premiere"], ["Ae", "After Effects"],
        ["Au", "Audition"], ["Cd", "CorelDRAW"], ["Wd", "Word"], ["Pp", "PowerPoint"]
      ],
      skills: [
        "Graphic Design", "Social Media Design", "Visual Content Creation", "Photo Manipulation", "Video Editing",
        "Motion Graphics", "Photo Retouching", "Photography", "Adobe Creative Suite", "Creative Problem Solving", "Attention to Detail"
      ],
      languages: [
        { flag: "🇪🇬", name: "Arabic", level: "Native", dots: 4 },
        { flag: "🇬🇧", name: "English", level: "Advanced", dots: 4 },
        { flag: "🇩🇪", name: "German", level: "Intermediate", dots: 3 },
        { flag: "🇫🇷", name: "French", level: "Beginner", dots: 2 }
      ],
      experience: [
        { title: "Graphic Design Intern", date: "2022", summary: "Hands-on training and real-world design experience." },
        { title: "Digital Growth", date: "2023", summary: "Developed digital content and visual materials." },
        { title: "Photo Editing Intern", date: "2023", summary: "Advanced photo manipulation and visual content production." },
        { title: "Freelance Graphic Designer", date: "2024 — Present", summary: "Working with clients on social media and brand content." }
      ]
    },
    ar: {
      software: [
        ["Ps", "فوتوشوب"], ["Ai", "إليستريتور"], ["Pr", "بريمير"], ["Ae", "أفتر إفكتس"],
        ["Au", "أوديشن"], ["Cd", "كورل درو"], ["Wd", "وورد"], ["Pp", "باوربوينت"]
      ],
      skills: [
        "التصميم الجرافيكي", "تصميم السوشيال ميديا", "صناعة المحتوى البصري", "معالجة الصور", "مونتاج الفيديو",
        "موشن جرافيك", "ريتاتش الصور", "التصوير الفوتوغرافي", "مجموعة أدوبي كريتيف", "حل المشكلات الإبداعي", "الاهتمام بالتفاصيل"
      ],
      languages: [
        { flag: "🇪🇬", name: "العربية", level: "اللغة الأم", dots: 4 },
        { flag: "🇬🇧", name: "الإنجليزية", level: "متقدم", dots: 4 },
        { flag: "🇩🇪", name: "الألمانية", level: "متوسط", dots: 3 },
        { flag: "🇫🇷", name: "الفرنسية", level: "مبتدئ", dots: 2 }
      ],
      experience: [
        { title: "متدرب تصميم جرافيك", date: "2022", summary: "تدريب عملي وخبرة حقيقية في التصميم." },
        { title: "النمو الرقمي", date: "2023", summary: "تطوير محتوى رقمي ومواد بصرية." },
        { title: "متدرب تعديل صور", date: "2023", summary: "معالجة متقدمة للصور وإنتاج محتوى بصري." },
        { title: "مصمم جرافيك مستقل", date: "2024 — الآن", summary: "العمل مع العملاء على السوشيال ميديا ومحتوى العلامات التجارية." }
      ]
    }
  };

  global.PortfolioData = {
    CONTENT: CONTENT,
    UI_COPY: UI_COPY,
    WORK_CATEGORIES: WORK_CATEGORIES,
    PORTFOLIO: PORTFOLIO,
    PROJECTS: PROJECTS,
    CONTACT_LINKS: CONTACT_LINKS,
    CV: CV
  };
})(window);
