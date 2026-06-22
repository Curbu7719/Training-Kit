# İşlenmiş Örnek: AI İncelemeciyi Gerçek Takım Ölçeğine Ayarla

AI incelemecin çalışıyor, ama artık ayda binlerce PR'da koşuyor ve hem fatura hem bekleme ölçekte önem kazanıyor. Derinlikte "hızlı ve ucuz", hareket ettirebileceğin somut sayılara ayrılır. İşte daha derin kaldıraçlar, tüm takım ona yaslanırken aracı yararlı tutar.

**Gecikme iki sayıdır.** **İlk-token'a-kadar-süre (TTFT)** (ilk yorumun belirmesi ne kadar sürer) ve sonrasında **saniye-başına-token** ölçersin. *Bu gününü neden kolaylaştırır?* Streaming düşük bir TTFT verir, böylece geri bildirimi hızlı görürsün — ve 2.000 token düzyazı boca eden bir kontrolün, harika bir TTFT'ye rağmen yavaş hissettirdiğini fark edip incelemenin kendisini kısaltırsın.

**Önbellek, tekrarı tasarrufa çevirir.** Kodlama standartların ve few-shot inceleme örneklerin her PR'da aynıdır. *Kaldıraç:* prefix caching o sabit ön-eki düşük bir oranla yeniden kullanır. *AI'ı neden böyle kullan?* Aynı girişi binlerce kez yeniden göndermek için tam fiyat ödüyorsun — fark ettiğin an onu önbelleğe almak bedava paradır.

**Reflekse göre değil, riske göre yönlendir.** Bir dokümantasyon yazım hatası ile bir auth refactor'u aynı modeli hak etmez. *Bu ölçekte neden önemli?* Her şeyi büyük modele göndermek, rutin %90'da ekstra hiçbir şey yakalamadan faturayı katlar — katmanlı yönlendirme harcamayı riskin olduğu yere koyar.

**Optimize etmeden önce ölç.** Bir şeyi değiştirmeden önce gerçek PR'ları profillersin — giren-çıkan token sayıları, TTFT, saniyelerin nereye gittiği. *Neden?* Yavaş adım çoğu zaman modelin değil, bir pipeline aşamasıdır (dosya çekme, bir linter çağrısı) — yanlışını optimize etmek emek harcatır.

**Özet:** takım ölçeğinde "incelemeciyi ayarla" somutlaşır: TTFT ve token oranını izle, sabit ön-eki önbelleğe al, riske göre yönlendir ve kesmeden önce profille. Tüm kurum ona yaslanırken her-PR'lık bir AI adımını hızlı ve uygun maliyetli tutan budur.
