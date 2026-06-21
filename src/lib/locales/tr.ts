// Turkish UI strings — flat dotted keys matching en.ts.
// Technical terms (token, prompt, context window, RAG, LLM, SLO, etc.)
// are kept in English where they are standard in Turkish tech usage.

const tr = {
  // ---------------------------------------------------------------------------
  // Nav / common
  // ---------------------------------------------------------------------------
  'nav.brand': 'TrainingKit',
  'nav.leaderboard': 'Sıralama',
  'nav.admin': 'Yönetici',
  'nav.signOut': 'Çıkış yap',
  'nav.dashboard': 'Ana sayfa',
  'nav.backToDashboard': 'Ana sayfaya dön',
  'nav.basics': 'AI temelleri',
  'nav.glossary': 'Sözlük',

  // ---------------------------------------------------------------------------
  // Language switcher
  // ---------------------------------------------------------------------------
  'lang.en': 'EN',
  'lang.tr': 'TR',

  // ---------------------------------------------------------------------------
  // Login page
  // ---------------------------------------------------------------------------
  'login.tagline': 'AI uygulama mimarisi — ekipteki herkes için',
  'login.email': 'E-posta',
  'login.emailPlaceholder': 'siz@ornek.com',
  'login.password': 'Şifre',
  'login.passwordPlaceholder': 'En az 8 karakter',
  'login.signIn': 'Giriş yap',
  'login.signUp': 'Hesap oluştur',
  'login.signingIn': 'Giriş yapılıyor…',
  'login.creatingAccount': 'Hesap oluşturuluyor…',
  'login.noAccount': 'Hesabınız yok mu?',
  'login.createOne': 'Oluşturun',
  'login.alreadyHaveAccount': 'Zaten hesabınız var mı?',
  'login.fallbackError': 'Bir şeyler ters gitti. Lütfen tekrar deneyin.',

  // ---------------------------------------------------------------------------
  // Dashboard
  // ---------------------------------------------------------------------------
  'dashboard.learningPath': 'Öğrenme yolunuz',
  'dashboard.modulesPassed': '{passed}/{total} modül tamamlandı',
  'dashboard.summary': '17 modül · her biri iki seviye · L2\'yi açmak için L1\'i tamamlayın',
  'dashboard.badges': 'Rozetleriniz',
  'dashboard.loadingProgress': 'İlerleme yükleniyor…',
  'dashboard.newToAi': 'AI\'a yeni misin? Önce "5 dakikada AI"yı oku',
  'dashboard.about.title': 'Başlamadan önce',
  'dashboard.about.body': 'Yazılım yaşam döngüsü boyunca AI benimseyen ekipler için bir "SDLC\'de AI" okuryazarlık programı — hem AI özellikleri inşa etmeyi hem de AI güdümlü bir SDLC\'de çalışmayı kapsar. Uygulamalı lab becerisi değil, ortak bir anlayış kazandırır. Modülleri istediğin sırayla al; her L2\'yi açmak için L1\'i tamamla, sonra sertifikanı kazanmak için sınava gir. Seviye başına gösterilen süreler kabaca taslaktır.',
  'dashboard.minutes': '~{min} dk',

  // AI temelleri + sözlük
  'glossary.title': 'Sözlük',
  'glossary.subtitle': 'Eğitimde geçen her AI terimi için sade dille tanımlar.',
  'glossary.search': 'Terim ara…',
  'glossary.empty': 'Aramanla eşleşen terim yok.',
  'intro.cta.glossary': 'Sözlüğü aç',
  'intro.cta.start': 'Modüllere git',

  // Module CTA labels
  'dashboard.cta.review': 'Tekrar et',
  'dashboard.cta.continue': 'Devam et',
  'dashboard.cta.start': 'Başla',

  // Level labels inside module card
  'dashboard.level.foundations': 'Temel bilgiler',
  'dashboard.level.deepDive': 'Derinlemesine',

  // Status labels
  'status.notStarted': 'Başlanmadı',
  'status.locked': 'Kilitli',
  'status.inProgress': 'Devam ediyor',
  'status.passed': 'Tamamlandı',

  // ---------------------------------------------------------------------------
  // Lesson player
  // ---------------------------------------------------------------------------
  'lesson.level': 'Seviye {level}',
  'lesson.progress': '{done}/{total} tamamlandı',
  'lesson.noLessons': 'Bu modül için ders bulunamadı.',
  'lesson.next': 'Sonraki',
  'lesson.markComplete': 'Tamamlandı olarak işaretle',
  'lesson.allDone': 'Tüm dersler tamamlandı!',
  'lesson.allDoneDesc': 'İlerlemeniz kaydedilecek ve kazanılan rozetler verilecek.',
  'lesson.completeModule': 'Modülü tamamla',
  'lesson.saving': 'Kaydediliyor…',
  'lesson.saveError': 'İlerleme kaydedilemedi',
  'lesson.goToLesson': 'Derse git: {title}',

  // Lesson kind labels
  'lesson.kind.concept': 'Kavram',
  'lesson.kind.example': 'Çözümlü örnek',
  'lesson.kind.quiz': 'Quiz',
  'lesson.kind.exercise': 'Alıştırma',

  // ---------------------------------------------------------------------------
  // Badge shelf
  // ---------------------------------------------------------------------------
  'badge.noBadges': 'Henüz rozet yok. Modülleri tamamlayarak rozet kazanın!',
  'badge.earned': 'Kazanıldı: {date}',

  // Toast (badge earned)
  'toast.newBadge.title': 'Yeni rozet kazandınız!',

  // ---------------------------------------------------------------------------
  // Hint panel
  // ---------------------------------------------------------------------------
  'hint.toggle': 'Farklı bir açıklama ister misiniz?',
  'hint.phrasings': 'Alternatif ifadeler',
  'hint.hints': 'İpuçları',
  'hint.faq': 'SSS',
  'hint.hintLabel': 'İpucu {n}',
  'hint.showFirst': 'İlk ipucunu göster',
  'hint.showNext': 'Sonraki ipucunu göster',
  'hint.available': '{n} ipucu mevcut. Tek tek açın.',
  'hint.availablePlural': '{n} ipucu mevcut. Tek tek açın.',
  'hint.allRevealed': 'Tüm ipuçları gösterildi.',
  'hint.version': 'Sürüm {n}',

  // ---------------------------------------------------------------------------
  // Quiz
  // ---------------------------------------------------------------------------
  'quiz.questionOf': 'Soru {n} / {total}',
  'quiz.answerChoices': 'Cevap seçenekleri',
  'quiz.submit': 'Cevabı gönder',
  'quiz.checking': 'Kontrol ediliyor…',
  'quiz.next': 'Sonraki soru',
  'quiz.finish': 'Quiz\'i bitir',
  'quiz.correct': 'Doğru! +{points} puan',
  'quiz.correctPlural': 'Doğru! +{points} puan',
  'quiz.incorrectSingle': 'Yanlış — doğru cevap yukarıda vurgulanmıştır',
  'quiz.incorrectPlural': 'Yanlış — doğru cevaplar yukarıda vurgulanmıştır',
  'quiz.submissionFailed': 'Gönderim başarısız oldu.',
  'quiz.why': 'Neden:',
  'quiz.complete.title': 'Quiz tamamlandı!',
  'quiz.complete.score': '{correct}/{total} doğru — {score}/{max} puan (%{pct})',

  // ---------------------------------------------------------------------------
  // Exercises (shared)
  // ---------------------------------------------------------------------------
  'exercise.submit': 'Gönder',
  'exercise.submitting': 'Gönderiliyor…',
  'exercise.continue': 'Devam et',
  'exercise.submissionFailed': 'Gönderim başarısız oldu.',
  'exercise.result.correct': 'Doğru — {score}/{max} puan',
  'exercise.result.incorrect': 'Yanlış — {score}/{max} puan',
  'exercise.correctAnswer': 'Doğru cevap:',

  // MCQ exercise
  'exercise.mcq.selectOne': 'Bir seçenek seçin.',
  'exercise.mcq.selectAll': 'Uygun olanların hepsini seçin.',

  // Order exercise
  'exercise.order.instruction': 'Öğeleri doğru sıraya koymak için okları kullanın.',
  'exercise.order.moveUp': '"{item}" öğesini yukarı taşı',
  'exercise.order.moveDown': '"{item}" öğesini aşağı taşı',
  'exercise.order.correct': 'Doğru sıralama — {score}/{max} puan',
  'exercise.order.incorrect': 'Yanlış sıralama — {score}/{max} puan',

  // Match exercise
  'exercise.match.instruction': 'Soldaki her öğe için sağdaki eşleşen öğeyi seçin.',
  'exercise.match.selectPlaceholder': '— seçin —',
  'exercise.match.matchFor': 'Eşleşme: {item}',
  'exercise.match.correct': 'Tümü doğru eşlendi — {score}/{max} puan',
  'exercise.match.incorrect': 'Bazı çiftler yanlış — {score}/{max} puan',

  // Fill exercise
  'exercise.fill.instructionSingle': 'Boşluğu doldurun.',
  'exercise.fill.instructionPlural': '{n} boşluğu doldurun.',
  'exercise.fill.blankLabel': 'Boşluk {n}',
  'exercise.fill.placeholder': 'Cevabınız…',
  'exercise.fill.acceptedAnswers': 'Kabul edilen cevaplar:',

  // Scenario exercise
  'exercise.scenario.decision': 'En iyi karar nedir?',
  'exercise.scenario.reason': 'Bu kararın en iyi gerekçesi nedir?',
  'exercise.scenario.bothCorrect': 'İkisi de doğru — {score}/{max} puan',
  'exercise.scenario.partialCorrect': 'Karar doğru, gerekçe yanlış — {score}/{max} puan',

  // Prompt-repair egzersizi (hands-on lab)
  'exercise.promptRepair.instruction': 'Aşağıdaki prompt\'u her gereksinimi karşılayacak şekilde düzenle, sonra gönder.',
  'exercise.promptRepair.editorLabel': 'Düzenlenebilir prompt',
  'exercise.promptRepair.requirements': 'Prompt\'un şunları içermeli:',
  'exercise.promptRepair.result': '{score}/{max} puan — {total} gereksinimden {met} tanesi karşılandı',

  // ---------------------------------------------------------------------------
  // Leaderboard
  // ---------------------------------------------------------------------------
  'leaderboard.title': 'Sıralama',
  'leaderboard.col.rank': 'Sıra',
  'leaderboard.col.name': 'Ad',
  'leaderboard.col.score': 'Puan',
  'leaderboard.col.badges': 'Rozet',
  'leaderboard.col.modules': 'Tamamlanan modüller',
  'leaderboard.you': '(siz)',
  'leaderboard.empty': 'Henüz sıralama girişi yok.',

  // ---------------------------------------------------------------------------
  // Admin panel
  // ---------------------------------------------------------------------------
  'admin.title': 'Yönetici paneli',
  'admin.badge': 'Yönetici',
  'admin.tab.content': 'İçerik',
  'admin.tab.users': 'Kullanıcılar',
  'admin.content.selectModule': 'Düzenlemek için bir modül seçin.',
  'admin.content.noContent': 'Bu modül için henüz içerik eklenmemiş.',
  'admin.lesson.title': 'Ders',
  'admin.lesson.kind.label': 'Başlık',
  'admin.lesson.body': 'İçerik (markdown)',
  'admin.quiz.title': 'Quiz sorusu',
  'admin.quiz.prompt': 'Soru metni',
  'admin.quiz.choices': 'Seçenekler (JSON)',
  'admin.quiz.correct': 'Doğru cevaplar (JSON)',
  'admin.quiz.points': 'Puan',
  'admin.exercise.title': 'Alıştırma',
  'admin.exercise.prompt': 'Soru metni (markdown)',
  'admin.exercise.spec': 'Spec (JSON)',
  'admin.exercise.answerKey': 'Cevap anahtarı (JSON)',
  'admin.exercise.maxScore': 'Maksimum puan',
  'admin.save': 'Kaydet',
  'admin.saved': 'Kaydedildi.',
  'admin.sections.lessons': 'Dersler',
  'admin.sections.quizQuestions': 'Quiz soruları',
  'admin.sections.exercises': 'Alıştırmalar',
  'admin.users.col.name': 'Ad',
  'admin.users.col.role': 'Rol',
  'admin.users.col.modules': 'Tamamlanan modüller',
  'admin.users.col.score': 'Toplam puan',
  'admin.users.col.badges': 'Rozet',
  'admin.users.empty': 'Kullanıcı bulunamadı.',
  'admin.tab.progress': 'İlerleme',
  'admin.progress.col.user': 'Kullanıcı',
  'admin.progress.col.role': 'Rol',
  'admin.progress.col.exam': 'Sınav',
  'admin.progress.col.devScore': 'Gelişim puanı',
  'admin.progress.legend': 'Gelişim puanı = %80 içerik ustalığı + %20 en iyi sınav puanı',
  'admin.progress.empty': 'Henüz ilerleme verisi yok.',
  'admin.progress.examNever': '—',

  // ---------------------------------------------------------------------------
  // Dashboard module titles and descriptions
  // ---------------------------------------------------------------------------
  'module.llm_foundations.title': 'LLM\'ler Nasıl Çalışır?',
  'module.llm_foundations.desc': 'LLM nedir ve ne yapar; yetenekleri ve sınırlılıkları; görev için doğru modeli seçmek.',

  'module.tokens.title': 'Token\'lar ve Maliyetler',
  'module.tokens.desc': 'Token nedir; kullanım ve maliyet tahmini; bütçe ve limitlere uygun prompt tasarımı.',

  'module.context_management.title': 'Context Window Yönetimi',
  'module.context_management.desc': 'Bilgi kaybetmeden veya limitlere çarpmadan uzun konuşmaları ve belgeleri ele almak.',

  'module.prompting.title': 'Gerçek İş İçin Prompting',
  'module.prompting.desc': 'Güvenilir ve yapılandırılmış çıktı üretmek için sistem promptları ve kullanıcı mesajları yazmak.',

  'module.guardrails.title': 'Güvenlik Önlemleri',
  'module.guardrails.desc': 'Prompt injection ve jailbreak risklerini tanımlamak; katmanlı savunmalar tasarlamak.',

  'module.security_privacy.title': 'Güvenlik & Gizlilik',
  'module.security_privacy.desc': 'AI ile PII ve sırların yönetimi; prompt ve veri sızıntılarını önleme; shadow AI\'ı görünür kılma.',

  'module.tool_use_agents.title': 'Araç Kullanımı ve Ajanlar',
  'module.tool_use_agents.desc': 'Fonksiyon çağrısı entegrasyonları; ajantik döngüler ve hata modları hakkında akıl yürütmek.',

  'module.rag.title': 'RAG — Retrieval-Augmented Generation',
  'module.rag.desc': 'Bir retrieval pipeline\'ı kurmak; chunking ve embedding stratejileri seçmek.',

  'module.evaluation.title': 'Değerlendirme ve Test',
  'module.evaluation.desc': 'Eval\'ları tanımlamak; kaliteyi ölçmek; prompt ve pipeline\'lar için regresyon testleri kurmak.',

  'module.cost_latency.title': 'Maliyet, Gecikme ve Güvenilirlik',
  'module.cost_latency.desc': 'Bir pipeline\'ı profilllemek; caching, routing ve streaming uygulamak; SLO\'lar belirlemek.',

  'module.ai_architecture.title': 'AI Sistem Mimarisi',
  'module.ai_architecture.desc': 'Tam bir AI sistem mimarisini okumak ve çizmek; güvenlik ve gizlilik risklerini belirlemek.',

  'module.ai_operations_sre.title': 'Operasyonda AI — Agent Güdümlü SRE & Ops',
  'module.ai_operations_sre.desc': 'SDLC ve ops genelinde aksiyon alan AI agent\'larını işletmek: blast radius\'u sınırlama, onay kapıları, action audit trail\'ler, agentic FinOps ve agent\'larla/agent\'lar hakkında olay müdahalesi.',

  // Bölüm başlıkları
  'section.sdlc.title': 'SDLC\'de AI',
  'section.strategy.title': 'AI Strateji Okuryazarlığı',
  'section.vibe.title': 'Vibe Coding',
  'section.exam.title': 'Öğrendiklerini Ölç',

  // Strateji şeridi modülleri
  'module.ai_fit_buildbuy.title': 'AI Uygunluğu ve Yap/Satın Al',
  'module.ai_fit_buildbuy.desc': 'AI ne zaman doğru araç; yap/satın al/fine-tune; vendor lock-in ve toplam maliyet.',
  'module.ai_risk_governance.title': 'AI Risk ve Yönetişim',
  'module.ai_risk_governance.desc': 'Veri gizliliği, IP, uyumluluk ve sorumlu AI; AI kullanımını yöneten kontroller ve onay kapıları.',
  'module.ai_value_scaling.title': 'AI Değeri ve Ölçekleme',
  'module.ai_value_scaling.desc': 'İş gerekçesi ve ROI; AI\'ı pilottan ölçekli üretime taşımak.',
  'module.ai_delivery_portfolio.title': 'AI Güdümlü SDLC\'de Teslim ve Portföy',
  'module.ai_delivery_portfolio.desc': 'Geliştirmenin AI ile yapıldığı bir ortamda yazılım teslimini ve proje portföyünü yönetmek: tahmin, kalite kapıları, gerçek-throughput metrikleri ve takımlar arası yatırım.',

  // Vibe Coding modülü
  'module.vibe_coding.title': 'Vibe Coding',
  'module.vibe_coding.desc': 'AI pair-programmer\'larla yazılım geliştirmek: IDE\'leri yönlendirmek, AI çıktısını incelemek ve kontrolü elde tutmak.',

  // ---------------------------------------------------------------------------
  // Sınav
  // ---------------------------------------------------------------------------
  'exam.pageTitle': 'Vaka Bazlı Değerlendirme',
  'exam.instructions': 'Vaka bazlı soruları çözüp puanınızı görmek için gönderin. Geçmek için 75 veya üzeri almanız gerekir.',
  'exam.questionLabel': 'Soru {n} / {total}',
  'exam.answeredOf': '{total} sorudan {answered} tanesi cevaplandı',
  'exam.allAnswered': 'Tümü cevaplandı — göndermeye hazır',
  'exam.submit': 'Cevapları gönder',
  'exam.submitting': 'Gönderiliyor…',
  'exam.submitError': 'Gönderim başarısız oldu. Lütfen tekrar deneyin.',
  'exam.loadingQuestions': 'Sorular yükleniyor…',

  // Sonuçlar
  'exam.correct': 'Doğru',
  'exam.incorrect': 'Yanlış',
  'exam.scoreSummary': '{total} sorudan {correct} tanesi doğru',
  'exam.retake': 'Tekrar dene',
  'exam.badgeEarned': 'Rozet kazanıldı: {badge}',

  // Motivasyon başlıkları
  'exam.headline.perfect': 'Mükemmel puan! Olağanüstü bir performans!',
  'exam.headline.outstanding': 'Harika bir sonuç!',
  'exam.headline.passed': 'Geçtiniz!',
  'exam.headline.close': 'Az kaldı — açıklamaları inceleyin ve tekrar deneyin!',
  'exam.headline.keepGoing': 'Devam edin — her deneme bilginizi artırır!',

  // Sınav CTA (ana sayfa)
  'exam.cta.blurb': 'Öğrendiklerini vaka bazlı senaryo sorularıyla ölç ve sertifikanı kazan.',
  'exam.cta.button': 'Başla',
} as const;

export default tr;
