# İpuçları ve Alternatif İfadeler

**Temel fikrin alternatif ifadeleri**

- "Token'lar hem bir para bütçesi hem bir alan bütçesidir: maliyet token × fiyattır (input ve output
  ayrı faturalı, output daha pahalı) ve context window input artı output'u tutar, bu yüzden ikisini de
  token sayısından öngörürsün."
- "Kod, semboller, boşluk ve İngilizce-dışı metin düz İngilizce prose'dan daha ağır tokenize olur, bu
  yüzden İngilizce kuralı eksik sayar — maliyete duyarlı her şey için seçtiğin modelin kendi
  tokenizer'ıyla ölç."
- "Pencereyi kasıtlı ayır: sistem + getirilen context + geçmiş, output için bir rezerv bırakmalı,
  yoksa büyük bir input cevabı boğar."

**İpucu yığını**

- **H1 (dürtme):** Token'a iki ayrı bütçe biner — fatura ve pencere. Soru genelde bunlardan birini
  tahmin etmek yerine kesin öngörmekle ilgilidir.
- **H2 (yapı):** Maliyet için: istek × (input token × input fiyatı + output token × output fiyatı),
  output daha ağır. Pencere için: input + output sığmalı, bu yüzden cevaba yer ayır ve aşırı büyük
  girdileri chunk'la.
- **H3 (işlenmiş yol):** On gerçek diff'i modelin tokenizer'ıyla ölç (~6.000 in, ~1.000 out), hacimle
  çarp output daha ağır hesaplanarak, Türkçe ek yükünü ekle ve output rezervini yiyecek her PR'ı chunk'la.

**Kısa SSS**

- **Sadece 100 token ≈ 75 kelime kullanamaz mıyım?** Kabaca ilk geçiş için evet. Gerçek bir bütçe
  için hayır — kod ve İngilizce-dışı metin daha fazla token'a bölünür, bu yüzden modelin tokenizer'ıyla
  kesin say.
- **Output neden token sayısının ima ettiğinden çok önemli?** Output genelde input'tan token başına
  daha pahalı fiyatlanır, bu yüzden aşırı uzun output'u kırpmak çoğu zaman en yüksek-kaldıraçlı maliyet kontrolüdür.
- **Çok-dillilik cezası neden gerçek?** Tokenizer'lar İngilizce için ayarlıdır, bu yüzden aynı cümle
  Türkçe'de (ve birçok dilde) daha fazla alt-kelime token'ına bölünür ve daha pahalıya gelir.
- **Kaçınılması gereken context-bütçesi hatası nedir?** Pencereyi neredeyse tamamen input'la doldurup
  modelin cevabını üretmesi için çok az token bırakmak.
