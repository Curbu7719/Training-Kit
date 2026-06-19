# Ölçekte Agent Ops — Yönetişim, Olaylar ve Yaşam Döngüsü

L1, aksiyon alan birkaç agent'ı işletmeyi kapsadı: blast radius'u sınırla, aksiyonları gözlemle, bir
insanı hesap verebilir tut. L2 ise bunun **ölçekte ve zaman içinde** ne hale geldiğidir — birçok
sistem ve ekip genelinde aksiyon alan bir agent *filosu*; burada yetkileri, kararları ve
aksiyonlarının maliyeti birikir ve altlarındaki model ve araçlar **siz fark etmeden değişir**.

**Yetkiler ve politika kod olarak (policy-as-code).** Filo ölçeğinde erişimi bir konsolda agent
agent veremezsin. Her agent'ın kendi **service identity'si (servis kimliği)**, en az yetki
kapsamları ve ortam sınırları vardır; hepsi **policy-as-code** olarak ifade edilir ve herhangi bir
değişiklik gibi incelenir. **Change window'lar (değişiklik pencereleri)** geçerlidir — bir freeze
sırasında otonom production aksiyonu yok — ve yüksek-blast aksiyon sınıfları, her ekibin keyfine
bırakılmadan **her agent için tek tip** zorunlu onay taşır.

**Agent'larla VE agent'lar HAKKINDA olaylar.** Agent'lar artık hem müdahale eden hem de sebep olan
taraf, bu yüzden olay taksonomisi iki yöne ayrılır:

- **Müdahale eden agent** — oto-triage, runbook çalıştırma, ilk hat remediation. Faydalı, ama
  yanlış olabilir.
- **Agent misfire (yanlış tetikleme)** — yanlış bir aksiyon aldı (yanlış servisi yeniden başlattı,
  kötü bir config push'ladı).
- **Kaçak döngü (runaway loop)** — maliyet yakan ya da zararı yayan tekrarlı veya zincirleme aksiyonlar.
- **Injection ile ele geçirilme** — güvenilmez metin bir agent'ı zararlı bir aksiyona yönlendirdi.
- **Yetki/escalation arızası** — bir agent dokunmaması gereken bir şeye ulaştı.

Evrensel kontrol aynıdır: **otonomiyi durdur (kill-switch)** ve **aksiyonu geri al**. Her olay,
agent'ın **karar izini (decision trace)** içeren bir **suçlamasız (blameless) postmortem** ile
biter ve — AI'a özgü kıvrım — her misfire, agent'ın davranışı için **yeni bir guardrail/politika ve
bir eval case'i** olur; böylece aynı yanlış aksiyon sessizce tekrarlayamaz.

**Denetlenebilirlik, uyum ve hesap verebilirlik.** Her agent aksiyonu loglanır, bir agent kimliğine
*ve* insan sahibine **atfedilebilir (attributable)** ve mümkün olan her yerde **geri alınabilirdir**.
Düzenleyici gerçek serttir: bir agent'ın yaptığından bir insan hesap verir — "agent karar verdi" bir
savunma değildir — bu yüzden audit'ler ve postmortem'ler hangi agent'ın, hangi muhakemeyle, hangi
aksiyonu aldığını yeniden kurabilmelidir.

**Agentic FinOps.** Her agent adımı bir LLM çağrısıdır ve aksiyonlar cloud kaynakları başlatabilir,
bu yüzden döngüye giren ya da fazla istekli bir agent hızla para ve compute yakar. İşlet: **maliyeti
agent bazında atfet (attribution)**, kaçak döngüleri **anomali tespiti** ile yakala (sabit bir eşik
değil, trendden sapma), her agent'ın **aksiyon hızını ve harcamasını** sınırla ve bir agent başına
bir tavanı aşmanın **degrade** (yalnızca-öner) mi yoksa **durma** mı olacağına karar ver.

**Agent yaşam döngüsü.** Bir agent'ın davranışı onun **politikasıdır = prompt + araçlar + yetkiler +
model** — hepsi sürüm kontrolünde versiyonlanmış artefaktlar, kod gibi incelenip yayına alınır, asla
canlıda düzenlenmez. Agent dünya üzerinde aksiyon aldığı için değişiklikler güvenli bir yoldan geçer:
**shadow** (gerçek olaylara karşı gözlem/dry-run modunda çalıştır ve *önerdiği* aksiyonları insanların
gerçekte yaptığıyla karşılaştır) → **canary** (olayların küçük bir diliminde otonom aksiyon almasına
izin ver) → tek-çevirmelik **policy rollback** hazır şekilde **rollout**. Bir model deprecation'ı ya
da yeni bir araç, herhangi biri gibi bir davranış değişikliğidir.

**Güven merdiveni (trust ladder).** Olgunluk, kanıt biriktikçe otonomiyi genişletmektir:
**suggest-only → approve-then-act → düşük-riskli alanlarda sınırlı otonomi → daha geniş otonomi** —
ve bir agent kötü davrandığında ipi geri çekmektir. Bu, herhangi bir tek agent'ın ne kadar zeki
olduğuyla değil; agent'lara güvenle daha uzun bir ip vermeni sağlayan politika, audit ve guardrail
mekanizmasıyla ilgilidir.

## Her rol bunu nasıl kullanır

- **DevOps / SRE ve Infrastructure Engineer:** Policy-as-code yetkilerini, agent bazında maliyet
  attribution'ını ve anomali alarmlarını, action-rate tavanlarını ve load-shedding'i ve agent
  politika değişiklikleri için shadow/canary harness'ını uygular.
- **Developer:** Agent'ın politikasını (prompt/araçlar/yetkiler/model) versiyonlar, shadow/canary
  yolunu bağlar ve her misfire'ı bir guardrail ve bir eval case'e dönüştürür.
- **Release / Project Manager:** Change window'lara ve agent başına degrade-mı-dur-mu politikasına
  sahip çıkar ve otonominin nerede genişleyebileceğine dair güven-merdiveni kararını verir.
- **QA, Governance ve Security Engineer:** Olay taksonomisini ve runbook'ları, postmortem'den
  eval-case'e döngüsünü, audit/hesap verebilirlik izini ve injection/yetki kontrollerini tasarlar ve
  kill-switch'i ve failover'ı gerçek başarısızlık altında doğrular.
