# Çalışılmış Örnek: Bir "Akıllı Yanıt Önerisi" Özelliğini Temin Etmek

**Ekip.** Bir SaaS yardım masası ürünü **önerilen yanıtlar** eklemek istiyor: bir temsilci
bir müşteri talep'ini açtığında, uygulama düzenleyip gönderebileceği bir taslak yanıt sunuyor.
PM, bir geliştirici ve bir mimar bunu nasıl temin edeceklerine karar vermek için oturuyor.

**Adım 1 — AI gerçekten doğru araç mı?** Taslaklar serbest biçimli talep metnine bağlı ve
doğal okunmalı, dolayısıyla bu belirsiz, dil biçimli iş — bir LLM için iyi bir uyum. AI
*olmayan* kısımları ayırarak teyit ediyorlar: müşterinin planını ve sipariş geçmişini aramak
kesin bir veritabanı sorgusu, dolayısıyla o deterministik kod olarak kalıyor. Yalnızca
**taslak ifadesi** AI'ya gidiyor.

**Adım 2 — Doğruluk ve non-determinizm.** "Çoğunlukla doğru" bir öneri yeterli çünkü bir
insan **göndermeden önce düzenliyor** — yani modelin non-determinizmini tolere edebilirler.
Yanıt incelenmeden otomatik gönderilseydi bunu tolere *etmezlerdi*.

**Adım 3 — Build vs buy vs fine-tune vs API.** Dört seçeneği tartıyorlar:

- Önerilen yanıt yapan bir yardım masası eklentisini **satın al (buy)** — en hızlı, ama
  jenerik ve çekirdek destek iş akışlarında **vendor lock-in** yaratır.
- Şirket içinde bir model **build** et — ne eğitim verileri ne de bir nedenleri var, çünkü
  yanıt taslağı oluşturma farklılaştırıcıları değil.
- **Fine-tune** — cazip, ama henüz etiketli bir veri kümeleri yok.
- İyi bir prompt'la bir **API çağır** (barındırılan bir LLM) — düşük ön maliyet, haftalar
  içinde yayında.

**Karar.** Talep'i ve alınan hesap bilgilerini besleyerek, ince bir dahili **soyutlama
katmanının** arkasında **barındırılan bir LLM API'si çağırıyorlar**. Soyutlama **switching
cost**'ları düşük tutuyor — sağlayıcıları sonradan değiştirebilirler. Gerçek **TCO**'yu
izlemek için hacmi günlüklüyorlar ve düzenlenmiş-yanıt verisini topladıktan sonra kalite
platoya ulaşırsa yalnızca o zaman **fine-tune** etmeyi planlıyorlar.

**Bu neden doğru karar.** AI yalnızca belirsiz kısma uyuyor; deterministik arama kod olarak
kalıyor; bir insan geçidi non-determinizmi soğuruyor; ve bir soyutlamanın arkasında bir
API'yle başlamak değeri hızla getirirken sonraki her seçeneği — buy, fine-tune veya build —
düşük lock-in ile açık tutuyor.
