# İpuçları & Alternatif İfadeler (L2)

## Alternatif ifadeler

- L2'de soru *döngünün nasıl çalıştığı* değil, gerçek sistemlere karşı *onu nasıl doğru, sınırlı ve hata ayıklanabilir tutacağıdır*.
- Model yalnızca **tool'larının** izin verdiği kadar iyi eylemde bulunur: kesin adlar/açıklamalar, tipli doğrulanmış girdiler ve **yorumlanabilir sonuç biçimleri** (yapılandırılmış hatalar dahil) asıl kaldıraçtır.
- **Mimari** ile uygulanan bir korkuluk (izin sınırı, onay kapısı) tutar; yalnızca **prompt'ta** yaşayan bir korkuluk model tarafından yok sayılabilir.

## İpucu yığını

**H1 (dürtme):** Basit bir maksimum-iterasyon sınırı mutlak en kötü durumu durdurur, ama aynı başarısız tool'u çağırmaya devam eden bir döngüye veya eksik bir kaydı geçici bir kesintiden ayırt edemeyen bir modele ne dersiniz? Modelin akıllıca eylemde bulunması için *tool'un* ne döndürmesi gerekir?

**H2 (tasarım):** Güvenilirlik, L1 döngüsünün üstüne katmanlardan gelir: tipli girdileri ve yorumlanabilir sonuçları olan tool'lar (bir `retryable` bayraklı yapılandırılmış hatalar), ilerleme olmamasını algılayan ve geçici ile kalıcı başarısızlıkları ayıran döngü kontrolü, birikerek büyüyen hataları sınırlamak için zemine oturtma, maliyet kontrolleri (paralel çağrılar, alt adımlar için daha küçük modeller), kodla uygulanan geri alınamaz eylemler için insan-onay kapıları ve gözlemlenebilirlik için iterasyon başına loglama.

**H3 (işlenmiş):** Bir iade agent'ı için: modelin birini yeniden denemesi ve diğerinde durması için `{"status":"unavailable","retryable":true}` ile `{"status":"not_found","retryable":false}` döndürün; tekrarlanan aynı çağrıları algılayın ve sınıra kadar dönmek yerine geri çekilin; büyük iadeleri uygulamadaki (prompt'taki değil) bir insan-onay kapısının arkasına koyun; ve kötü bir çalıştırmanın izlenebilmesi için her plan/tool/argüman/gözlemi loglayın.

## SSS

**S: Bir maksimum-iterasyon sınırı bir döngüyü kontrol etmek için neden yeterli değil?**
En kötü durumu durdurur ama israfı durdurmaz. Bir agent, aynı başarısız tool'u sınıra çarpana kadar tekrar tekrar çağırabilir. **İlerleme olmamasını** (aynı tool + aynı argümanlar, yeniden-denenemeyen hata) algılamak ve geçici ile kalıcı başarısızlıkları ayırmak, onu daha erken ve daha zarif şekilde durdurur.

**S: Riskli eylemleri neden bir prompt yerine mimari ile uygularım?**
Bir prompt, modelin yanlış okuyabileceği veya geçersiz kılabileceği bir istektir; bozuk bir girdi onu yanlış eyleme ikna edebilir. Uygulamanızda uygulanan bir izin sınırı veya onay kapısı model tarafından atlanamaz, böylece geri alınamaz eylemler güvende kalır.

**S: Birikerek büyüyen hatalar nasıl olur ve onları nasıl sınırlarım?**
Her adım önceki gözleme dayanır, bu yüzden kötü bir okuma sonraki her adıma yayılır. Bunu, modeli kendi belleği yerine gerçek tool sonuçlarına oturtarak, gözlemleri çapraz kontrol için bağlamda tutarak ve gerçek zemin döndüren tool'ları tercih ederek sınırlayın.

**S: Agent maliyetini ve gecikmesini kontrol etmenin başlıca kaldıraçları nelerdir?**
İterasyonları sınırlayın, bağımsız tool çağrılarını sıralı yerine paralel çalıştırın, rutin alt adımlar için daha küçük bir model kullanın ve büyük modeli planlama için saklayın, ve bir görev içinde değişmeyen tool sonuçlarını önbelleğe alın.
