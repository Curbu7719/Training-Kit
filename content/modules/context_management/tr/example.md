# Çalışılmış Örnek: Planı Kaybeden Çok Dosyalı Bir Refactor (Bakım Aşaması)

**Aşama: Bakım/Refactoring.** Bir geliştirici, bir AI asistanından eski bir serviste çekirdek bir `User` modelini `Account` olarak yeniden adlandırmasını ister — yaklaşık 30 dosyaya dokunarak. Oturum iyi başlar: asistan modeli, repository sınıfını ve birkaç çağıranı günceller. Sonra, yirmi dosya geçince, erken bir talimatı ("DB uyumluluğu için eski `user_id` kolon adını koru") "unutur" ve kolonu da yeniden adlandırmaya başlar, migration'ları bozar.

**Neden oldu.** Araç, model durumsuz olduğu için her çağrıda **tüm** transkripti — düzenlenen her dosyayı ve açıklamayı — yeniden gönderiyordu. Refactor büyüdükçe biriken bağlam **context window** sınırına yaklaştı. Sığdırmak için en eski içerik — o uyumluluk talimatı dahil — atıldı. Model bunu hiç görmedi, bu yüzden ona uyamadı.

**Strateji seçimleriyle düzeltmek.** Ekip iki yaklaşımı birleştirir:

- Kod tabanı için **retrieval**: 30 dosyanın hepsini yapıştırmak yerine, yalnızca mevcut düzenlemeyle ilgili birkaç dosyayı getir. Bu, tüm refactor boyunca pencereyi yalın tutar.
- Plan için **sabitlenmiş gerçeklerle özetleme**: refactor'un kurallarının kısa bir çalışan özetini tut ("`User`→`Account` yeniden adlandır; **`user_id` kolonunu koru**; tüm çağıranları güncelle"), her zaman en üstte yeniden gönderilir, böylece asla kaydırılıp gözden çıkmaz.

Artık her çağrı şunları içerir: sabitlenmiş refactor kuralları + o ana kadarki ilerlemenin bir özeti + yalnızca şu an düzenlenen dosyalar — pencere içinde rahatça.

**Bir başka seçenek.** BA'nın görüşme notlarındaki uzun gereksinim dizileri için de aynı fikir geçerlidir: her mesajı yapıştırmak yerine diziyi **özetle**.

**Çıkarım:** bağlamın tükenmesi bir model hatası değildir — bir tasarım kısıtıdır. Çözüm, her çağrıda *neyi dahil edeceğine* karar vermektir; kod için retrieval, plan için özetleme kullanarak, sınırın altında kalırken temel kuralların mevcut kalmasını sağlamak.
