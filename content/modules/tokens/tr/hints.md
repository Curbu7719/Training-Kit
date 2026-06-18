# İpuçları — Token'lar

## Temel fikrin alternatif ifadeleri

- Bir token, bir LLM'in gerçekten okuyup ürettiği küçük parçadır — çoğu zaman bir kelimenin bir
  bölümü; bir diff, bir günlük veya bir spesifikasyon, model görmeden önce token'lara bölünür.
- Modeller kelimelerle değil token'larla düşünür: bir AI inceleyicinin maliyeti ve okuyabileceği
  dosya boyutu, her ikisi de token başına ölçülür, bu yüzden kelime/satır sayıları yalnızca kabaca bir göstergedir.
- "Tokenizasyon", metninizi — kaynak kod ve günlükler dahil — model işlemeden önce bu alt-kelime
  parçalarına ayıran adımdır.

## İpucu yığını

- **H1 (dürtme):** Bir token genellikle bir kelimeden *daha küçüktür* ve kod düz metinden daha
  ağır tokenize edilir. Sorunun gerçekten saymanızı veya bütçelemenizi istediği birim nedir?
- **H2 (yapısal):** Dönüştürmek için düz metinde **100 token ≈ 75 kelime** kullanın, ancak kodu
  bir tokenizer ile tam olarak sayın. Girdi token'larının (gönderdiğiniz diff/günlük) ve çıktı
  token'larının (AI'ın yorumları) ayrı ayrı sayıldığını — ve fiyatlandırıldığını — unutmayın.
- **H3 (cevaba yakın):** Maliyet için, istek başına token'ları istek hacmiyle ve token başına
  fiyatla çarpın ve girdi ile çıktıyı ayrı yapın. Sınırlar için, göndermeden önce dosyanın
  context window'a sığıp sığmadığını kontrol edin — sığmıyorsa parçalayın.

## SSS

**S: Bir token her zaman bir kelime midir?**
Hayır. Yaygın kısa kelimeler genellikle tek token'dır, ancak daha uzun kelimeler birkaça bölünür
ve kaynak kod daha da fazla bölünür (parantezler, girinti, tanımlayıcılar). Yani 1 kelime ≠ 1 token.

**S: Girdi ve çıktı token'ları aynı mı maliyetlidir?**
Genellikle değil. Çoğu sağlayıcı girdiyi ve çıktıyı ayrı faturalandırır ve çıktı çoğu zaman daha
pahalıdır. Bir AI inceleyici bütçelerken diff'i (girdi) ve yorumları (çıktı) ayrı sayın.

**S: Devasa bir dosya neden bütçeyi *veya* sınırı bozar?**
20.000 satırlık üretilmiş bir dosya çok büyük sayıda girdi token'ıdır — pahalıdır — ve modelin
context window'unu basitçe aşabilir, bu yüzden tek bir çağrıya hiç sığmaz. Parçalayın veya atlayın.

**S: Tahmin yerine tam bir sayıyı nasıl alırım?**
Belirli modeliniz için bir tokenizer aracı veya kütüphanesi kullanın. Her model ailesi biraz
farklı tokenize eder ve özellikle kod değişir, bu yüzden maliyet önemli olduğunda her zaman ölçün.
