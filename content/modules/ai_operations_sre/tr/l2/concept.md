# Ölçekte Agent Operasyonları — Yönetişim, Olaylar ve Yaşam Döngüsü

L1, eylem alan birkaç agent'ı işletmeyi ele aldı: etki alanını sınırla, eylemleri izle, sorumluluğu
bir insanda tut. L2 ise bunun **ölçekte ve zaman içinde** ne hale geldiğini anlatır — birçok sistem
ve ekip genelinde eylem alan bir agent *filosu*; burada yetkiler, kararlar ve eylemlerin maliyeti
birikir, altlarındaki model ve araçlar da **siz fark etmeden değişir**.

**Kod olarak politika (policy-as-code).** Filo ölçeğinde erişimi bir konsoldan agent agent
veremezsiniz. Her agent'ın kendi **servis kimliği**, en az yetki kapsamı ve ortam sınırları olur;
hepsi **kod olarak politika** biçiminde yazılır ve her değişiklik gibi incelenir. **Değişiklik
pencereleri** uygulanır — bir dondurma (freeze) sırasında otonom üretim eylemi yapılmaz — ve yüksek
etkili eylem türleri, her ekibin insafına bırakılmadan **tüm agent'lar için tek tip** zorunlu onay
taşır.

**Agent'larla VE agent'lar HAKKINDA olaylar.** Agent'lar artık hem müdahale eden hem de soruna yol
açan taraf; bu yüzden olay sınıflaması iki yöne ayrılır:

- **Müdahale eden agent** — otomatik ayıklama, runbook çalıştırma, ilk hat müdahale. Faydalı ama
  yanlış olabilir.
- **Hatalı eylem** — agent yanlış bir eylem aldı (yanlış servisi yeniden başlattı, kötü bir
  yapılandırma gönderdi).
- **Kaçak döngü** — maliyet yakan ya da zararı yayan tekrarlı veya zincirleme eylemler.
- **Injection ile ele geçirilme** — güvenilmez metin, bir agent'ı zararlı bir eyleme yönlendirdi.
- **Yetki aşımı** — bir agent dokunmaması gereken bir şeye ulaştı.

Evrensel kontrol aynıdır: **otonomiyi durdur (acil durdurma)** ve **eylemi geri al**. Her olay,
agent'ın **karar izini** içeren bir **suçlamasız olay sonrası inceleme (postmortem)** ile biter; ve
— AI'a özgü ayrıntı — her hatalı eylem, agent'ın davranışı için **yeni bir guardrail/politika ve bir
eval senaryosu** doğurur, böylece aynı yanlış eylem sessizce tekrarlayamaz.

**Denetlenebilirlik, uyum ve hesap verebilirlik.** Her agent eylemi günlüğe yazılır, hem agent
kimliğine *hem de* insan sahibine **atfedilebilir** ve mümkün olan her yerde **geri alınabilirdir**.
Düzenleyici gerçek nettir: bir agent'ın yaptığından bir insan hesap verir — "agent karar verdi" bir
savunma değildir — bu yüzden denetimler ve olay incelemeleri hangi agent'ın, hangi gerekçeyle, hangi
eylemi aldığını yeniden kurabilmelidir.

**Agent maliyet yönetimi (FinOps).** Her agent adımı bir LLM çağrısıdır ve eylemler bulut kaynakları
başlatabilir; bu yüzden döngüye giren ya da fazla istekli bir agent hızla para ve işlem gücü yakar.
Şöyle işletin: **maliyeti agent bazında atfedin**, kaçak döngüleri **anomali tespitiyle** yakalayın
(sabit bir eşik değil, trendden sapma), her agent'ın **eylem hızını ve harcamasını** sınırlayın ve
bir tavanı aşmanın o agent için **düşürme** (yalnızca öneri) mi yoksa **durdurma** mı olacağına karar
verin.

**Agent yaşam döngüsü.** Bir agent'ın davranışı onun **politikasıdır = istem + araçlar + yetkiler +
model** — hepsi sürüm kontrolünde tutulan, kod gibi incelenip yayına alınan, asla canlıda
düzenlenmeyen birer artefakt. Agent dünya üzerinde eylem aldığı için değişiklikler güvenli bir
yoldan geçer: **shadow** (gerçek olaylara karşı gözlem/dry-run modunda çalıştırın ve *önerdiği*
eylemleri insanların gerçekte yaptığıyla karşılaştırın) → **canary** (olayların küçük bir diliminde
otonom eylem almasına izin verin) → tek hamlede **politika geri alma** hazırken **yayına alma**. Bir
modelin kullanımdan kaldırılması ya da yeni bir araç da, diğerleri gibi bir davranış değişikliğidir.

**Güven merdiveni.** Olgunluk, kanıt biriktikçe otonomiyi genişletmektir: **yalnızca öneri → onayla
ve uygula → düşük riskli alanlarda sınırlı otonomi → daha geniş otonomi** — ve bir agent kötü
davrandığında ipi geri çekmektir. Bu, herhangi bir agent'ın ne kadar zeki olduğuyla değil; agent'lara
güvenle daha uzun bir ip vermenizi sağlayan politika, denetim ve guardrail düzeneğiyle ilgilidir.

## Her rol bunu nasıl kullanır

- **DevOps Engineer:** Kod olarak politika yetkilerini, agent bazında maliyet atfını ve anomali alarmlarını, eylem hızı tavanlarını ve yük atmayı ve agent politika değişiklikleri için shadow/canary düzeneğini kurar.
- **Infrastructure Engineer:** Ölçekte agent filosu için kapasiteye, kotalara ve maliyet kontrollerine sahiptir.
- **Developer:** Agent'ın politikasını (istem/araçlar/yetkiler/model) versiyonlar, shadow/canary yolunu bağlar ve her hatalı eylemi bir guardrail ve bir eval senaryosuna dönüştürür.
- **Release Manager:** Değişiklik pencerelerine ve agent başına düşürme-mi-durdurma-mı politikasına sahip çıkar; otonominin nerede genişleyebileceğine dair güven merdiveni kararını verir.
- **Security Engineer:** Injection/yetki kontrollerini ve girdiye güven sınırını tasarlar ve acil durdurmayı ve failover'ı gerçek arıza altında doğrular.
- **Governance:** Olay sınıflamasına, denetim/hesap verebilirlik kaydına ve "olaydan eval senaryosuna" döngüsüne sahiptir.
