# Otonomi Altında Güvenilir Kalan Agent'lar Tasarlamak

L1'de agent döngüsü planla → eyleme geç → gözlemle → tekrarla şeklindeydi. L2'de soru, *döngünün nasıl çalıştığından*, gerçek sistemlere karşı üretimde çalışırken *onu nasıl doğru, sınırlı ve hata ayıklanabilir (debuggable) tutacağına* kayar. Otonomi, fikir yanlış olduğu için başarısız olmaz; kenarlarda başarısız olur — belirsiz tool sonuçları, kısmi başarısızlıklar ve üretken görünen ama olmayan döngüler.

**Asıl kaldıraç tool tasarımıdır.** Model yalnızca tool'larının izin verdiği kadar iyi eylemde bulunabilir. Her tool'un kesin bir **adı ve açıklaması** (model tool'ları yalnızca bunlardan seçer), **tipli, doğrulanmış bir girdi şeması** ve **modelin belirsizlik olmadan yorumlayabileceği bir sonuç biçimi** gerekir. Ham bir 500 hatası döndüren bir tool modele hiçbir şey öğretmez; `{"error": "order_not_found", "retryable": false}` döndüren bir tool ise akıllıca karar vermesini sağlar. Dar, iyi adlandırılmış tool'lar, dev bir "her-şeyi-yap" tool'undan iyidir.

**Basit bir sayaçtan öteye döngü kontrolü.** Bir maksimum-iterasyon sınırı en kötü durumu durdurur, ama iyi agent'lar **ilerleme olmamasını (non-progress)** da algılar: aynı tool'un aynı argümanlarla iki kez çağrılması veya yeniden denemeyle çözülmeyecek bir hata. **Geçici başarısızlıkları** (geri çekilmeyle/backoff yeniden dene) **kalıcı** olanlardan (dur ve raporla) ayırın. Bu olmadan, döngü dönmekte "başarılı" olur.

**Birikerek büyüyen hatalar ve zemine oturtma (grounding).** Her adım bir öncekinin gözlemine dayandığı için, kötü bir okuma yayılır. Hafifletmeler: modelin kendi belleği yerine **tool sonucuna karşı doğrulama** yapmasını sağlayın, gözlemleri bağlamda tutun ki sonraki adımlar çapraz kontrol edebilsin ve modelin tahminleri yerine gerçek zemin döndüren tool'ları tercih edin.

**Maliyet ve gecikme (latency) ödünleşimleri.** Her iterasyon bir model çağrısı artı bir tool çağrısıdır. Stratejiler: iterasyonları sınırla, **bağımsız tool çağrılarını paralel** çalıştır, rutin alt adımlar için **daha küçük bir model** kullan ve büyüğünü planlama için sakla, ve bir görev içinde değişmeyen tool sonuçlarını önbelleğe al.

**İnsanların ait olduğu yer.** Geri alınamaz veya yüksek etkili eylemler (para harcama, veri silme, dış iletişim) bir **insan-onay kapısının** arkasında durmalı veya izin verilen bir tool alt kümesiyle sınırlandırılmalıdır. Bunu prompt değil, mimari uygular — bir prompt yok sayılabilir; bir izin sınırı yok sayılamaz.

**Gözlemlenebilirlik (observability).** Göremediğiniz şeyi hata ayıklayamazsınız. Her iterasyonun planını, istenen tool'u, argümanlarını ve gözlemi loglayın ki başarısız bir çalıştırma adım adım izlenebilsin.

## Her rol bunu nasıl kullanır

- **Developer:** Yorumlanabilir hata sonuçlarına sahip tipli tool şemaları tasarlar, yeniden-dene-veya-dur mantığını ve paralel tool çağrılarını uygular ve izleme için her iterasyonu loglar.
- **Enterprise Architect:** İzin sınırlarını ve onay kapılarını mimari olarak tasarlar.
- **Security Engineer:** Hangi eylemlerin geri alınamaz olduğunu ve onayın arkasında durması gerektiğini belirtir.
- **Tester:** Başarısızlık biçimlerini test eder — geçici ve kalıcı hatalar, döngü sonlanması ve birikerek büyüyen hata kurtarması.
- **Project Manager:** İterasyon ve bütçe tavanlarını ürün kısıtı olarak belirler ve küçük ile büyük model arasındaki maliyet/gecikme dengesine karar verir.
