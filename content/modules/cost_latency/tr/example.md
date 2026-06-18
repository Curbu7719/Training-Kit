# Çözümlü Örnek: CI'da Bir AI PR İnceleyicisini Ayarlamak

Bir platform ekibi, her pull request'te çalışan ve satır içi yorumlar gönderen bir **AI kod
inceleyici** yayınlar. İlk sürüm, her değişen dosyayı *artı onun tüm üst modülünü* ve
ekibin tam stil kılavuzunu büyük bir modele gönderir, ardından ayrıntılı bir düzyazı
inceleme ister.

**PR başına temel (baseline).**

| Bölüm | Yaklaşık token | Notlar |
|---|---|---|
| Input (tüm dosyalar + stil kılavuzu + diff) | 9.000 | Çoğu dosya değişmemiş context'tir |
| Output (uzun düzyazı inceleme) | 1.500 | Her noktadan önce kodu yeniden ifade eder |

Büyük model **milyon input token başına 5$** ve **milyon output token başına 15$** ile, bir
inceleme yaklaşık olarak şu kadara mal olur:

`(9.000 × 5$ + 1.500 × 15$) ÷ 1.000.000 = 0,045$ + 0,0225$ = 0,0675$`

Ayda ~600 PR genelinde bu yaklaşık **40$** eder ve her inceleme ~11 saniye sürer — bir
geliştiricinin başka sekmeye geçip merge kapısını beklerken akışını kaybetmesine yetecek
kadar uzun.

**Kaldıraçları uygulamak.** Ekip üç değişiklik yapar:

1. **Context'i kırp** — tüm dosyalar yerine yalnızca değişen parçaları (hunk) artı
   etraflarındaki birkaç satırı gönderin, input'u 9.000'den **3.000 token'a** düşürerek.
2. **Ön eki cache'le** — stil kılavuzu ve inceleme kriterleri her PR'de aynıdır, bu yüzden
   her seferinde ham olarak yeniden göndermek yerine ön ek olarak prefix-cache yaparlar.
3. **Daha kısa output** — "en önemli 5 sorunu kısa madde işaretleri olarak" talimatı vererek
   output'u **400 token'a** düşürün ve yorumlar yazıldıkça görünsün diye **stream** edin.

**Ayarlamadan sonra.**

`(3.000 × 5$ + 400 × 15$) ÷ 1.000.000 = 0,015$ + 0,006$ ≈ 0,021$`

İnceleme başına maliyet **0,0675$'dan ~0,021$'a** düşer (prefix-cache tasarrufunu saymadan
önce yaklaşık %70 daha ucuz) ve latency kabaca **4 saniyeye** iner, ilk yorum bir saniyenin
altında stream olarak gelir.

**Denge kontrolü.** Değişen parçalar üzerindeki kısa madde işaretleri, tam context'li
incelemeye göre dosyalar arası sorunları biraz daha az yakalar. Ekip, rutin PR'ler için
bunun doğru denge olduğunu doğrular ve yalnızca sürüm dallarında daha ağır bir tam context'li
geçiş — büyük model, tüm modül — saklar. Kalite/maliyet/latency üçgeninde bilinçli, kontrol
başına bir nokta.
