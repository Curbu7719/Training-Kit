# İşlenmiş Örnek: "AI'a Dikkat Et"i Uygulanabilir Bir Kurala Çevir

"Ne yapıştırdığına dikkat et" kimsenin tutarlı izleyemeyeceği bir öğüttür — ve bir denetçi bunu doğrulayamaz. Derinlikte işin, o belirsizliği insanlar yerine karar veren bir sisteme çevirmektir. İşte bu, günlük AI kullanımını zorlaştırmaz, kolaylaştırır.

**Veriyi etiketle ki kural otomatik olsun.** Veriyi public / internal / confidential / regulated diye etiketler ve her katmana bir AI kuralı bağlarsın: public snippet → herhangi bir onaylı araç; confidential kod → zero-retention kurumsal araç; regulated (PII/PHI/PCI) → maskelenir ya da hiç gönderilmez. *Bu gününü neden kolaylaştırır?* Kimse o an *yargıda bulunmak* zorunda kalmaz — etiket zaten karar vermiştir. "Dikkat et", "bu katman, bu araç" oldu.

**Sözleşmeyi doğrula, pazarlamaya güvenme.** "Zero-retention" ve "no-train" bir his değil, sözleşmede ve API config'inde yaşar. Residency (prompt'lar nerede işleniyor), saklama süresi, eğitime girip girmedikleri ve hangi alt-işleyicilerin gördüğünü kontrol edersin. *Neden uğraşmalı?* *Aynı* ürünün ücretsiz katmanı ile kurumsal katmanı zıt cevaplar verebilir — varsaymak denetimde sana pahalıya patlar.

**Alt-katman sızıntılarını kapat.** Tek yüzey prompt değildir: prompt'lar ve cevaplar **loglara** ve observability araçlarına da düşer. *Hamle:* AI trafiğini düz loglardan uzak tut ya da orada da maskele — çünkü logdaki sızıntı da sızıntıdır.

**Tüm bunların altında neden AI?** Çünkü artık confidential işte ona *evet* diyebilirsin. Sınıflandırma + doğrulanmış sözleşme + temiz loglar, hukuk ve güvenliğin gerçek kod tabanı kullanımını gölge AI'a sürmek yerine onaylamasını sağlayan tam da şeydir.

**Özet:** yönetişim AI'ı yavaşlatan şey değildir — onu önemli veride kullanmanı sağlayan şeydir. Sınıflandır, kuralları katmanlara bağla, sözleşmeyi doğrula ve log yüzeylerini mühürle; "dikkat et" kanıtlayabileceğin bir kontrole dönüşür.
