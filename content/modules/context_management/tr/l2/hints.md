# İpuçları & Alternatif İfadeler (L2)

## Temel fikrin alternatif ifadeleri

- **Tek cümleyle:** Her context stratejisi alanı bir bedelle satın alır — özetleme doğruluk kaybeder, kayan pencere erken kuralları unutur, retrieval doğru dosyaları getirmeye bağlıdır, kontrol noktası doğru migration durumunu yakalamaya bağlıdır — bu yüzden hangi hata modunu tolere edebileceğinize göre seçim yaparsınız.
- **Başka bir açıdan:** AI destekli bir refactor için "güvenli" tek bir teknik yoktur. Sağlam sistemler stratejileri birleştirir ve asla atılmaması gereken kuralları (uyumluluk kısıtları, kapsam) açıkça korur.
- **Risk çerçevesi:** Bir strateji seçmek bir hata modu seçmektir. Bu seçimi bilinçli yapın, sonra tam olarak o hata için test edin.

## Kademeli ipucu yığını

- **H1:** Her strateji için sorun "bu sessizce neyi kaybeder?" Özetleme ayrıntı kaybeder; kayan pencere erken turları kaybeder; retrieval yanlış/hiç dosya getirebilir; kontrol noktaları devam eden kararları atlayabilir.
- **H2:** Hata modunu belirtiyle eşleştirin. Erken belirtilen bir uyumluluk kuralının geç ihlal edilmesi → kaydırılıp gözden çıktı (kayan pencere) ya da sıkıştırılarak yok edildi (özetleme). Yoktan üretilmiş kod → retrieval kaçırdı ya da parçalama bir fonksiyonu böldü. Biten işi tekrar yapan, devam ettirilmiş bir oturum → eksik bir kontrol noktası.
- **H3:** En güçlü yanıtlar genellikle stratejileri *birleştirir* ve pazarlık konusu olmayan kuralları *sabitler* ki asla özetlenmesin ya da atılmasın. Ayrıca konum etkilerini (ortada kaybolma — kritik dosyaları kenarlara yakın yerleştir) ve çıktı baş boşluğu ayırmayı unutmayın — yalnızca daha büyük bir pencere çözüm değildir.

## SSS

**S: Çok daha büyük bir context window, tüm bunlardan daha basit bir çözüm değil mi?**
C: Yardımcı olur ama bir tedavi değildir. Daha büyük pencereler daha pahalıdır ve sık çağrılarda gecikme ekler, modeller bağlam ortasındaki dosyalara daha az güvenilir biçimde dikkat edebilir ve yine de üretilen çıktı için yer ayırmanız gerekir. Strateji yine de önemlidir.

**S: Uzun bir migration boyunca özetler neden kötüleşir?**
C: Bir önceki özeti özetlemek kaybı biriktirir — her tur kaynaktan daha da uzaklaşır. Kritik kuralları (geriye dönük uyumluluk, kapsam) yeniden özetlenmelerine izin vermek yerine kelimesi kelimesine sabitleyerek koruyun.

**S: Retrieval tabanlı kod asistanım bazen kendinden emin ama yanlış kod yazıyor. Neden?**
C: Muhtemelen bir retrieval kaçırması — yanlış, kısmi ya da bayat dosyalar. Model sonra boşluğu halüsinasyonla doldurur. Parça sınırlarını fonksiyonlara hizalayın, düzenlemelerden sonra indeksi yenileyin ve getirilen parçaların değiştirdiğiniz sembolü kapsadığını doğrulayın.
