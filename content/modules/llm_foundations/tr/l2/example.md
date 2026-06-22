# İşlenmiş Örnek: Tek Model Tüm Gününe Uymaz

Gün boyu AI kullanırsın ama her iş aynı modeli hak etmez. Modeli işe eşlemek araçlarını hızlı ve ucuz tutar — ve neden bir an düşünmeye değer, işte.

**Satır içi tamamlama — anında istersin.** Sen yazarken küçük hızlı bir model bir sonraki satırı önerir. *Neden küçük model?* Büyük bir "akıl yürüten" model her tuş vuruşunda saniyelerce düşünür ve servet harcar — burada hız zekâdan önemli, bu yüzden tamamlamayı en ucuz hızlı modele bağlar ve çıktıyı kısa tutarsın.

**PR incelemesi — her PR'da yeterince iyi.** Orta bir model her pull request'i inceler; yalnızca dağınık, korkutucu refactor'lar daha güçlü bir modele yükseltilir. *Neden hep büyük değil de route?* PR'ların çoğu rutindir — hepsini pahalı modele göndermek, ekstra hiçbir şey yakalamadan faturayı katlar.

**Nadir zor karar — büyük beyni getir.** Ara sıra "bu tasarım sağlam mı?" diye sorarsın — işte o zaman en güçlü akıl yürüten model maliyetini hak eder, çünkü nadirdir ve cevap gerçekten önemlidir.

**Çıktıyı dizginleyen iki ayar.** İnceleyici bir deneme değil en önemli sorunları versin diye **maksimum çıktıyı** sınırlarsın ve tamamlama blokta temiz bitsin diye bir **durdurma dizisi** koyarsın.

**Neden uğraşayım ki?** Tek büyük modeli her yere bağlamak basit görünen tuzaktır: tamamlama yavaşlar, fatura her sprint tırmanır ve yine halüsinasyonlara çarparsın. Modeli işe eşlemek, ihtiyacın olan yerde hız, önemli olan yerde derinlik verir.

**Özet:** "AI" diye tek bir şey yok — rutin için küçük hızlı bir model, zor karar için güçlü bir model ve her işi yapabilecek en ucuz modele gönderen bir route var.
