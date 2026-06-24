# İleri Prompt Desenleri

L1 temelleri kapsadı: net bir yönerge, sistem/kullanıcı ayrımı, ayraçlar ve yineleme. L2 ise
**üretim** prompt'ları için araç setidir — çıktıyı, başka yazılımların ve takım arkadaşlarının
güvenebileceği kadar sağlam kılan desenler ve bir prompt değişirken çalışmaya devam etmesini sağlayan
disiplin.

**Bir örnek.** Ekibin, **bir şartnameyi (spec) yapılandırılmış bir test planına çeviren bir AI
özelliği** yayınlıyor ve bu planı sonraki adımdaki araçlar tüketiyor. Gelişigüzel bir prompt demoda
çalışır, üretimde kırılır; bu desenler onu güvenilir kılan şeydir.

## Few-shot'u iyi yapmak

Örnek göstermek ("few-shot"), tarz tarif etmekten daha iyi öğretir — ama yalnızca örnekler iyiyse:

- **Temsili ve çeşitli** — kolay durumu *ve* zor olanları (boş girdi, bir uç durum) kapsa; üç benzer
  kolay örnek değil.
- **İstediğin biçimle tutarlı** — örnekler *şartnamenin kendisidir*; her tutarsızlık modele tutarsız
  olmayı öğretir.
- **Bilinçli sıralı** — en net örneği başa koy; çok fazla örnek az kazanç için token israf eder, bu
  yüzden örneği yalnızca prompt'un örneksiz başarısız olduğu yere ekle.

## Akıl yürütme prompt'ları

Çok adımlı problemlerde modelin üzerinde çalışmasına izin ver: adım adım akıl yürütmesini iste ya da
bunu kendi içinde yapan, akıl yürüten bir model kullan. Bu; zor mantık, hata ayıklama ve denge
analizinde yardımcı olur. Basit işlerde yalnızca token ve gecikme ekler — ve sonraki adımdaki kod için
yalnızca nihai cevap lazımsa, akıl yürütüp **yalnızca** yapılandırılmış sonucu döndürmesini sağla.

## Bir sözleşme olarak yapılandırılmış çıktı

Sonucu bir araç ya da takım arkadaşı tüketecekse, serbest metin risktir. Katı bir **çıktı sözleşmesi**
belirt: adlandırılmış bir JSON şeması (ya da sabit bir şablon), ayraçlarla sarılı ve modele *yalnızca*
onu döndürmesi söylenmiş. Sonra kullanmadan önce çıktıyı **doğrula**; başarısızlıkta onar ya da
reddet. Tanımlı bir şema artı doğrulama, sonraki adımdaki kodun serbest metni ayrıştırmaya çalışmak
yerine sonuca güvenmesini sağlayan şeydir.

## Versiyonlanan birer ürün olarak prompt'lar

Üretim prompt'u koddur. Onu **sürüm kontrolünde ya da bir prompt kayıt defterinde** tut, satır içinde
ve canlı düzenlenmiş değil; değişken kısımları (şartname, çerçeve) **parametrele**, tüm metni yeniden
yazma; ve değişiklikleri her kod değişikliği gibi incele. Bir prompt'u takım genelinde sürdürülebilir
kılan budur.

## Değerlendirmeyle yineleme

Prompt'ları sezgiyle ayarlama. Temsili girdiler ve bilinen-doğru çıktılardan oluşan küçük bir
**değerlendirme seti (eval)** tut; prompt'u değiştir, seti çalıştır ve değişikliği **yalnızca skorlar
iyileşirse** koru. Bu, prompt'lar için TDD'dir ve doğrudan Değerlendirme modülüne bağlanır — bir
durumu düzeltmenin sessizce on tanesini bozmamasını böyle sağlarsın.

## Sağlamlık

Gerçek girdiler dağınıktır, bazen de düşmancadır. Belirsizliği ele al (bilgi eksikse modele tahmin
ettirmek yerine ne yapacağını söyle) ve prompt'taki herhangi bir **güvenilmez metni** (yapıştırılmış
bir talep kaydı, getirilen bir belge) talimat değil veri olarak ele al — Guardrails modülünde
işlenen prompt injection sınırı.

## Her rol bunu nasıl kullanır

- **Developer:** Doğrulamalı JSON şeması çıktı sözleşmesini yazar, prompt'u parametreler ve sürüm kontrolüne alır ve CI'da bir değerlendirme setine karşı yineler.
- **Tester:** Değerlendirme/regresyon setini kurar ve çıktıyı şemaya karşı ve prompt-injection sağlamlığı için test eder.
- **Solution Designer:** Temsili ve uç durum örnekleri sağlar ve "iyi" bir çıktının ne içerdiğini tanımlar; böylece few-shot ve değerlendirme seti gerçek ihtiyaçları yansıtır.
- **Project Manager:** Prompt'u bakımı yapılan bir varlık olarak görür (versiyonlu, incelenmiş) ve bir değişiklik yayınlanmadan önce değerlendirme setinin geçmesi gereken kalite çıtasını koyar.
- **Enterprise Architect:** Prompt versiyonlama ve doğrulama noktalarını, prompt'lar evrildikçe güvenilir kalacak biçimde tasarlar.
