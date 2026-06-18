# İşlenmiş Örnek: Bir %92 Eval Puanı Bir Başarısızlığı Gizlediğinde

**SDLC aşaması: Test / Bakım.** Bir ekip, destek araçlarının içine bir AI asistanı ship ediyor. QA'nın 200 vakalık golden dataset üzerindeki offline eval'i, bir LLM-as-judge ile **%92 accuracy** bildiriyor ve PM onaylıyor. Lansmandan iki hafta sonra şikayetler artıyor — özellikle iade hakkında soru soran kullanıcılardan. Yüksek puan gerçek bir başarısızlığı gizlemişti. Test uzmanının çalıştırdığı L2 teşhisi şöyle.

**Sorun 1 — Toplu puan bir alt grubu gizledi.** QA, %92'yi kategoriye göre dilimliyor. Billing, hesap ve nasıl-yapılır soruları %95–98 puan alıyor; **iade soruları %48 puan alıyor**. Veri kümesinde 200 vakanın yalnızca 12'si iade vakasıydı, bu yüzden kötü performansları ortalamayı pek etkilemedi. *Düzeltme:* veri kümesi katmanlanmamıştı — iadeler gerçek trafiğe göre yetersiz temsil edilmişti.

**Sorun 2 — Judge çok hoşgörülüydü.** 30 iade yanıtını örnekliyorlar ve insanların derecelendirmesini sağlıyorlar. İnsan-judge uyumu düşük: LLM judge, uzun ve kendinden emin oldukları için birkaç yanlış yanıtı kabul edilebilir olarak derecelendirdi — **verbosity bias**. *Düzeltme:* rubric'i belirli, doğru bir politika referansı gerektirecek şekilde sıkılaştırın, karşılaştırma sırasını randomize edin ve uyum yüksek olana kadar insan örneğine karşı yeniden doğrulayın.

**Sorun 3 — Atlanmış bir regresyon.** Geçmiş kontrol edildiğinde, iade accuracy'si üç sürüm önce iyiydi. Yanıtları kısaltmaya yönelik bir prompt değişikliği bir politika ayrıntısını düşürmüştü. İade'ye özel bir regresyon vakası var olmadığı için CI hiçbir şey yakalamadı. *Düzeltme:* gerçek başarısız olan iade sorularını kalıcı regresyon vakaları olarak ekleyin; böylece bu hata asla sessizce geri dönemez.

**Geri adım.** QA, veri kümesini gerçek trafiği yansıtacak şekilde yeniden katmanlar, gelecekteki her eval'i kategoriye göre dilimler, judge'ı periyodik insan etiketlerine karşı doğrular ve ekip, sürümleri yalnızca toplama değil, segment-başına puanlara göre geçitler. Prompt düzeltmesinden sonra yeniden çalıştırma, iadelerin başka bir kategori gerilemeden %94'e geri döndüğünü gösteriyor.

**Ders:** tek bir yüksek sayı "iyi" değildir. Güvenilir değerlendirme, temsili bir veri kümesi, doğrulanmış bir judge, gerçek hatalardan çıkarılmış regresyon vakaları ve hiçbir kritik alt grubun ortalamanın arkasına saklanamayacağı kadar ince dilimlenmiş puanlar demektir.
