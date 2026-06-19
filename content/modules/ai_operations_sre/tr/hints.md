# İpuçları ve Alternatif İfadeler

**Temel fikrin alternatif ifadeleri**

- "Bir ops agent'ı çağırıp okuduğun bir araç değildir — senin sistemlerinde aksiyon alan bir
  aktördür, bu yüzden blast radius yanlış bir yanıt değil yanlış bir *aksiyondur* ve güvenilirlik,
  onun yapmasına izin verilen şeyi sınırlamak demektir."
- "Agent'ı sınırla: en az yetki (varsayılan read-only), ortam kapsamı, plan-sonra-uygula dry-run'lar
  ve yıkıcı/geri-alınamaz/production aksiyonları için onay kapıları — tüm otonomiyi durduran bir
  kill-switch ve döngüleri yakalayan rate limit'lerle birlikte."
- "App'i değil agent'ı gözlemle: ne yaptığının, ne gözlemlediğinin ve nedeninin action audit trail'i,
  çünkü yeşil bir pano sana yanlış servisi yeniden başlattığını söylemez ve her aksiyon için bir
  insan hesap verebilir kalır."

**İpucu yığını**

- **H1 (dürtme):** AI yalnızca yanıtlamak yerine *aksiyon* alabildiğinde neyin değiştiğini sor.
  Yanlış bir yanıt gürültüdür; yanlış bir aksiyon production'ı değiştirir. Tüm plan, kendinden emin
  ama yanlış bir aksiyonun neyi bozabileceğini sınırlamak için vardır.
- **H2 (yapı):** Kontrolleri gez. Yetkiler: en az yetki, ortam kapsamı. Çalıştırma öncesi: blast
  radius'a göre dry-run + onay kapısı. Çalışma anı: rate limit + kill-switch. Sonrasında: action
  audit trail + hesap verebilir bir insan.
- **H3 (işlenmiş yol):** Bir bellek alarmı → agent otonom olarak bir servisi yeniden başlatır →
  sızıntı sürer → döngüye girer. Agent'ın haklı olmasına güvenme: action-rate limiti devreye girip
  eskalasyon yapar, insan otonomiyi kill-switch'ler, audit trail tekrarlanan remediation'ı gösterir
  ve gerçek düzeltme gönderilir.

**Kısa SSS**

- **Bir ops agent'ı normal bir AI özelliğinden neden daha riskli?** Çünkü yalnızca bir yanıt
  üretmez — gerçek etkileri olan aksiyonlar alır. Yanlış bir aksiyon (restart, config push, silme)
  doğrudan production'a çarpar, bu yüzden yetkilerini sınırlar ve yüksek-blast aksiyonlarını
  kapıdan geçirirsin.
- **Bir aksiyonun otonom mu çalışacağına yoksa onay mı gerekeceğine ne karar verir?** Blast radius
  ve geri alınabilirlik. Read-only ve düşük riskli geri-alınabilir aksiyonlar otonom olabilir;
  yıkıcı, geri-alınamaz ya da production'a dokunan aksiyonlar bir insanın onayını gerektirir.
- **Neden yalnızca aksiyonları değil agent'ın muhakemesini de logla?** Çünkü bir postmortem ve bir
  audit, yalnızca ne yaptığını değil *neden* aksiyon aldığını bilmek zorundadır — kendinden emin
  ama yanlış bir teşhisi böyle yakalar ve onun için bir insanı hesap verebilir tutarsın.
- **Prompt injection burada gerçekten bir ops sorunu mu?** Evet. Özenle hazırlanmış bir log satırı,
  ticket ya da hata mesajı, aksiyon alan bir agent'ı tehlikeli bir şey çalıştırmaya yönlendirebilir,
  bu yüzden agent'ın okuduğu dış metin güvenilmez girdidir ve yüksek-blast aksiyonlar yine de bir
  kapıdan geçer.
