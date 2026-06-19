import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'content', 'exam');

// Each item: idx = index the correct answer sits at; d = 3 distractors that fill
// the remaining indices in ascending order. Correct positions are balanced 5/5/5/5
// across A/B/C/D with no visible cycle.
const Q = [
  { idx: 2,
    en: { q: "Your team must classify thousands of support tickets per hour on a tight budget; quality needs are moderate and latency matters. Which model strategy fits best?",
      correct: "Use a small, fast model for the bulk and escalate only the low-confidence cases to a larger model",
      d: ["Fine-tune a large model on your historical tickets before processing any new ones","Send every ticket to your most capable frontier model so accuracy is never a concern","Classify the first batch, then reuse those answers for all later tickets to avoid new calls"],
      exp: "Right call. A small fast model for the routine bulk, escalating only uncertain cases to a bigger one, holds cost and latency down while protecting quality where it matters." },
    tr: { q: "Ekibin, kısıtlı bütçeyle saatte binlerce destek talebini sınıflandırmalı; kalite beklentisi orta, gecikme önemli. Hangi model stratejisi en uygun?",
      correct: "Çoğunluk için küçük/hızlı bir model kullan, yalnızca düşük-güvenli vakaları daha büyük modele yükselt",
      d: ["Yeni talepleri işlemeden önce büyük bir modeli geçmiş taleplerinle fine-tune et","Doğruluktan asla taviz vermemek için her talebi en yetenekli frontier modele gönder","İlk grubu sınıflandır, sonra yeni çağrı yapmamak için o cevapları sonraki tüm taleplerde tekrar kullan"],
      exp: "Doğru seçim. Rutin çoğunluk için küçük/hızlı model, yalnızca belirsiz vakaları büyük modele yükseltmek; maliyeti ve gecikmeyi düşük tutarken kaliteyi önemli yerde korur." } },

  { idx: 0,
    en: { q: "Your AI feature's API bill is climbing sharply even though request counts are flat. What should you investigate first?",
      correct: "Tokens per request — longer prompts and larger outputs raise cost even when traffic is constant",
      d: ["The number of concurrent users, since cost scales with users rather than tokens","Whether the provider quietly moved your requests from GPU to CPU hardware","The size of your vector-database index, which is what providers bill for"],
      exp: "Good instinct. LLM usage is billed per token, so heavier prompts or more verbose outputs inflate the bill even at flat traffic — trim context and cap output length first." },
    tr: { q: "AI özelliğinin API faturası, istek sayısı sabitken hızla artıyor. İlk neyi araştırmalısın?",
      correct: "İstek başına token — daha uzun prompt'lar ve daha büyük çıktılar, trafik sabitken bile maliyeti yükseltir",
      d: ["Eşzamanlı kullanıcı sayısı; çünkü maliyet token'a değil kullanıcıya göre artar","Sağlayıcının isteklerini sessizce GPU'dan CPU'ya taşıyıp taşımadığı","Sağlayıcıların faturalandırdığı şey olan vektör veritabanı indeksinin boyutu"],
      exp: "İyi sezgi. LLM kullanımı token başına faturalanır; ağır prompt'lar veya uzun çıktılar trafik sabitken bile faturayı şişirir — önce context'i kısalt ve çıktı uzunluğunu sınırla." } },

  { idx: 1,
    en: { q: "You're building an assistant that must reason over a 200-page contract that exceeds the model's context window. What's the right design?",
      correct: "Chunk the document and retrieve only the passages relevant to each question (RAG)",
      d: ["Send the whole document and rely on the model to ignore the irrelevant parts","Summarize the entire contract once and answer every future question only from that summary","Switch to a model with a smaller context window to force the answer to stay focused"],
      exp: "Exactly the pattern. When content exceeds the window, chunk it and retrieve only the relevant passages per question — you stay within limits and the answer stays focused." },
    tr: { q: "Modelin context window'unu aşan 200 sayfalık bir sözleşme üzerinde akıl yürütmesi gereken bir asistan kuruyorsun. Doğru tasarım nedir?",
      correct: "Belgeyi parçalara böl ve her soru için yalnızca ilgili bölümleri getir (RAG)",
      d: ["Tüm belgeyi gönder ve modelin alakasız kısımları görmezden gelmesine güven","Tüm sözleşmeyi bir kez özetle ve gelecekteki her soruyu yalnızca o özetten cevapla","Cevabın odaklı kalması için daha küçük context window'lu bir modele geç"],
      exp: "Tam da bu desen. İçerik pencereyi aşınca parçala ve her soru için yalnızca ilgili bölümleri getir — hem limit içinde kalırsın hem cevap odaklı olur." } },

  { idx: 3,
    en: { q: "You want an LLM to generate unit tests for an existing function. Which prompt most reliably produces correct, useful tests?",
      correct: "Provide the actual function code, the expected behavior, and the test framework you use",
      d: ["Describe the function from memory in plain English and ask for tests","Ask for the test names first, then have it fill in the bodies without seeing the code","Have it also rewrite the function from scratch so the tests match its own version"],
      exp: "Yes. Grounding the model in the real code, the expected behavior, and your framework yields tests that compile and assert the right things; ungrounded prompts drift." },
    tr: { q: "Mevcut bir fonksiyon için LLM'in unit test üretmesini istiyorsun. Hangi prompt en güvenilir şekilde doğru, kullanışlı testler üretir?",
      correct: "Gerçek fonksiyon kodunu, beklenen davranışı ve kullandığın test framework'ünü ver",
      d: ["Fonksiyonu hafızandan düz dille anlat ve test iste","Önce test isimlerini iste, sonra kodu görmeden gövdeleri doldurmasını sağla","Testler kendi sürümüne uysun diye fonksiyonu da sıfırdan yeniden yazdır"],
      exp: "Evet. Modeli gerçek kod, beklenen davranış ve framework'ünle topraklamak; derlenen ve doğru şeyi assert eden testler üretir — topraksız prompt'lar savrulur." } },

  { idx: 1,
    en: { q: "A PM wants the AI to turn vague feature ideas into user stories. How should you prompt for consistent, usable output?",
      correct: "Give the persona, the goal, and an explicit acceptance-criteria template, and ask for stories in that structure",
      d: ["Send only the feature title and let the model infer the audience and outcome","Ask for free-form prose so each story reads uniquely and naturally","Tell it to omit acceptance criteria to keep the stories short"],
      exp: "Well structured. Persona, goal, and an explicit acceptance-criteria format give the model the scaffold for consistent, ready-to-use stories instead of a different shape each time." },
    tr: { q: "Bir PM, AI'ın belirsiz özellik fikirlerini user story'lere çevirmesini istiyor. Tutarlı, kullanılabilir çıktı için nasıl prompt yazmalısın?",
      correct: "Persona'yı, hedefi ve açık bir kabul-kriteri şablonunu ver ve story'leri o yapıda iste",
      d: ["Yalnızca özellik başlığını gönder, kitleyi ve sonucu modelin çıkarmasına bırak","Her story benzersiz ve doğal okunsun diye serbest metin iste","Story'ler kısa kalsın diye kabul kriterlerini atlamasını söyle"],
      exp: "İyi yapılandırma. Persona, hedef ve açık kabul-kriteri formatı; her seferinde farklı değil, tutarlı ve kullanıma hazır story'ler için modele iskele verir." } },

  { idx: 2,
    en: { q: "Your customer-facing chatbot occasionally emits toxic or off-topic replies. What's the right design response?",
      correct: "Add input and output guardrails that validate, filter, and constrain responses before users see them",
      d: ["Lower the temperature so the model is less likely to wander off-topic","Add a disclaimer warning users that some answers may be inappropriate","Retry each request several times and return the shortest reply"],
      exp: "Solid. Guardrails that validate and constrain both inputs and outputs are the systematic fix — lowering temperature or adding a disclaimer doesn't actually stop unsafe content from reaching users." },
    tr: { q: "Müşteriye dönük chatbot'un ara sıra toksik veya konu-dışı yanıtlar veriyor. Doğru tasarım yanıtı nedir?",
      correct: "Yanıtlar kullanıcıya ulaşmadan önce doğrulayan, filtreleyen ve kısıtlayan girdi/çıktı guardrail'leri ekle",
      d: ["Model konudan sapma olasılığı azalsın diye temperature'ı düşür","Bazı cevapların uygunsuz olabileceğine dair kullanıcıya uyarı ekle","Her isteği birkaç kez tekrarla ve en kısa yanıtı döndür"],
      exp: "Sağlam. Hem girdiyi hem çıktıyı doğrulayan/kısıtlayan guardrail'ler sistematik çözümdür — temperature düşürmek veya uyarı eklemek, güvensiz içeriğin kullanıcıya ulaşmasını gerçekten engellemez." } },

  { idx: 0,
    en: { q: "An employee wants to paste a spreadsheet of customer names, emails, and account numbers into a public AI tool to summarize it. What should policy direct them to do?",
      correct: "Redact or avoid the PII, and use an approved tool covered by a data-handling agreement",
      d: ["Allow it as long as they delete the chat history afterward","Allow it but add a line to the prompt asking the tool not to store the data","Allow it if the spreadsheet is under a few hundred rows"],
      exp: "Good judgment. The risk is the PII leaving your control; redact it and route the task to an approved tool with real data terms — deleting the chat or asking nicely in the prompt doesn't govern retention." },
    tr: { q: "Bir çalışan, müşteri adları, e-postaları ve hesap numaralarından oluşan bir tabloyu özetletmek için public bir AI aracına yapıştırmak istiyor. Politika ne yönlendirmeli?",
      correct: "PII'ı redakte et veya gönderme; veri-işleme anlaşması kapsamındaki onaylı bir araç kullan",
      d: ["Sonradan sohbet geçmişini silmesi koşuluyla izin ver","İzin ver ama prompt'a aracın veriyi saklamamasını isteyen bir satır ekle","Tablo birkaç yüz satırın altındaysa izin ver"],
      exp: "İyi muhakeme. Risk PII'ın kontrolünden çıkması; redakte et ve görevi gerçek veri şartları olan onaylı bir araca yönlendir — sohbeti silmek veya prompt'ta rica etmek saklamayı yönetmez." } },

  { idx: 3,
    en: { q: "Teams across the company are quietly adopting unapproved AI tools ('shadow AI'). What's the most effective governance response?",
      correct: "Provide sanctioned, well-supported tools plus clear usage guidelines so people don't need to go around IT",
      d: ["Block all external AI tools at the network and consider the problem solved","Require a manager's email sign-off before anyone may use any AI tool","Wait for an incident, then write a restrictive policy in response"],
      exp: "Mature thinking. Shadow AI grows when there's no good sanctioned option; offering approved tools with clear guidance channels demand safely, where blanket blocks just push it out of sight." },
    tr: { q: "Şirket genelinde ekipler sessizce onaysız AI araçları benimsiyor ('shadow AI'). En etkili yönetişim yanıtı nedir?",
      correct: "Onaylı, iyi desteklenen araçlar + net kullanım kılavuzları sun ki insanlar IT'yi atlamak zorunda kalmasın",
      d: ["Tüm dış AI araçlarını ağ seviyesinde engelle ve sorunu çözülmüş say","Herhangi bir AI aracı kullanılmadan önce yöneticiden e-posta onayı şart koş","Bir olay olmasını bekle, sonra tepki olarak kısıtlayıcı bir politika yaz"],
      exp: "Olgun yaklaşım. Shadow AI, iyi bir onaylı seçenek olmayınca büyür; onaylı araçları net kılavuzla sunmak talebi güvenli kanala alır — topyekûn engel sadece gözden uzağa iter." } },

  { idx: 3,
    en: { q: "You want an assistant that can look up live order status, check inventory, and issue refunds. What capability does this require?",
      correct: "Tool use / function calling so the model can invoke your real APIs through a controlled interface",
      d: ["A larger context window so all order data fits in the prompt","Fine-tuning the model on last quarter's order history","A retrieval (RAG) index over past orders so it can read them"],
      exp: "Sharp distinction. Acting on live systems — not just reading about them — requires tool use / function calling. RAG retrieves text; it can't actually issue a refund." },
    tr: { q: "Canlı sipariş durumu sorgulayabilen, stok kontrol eden ve iade işleyebilen bir asistan istiyorsun. Bu hangi yeteneği gerektirir?",
      correct: "Modelin gerçek API'lerini kontrollü bir arayüzle çağırabilmesi için tool use / function calling",
      d: ["Tüm sipariş verisi prompt'a sığsın diye daha büyük bir context window","Modeli geçen çeyreğin sipariş geçmişiyle fine-tune etmek","Geçmiş siparişleri okuyabilmesi için onlar üzerinde bir retrieval (RAG) indeksi"],
      exp: "Keskin ayrım. Canlı sistemlerde eylem yapmak — sadece okumak değil — tool use / function calling gerektirir. RAG metin getirir; iadeyi gerçekten yapamaz." } },

  { idx: 1,
    en: { q: "You're giving an autonomous agent the ability to run shell commands and edit files. What's the most important guardrail before going live?",
      correct: "Scope its permissions tightly and require human confirmation for irreversible or destructive actions",
      d: ["Give it broad access so it never stalls on a permission error","Let it run unattended but email you a summary of what it did afterward","Cap the model's output length so its commands stay short"],
      exp: "Safety-first, exactly. Least-privilege scoping plus a human gate on destructive, hard-to-reverse actions keeps an agent from causing real damage — an after-the-fact summary is too late." },
    tr: { q: "Otonom bir agent'a shell komutu çalıştırma ve dosya düzenleme yeteneği veriyorsun. Yayına almadan önceki en önemli guardrail nedir?",
      correct: "İzinlerini dar tut ve geri alınamaz veya yıkıcı eylemler için insan onayı şart koş",
      d: ["Bir izin hatasında takılmasın diye ona geniş erişim ver","Gözetimsiz çalışsın ama sonradan ne yaptığının özetini sana e-postayla gönder","Komutları kısa kalsın diye modelin çıktı uzunluğunu sınırla"],
      exp: "Önce-güvenlik, aynen. Least-privilege kapsam + yıkıcı, zor-geri-alınır eylemlerde insan kapısı, agent'ın gerçek hasar vermesini engeller — sonradan özet çok geç." } },

  { idx: 0,
    en: { q: "Your coding assistant keeps inventing internal API methods that don't exist in your codebase. What design change fixes the root cause?",
      correct: "Ground it in your actual repository via retrieval (RAG) so it answers from real code",
      d: ["Add a system instruction telling it to never invent methods","Raise the temperature so it explores more method options","Switch to a model with a more recent training cutoff"],
      exp: "Right at the root. The model never saw your private code, so the durable fix is retrieval that puts real repository code in front of it — a 'don't invent' rule or a newer model can't supply knowledge it never had." },
    tr: { q: "Coding asistanın, kod tabanında olmayan iç API metotları uydurup duruyor. Kök nedeni hangi tasarım değişikliği çözer?",
      correct: "Onu retrieval (RAG) ile gerçek deponuna toprakla ki gerçek koddan cevap versin",
      d: ["Asla metot uydurmamasını söyleyen bir system talimatı ekle","Daha çok metot seçeneği keşfetsin diye temperature'ı yükselt","Daha yeni eğitim kesim tarihli bir modele geç"],
      exp: "Tam kökten. Model senin özel kodunu hiç görmedi; kalıcı çözüm, gerçek depo kodunu önüne koyan retrieval'dır — 'uydurma' kuralı veya yeni model, hiç sahip olmadığı bilgiyi veremez." } },

  { idx: 2,
    en: { q: "Before shipping an AI feature that summarizes legal documents, how should you judge whether it's good enough?",
      correct: "Build a task-specific eval set of representative inputs with known-good outputs and measure against it",
      d: ["Rely on the model provider's published benchmark scores","Have one senior engineer read a couple of outputs and approve","Ship to a small group and act only if complaints come in"],
      exp: "Rigorous. A task-specific eval set with representative inputs and expected outputs is the reliable pre-release signal — vendor benchmarks and a quick eyeball don't tell you how it does on your data." },
    tr: { q: "Hukuki belgeleri özetleyen bir AI özelliğini yayına almadan önce yeterince iyi olup olmadığını nasıl değerlendirmelisin?",
      correct: "Temsili girdiler ve bilinen-doğru çıktılardan oluşan göreve-özel bir eval seti kur ve ona karşı ölç",
      d: ["Model sağlayıcısının yayınladığı benchmark skorlarına güven","Bir kıdemli mühendis birkaç çıktıyı okusun ve onaylasın","Küçük bir gruba yayınla ve yalnızca şikayet gelirse harekete geç"],
      exp: "Titiz. Temsili girdiler ve beklenen çıktılarla göreve-özel eval seti, güvenilir yayın-öncesi sinyaldir — sağlayıcı benchmark'ları ve göz kararı, senin verinde nasıl çalıştığını söylemez." } },

  { idx: 0,
    en: { q: "An interactive AI feature feels sluggish, hurting UX. Which change best improves perceived latency without changing the answer?",
      correct: "Stream the response token-by-token so users see output immediately, and cache common results",
      d: ["Route every request to your largest model so it finishes thinking sooner","Batch several users' requests together before each call","Raise the max output tokens so the model never stops early"],
      exp: "Good UX instinct. Streaming output as it's generated, plus caching repeats, makes the feature feel fast without touching answer quality; batching helps throughput but delays an interactive reply." },
    tr: { q: "Etkileşimli bir AI özelliği yavaş hissettiriyor ve UX'i bozuyor. Cevabı değiştirmeden algılanan gecikmeyi en iyi hangisi iyileştirir?",
      correct: "Yanıtı token-token stream et ki kullanıcı çıktıyı anında görsün, ve sık sonuçları cache'le",
      d: ["Daha erken 'düşünmeyi bitirsin' diye her isteği en büyük modele yönlendir","Her çağrı öncesi birkaç kullanıcının isteğini birlikte batch'le","Model erken durmasın diye maksimum çıktı token'ını yükselt"],
      exp: "İyi UX sezgisi. Çıktıyı üretilirken stream etmek + tekrarları cache'lemek, cevap kalitesine dokunmadan hızlı hissettirir; batch throughput'a yarar ama etkileşimli yanıtı geciktirir." } },

  { idx: 3,
    en: { q: "Leadership asks whether to build a custom in-house model or use a hosted AI API for a new feature. What should drive the decision?",
      correct: "Whether the capability is core to your differentiation and whether you have the data, talent, and budget to sustain it — otherwise buy",
      d: ["Always build in-house to avoid depending on any external vendor","Always buy, since training a model in-house is never worthwhile","Match whatever the largest competitor in your industry chose"],
      exp: "Sound strategy. Build-vs-buy turns on whether the capability is truly core and sustainable for you — most teams should buy/use an API unless it's strategic differentiation they can resource long-term." },
    tr: { q: "Liderlik, yeni bir özellik için özel bir in-house model mi geliştirmeli yoksa hazır bir AI API mi kullanmalı diye soruyor. Kararı ne belirlemeli?",
      correct: "Yetenek farklılaşmanın çekirdeği mi ve onu sürdürecek veri/yetenek/bütçen var mı — yoksa satın al",
      d: ["Herhangi bir dış sağlayıcıya bağımlı kalmamak için her zaman in-house geliştir","In-house model eğitmek asla değmez, bu yüzden her zaman satın al","Sektöründeki en büyük rakip ne seçtiyse onu yap"],
      exp: "Sağlam strateji. Yap-satın al, yeteneğin gerçekten çekirdek ve senin için sürdürülebilir olup olmadığına bağlıdır — uzun vadede kaynak ayırabileceğin stratejik bir farklılaşma değilse çoğu ekip satın almalı." } },

  { idx: 2,
    en: { q: "You're scaling an AI feature from pilot to all users and must justify continued investment. What should you put in place to track ROI?",
      correct: "Tie cost per request to a concrete value metric (tickets deflected, hours saved) and watch it as usage grows",
      d: ["Track total monthly spend and keep it under a fixed cap","Assume ROI is positive because the pilot demo impressed everyone","Report the model's benchmark accuracy as the ROI figure"],
      exp: "Good discipline. Pairing cost per request with a concrete value metric and tracking it as you scale is how you prove ROI and catch unit economics that quietly break at volume." },
    tr: { q: "Bir AI özelliğini pilottan tüm kullanıcılara ölçeklendiriyorsun ve devam eden yatırımı gerekçelendirmelisin. ROI'yi izlemek için ne kurmalısın?",
      correct: "İstek başına maliyeti somut bir değer metriğine (savuşturulan talep, kazanılan saat) bağla ve kullanım büyüdükçe izle",
      d: ["Toplam aylık harcamayı izle ve sabit bir tavanın altında tut","Pilot demo herkesi etkilediği için ROI'nin pozitif olduğunu varsay","ROI rakamı olarak modelin benchmark doğruluğunu raporla"],
      exp: "İyi disiplin. İstek başına maliyeti somut değer metriğiyle eşleştirip ölçeklenirken izlemek, ROI'yi kanıtlamanın ve hacimde sessizce bozulan birim ekonomiyi yakalamanın yoludur." } },

  { idx: 1,
    en: { q: "A long AI coding session is nearing the model's context limit but the task isn't done. How do you continue without losing what matters?",
      correct: "Summarize the key decisions and current state into a compact handoff, then continue from that",
      d: ["Keep going and let the oldest messages fall out of the window automatically","Paste the entire raw transcript into a fresh session and continue","Lower the temperature so the model retains more of the earlier history"],
      exp: "Good context hygiene. A compact summary/handoff of the decisions and current state preserves what matters in far fewer tokens; re-pasting the raw transcript just hits the same limit again." },
    tr: { q: "Uzun bir AI kodlama oturumu modelin context limitine yaklaşıyor ama görev bitmedi. Önemli olanı kaybetmeden nasıl devam edersin?",
      correct: "Önemli kararları ve mevcut durumu kompakt bir handoff'a özetle, sonra ondan devam et",
      d: ["Devam et ve en eski mesajların pencereden otomatik düşmesine izin ver","Tüm ham transkripti yeni bir oturuma yapıştır ve devam et","Model daha eski geçmişi daha çok tutsun diye temperature'ı düşür"],
      exp: "İyi context hijyeni. Kararların ve mevcut durumun kompakt özeti/handoff'u önemli olanı çok daha az token'la korur; ham transkripti yeniden yapıştırmak aynı limite tekrar toslar." } },

  { idx: 2,
    en: { q: "An AI PR-review bot handles ~800 PRs/month. Each call averages ~6,000 input tokens and ~1,000 output tokens, and output is priced higher than input. What most directly determines the monthly bill?",
      correct: "Total tokens (input + output) across all calls, with output costed at its higher rate",
      d: ["Mainly the input tokens you send, since the bot's own comments aren't charged","Mainly the PR count; the size of each diff doesn't materially affect cost","The model's parameter count, which sets the price"],
      exp: "That's the calculation. Cost is total tokens across all calls — input and output priced separately, output weighted higher — which lets you forecast and control the bill. Output is not free." },
    tr: { q: "Bir AI PR-review botu ayda ~800 PR işliyor. Her çağrı ortalama ~6.000 input ve ~1.000 output token; output, input'tan daha pahalı. Aylık faturayı en doğrudan ne belirler?",
      correct: "Tüm çağrılardaki toplam token (input + output), output kendi yüksek oranıyla hesaplanarak",
      d: ["Çoğunlukla gönderdiğin input token'lar; çünkü botun kendi yorumları ücretsizdir","Çoğunlukla PR sayısı; her diff'in boyutu maliyeti kayda değer etkilemez","Fiyatı belirleyen şey olan modelin parametre sayısı"],
      exp: "Hesap bu. Maliyet, tüm çağrılardaki toplam token — input ve output ayrı fiyatlı, output daha ağır — ki bu faturayı öngörmeni sağlar. Output ücretsiz değildir." } },

  { idx: 1,
    en: { q: "A downstream program must reliably parse your model's output. What's the most robust way to design this?",
      correct: "Ask for output in a strict, specified JSON schema and validate it before use, repairing or rejecting on failure",
      d: ["Let the model reply in natural language and parse it with regular expressions","Add 'please stay consistent' to the prompt and trust the format to hold","Set temperature to zero so the wording never varies"],
      exp: "Robust by design. A defined JSON schema plus validation gives downstream code a contract to rely on; regexing free text or hoping for consistency breaks the first time the phrasing shifts." },
    tr: { q: "Aşağı-akış bir program, modelin çıktısını güvenilir şekilde parse etmeli. En sağlam tasarım hangisi?",
      correct: "Çıktıyı katı, belirtilmiş bir JSON şemasında iste ve kullanmadan önce doğrula; başarısızlıkta onar veya reddet",
      d: ["Model doğal dilde yanıtlasın ve onu regular expression'larla parse et","Prompt'a 'lütfen tutarlı kal' ekle ve formatın korunmasına güven","İfade hiç değişmesin diye temperature'ı sıfıra ayarla"],
      exp: "Tasarımca sağlam. Tanımlı JSON şeması + doğrulama, aşağı-akış koda güvenilecek bir sözleşme verir; serbest metni regex'lemek veya tutarlılık ummak, ifade değişir değişmez bozulur." } },

  { idx: 3,
    en: { q: "You want an assistant to reach several internal systems (a wiki, a ticket tracker, a database) through one consistent, reusable interface instead of bespoke one-off integrations. What fits best?",
      correct: "Expose each system through a standard tool/context protocol (e.g. MCP) so the assistant connects uniformly and reusably",
      d: ["Paste each system's full contents into the context window on every call","Fine-tune the model nightly on each system's data","Write a separate hard-coded integration inside the prompt for each system"],
      exp: "Clean and scalable. A standard protocol like MCP exposes tools and data sources through one consistent interface the assistant reuses — far better than brittle one-off integrations or stuffing everything into the prompt." },
    tr: { q: "Bir asistanın, tek seferlik özel entegrasyonlar yerine birkaç dahili sisteme (wiki, ticket takip, veritabanı) tek tutarlı, yeniden kullanılabilir bir arayüzle erişmesini istiyorsun. En uygun hangisi?",
      correct: "Her sistemi standart bir tool/context protokolü (örn. MCP) üzerinden sun ki asistan tek tip ve yeniden kullanılabilir şekilde bağlansın",
      d: ["Her sistemin tüm içeriğini her çağrıda context window'a yapıştır","Modeli her gece her sistemin verisiyle fine-tune et","Her sistem için prompt'un içine ayrı bir hard-coded entegrasyon yaz"],
      exp: "Temiz ve ölçeklenebilir. MCP gibi standart bir protokol, tool'ları ve veri kaynaklarını asistanın yeniden kullandığı tek tutarlı arayüzle sunar — kırılgan tek-seferlik entegrasyonlardan veya her şeyi prompt'a tıkmaktan çok daha iyi." } },

  { idx: 0,
    en: { q: "You tweak a production prompt to fix one bad case. How do you avoid silently breaking other cases you can't directly see?",
      correct: "Version the prompt and run it against a saved set of test cases (an eval/regression set) before rolling it out",
      d: ["Deploy it right away, since the case you just tested now works","Keep the prompt inline in the code and keep adjusting it in production as issues surface","Rely on remembering which earlier phrasings worked"],
      exp: "Treat prompts like code. Version them and run a saved regression/eval set before rollout, so a fix for one case can't quietly break ten others you didn't re-check." },
    tr: { q: "Bir production prompt'unu tek bir kötü vakayı düzeltmek için değiştiriyorsun. Doğrudan göremediğin diğer vakaları sessizce bozmamayı nasıl sağlarsın?",
      correct: "Prompt'u versiyonla ve yayına almadan önce kayıtlı bir test-vakası setine (eval/regresyon seti) karşı çalıştır",
      d: ["Test ettiğin vaka artık çalıştığı için hemen deploy et","Prompt'u kod içinde tut ve sorunlar çıktıkça production'da ayarlamaya devam et","Daha önce hangi ifadelerin çalıştığını hatırlamaya güven"],
      exp: "Prompt'ları kod gibi ele al. Versiyonla ve yayından önce kayıtlı regresyon/eval setine karşı çalıştır ki bir vakayı düzeltirken yeniden kontrol etmediğin on tanesini sessizce bozmayasın." } },
];

function build(lang) {
  return Q.map((it) => {
    const c = it[lang];
    const choices = new Array(4);
    choices[it.idx] = c.correct;
    let di = 0;
    for (let i = 0; i < 4; i++) if (i !== it.idx) choices[i] = c.d[di++];
    return { prompt: c.q, choices, correct: it.idx, explanation: c.exp };
  });
}

const dist = [0, 0, 0, 0];
for (const it of Q) dist[it.idx]++;
if (Q.length !== 20) throw new Error('expected 20 questions, got ' + Q.length);
writeFileSync(join(DIR, 'sdlc-exam.json'), JSON.stringify(build('en'), null, 2) + '\n');
writeFileSync(join(DIR, 'sdlc-exam.tr.json'), JSON.stringify(build('tr'), null, 2) + '\n');
console.log('wrote 20 EN + 20 TR; answer-position A/B/C/D =', dist.join('/'));
