# İleri Prompting Desenleri

L1 temelleri kapsadı: net bir brief, system/user ayrımı, delimiter'lar ve iterasyon. L2,
**production** prompt'ları için araç setidir — çıktıyı, başka yazılımların ve takım arkadaşlarının
güvenebileceği kadar güvenilir kılan desenler ve bir prompt evrilirken çalışmaya devam etmesini
sağlayan disiplin.

**Çalışan bir örnek.** Ekibin, **bir spec'i yapılandırılmış bir test planına çeviren bir AI
özelliği** yayınlıyor ve bu plan aşağı-akış araçlarca tüketiliyor. Gelişigüzel bir prompt demoda
çalışır, production'da kırılır; bu desenler onu güvenilir kılan şeydir.

## Few-shot'u iyi yapmak

Örnek göstermek ("few-shot"), house style'ı tarif etmekten daha iyi öğretir — ama yalnızca örnekler iyiyse:

- **Temsili ve çeşitli** — kolay vakayı *ve* zor olanları (boş girdi, bir edge case) kapsa, üç benzer
  happy-path değil.
- **İstediğin formatla tutarlı** — örnekler *spec'in kendisidir*; herhangi bir tutarsızlık modele
  tutarsız olmayı öğretir.
- **Kasıtlı sıralı** — en net örneği başa koy; çok fazla örnek az kazanç için token israf eder, bu
  yüzden zero-shot'un gerçekten başarısız olduğu yere örnek ekle.

## Reasoning prompt'ları

Çok-adımlı problemler için modelin üzerinde çalışmasına izin ver: adım adım akıl yürütmesini iste ya
da bunu içsel yapan bir **reasoning model** kullan. Bu; zor mantık, debugging ve denge analizinde
yardımcı olur. Basit görevler için yalnızca token ve gecikme ekler — ve aşağı-akış kod için yalnızca
nihai cevaba ihtiyacın varsa, akıl yürütüp **yalnızca** yapılandırılmış sonucu döndürmesini sağla.

## Bir sözleşme olarak yapılandırılmış çıktı

Sonucu bir araç ya da takım arkadaşı tüketecekse, serbest metin bir risktir. Katı bir **çıktı
sözleşmesi** belirt: adlandırılmış bir JSON şeması (ya da sabit bir şablon), delimiter'larla
sarılmış, modele *yalnızca* onu döndürmesi söylenmiş. Sonra kullanmadan önce çıktıyı **doğrula**;
başarısızlıkta onar ya da reddet. Tanımlı bir şema artı doğrulama, aşağı-akış kodun prose'u
regex'lemek yerine sonuca güvenmesini sağlayan şeydir.

## Versiyonlanmış artefakt olarak prompt'lar

Bir production prompt koddur. Onu **version control'da ya da bir prompt registry'sinde** tut, satır
içi ve canlı düzenlenmiş değil; değişken kısımları (spec, framework) **parametrele**, tüm string'i
yeniden yazma; ve değişiklikleri her değişiklik gibi incele. Bir prompt'u bir takım genelinde
sürdürülebilir kılan budur.

## Eval-güdümlü iterasyon

Prompt'ları vibe'la ayarlama. Temsili girdiler ve bilinen-doğru çıktılardan oluşan küçük bir **eval
seti** tut; prompt'u değiştir, seti çalıştır ve değişikliği **yalnızca skorlar iyileşirse** sakla. Bu,
prompt'lar için TDD'dir ve doğrudan Evaluation modülüne bağlanır — bir vakayı düzeltmenin sessizce on
tanesini bozmamasını böyle sağlarsın.

## Sağlamlık (robustness)

Gerçek girdiler dağınıktır ve bazen düşmancadır. Belirsizliği ele al (bilgi eksikse modele tahmin
ettirmek yerine ne yapacağını söyle) ve prompt'taki herhangi bir **güvenilmez metni** (yapıştırılmış
bir ticket, getirilen bir belge) talimat değil veri olarak ele al — Guardrails'te kapsanan prompt-
injection sınırı.

## Her rol bunu nasıl kullanır

- **Developer/Mühendis:** Doğrulamalı JSON-şeması çıktı sözleşmesini yazar, prompt'u parametreler ve
  version control'a alır ve CI'da bir eval setine karşı iterasyon yapar.
- **İş Analisti:** Temsili ve edge-case örnekleri sağlar ve "iyi" bir çıktının ne içerdiğini tanımlar,
  böylece few-shot ve eval seti gerçek gereksinimleri yansıtır.
- **PM/Ürün Sahibi:** Prompt'u sürdürülen bir varlık olarak ele alır (versiyonlu, incelenmiş) ve bir
  prompt değişikliği yayınlanmadan önce eval setinin geçmesi gereken kalite çıtasını koyar.
- **QA/Tester ve Mimar:** Eval/regresyon setini kurar, çıktıyı şemaya karşı ve injection sağlamlığı
  için test eder ve prompt-versiyonlama ile doğrulama dikişlerini tasarlar.
