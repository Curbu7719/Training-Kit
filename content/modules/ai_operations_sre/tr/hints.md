# İpuçları ve Alternatif İfadeler

**Temel fikrin alternatif ifadeleri**

- "Bir AI özelliği geliştirmek onu bir demoda çalışır hale getirir; onu işletmek ise üretimde
  çalışır tutar — model, kendiliğinden yavaşlayabilen, pahalanabilen ya da sessizce kötüleşebilen
  uzak bir bağımlılıktır."
- "Bir AI özelliğini dört temel direk üzerinde işletirsin: gözlemlenebilirlik (trace al ve altın
  sinyalleri izle), güvenilirlik (timeout, retry, fallback, degraded mode), maliyet yönetişimi
  (bütçe alarmları ve katı bir tavan) ve olay müdahalesi (runbook'lar artı flag'lerin arkasında
  hızlı rollback)."
- "Output'lar deterministik olmadığı için tek bir kötü yanıta değil, oranlara ve trendlere alarm
  verirsin — ve sessiz regresyonları birim testleriyle değil, çevrimiçi kalite izleme ile
  yakalarsın."

**İpucu yığını**

- **H1 (dürtme):** *Geliştirmeyi* *işletmekten* ayır. Soru genellikle ikincisiyle ilgilidir:
  gerçek trafik özelliğe çarptığında, neyi izlersin ve sağlayıcı başarısız olduğunda ya da fatura
  fırladığında ne olur?
- **H2 (yapı):** Dört direği gez. Gözlemlenebilirlik: panoda ne var? Güvenilirlik: degraded mode
  nedir? Maliyet: tavan nerede? Olay: runbook nedir ve nasıl rollback yaparsın?
- **H3 (işlenmiş yol):** Bir sağlayıcı yavaşlaması, bir güvenilirlik + olay olayıdır: hata/latency
  oranında alarm çalar → runbook, bir feature flag aracılığıyla ikincil sağlayıcıya failover
  yapmayı söyler (yeniden dağıtım yok, çünkü model bir soyutlama arkasında) → zarifçe azalt →
  postmortem.

**Kısa SSS**

- **Neden herhangi bir yanlış yanıta page göndermiyoruz?** Output'lar deterministik değildir, bu
  yüzden tek bir kötü örnek gürültüdür. Tek bir output'a değil, bir *orana* — örneğin birçok istek
  genelinde düşen dayanaklılığa — page gönder.
- **Rollback neden bir flag değişikliği, bir yeniden dağıtım değil?** Çünkü prompt'u ve model
  seçimini bir **feature flag**'in arkasında yayına alırsın; önceki sürüme dönmek saniyeler süren
  bir config değişikliğidir ve bir olayın ortasında tam da istediğin şey budur.
- **İlk enstrümante edilecek en değerli tek şey nedir?** Token'lar ve latency ile uçtan uca
  trace'ler. Neredeyse her diğer sinyal (maliyet, p95, reddetme oranı, dayanaklılık) bu trace
  verisine sahip olmaktan türetilir.
- **Maliyet gerçekten bir SRE meselesi mi?** Evet. LLM harcaması trafikle ölçeklenir ve tek bir
  kötü değişiklikten fırlayabilir, bu yüzden bir **bütçe alarmı** ve bir **katı tavan /
  kill-switch** yalnızca finans raporları değil, birer güvenilirlik kontrolüdür.
