# Token Mekaniği ve Bütçeleme

L1, token'ı tanıttı — modelin okuduğu alt-kelime birimi ve neden "1 kelime ≠ 1 token" olduğunu. L2,
token'lamanın neden böyle davrandığına daha derinden iner ve bunu **güvenilir bir maliyet ve bağlam
bütçesine** nasıl çevireceğini gösterir. Bu, faturanın altındaki mekaniktir; iyileştirme
kaldıraçlarından (önbellekleme, yönlendirme, akış — Maliyet ve Gecikme modülü) ayrıdır.

**Bir örnek.** **AI PR-inceleme botun** her pull request'te çalışıyor. Bütçesini onaylatmak ve bağlam
penceresine sığdırmak için token'larını tahminle değil, kesin hesapla öngörmen gerekir.

## Kod ve bazı metinler neden "daha ağır" token'lanır

Token'layıcı (tokenizer), metni veriden öğrenilmiş alt-kelime birimlerine böler (BPE türü bir
yöntem). Sonuçları:

- **Noktalama, boşluk ve semboller token harcar.** Kod; düz metinde olmayan `(){};`, girinti ve
  işleçlerle doludur; bu yüzden 400 satırlık bir fark (diff), 400 satırlık bir denemeden çok daha
  fazla token eder.
- **Nadir ya da bileşik kelimeler daha çok parçaya bölünür.** Yaygın bir kelime tek token olabilir;
  `getUserAccountByIdOrThrow` gibi sıra dışı bir ad birkaç parçaya ayrılır.
- **Özel/denetim token'ları vardır.** Mesajlar görünmeyen yapısal token'lar (rol işaretleri,
  ayraçlar) taşır ve onlar da sayılır; yani faturalanan toplam, görünen metninden biraz fazladır.

## Çok dillilik cezası

Token'layıcılar genelde İngilizce için ayarlanır. **Aynı cümle Türkçe'de (ya da İngilizce dışı
dillerde) çoğu zaman İngilizce'den belirgin biçimde daha fazla token eder**, çünkü model o kelimeleri
daha çok alt-kelime parçasına böler. Özelliğin İngilizce dışı metin işliyorsa, İngilizce kuralı yerine
bu ek yükü bütçele.

## Sayma: tahmin mi, kesin mi

- **Tahmin** ilk bakış için: kabaca **100 token ≈ 75 İngilizce kelime** — kaba boyutlandırmaya yeter.
- **Kesin say** maliyete duyarlı her şey için: metni **seçtiğin modelin token'layıcısından** geçir.
  Farklı model aileleri farklı token'lar, bu yüzden birinden alınan sayım diğeri için geçerli değildir.

## Faturayı bütçelemek

Maliyet **token × token başına fiyat**'tır; **girdi ve çıktı ayrı fiyatlanır** ve **çıktı genelde daha
pahalıdır**. Bir özelliği öngörmek için:

> aylık maliyet ≈ aylık istek × (ort. girdi token × girdi fiyatı + ort. çıktı token × çıktı fiyatı)

PR botu için: 800 PR × (6.000 girdi + 1.000 çıktı) token; çıktı daha ağır fiyatlı. Çıktı hacmi, token
sayısının ima ettiğinden daha önemlidir — bunu tahminde unutma.

## Bağlam penceresini bütçelemek

Token'lar aynı zamanda bir **alan** bütçesidir. Pencere, girdi *ve* çıktıyı birlikte tutar; bu yüzden
bilinçli ayır: sistem talimatları + getirilen bağlam + sohbet geçmişi, **çıktı için bir pay**
bırakmalı. Yaygın hata, pencerenin neredeyse tamamını girdiyle doldurup cevaba yer bırakmamaktır.

## Her rol bunu nasıl kullanır

- **Geliştirici/Mühendis:** Büyük farkları göndermeden önce gerçek token'layıcıyla token sayar ve
  girdinin çıktı payını yutmaması için pencereyi bütçeler.
- **İş Analisti:** Analiz başına token maliyetini — İngilizce dışı ek yük dahil — tahmin eder; böylece
  belge başına harcama baştan bellidir.
- **PM/Ürün Sahibi:** İstek hacmi ile girdi/çıktı token karışımından aylık harcamayı öngörür ve
  faturanın çıktı kaynaklı olduğu yerde çıktı sınırları koyar.
- **QA ve Mimar:** Pencere sınırına yakın davranışı test eder ve uzun girdilerin taşmak yerine
  bilinçli biçimde kısalması için parçalama/kırpma tasarlar.
