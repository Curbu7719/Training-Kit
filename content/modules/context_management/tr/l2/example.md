# Çalışılmış Örnek: Her Stratejinin Hata Modu Isırdığında (Bakım Aşaması)

**Aşama: Bakım — çok günlü bir eski sistem migration'ı.** Bir ekip, bir servisi kullanımdan kaldırılmış bir framework'ten halefine taşımak için bir AI asistanı çalıştırır. Her biri farklı bir stratejinin hata modunu açığa çıkaran üç olay, neden bir tekniğin asla evrensel olarak "güvenli" olmadığını gösterir.

**Olay 1 — özetleme kayması.** Token'ları kontrol etmek için, migration'ın eski turları çalışan bir özete katlandı; bu özet de iş büyüdükçe yeniden özetlendi. Üçüncü güne gelindiğinde, "geriye dönük uyumluluk için herkese açık `/v1/orders` yanıt şeklini koru" kuralı sıkıştırılarak yok edilmişti. Model yanıt şemasını değiştirdi, aşağı akış tüketicilerini bozdu. **Ders:** özetleme kayıplıdır ve özetlerin özetleri kayar. Çözüm: geriye dönük uyumluluk kurallarını, asla özetlenmeyen, kelimesi kelimesine taşınan korumalı gerçekler olarak **sabitle**.

**Olay 2 — kayan pencere unutkanlığı.** İkinci bir oturum, özet olmadan yalnızca son 12 turu kelimesi kelimesine tuttu. Migration'ın 1. turdan itibaren belirtilen hedefi (auth'ı yeni middleware'e taşı, routing'e dokunma) kaydırılıp gözden çıktı ve asistan routing'i de yeniden yazmaya başladı. **Ders:** kayan pencere tasarım gereği unutkandır. Çözüm: bunu hedef ve kapsamın kısa, kalıcı bir özetiyle eşleştir.

**Olay 3 — retrieval kaçırması.** Kaynak dosyalar modele retrieval aracılığıyla sunuldu. Kötü parçalanmış bir dosya, bir doğrulama fonksiyonunu iki parçaya böldü; retriever yalnızca ilk yarıyı döndürdü ve model gerisini halüsinasyon olarak üretti, derlenen ama bir kontrolü atlayan kod ortaya çıkardı. **Ders:** retrieval riski retrieval kalitesine taşır — parça sınırları ve indeks tazeliği artık önemlidir. Çözüm: parçaları fonksiyon sınırlarına hizala ve getirilen parçaların düzenlenen sembolü kapsadığını kontrol et.

**Birleşik tasarım.** Ekip şunlarla bitirdi: kaynak dosyalar için retrieval (kalite kontrolleriyle), yakın diyalog için kayan pencere, eski geçmiş için çalışan bir özet, *sabitlenmiş* uyumluluk ve kapsam kuralları ve her günün sonunda yazılan bir **kontrol noktası**, böylece sonraki oturum temiz biçimde devam eder.

**Çıkarım:** her stratejinin karakteristik bir hata modu vardır. Sağlam context yönetimi teknikleri birleştirir ve asla kaybedilmemesi gereken gerçekleri korur.
