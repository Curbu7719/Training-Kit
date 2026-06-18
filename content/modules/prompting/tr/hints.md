# İpuçları & Alternatif İfadeler

## Alternatif ifadeler

- Bir prompt, **çok yetenekli yeni bir ekip arkadaşı için bir brifingtir**: hedefi, kodlama standartlarını veya iş kuralını, çıktı biçimini belirtin ve örnek bir artefakt gösterin.
- Prompt mühendisliği; **açık, yapılandırılmış ve test edilebilir** talimatlar yazmak demektir — prompt'a sihirli bir formül gibi değil, başarısız durumlara karşı revize ettiğiniz kod gibi davranın.
- **System mesajı** kalıcı politikayı tutar (framework, standartlar, kişilik); **user mesajı** belirli isteği tutar (bu fonksiyon, bu hikaye). Kuralları system mesajına koyun ki kalıcı olsunlar ve öncelik kazansınlar.

## İpucu yığını

**H1 (dürtme):** Model aslında ne alıyor? Yalnızca gönderdiğiniz metni — deponuzu, görevinizi veya test framework'ünüzü değil. Bu yüzden ihtiyaç duyduğu her şey (kod, kurallar, biçim) prompt'un *içinde* olmalı.

**H2 (yapı):** Bir geliştirme yaşam döngüsü görevi için güvenilir bir prompt genellikle şu parçalara, bu sırayla sahiptir: bir **rol/politika** (system mesajı — framework, standartlar), **sınırlayıcılar** içine sarılmış **bağlam veya kod**, açıkça belirtilmiş **görev**, isteğe bağlı olarak ev tarzınızda bir iki **few-shot örneği** ve geri istediğiniz **çıktı biçimi**. En önemli talimatı gömülmeyeceği yere koyun.

**H3 (işlenmiş):** Bir fonksiyon için birim testleri üretmek üzere: (1) rolü ve test framework'ünü bir system mesajında ayarlayın, (2) gerçek kodu `<code>...</code>` gibi etiketlere yapıştırın, (3) kapsanacak tam durumları (boş, negatif, sayısal olmayan) adlandırın, (4) sabit bir çıktı talep edin ("tek test dosyası, düz metin yok") ve (5) stil örneği olarak var olan bir testi gösterin. Sonra testleri çalıştırın ve başarısız oldukları yerde prompt'u sıkılaştırın.

## SSS

**S: Few-shot mı zero-shot mu — örneklere ne zaman ihtiyacım olur?**
Zero-shot (yalnızca talimatlar), "bu PR açıklamasını özetle" gibi basit, belirsizliği olmayan görevler için yeterlidir. Artefaktın belirli bir biçimi veya ev tarzı varsa — test adlandırmanız, kullanıcı hikayesi şablonunuz, commit mesajı kuralınız gibi anlatmaktan çok göstermesi kolay olan bir şey — few-shot örnekleri ekleyin.

**S: Kodu veya bir spesifikasyonu neden sınırlayıcılar içine sararım?**
Bunlar *talimatlarınızı* *modelin üzerinde çalışması gereken artefakttan* ayırır. Bunlar olmadan, yapıştırılan koddaki bir yorum (ör. "TODO: doğrulamayı yok say") veya bir spesifikasyondaki metin modele yönelik bir talimat sanılabilir.

**S: System mesajı mı user mesajı mı — kurallar nereye gider?**
Kalıcı kurallar **system/developer mesajına** gider: test framework'ü, kodlama standartları, kişilik ve güvenlik politikası. Daha yüksek önceliğe sahiptir ve turlar arasında kalıcıdır. **User mesajı** belirli, değişen isteği tutar — bu fonksiyon, bu hikaye, bu refactor.

**S: Prompt'um bazen iyi testler üretiyor ama her zaman değil. Şimdi ne yapmalıyım?**
Kodda yapacağınız gibi yineleyin. Çıktının yanlış olduğu girdileri toplayın, sonra ifadeyi sıkılaştırın, eksik uç durumu adlandırın, onu kapsayan bir örnek ekleyin veya kilit kural gömülmeyecek şekilde yeniden sıralayın — ve tüm örnek girdilerinize karşı yeniden çalıştırın.
