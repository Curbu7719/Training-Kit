# İpuçları — AI'ı İyi Kullanmak (L2)

## Temel fikrin alternatif ifadeleri

- Derinlikte güvenlik *yargıdır*: ne kadar doğrulayacağın, yanlış cevabı nasıl yakalayacağın, neyi yapıştırabileceğin ve ne zaman yükselteceğin.
- Riske orantılı doğrula; kaynağı olmayan kendinden emin spesifiklere güvenme; neyi göndereceğine veri katmanı (public/internal/confidential) karar versin; dış içerikten gelen AI eylemlerini şüpheli gör.
- İnsan sorumlu kalır — bir incelemede "AI öyle dedi" asla cevap değildir.

## İpucu yığını

- **H1 (dürtme):** "Bu yanlışsa ne olur?" diye sor. Cevap ne kadar büyükse, o kadar sıkı kontrol et.
- **H2 (yapısal):** *Özetle*meyi (genelde güvenli) *eyleme geçme*den (gerçekten istediğini doğrula) ayır — özellikle içerik dışarıdan geldiyse.
- **H3 (çözümlü):** Liderlik sunumuna giden temiz bir "4,2 saat" → yüksek risk → kaynağa kadar izini sür → 6,8'miş → yanlış sayı, bir kararı yönlendirmeden yakalandı.

## SSS

- **Ne kadar kontrol yeter?** Yanılmanın maliyetine göre ayarla. Tek kullanımlık: neredeyse hiç. Karar/müşteri/geri alınamaz: kaynağa kadar izini sür ve bir insan ekle.
- **Halüsinasyon belirtileri neler?** İzi sürülemeyen kendinden emin spesifikler, uydurma atıf/bağlantılar veya var olmayan API/politikalar.
