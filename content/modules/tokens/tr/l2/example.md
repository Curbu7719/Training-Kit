# İşlenmiş Örnek: AI PR-Review Botunu Bütçelemek

Liderlik soruyor: *"PR-review botu ayda ne kadara mal olacak ve modelin context window'una sığacak
mı?"* Tahminle değil, token matematiğiyle cevap verirsin.

## Adım 1 — Gerçek token'ları kesin ölç

Göz kararı yapmazsın. Botun gönderdiği on temsili PR diff'ini artı çevredeki dosyaları alır ve
**seçtiğin modelin tokenizer'ından** geçirirsin. Ortalama, inceleme başına **~6.000 input token**
çıkar (kod ağır tokenize olur — parantezler, girinti ve uzun tanımlayıcıların hepsi token harcar) ve
botun yorumları ortalama **~1.000 output token** olur.

## Adım 2 — Bütçe matematiğini yap

Ayda ~800 PR ve input/output ayrı fiyatlı (output daha pahalı) ile:

> aylık maliyet ≈ 800 × (6.000 × input_fiyatı + 1.000 × output_fiyatı)

Raporladığın kilit içgörü: **output daha küçük token sayısıdır ama token başına daha büyük maliyet
sürücüsüdür**, bu yüzden botu "bir deneme değil, en önemli sorunlar"a sınırlamak en yüksek-kaldıraçlı
bütçe kontrolüdür. Aşırı uzun output'u yarıya indirmek, aynı sayıda input token'ı kırpmaktan daha çok tasarruf ettirir.

## Adım 3 — Context bütçesini kontrol et

Modelin penceresi diyelim 128k token. Bir inceleme ~6.000 input + ~1.000 output ≈ 7.000 kullanır —
yani tek bir inceleme rahatça sığar. Risk **devasa bir PR**'dır: 5.000 satırlık bir refactor input'u
pencerenin güvenli bir oranının ötesine itip tam bir inceleme için çok az **output rezervi**
bırakabilir. Bir kural koyarsın: bir diff bir token eşiğini aşarsa, bütün halde göndermek yerine
**chunk'la** (dosya başına incele).

## Adım 4 — Çok-dilli durumu hesaba kat

Ekibin commit mesajları ve bazı docstring'leri **Türkçe**. Yeniden ölçersin: aynı metin Türkçe'de,
İngilizce kuralının öngördüğünden belirgin biçimde daha fazla token'a mal olur, bu yüzden eksik
bütçelemek yerine bu ek yükü tahmine eklersin.

## Ders

Fatura da pencere de birer **token bütçesidir** ve ikisi de öngörülebilirdir — tahmin yerine gerçek
tokenizer'la sayarsan. Kodun ve İngilizce-dışı metnin daha ağır tokenize olduğunu, output'un maliyeti
sürüklediğini ve pencerenin bir output rezervi gerektirdiğini bilmek, "AI pahalı olabilir"i
savunabileceğin ve etrafında tasarım yapabileceğin bir sayıya çevirir. İşte token mekaniğinin işe koşulması budur.
