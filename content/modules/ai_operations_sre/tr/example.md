# İşlenmiş Örnek: Sabah 3'teki Çağrıyı Bir Agent Alsın — Sınırlar İçinde

Saat sabah 3, bir alarm çalıyor. Hayal, onu alan, araştıran ve sen uyanmadan düzelten bir on-call agent. Kâbus ise aynı agent'ın sabah 3'te yanlış servisi kendinden emin biçimde yeniden başlatması. Fark tamamen onu nasıl sınırladığında. İşte blast radius olmadan uykuyu nasıl alırsın.

**Her şeyi değiştiren kayma: araç mı, aktör mü?** Bir chatbot metin döndürür ve onun üzerine *sen* eyleme geçersin. Bir **on-call agent eylemi alır** — servisi yeniden başlatır, config'i push'lar, cluster'ı ölçekler. *Bu gününü neden kolaylaştırır?* Sen uyurken araştır-ve-düzelt çilesini o yapar — ama *eyleme geçtiği* için yanlış bir hamle yalnızca yanlış bir cevap değil, yanlış bir *eylemdir*.

**Önce blast radius'u sınırla.** Otonomiden önce, neye *dokunabileceğine* karar verirsin: salt-okunur araştırma serbestçe, düşük riskli düzeltmeler kendi başına, yüksek etkili eylemler (prod verisine dokunma, harcama ölçekleme, silme) yalnızca bir insan kapısı arkasında. *Peki o zaman neden agent?* Çünkü çağrıların büyük çoğunluğu rutindir — takılı bir worker'ı yeniden başlat, bir kuyruğu temizle — ve agent bunları anında halleder, yalnızca yargı gereken nadir çağrıyı sana yükseltir.

**Her eylemi gözlemlenebilir kıl.** Agent ne gördüğünü, neye karar verdiğini ve ne yaptığını loglar. *Bu neden önemli?* Sabah 3'te onun eylemlerini bir runbook izi gibi okuman gerekir — "alarm → X kontrol edildi → Y yeniden başlatıldı" — bir kara kutunun prod'a ne yaptığını tahmin etmek değil.

**Sorumlu kal.** Sonuç hâlâ bir insanındır. Agent *senin* koyduğun sınırlar içinde eyleme geçer; sen ne yaptığını incelersin. *Neden?* Otonomi sorumluluğu kaldırmaz — işini her adımı yapmaktan, sınırları koyup izi kontrol etmeye taşır.

**Özet:** eyleme geçen bir agent, seni uyandıran çağrı ile kendini düzelten çağrı arasındaki farktır. Blast radius'u sınırla, her eylemi logla, bir insanı sorumlu tut — gözetimsiz prod'u kırma anahtarlarını ona vermeden bir aktörün yardımını al.
