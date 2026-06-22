# Derinlemesine AI Özelliklerini Değerlendirme: Güvenilir Ölçüm

L1, yaklaşımları ve metrikleri tanıttı. L2'de zor olan kısım, ölçümün kendisini *güvenilir* kılmaktır — kusurlu bir eval, hiç olmamasından daha kötüdür, çünkü QA'ya ve PM'e sahte bir güven verir ve bir sürüm, yalan söyleyen yeşil bir sayı üzerinden ship edilir. Merkezi sorular şunlar olur: veri kümem temsili mi, judge'ım güvenilir mi ve bir puan değişimi gerçek bir değişiklik anlamına mı geliyor?

**Veri kümeniz size yalan söyleyebilir.** Yalnızca kolay, mutlu-yol girdilerinden alınan bir golden set, özellik gerçek kullanıcıların karşılaştığı edge case'lerde başarısız olurken yüksek puanlar bildirir. Güçlü veri kümeleri **katmanlanmıştır** (stratified) — zor vakaları, nadir kategorileri, adversarial girdileri ve bilinen geçmiş başarısızlıkları kasıtlı olarak kapsar. Her production hatası yeni bir eval vakasına damıtılmalıdır; böylece asla sessizce geri dönemez; bu, bir regresyon paketinin tıpkı her hata düzeltmesi için başarısız bir test eklemek gibi diş kazanma biçimidir.

**LLM-as-judge'ın kendisi doğrulanmalıdır.** Bir judge modelinin önyargıları vardır: **position bias** (ikili bir karşılaştırmada ilk seçeneği kayırma), **verbosity bias** (daha uzun yanıtları daha yüksek derecelendirme) ve **self-preference** (kendi model ailesinin çıktılarını kayırma). Hafifletmeler: judge puanlarını bir insan derecelendirmeleri örneğine karşı doğrulayarak uyumu ölçün; seçenek sırasını randomize edin; muğlak bir "1–10 derecelendir" yerine somut bir rubric kullanın. Judge-insan uyumu düşükse, judge'ın sayıları gürültüdür ve CI geçidiniz anlamsızdır.

**Offline vs online.** Offline eval'ler (golden dataset'ler, CI'da sürüm öncesi çalıştırılır) hızlı, ucuz, tekrarlanabilirdir — ama yalnızca veri kadar iyidir. **Online eval'ler** — A/B testleri ve thumbs-up, kullanıcı düzenlemeleri veya görev tamamlama gibi production sinyalleri — gerçek etkiyi ölçer ama yavaştır ve yalnızca ship ettikten sonra mevcuttur. Olgun ekipler offline'ı hızlı bir geçit, online'ı ground truth olarak kullanır; mimarın tasarladığı observability dashboard'larıyla.

**Puanları dürüstçe okumak.** Çıktılar non-deterministik olduğundan, küçük bir puan dalgalanması sinyal değil gürültü olabilir — tepki vermeden önce gerçek bir regresyonu çalıştırmadan-çalıştırmaya varyanstan ayırın. **Alt grup başarısızlıklarını gizleyen toplu puanlara** dikkat edin: genel bir %90, kritik bir kategoriyi %40'ta maskeleyebilir, bu yüzden segmente göre dilimleyin. Ve bir proxy'yi gerçek kaliteyi yansıtmayı bırakana kadar optimize etmekten sakının (**Goodhart yasası**): bir ölçü hedef haline geldiğinde, iyi bir ölçü olmaktan çıkar.

## Her rol bunu nasıl kullanır

- **Tester:** Veri kümelerini katmanlar, her production hatasını regresyon vakası olarak ekler, judge'ı insan etiketlerine karşı doğrular ve puanları segmente göre dilimler.
- **Developer:** Katmanlı eval'ları ve segment bazlı dilimlemeyi CI'a bağlar.
- **Project Manager:** Hızlı offline geçitleri daha yavaş online ground truth'a karşı dengeler, veri kümesinin iş açısından kritik segmentleri kapsamasını sağlar ve bir proxy metriği gerçek değer pahasına optimize etmeye karşı korur.
- **Enterprise Architect:** Production observability'sini tasarlar ve toplu puanların asla başarısız bir alt grubu gizlememesini sağlar.
