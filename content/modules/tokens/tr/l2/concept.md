# Token Mekaniği ve Bütçeleme

L1, token'ı tanıttı — modelin okuduğu sub-word (alt-kelime) birimi ve neden "1 kelime ≠ 1 token"
olduğunu. L2, tokenization'ın neden böyle davrandığına daha derin iner ve bunu **güvenilir bir
maliyet ve context bütçesine** nasıl çevireceğini gösterir. Bu, faturanın altındaki mekaniktir;
optimizasyon kaldıraçlarından (caching, routing, streaming — Cost & Latency modülü) ayrıdır.

**Çalışan bir örnek.** **AI PR-review botun** her pull request'te çalışıyor. Bütçesini onaylatmak
ve context window içinde tutmak için token'larını tahmin değil, kesin öngörmen gerekir.

## Kod ve bazı metinler neden "daha ağır" tokenize olur

Tokenizer'lar metni veriden öğrenilen alt-kelime birimlerine böler (BPE tarzı bir şema). Sonuçları:

- **Noktalama, boşluk ve semboller token harcar.** Kod; prose'da olmayan `(){};`, girinti ve
  operatörlerle yoğundur, bu yüzden 400 satırlık bir diff, 400 satırlık bir denemeden çok daha fazla token'dır.
- **Nadir veya bileşik kelimeler daha fazla parçaya bölünür.** Yaygın bir kelime tek token olabilir;
  `getUserAccountByIdOrThrow` gibi sıra dışı bir tanımlayıcı birkaç parçaya ayrılır.
- **Özel / kontrol token'ları vardır.** Mesajlar gizli yapısal token'lar (rol işaretleri,
  delimiter'lar) taşır ve onlar da sayılır; yani faturalanan toplam, görünen metninden biraz fazladır.

## Çok-dillilik cezası (multilingual penalty)

Tokenizer'lar genelde İngilizce için optimize edilir. **Aynı cümle Türkçe'de (ya da diğer
İngilizce-dışı dillerde) çoğu zaman İngilizce'den belirgin biçimde daha fazla token'a mal olur**,
çünkü model o kelimeleri daha fazla alt-kelime parçasına böler. Özelliğin İngilizce-dışı metin
işliyorsa, İngilizce kuralı yerine bu ek yükü bütçele.

## Sayma: tahmin vs kesin

- **Tahmin** ilk geçiş için: kabaca **100 token ≈ 75 İngilizce kelime** — kabaca boyutlandırma için yeterli.
- **Kesin say** maliyete duyarlı her şey için: metni **seçtiğin modelin tokenizer'ından** geçir.
  Farklı model aileleri farklı tokenize eder, bu yüzden birinden alınan bir sayım diğeri için geçerli değildir.

## Faturayı bütçelemek

Maliyet **token × token-başına fiyat**'tır; **input ve output ayrı fiyatlanır** ve **output genelde
daha pahalıdır**. Bir özelliği öngörmek için:

> aylık maliyet ≈ ay/istek × (ort. input token × input fiyatı + ort. output token × output fiyatı)

PR botu için: 800 PR × (6.000 input + 1.000 output) token, output daha ağır ağırlıklı. Output hacmi,
token sayısının ima ettiğinden daha çok önemlidir — bunu tahminde tut.

## Context window'u bütçelemek

Token'lar aynı zamanda bir **alan** bütçesidir. Pencere input *ve* output'u tutar, bu yüzden kasıtlı
ayır: sistem talimatları + getirilen context + sohbet geçmişi, **output için bir rezerv** bırakmalı.
Yaygın bir hata, pencerenin %98'ini input'la doldurup cevaba yer bırakmamaktır.

## Her rol bunu nasıl kullanır

- **Developer/Mühendis:** Büyük diff'leri göndermeden önce gerçek tokenizer'la token sayar ve input'un
  output rezervini boğmaması için pencereyi bütçeler.
- **İş Analisti:** Analiz başına token maliyetini — İngilizce-dışı ek yük dahil — tahmin eder, böylece
  belge başına harcama baştan bilinir.
- **PM/Ürün Sahibi:** İstek hacmi ve input/output token karışımından aylık harcamayı öngörür ve
  faturanın output-güdümlü olduğu yerde output tavanları koyar.
- **QA ve Mimar:** Pencere limitine yakın davranışı test eder ve uzun girdilerin taşmak yerine kasıtlı
  bozulması için chunking/truncation tasarlar.
