# Uygulamalı Örnek: Bir AI Kod İnceleme Botunun Bütçelenmesi

**Aşama: sürekli entegrasyon / kod inceleme.** Bir platform ekibi, her pull request'e yorum
yapan bir AI inceleyici eklemek istiyor. Onu açmadan önce, özelliği ay için bütçeleyebilmek
adına token maliyetini tahmin ediyorlar.

**İçeri ne giriyor.** Tipik bir PR'de bot, diff'i ve çevresindeki bir miktar kodu okur —
yaklaşık **600 satır**. Kaynak kod token açısından ağırdır: parantezler, girinti ve
tanımlayıcılar hepsi token harcar, bu yüzden ekip düz metin oranını kullanmaz. Temsili bir
diff'i kendi modelleri için bir tokenizer'dan geçirip **~9.000 girdi token'ı** ölçerler. Ayrıca
sabit bir talimat prompt'unu ("Bu diff'i hatalar, güvenlik sorunları ve stil açısından
incele…") yaklaşık **300 token** olarak başa eklerler, böylece girdi PR başına **~9.300 token** olur.

**Dışarı ne çıkıyor.** Bot kabaca **400 kelimelik** inceleme yorumu yazar. Kabaca çıktı
tahminini `400 ÷ 75 × 100 ≈ 530 çıktı token'ı` kullanarak **~550 çıktı token'ına** yuvarlarlar.

**PR başına maliyet.** Girdi ve çıktı ayrı ayrı faturalandırıldığı için bunları ayrı
hesaplarlar. Modellerinin milyon girdi token'ı başına \$3 ve milyon çıktı token'ı başına \$15
ücret aldığını varsayalım:

| Bölüm | Token | Oran (1M başına) | Maliyet |
|---|---|---|---|
| Girdi (diff + prompt) | 9.300 | \$3 | \$0.0279 |
| Çıktı (yorumlar) | 550 | \$15 | \$0.0083 |
| **PR başına** | | | **~\$0.036** |

**Aya ölçeklendirme.** Ekip ayda yaklaşık **1.500 PR** birleştirir, yani tahmin
`1.500 × \$0.036 ≈ \$54/ay` olur — onaylanacak kadar ucuz.

**Kontrol ettikleri tuzak.** Tek bir devasa PR (20.000 satırlık üretilmiş bir migration)
modelin context window'unu tamamen aşardı, bu yüzden bot, bir token eşiğinin üzerindeki
diff'leri başarısız olmak yerine **atlamak veya parçalamak** üzere yapılandırılmıştır.

**Çıkarım:** istek başına tahmin et, girdiyi çıktıdan ayır, hacimle çarp — ve hem bütçeyi *hem
de* context sınırını bozan tek bir aşırı büyük dosyaya karşı koru.
