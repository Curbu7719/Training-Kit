# İşlenmiş Örnek: Fatura Şoku Yok — Aracı Önce Bütçele

İş akışına bir AI adımı eklemek istiyorsun ama sürpriz faturadan çekiniyorsun. Token'larla düşünmek, taahhütten önce maliyeti öngörmeni — ve onu tasarımla düşürmeni — sağlar, işte.

**Tahmin etme, ölç.** Aracın göreceği birkaç gerçek girdiyi al ve modelin kendi tokenizer'ından geçir. PR-inceleme örneği ortalama ~6.000 token girdi, ~1.000 çıktı. *Neden ölç?* Kod ve alan metnin, kabaca bir kuralın öngördüğünden daha ağır tokenize olur — tahmin epey şaşabilir.

**Hesabı yap.** Aylık maliyet ≈ çalıştırma × (girdi token × girdi fiyatı + çıktı token × çıktı fiyatı). Para kazandıran içgörü: **çıktı daha pahalı fiyatlanır**, bu yüzden aşırı uzun çıktıyı kırpmak ("yalnızca en önemli sorunlar", deneme değil) faturayı, girdiyi kırpmaktan daha çok düşürür.

**Cevabı koru.** Devasa bir girdi tüm context window'u yiyip yanıta yer bırakmayabilir; bu yüzden aşırı büyük girdileri parçalarsın — araç kesilmek yerine kullanışlı kalır.

**Türkçe püf noktası.** Girdilerin Türkçe ise İngilizce kuralının önerdiğinden daha fazla token'a mal olur — eksik bütçelememek için bunu tahmine ekle.

**Neden uğraşayım?** Çünkü beş dakikalık bir token tahmini, "bütçeyi aşabiliriz"i Proje Yöneticine savunabileceğin bir sayıya — ve ucuz kalacak şekilde tasarlayabileceğin bir araca — çevirir.
