# İşlenmiş Örnek: Kodlama Aşamasında Birim Testleri için Prompt Yazmak

**Görev:** kodlama aşamasında bir geliştirici, yeni fiyatlandırma özelliğinin kapsamla birlikte yayınlanması için modelin bir `parse_price` fonksiyonu için birim testleri üretmesini istiyor.

**İlk deneme (belirsiz):**

> parse_price fonksiyonum için biraz test yaz.

Modelin elinde kod yok, framework yok ve hangi uç durumların önemli olduğuna dair fikri yok. Akla yatkın görünen bir fonksiyon imzası uydurur, rastgele bir framework seçer ve var olmayan bir API'ye karşı iki mutlu-yol testi yazar. Yapı için işe yaramaz.

**Mühendislik yapılmış prompt.** Bir rol ekleriz, gerçek kodu sınırlayıcılar içine yapıştırırız, görevi tam olarak belirtiriz ve çıktı biçimini sabitleriz:

> **System:** Sen kıdemli bir Python mühendisisin. Testleri yalnızca `pytest` kullanarak yaz. Gösterilmeyen fonksiyonlar uydurma.
>
> **User:** Etiketler arasındaki fonksiyon için birim testleri üret. Şunları kapsa: geçerli bir fiyat string'i, boş bir string, negatif bir değer ve sayısal olmayan bir girdi.
> Tek bir test dosyası döndür, düz metin (prose) ekleme.
> `<code>def parse_price(s): ...</code>`

Şimdi model, projenin gerçek framework'ünü kullanan dört hedefli testle temiz bir `test_parse_price.py` döndürür.

**Bir few-shot örneği eklemek** ev tarzını sabitler. Adlandırma ve yapının eşleşmesi için var olan bir testi başa ekleriz:

> Test tarzımızdan bir örnek:
> `<test>def test_parse_price_valid(): assert parse_price("9.99") == 9.99</test>`
> Şimdi gerisini bu tarzda üret.

**Her değişiklik neden önemliydi:**

- **System mesajı** framework'ü sabitledi ve uydurulmuş API'leri yasakladı — böylece testler gerçekten çalışıyor.
- **Kodu sınırlayıcılar içine yapıştırmak** modele tahmin yerine gerçek zemin verdi ve koddaki bir yorumun talimat olarak okunmasını engelledi.
- **Tam durumları listelemek** "biraz test"i, QA'nın önemsediği uç durumlara dönüştürdü.
- **Few-shot örneği** ekibin adlandırma kuralıyla eşleşti, böylece diff temiz şekilde merge oldu.

**Ders:** model denemeler arasında daha akıllı olmadı — *brifing* oldu. Yapılandırılmış, koda dayalı, örnekle desteklenmiş bir prompt, bir tahmini CI pipeline'ının çalıştırabileceği çalışır testlere dönüştürdü.
