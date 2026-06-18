# İpuçları & SSS (L2)

## Alternatif ifadeler

- L2'de risk düşük bir puan değildir — *yanıltıcı* bir puandır. Kusurlu bir eval, QA'ya ve PM'e sahte bir güven verir; bu, hiç eval olmamasından daha kötüdür.
- Ölçüme yalnızca üç şey geçerli olduğunda güvenin: veri kümesi temsili olduğunda, judge insanlara karşı doğrulandığında ve bir puan hareketinin non-deterministik gürültü değil gerçek sinyal olduğunda.
- Tek bir yüksek toplam sayı, onu dilimleyene kadar hiçbir şey kanıtlamaz — %90'lık bir ortalama, %40'ta oturan kritik bir kategoriyi gizleyebilir.

## İpucu yığını

- **H1 (dürtme):** *İyi görünen* bir puanı güvenilmez kılabilecek şeyin ne olduğunu sorun. Üç olağan şüpheli: veri kümesi, judge ve sayıyı nasıl okuduğunuz.
- **H2 (yapı):** Veri kümesi → zor vakaları ve gerçek trafik karışımını kapsayacak şekilde katmanlanmalı, geçmiş hatalar regresyon vakaları olarak eklenmeli. Judge → insan etiketlerine karşı doğrulanmalı ve position/verbosity/self-preference önyargısı için kontrol edilmeli. Okuma → alt grupların saklanamaması için segmente göre dilimle ve gerçek regresyonları çalıştırmadan-çalıştırmaya varyanstan ayır.
- **H3 (yakın-yanıt):** Bir toplama yüksek ama kullanıcılar şikayet ediyorsa, başarısız bir alt grubu ortaya çıkarmak için puanı kategoriye göre dilimle; sonra insan derecelendirmelerini örnekleyerek judge'ın o vakaları aşırı derecelendirip derecelendirmediğini (genellikle verbosity bias) kontrol et; son olarak gerçek başarısız vakaları CI'da kalıcı regresyon testleri olarak ekle.

## SSS

**LLM judge'ı neden insanlara karşı doğrularız?** Bir judge'ın önyargıları vardır — position bias (ilk seçeneği kayırma), verbosity bias (daha uzun yanıtları daha yüksek derecelendirme) ve self-preference (kendi model ailesini kayırma). İnsan derecelendirmeleriyle uyumu ölçmek, puanlarının güvenilir mi yoksa gürültü mü olduğunu söyler.

**Veri kümesini neden katmanlarız?** Yalnızca kolay, mutlu-yol girdilerinden örneklemek, gerçek edge case'ler başarısız olurken şişirilmiş puanlar bildirir. Katmanlama, zor vakaların, nadir kategorilerin ve geçmiş başarısızlıkların, önemli olanla orantılı olarak temsil edilmesini sağlar.

**Bu bağlamda Goodhart yasası nedir?** "Bir ölçü hedef haline geldiğinde, iyi bir ölçü olmaktan çıkar." Bir proxy metriği yeterince sıkı optimize etmek, gerçek kullanıcı kalitesi durağanlaşır veya düşerken sayıyı iyileştirebilir.

**Offline vs online eval'ler — hangisi kazanır?** Hiçbiri tek başına. Offline eval'ler hızlı, ucuz, tekrarlanabilir bir CI geçididir; online eval'ler (A/B testleri, production sinyalleri) daha yavaştır ama gerçek-dünya etkisini ölçer. Olgun ekipler ikisini de kullanır — offline'ı regresyonları erken yakalamak için, online'ı ground truth olarak.
