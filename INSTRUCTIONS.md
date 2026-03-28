# Nastavení Resend a Cloudflare pro kontaktní formulář

Toto je návod pro zprovoznění kontaktního formuláře na doméně `kontrola-systemu-vytapeni.cz` s odesíláním přes Resend a backendem na Cloudflare.

## 1. Cloudflare - Nastavení API klíče

Aby mohl backend odesílat e-maily, je potřeba do Cloudflare přidat API klíč z Resendu.

1. Přihlaste se do **Cloudflare Dashboard**.
2. Přejděte do **Workers & Pages**.
3. Vyberte projekt `kontrola-systemu-vytapeni`.
4. Přejděte na kartu **Settings** -> **Variables**.
5. V sekci **Environment Variables** klikněte na **Add variable**.
6. Název (Variable name): `RESEND_API_KEY`
7. Hodnota (Value): *Vložte váš API klíč z Resendu*
8. Klikněte na **Save and deploy**.

## 2. DNS konfigurace pro Resend

V administraci Resendu přidejte doménu `kontrola-systemu-vytapeni.cz`. Resend vám vygeneruje DNS záznamy, které musíte přidat do vašeho DNS (pravděpodobně v Cloudflare).

### DKIM záznamy
Resend obvykle vyžaduje 3 `CNAME` záznamy pro DKIM. Ty přidejte přesně tak, jak je Resend zobrazí.

### SPF záznam (Klíčové!)
Protože na doméně již používáte jiné e-mailové služby, **NESMÍTE** přepsat stávající SPF záznam. Musíte jej **sloučit**.

*   Původní SPF záznam vypadá pravděpodobně nějak takto: `v=spf1 include:_spf.google.com ~all` (příklad).
*   Resend vyžaduje: `include:spf.resend.com`
*   **Nový (sloučený) SPF záznam** bude vypadat takto:
    `v=spf1 include:_spf.google.com include:spf.resend.com ~all`

**Důležité:** V DNS smí být pro doménu pouze **jeden** záznam typu TXT začínající `v=spf1`.

## 3. MX záznamy
**NEMĚŇTE MX záznamy.** Resend slouží pouze pro odesílání (outbound). Pro příjem pošty na `info@kontrola-systemu-vytapeni.cz` musí zůstat zachovány vaše stávající MX záznamy.

---

## Jak otestovat řešení

### Lokální testování
1. V souboru `.dev.vars` v rootu projektu (pokud neexistuje, vytvořte ho) nastavte:
   `RESEND_API_KEY=re_vás_klíč`
2. Spusťte vývojový server: `npm run dev`
3. Vyplňte formulář na webu a odešlete.
4. Zkontrolujte konzoli v terminálu a doručenou poštu (včetně spamu, pokud ještě nemáte nastavené DNS).

### Produkční testování
1. Po nasazení na Cloudflare a nastavení `RESEND_API_KEY` v dashboardu otevřete web `https://kontrola-systemu-vytapeni.cz`.
2. Zkuste odeslat testovací poptávku.
3. Pokud se zobrazí "Poptávka byla odeslána!", backend úspěšně přijal data a předal je Resendu.
4. Pokud dojde k chybě, zkontrolujte logy v Cloudflare Dashboardu u příslušného Workeru.
