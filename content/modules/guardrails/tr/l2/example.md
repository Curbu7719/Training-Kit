# İşlenmiş Örnek: Guardrail'ları Öyle Ayarla ki Agent Gerçekten Kullanılsın

AI agent'ın o kadar kilitli ki geliştiriciler etrafından dolanıyor — ve insanların devre dışı bıraktığı bir guardrail hiçbir şeyi korumaz. Derinlikte iş *daha çok* kapı değildir; her kapıyı işe yaradığı yere koymak ve dengeyi ayarlamaktır. İşte bu, hem agent'ı güvende hem ekibini kullanmaya istekli tutar.

**Her kontrolü bağlamı olan yere koy.** Açıkça tehlikeli bir komutu durdurmanın en ucuzu **eylem-sırasında (in-action)** bir deny list'tir; ince biçimde sızan bir kimlik bilgisi ancak **eylem-sonrası (post-action)** gerçek diff taranarak yakalanır. *Bu gününü neden kolaylaştırır?* Ucuz bir otomatik kontrolün zaten temize çıkardığı değişikliklerde yavaş bir insan incelemesi ödemeyi bırakırsın.

**Denge üçgenini risk katmanına göre ayarla.** Bir dokümantasyon yazım düzeltmesi doğrudan geçer; auth ya da prod config'e dokunan bir değişiklik tam kapıdan geçer. *Neden AI?* Çünkü katmanlama, agent'ın rutin %90'ı sürtünmesiz halletmesi demektir; dikkatini yalnızca riskin gerçek olduğu yere harcarsın — okumayı bırakana kadar her şeyi onaylamak yerine.

**Yalnızca input validation'a güvenme.** Injection dolaylı gelir — bir bağımlılığın README'sinde, bir PR yorumunda, agent'ın veri olarak okuduğu bir dosyada. *Hamle:* çekilen her içeriğin düşmanca olduğunu varsay ve **en az ayrıcalıklı sandbox'a** güven ki başarılı bir injection bile sızdıramasın ya da yok edemesin. *Neden?* Henüz çekmediğin metni önceden tarayamazsın — o yüzden yalnızca neyi okuduğunu değil, agent'ın neyi *yapabileceğini* sınırlarsın.

**İki başarısızlık biçimini izle.** Aşırı engelleme insanları agent'ın etrafından dolandırır (o yüzden güvenli işlemler geçmeli); az engelleme yeniden çerçevelenmiş bir isteği içeri alır (o yüzden katmanlar örtüşmeli). Yanlış yapılandırılmış tek bir tarayıcı tek hata noktasıdır — bağımsız katmanlar emniyet payıdır.

**Özet:** olgun guardrail'lar daha yüksek bir duvar değildir — ayarlanmış bir pipeline'dır. Risk katmanına göre kapı koy, meşru işi hızlı tut ve bağımsız kontrolleri katmanla; böylece agent güvende kalır *ve* ekibin etrafından dolanmak yerine ona uzanmayı sürdürür.
