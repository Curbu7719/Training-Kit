# İpuçları ve Alternatif İfadeler

**Temel fikrin alternatif ifadeleri**

- "Bir operasyon agent'ı, çağırıp okuduğunuz bir araç değildir — sistemlerinizde eylem alan bir
  aktördür; bu yüzden hatanın etki alanı yanlış bir yanıt değil yanlış bir *eylemdir* ve
  güvenilirlik, onun yapmasına izin verilen şeyi sınırlamak demektir."
- "Agent'ı sınırlayın: en az yetki (varsayılan salt-okunur), ortam ayrımı, 'önce planla' adımı ve
  yıkıcı / geri-alınamaz / üretim eylemleri için onay kapıları — tüm otonomiyi durduran bir acil
  durdurma ve döngüleri yakalayan eylem hızı sınırlarıyla birlikte."
- "Uygulamayı değil agent'ı izleyin: ne yaptığını, ne gözlemlediğini ve nedenini içeren bir eylem
  günlüğü tutun; çünkü yeşil bir pano size yanlış servisi yeniden başlattığını söylemez ve her
  eylemin sorumluluğunu bir insan taşır."

**İpucu yığını**

- **H1 (dürtme):** AI yalnızca yanıt vermek yerine *eylem* alabildiğinde neyin değiştiğini sorun.
  Yanlış bir yanıt gürültüdür; yanlış bir eylem üretimi değiştirir. Tüm plan, kendinden emin ama
  yanlış bir eylemin neyi bozabileceğini sınırlamak için vardır.
- **H2 (yapı):** Kontrolleri gezin. Yetkiler: en az yetki, ortam ayrımı. Çalıştırma öncesi: etki
  alanına göre önce-planla + onay kapısı. Çalışma anında: eylem hızı sınırı + acil durdurma.
  Sonrasında: eylem günlüğü + sorumlu bir insan.
- **H3 (işlenmiş yol):** Bir bellek alarmı → agent bir servisi otonom yeniden başlatır → sızıntı
  sürer → döngüye girer. Agent'ın haklı olmasına güvenmeyin: eylem hızı sınırı devreye girip
  yükseltir, insan otonomiyi durdurur, eylem günlüğü tekrarlanan müdahaleyi gösterir ve gerçek
  düzeltme gönderilir.

**Kısa SSS**

- **Bir operasyon agent'ı neden normal bir AI özelliğinden daha riskli?** Çünkü yalnızca yanıt
  üretmez — gerçek etkileri olan eylemler alır. Yanlış bir eylem (yeniden başlatma, yapılandırma
  gönderme, silme) doğrudan üretimi etkiler; bu yüzden yetkilerini sınırlar ve yüksek etkili
  eylemleri onaydan geçirirsiniz.
- **Bir eylemin otonom mu çalışacağına yoksa onay mı gerekeceğine ne karar verir?** Etki alanı ve
  geri alınabilirlik. Salt-okunur ve düşük riskli geri-alınabilir eylemler otonom olabilir; yıkıcı,
  geri-alınamaz ya da üretime dokunan eylemler bir insanın onayını gerektirir.
- **Neden yalnızca eylemleri değil agent'ın gerekçesini de kaydetmeli?** Çünkü bir olay sonrası
  inceleme ve bir denetim, yalnızca ne yaptığını değil *neden* eylem aldığını bilmek zorundadır —
  kendinden emin ama yanlış bir teşhisi böyle yakalar ve bunun sorumluluğunu bir insana bağlarsınız.
- **Prompt injection burada gerçekten bir operasyon sorunu mu?** Evet. Özenle hazırlanmış bir günlük
  satırı, talep kaydı ya da hata mesajı, eylem alan bir agent'ı tehlikeli bir şey çalıştırmaya
  yönlendirebilir; bu yüzden agent'ın okuduğu dış metin güvenilmez girdidir ve yüksek etkili eylemler
  yine de bir kapıdan geçer.
