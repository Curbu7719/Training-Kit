// Append one trade-off question to each L1 module quiz (EN + TR).
// Trade-off = two legitimate approaches; the constraint in the prompt decides.
// Distractors are "right in a different context" — so it rewards reasoning,
// not recognition. Idempotent via a marker tag on the appended question.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'content', 'modules');

const ITEMS = [
  { code: 'llm_foundations', correct: 0,
    en: { q: "A task is simple but extremely high-volume and latency-sensitive, and a small error rate is cheap to catch downstream. Which model choice is the better *trade-off* here?",
      ch: ["A small, fast, cheap model — the volume and latency outweigh a marginal accuracy gain","The largest frontier model, since more capability is always safer","Fine-tune a mid-size model on the task before launching","A different random model per request to average out errors"] },
    tr: { q: "Bir görev basit ama çok yüksek hacimli ve gecikmeye duyarlı; küçük bir hata oranını aşağı-akışta ucuza yakalayabiliyorsun. Burada hangi model seçimi daha iyi *trade-off*?",
      ch: ["Küçük, hızlı, ucuz model — hacim ve gecikme, marjinal doğruluk kazancından ağır basar","En büyük frontier model; çünkü daha fazla yetenek her zaman daha güvenlidir","Başlatmadan önce orta boy bir modeli göreve fine-tune et","Hataları ortalamak için her istekte farklı rastgele bir model"] } },

  { code: 'tokens', correct: 2,
    en: { q: "Trimming the prompt lowers token cost but risks dropping context the model needs. For a high-stakes legal-summary feature where a missed clause is costly, which *trade-off* is right?",
      ch: ["Trim as aggressively as possible to minimize cost on every call","Always send the entire document so nothing is ever omitted","Keep the context the task genuinely needs even at higher token cost; trim only clearly-irrelevant text","Switch to the cheapest model so token price stops mattering"] },
    tr: { q: "Prompt'u kısaltmak token maliyetini düşürür ama modelin ihtiyaç duyduğu context'i atma riski taşır. Bir maddenin kaçması pahalıya patlayan, yüksek-riskli hukuki-özet özelliğinde hangi *trade-off* doğru?",
      ch: ["Her çağrıda maliyeti minimize etmek için olabildiğince agresif kısalt","Hiçbir şey atlanmasın diye her zaman tüm belgeyi gönder","Görevin gerçekten ihtiyaç duyduğu context'i daha yüksek token maliyetine rağmen koru; yalnızca açıkça-alakasız metni kırp","Token fiyatı önemini yitirsin diye en ucuz modele geç"] } },

  { code: 'context_management', correct: 1,
    en: { q: "You need a model to work across a large codebase where exact details matter and files cross-reference each other. Summarize-then-work vs retrieve-relevant-chunks — which *trade-off* fits?",
      ch: ["Summarize the whole codebase once and work from the summary — it's the most compact","Retrieve the specific relevant chunks per question — a summary would lose the exact details you need","Paste the entire codebase every call so nothing is ever missed","Lower the temperature so the model holds more of it in mind"] },
    tr: { q: "Modelin, tam ayrıntıların önemli olduğu ve dosyaların birbirine atıf yaptığı büyük bir kod tabanında çalışması gerekiyor. Özetle-sonra-çalış mı, ilgili-parçaları-getir mi — hangi *trade-off*?",
      ch: ["Tüm kod tabanını bir kez özetle ve özetten çalış — en kompakt olan bu","Soru başına ilgili belirli parçaları getir — özet, ihtiyacın olan tam ayrıntıları kaybeder","Hiçbir şey kaçmasın diye her çağrıda tüm kod tabanını yapıştır","Model daha çoğunu akılda tutsun diye temperature'ı düşür"] } },

  { code: 'prompting', correct: 3,
    en: { q: "Few-shot examples improve format adherence but add tokens to every call. For a simple, unambiguous extraction task run millions of times a day, which *trade-off* is better?",
      ch: ["Add several few-shot examples to every call for maximum reliability","Add one long, elaborate example so the model never misformats","Switch to a larger model instead of giving any examples","Go zero-shot with a crisp instruction — the task is simple, so few-shot's per-call token cost isn't worth it at this scale"] },
    tr: { q: "Few-shot örnekleri format uyumunu artırır ama her çağrıya token ekler. Günde milyonlarca kez çalışan basit, net bir çıkarım görevinde hangi *trade-off* daha iyi?",
      ch: ["Maksimum güvenilirlik için her çağrıya birkaç few-shot örnek ekle","Model asla yanlış formatlamasın diye uzun, ayrıntılı tek bir örnek ekle","Örnek vermek yerine daha büyük bir modele geç","Net bir talimatla zero-shot git — görev basit, few-shot'ın çağrı-başına token maliyeti bu ölçekte değmez"] } },

  { code: 'guardrails', correct: 0,
    en: { q: "A stricter output filter blocks more bad content but also rejects some legitimate answers (false positives). For an internal tool used only by trusted engineers, which *trade-off* fits?",
      ch: ["Lighter-touch guardrails — for trusted internal users, false positives hurt productivity more than the rare bad output","Maximum strictness regardless of audience, to be safe","No guardrails at all, since engineers can handle anything","Block every response that contains code, just in case"] },
    tr: { q: "Daha katı bir çıktı filtresi daha çok kötü içeriği engeller ama bazı meşru cevapları da reddeder (false positive). Yalnızca güvenilir mühendislerin kullandığı bir iç araçta hangi *trade-off* uygun?",
      ch: ["Daha hafif guardrail'ler — güvenilir iç kullanıcılarda false positive'ler, nadir kötü çıktıdan daha çok üretkenliği baltalar","Kitleden bağımsız, güvende olmak için maksimum katılık","Hiç guardrail yok; mühendisler her şeyle başa çıkar","Her ihtimale karşı kod içeren her yanıtı engelle"] } },

  { code: 'security_privacy', correct: 2,
    en: { q: "Self-hosting keeps data in-house but costs more and lags on model quality; a hosted API under a no-retention agreement is cheaper and stronger but data leaves your network. For moderately-sensitive internal docs covered by a vendor DPA, which *trade-off* is reasonable?",
      ch: ["Always self-host; sensitive data must never leave the building under any terms","Paste it into any public tool — a DPA makes everything safe","Use the hosted API under the no-retention/DPA terms — proportionate for moderate sensitivity; self-hosting would be overkill here","Email the vendor and ask them to delete it later"] },
    tr: { q: "Self-host veriyi içeride tutar ama daha pahalı ve model kalitesinde geride; no-retention anlaşmalı hosted API daha ucuz ve güçlü ama veri ağından çıkar. Vendor DPA kapsamındaki orta-hassasiyette iç belgeler için hangi *trade-off* makul?",
      ch: ["Her zaman self-host; hassas veri hiçbir şartla binadan çıkmamalı","Herhangi bir public araca yapıştır — DPA her şeyi güvenli kılar","No-retention/DPA şartlarıyla hosted API'yi kullan — orta hassasiyet için orantılı; self-host burada aşırı olur","Vendor'a e-posta atıp sonradan silmesini iste"] } },

  { code: 'tool_use_agents', correct: 1,
    en: { q: "An agent that plans and calls tools is powerful but adds latency, cost, and new failure modes. For a fixed, well-known 2-step sequence, which design *trade-off* is better?",
      ch: ["A fully autonomous agent loop, since agents are the modern approach","A simple scripted pipeline (or single call) — a deterministic 2-step task doesn't need open-ended agency","Give the agent unlimited steps so it can't get stuck","Add three more tools so it has options"] },
    tr: { q: "Planlayıp tool çağıran bir agent güçlüdür ama gecikme, maliyet ve yeni hata modları ekler. Sabit, iyi bilinen 2-adımlı bir dizi için hangi tasarım *trade-off*'u daha iyi?",
      ch: ["Tam otonom bir agent döngüsü; çünkü agent'lar modern yaklaşımdır","Basit scriptli bir pipeline (veya tek çağrı) — deterministik 2-adımlı görev açık-uçlu otonomi gerektirmez","Takılmasın diye agent'a sınırsız adım ver","Seçeneği olsun diye üç tool daha ekle"] } },

  { code: 'rag', correct: 3,
    en: { q: "Larger retrieval chunks give more surrounding context but dilute relevance and waste prompt space; smaller chunks are precise but can split a thought. For retrieving short, self-contained config snippets, which *trade-off* is better?",
      ch: ["The largest possible chunks, so context is never missing","One chunk per whole file, regardless of size","Disable chunking and embed entire documents","Smaller, self-contained chunks — config snippets are short and discrete, so precision beats surrounding context here"] },
    tr: { q: "Daha büyük retrieval parçaları daha çok çevresel context verir ama alakayı seyreltir ve prompt alanını harcar; küçük parçalar isabetlidir ama bir düşünceyi bölebilir. Kısa, kendi-içinde-bütün config parçacıkları getirmek için hangi *trade-off* daha iyi?",
      ch: ["Context hiç eksik olmasın diye olabildiğince büyük parçalar","Boyuttan bağımsız, dosya başına tek parça","Chunking'i kapat ve tüm belgeleri embed et","Daha küçük, kendi-içinde-bütün parçalar — config parçacıkları kısa ve ayrık, burada isabet çevresel context'ten önemli"] } },

  { code: 'evaluation', correct: 0,
    en: { q: "Human review is the most trustworthy eval but slow and costly; an LLM judge is fast and cheap but biased. For a gate that must run on *every* pull request, which *trade-off* fits — with what safeguard?",
      ch: ["LLM-as-judge for speed, validated against a sample of human labels so you trust its scores","Full human review on every PR; quality must never be automated","Skip evaluation in CI and rely on production complaints","Trust the LLM judge's raw scores without ever checking them against humans"] },
    tr: { q: "İnsan incelemesi en güvenilir eval ama yavaş ve pahalı; LLM judge hızlı ve ucuz ama yanlı. *Her* pull request'te çalışması gereken bir kapı için hangi *trade-off* uygun — hangi güvenceyle?",
      ch: ["Hız için LLM-as-judge, skorlarına güvenmek için bir insan-etiket örneğine karşı doğrulanmış","Her PR'da tam insan incelemesi; kalite asla otomatikleştirilmemeli","CI'da değerlendirmeyi atla ve production şikayetlerine güven","LLM judge'ın ham skorlarına, insanla hiç kıyaslamadan güven"] } },

  { code: 'cost_latency', correct: 1,
    en: { q: "Caching responses cuts cost and latency but can serve stale answers. For a feature answering questions over data that changes every hour, which caching *trade-off* is appropriate?",
      ch: ["Aggressively cache every response for as long as possible","Use a short TTL (or cache only the stable parts) so answers stay fresh enough for hourly-changing data","Never cache anything anywhere, to be safe","Cache by user rather than by query so everyone gets their own stale copy"] },
    tr: { q: "Yanıtları cache'lemek maliyeti ve gecikmeyi düşürür ama bayat cevap sunabilir. Her saat değişen veriler üzerinde soru cevaplayan bir özellikte hangi cache *trade-off*'u uygun?",
      ch: ["Her yanıtı olabildiğince uzun süre agresif cache'le","Kısa bir TTL kullan (veya yalnızca sabit kısımları cache'le) ki cevaplar saatlik-değişen veri için yeterince taze kalsın","Güvende olmak için hiçbir yerde hiçbir şeyi cache'leme","Sorguya göre değil kullanıcıya göre cache'le ki herkes kendi bayat kopyasını alsın"] } },

  { code: 'ai_architecture', correct: 2,
    en: { q: "Coding straight to one provider's SDK ships fastest; a provider-abstraction layer adds work but enables switching later. For an early MVP racing to validate the idea, which *trade-off* is reasonable?",
      ch: ["Build a full multi-provider abstraction layer up front so you're never locked in","Hard-code the provider everywhere and never plan for change","Ship directly to one provider now, keeping a thin seam — don't over-engineer abstraction before product-market fit","Support three providers from day one to be safe"] },
    tr: { q: "Doğrudan tek sağlayıcının SDK'sine kodlamak en hızlı yayınlar; sağlayıcı-soyutlama katmanı iş ekler ama sonradan geçişi mümkün kılar. Fikri doğrulamaya koşan erken bir MVP için hangi *trade-off* makul?",
      ch: ["Asla kilitlenmemek için baştan tam çok-sağlayıcılı bir soyutlama katmanı kur","Sağlayıcıyı her yere hard-code et ve değişimi hiç planlama","Şimdi tek sağlayıcıya doğrudan yayınla, ince bir seam bırak — PMF öncesi soyutlamayı aşırı mühendisleme","Güvende olmak için ilk günden üç sağlayıcıyı destekle"] } },

  { code: 'ai_fit_buildbuy', correct: 3,
    en: { q: "A capability is somewhat important but not your core differentiation, a solid hosted option exists, and your team is small. Which build-vs-buy *trade-off* fits?",
      ch: ["Build it in-house because owning more of the stack is always better","Build it because relying on a vendor is a risk you should never take","Wait and do nothing until you can afford to build it","Buy/integrate the hosted option now, and revisit building only if it later becomes true differentiation you can resource"] },
    tr: { q: "Bir yetenek bir miktar önemli ama çekirdek farklılaşman değil, sağlam bir hosted seçenek var ve ekibin küçük. Hangi yap-satın al *trade-off*'u uygun?",
      ch: ["İn-house geliştir; çünkü stack'in daha çoğuna sahip olmak her zaman daha iyidir","Geliştir; çünkü bir vendor'a güvenmek asla alınmaması gereken bir risktir","Geliştirmeye gücün yetene kadar bekle ve hiçbir şey yapma","Hosted seçeneği şimdi satın al/entegre et; ancak ileride kaynak ayırabileceğin gerçek bir farklılaşmaya dönüşürse geliştirmeyi yeniden değerlendir"] } },

  { code: 'ai_risk_governance', correct: 0,
    en: { q: "Heavy approval gates and audits reduce risk but slow delivery. For a low-risk, internal-only AI helper, which governance *trade-off* is appropriate?",
      ch: ["Lightweight governance proportional to the low risk — don't gate an internal helper like a customer-facing, regulated system","The same full approval board and audit trail you'd use for a public financial product","No governance at all, since it's internal","Block the project until a company-wide AI policy is finished"] },
    tr: { q: "Ağır onay kapıları ve denetimler riski azaltır ama teslimi yavaşlatır. Düşük-riskli, yalnızca-iç bir AI yardımcısı için hangi yönetişim *trade-off*'u uygun?",
      ch: ["Düşük riske orantılı hafif yönetişim — bir iç yardımcıyı müşteriye-dönük, regüle bir sistem gibi kapılama","Public bir finansal ürün için kullanacağın tam onay kurulu ve denetim izinin aynısı","İç olduğu için hiç yönetişim yok","Şirket-geneli bir AI politikası bitene kadar projeyi durdur"] } },

  { code: 'ai_value_scaling', correct: 1,
    en: { q: "A pilot shows modest but real value, yet the unit economics look shaky at full scale. Which scaling *trade-off* is the disciplined choice?",
      ch: ["Roll out to everyone immediately — it works, so scale is the obvious next step","Fix the unit economics first (or scale a narrow high-value slice) before a full rollout","Kill it outright; modest value is never worth pursuing","Keep it in pilot forever to avoid the decision"] },
    tr: { q: "Bir pilot mütevazı ama gerçek bir değer gösteriyor, ancak birim ekonomi tam ölçekte sallantılı görünüyor. Hangi ölçekleme *trade-off*'u disiplinli seçim?",
      ch: ["Hemen herkese yay — çalışıyor, o yüzden ölçeklemek bariz sonraki adım","Tam yayılımdan önce birim ekonomiyi düzelt (veya dar, yüksek-değerli bir dilimi ölçekle)","Direkt kapat; mütevazı değer asla peşinden gidilmeye değmez","Kararı ertelemek için sonsuza dek pilotta tut"] } },

  { code: 'vibe_coding', correct: 2,
    en: { q: "While vibe coding, the AI is about 80% of the way to a fix but keeps looping on the last 20%, re-suggesting variants. Which *trade-off* between continuing and intervening is right?",
      ch: ["Keep prompting; with enough tries the model always converges","Accept the 80% version and move on, since most of it works","Take the wheel and finish the hard 20% yourself — the looping cost now exceeds just writing it","Restart the whole task from a blank prompt to reset its 'mood'"] },
    tr: { q: "Vibe coding sırasında AI bir düzeltmenin ~%80'ine geldi ama son %20'de döngüye girip varyantlar öneriyor. Devam etmek ile müdahale etmek arasında hangi *trade-off* doğru?",
      ch: ["Prompt'lamaya devam et; yeterli denemeyle model her zaman yakınsar","%80'lik sürümü kabul et ve devam et; çoğu zaten çalışıyor","Direksiyona geç ve zor %20'yi kendin bitir — döngü maliyeti artık onu yazmaktan fazla","'Modunu' sıfırlamak için tüm görevi boş bir prompt'tan yeniden başlat"] } },
];

let added = 0;
for (const it of ITEMS) {
  for (const [lang, sub] of [['en', null], ['tr', 'tr']]) {
    const path = sub ? join(ROOT, it.code, sub, 'quiz.json') : join(ROOT, it.code, 'quiz.json');
    if (!existsSync(path)) { console.warn(`! missing ${path}`); continue; }
    const arr = JSON.parse(readFileSync(path, 'utf8'));
    const c = it[lang];
    // idempotent: skip if this exact trade-off question is already present
    if (arr.some((q) => q.prompt === c.q)) continue;
    arr.push({ prompt: c.q, choices: c.ch, correct: [it.correct], points: 1 });
    writeFileSync(path, JSON.stringify(arr, null, 2) + '\n');
    if (lang === 'en') added++;
  }
}
console.log(`Added trade-off question to ${added} module L1 quizzes (EN + TR).`);
