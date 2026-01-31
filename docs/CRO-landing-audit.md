# Auditoría CRO – Landing CloudSaver

**Regla aplicada:** `.claude/skills/page-cro/SKILL.md` — Page Conversion Rate Optimization.

---

## Evaluación inicial

| Aspecto | Valor |
|--------|--------|
| **Tipo de página** | Landing (homepage con un solo objetivo de conversión) |
| **Objetivo de conversión principal** | Que el usuario pegue su token de DigitalOcean y ejecute el análisis (acción = “run analysis”) |
| **Contexto de tráfico** | Por definir (orgánico, paid, email, social). Afecta message match. |
| **Producto** | CloudSaver — análisis gratuito de infraestructura DigitalOcean para encontrar ahorros (read-only, sin registro). |

No existe `.claude/product-marketing-context.md`; el contexto se tomó del README y de los componentes actuales.

---

## Análisis por dimensiones (orden de impacto)

### 1. Claridad de la propuesta de valor (alto impacto)

**Estado:** Bueno tras los últimos cambios de copy.

- El visitante entiende en pocos segundos: “encontrar ahorros en DigitalOcean” + “pega tu token, reporte en <30s”.
- Beneficio principal claro y específico (tiempo, gratuidad, sin registro).
- Lenguaje orientado al cliente (droplets, volumes, snapshots, “cut costs”).

**Riesgo:** El typewriter del hero rota entre “Unused Resources”, “Zombie Droplets”, etc. Quien llega en el primer segundo puede no ver aún “DigitalOcean” o “savings” si solo lee “Find Hidden Savings” + una palabra técnica. Considerar que la línea fija ya diga “in your DigitalOcean infrastructure” o similar.

---

### 2. Efectividad del headline

**Estado:** Fuerte.

- “Find Hidden Savings” comunica resultado.
- Subheadline concreto: “Paste your DigitalOcean token. Get a free report in under 30 seconds.”

**Inconsistencia:** En navbar el CTA es “Start Audit” y en hero “See My Savings”. Diferentes framings (audit vs savings) pueden diluir el mensaje. Conviene alinear.

---

### 3. Ubicación, copy y jerarquía del CTA

**Estado:** Un solo CTA principal (usar el análisis), bien identificado.

**Puntos a mejorar:**

- **Navbar:** “Start Audit” vs hero “See My Savings” — unificar copy (p. ej. “See My Savings” en ambos o “Run free analysis”).
- **Sección token:** El título “Enter the Mainframe” es creativo pero no comunica valor ni acción. El copy del botón del form es “Start Analysis” (ghost, poco prominente). Para quien ya hizo scroll hasta ahí, un CTA más visible y orientado a resultado (“Get my report” / “See my savings”) puede mejorar conversión.
- **Repetición del CTA:** Tras “How It Works” el usuario cae directo en el token input (bien). Tras “Features” y “FAQs” no hay CTA; quien termina de leer y no ha actuado debe subir de nuevo. Añadir un CTA secundario (mismo copy, scroll a `#token-input`) después de Features o después de FAQs aumentaría oportunidades de conversión.
- **Prominencia del botón en el form:** El botón de analizar es ghost. Un botón sólido (estilo hero) en la zona del token refuerza la jerarquía.

---

### 4. Jerarquía visual y escaneabilidad

**Estado:** Bueno.

- Secciones claras: Current State → Future State → How It Works → Token Input → Features → FAQs → About Me → Footer.
- Trust indicators bajo el hero (Read-Only, 30s, We never store) ayudan.
- Badge “Read Changelog” en el hero puede competir con el CTA principal; si la prioridad es conversión, considerar moverlo o rebajarlo visualmente.

---

### 5. Señales de confianza y prueba social

**Estado:** Parcial.

- Tienes: read-only, tiempo, no almacenar token, FAQ de seguridad.
- Falta: logos de clientes, testimonios, cifras (“X análisis realizados”), casos con ahorro real.
- Para una herramienta donde el usuario pega un token de API, una sola prueba social concreta (número de análisis o testimonial corto) cerca del CTA o del input puede reducir fricción percibida.

---

### 6. Manejo de objeciones

**Estado:** Muy bueno.

- FAQs cubren: ¿es seguro?, ¿cuánto tarda?, ¿cuánto ahorro?, ¿modifica algo?, ¿necesito conocimientos?, ¿es gratis?, ¿y si no estoy de acuerdo?, ¿por qué “Low” confidence?
- En el form, “Where is my token?” con modal de pasos reduce fricción.
- Opción de mejora: en el modal, enlace directo a la página de API/tokens de DigitalOcean (reduce pasos y abandono).

---

### 7. Fricción

**Estado:** Bajo en el form (un campo, un botón).

**Posibles fricciones:**

- Usuario “listo” tiene que hacer scroll (Hero → Current → Future → How It Works) antes de ver el input. Para tráfico warm, probar poner el token input más arriba (justo después del hero o después de How It Works, que ya está).
- Nav con 4 enlaces (Current State, Future State, How It Works, Features) ofrece alternativas al CTA; en una landing pura se podría simplificar o hacer que el CTA destaque más.
- Sección “About Me” antes del footer puede distraer a quien quiere “solo convertir”; opción: acortar o mover después del footer.

---

## Recomendaciones

### Quick Wins (implementar ya)

1. **Unificar CTA hero y navbar**  
   - Usar el mismo copy en ambos (p. ej. “See My Savings” o “Get my free report”). Objetivo: un solo mensaje de acción.

2. **Añadir CTA repetido tras FAQs**  
   - Bloque corto: línea de copy (“See where you can cut costs”) + botón que haga scroll a `#token-input` con el mismo copy del hero. Objetivo: captar a quien leyó todo y no ha actuado.

3. **Enlace directo a DigitalOcean en el modal del token**  
   - En “Where is my token?”, añadir link a la página de API/tokens de DigitalOcean (ej. `https://cloud.digitalocean.com/account/api/tokens`) para “Generate New Token”. Objetivo: menos pasos y menos abandono.

4. **Reforzar botón de análisis en el form**  
   - Cambiar el botón “Start Analysis” de ghost a estilo primario (como el del hero) y/o copy “Get my report” / “See my savings”. Objetivo: jerarquía visual clara y mensaje orientado a resultado.

---

### Cambios de mayor impacto (priorizar)

1. **Añadir una prueba social**  
   - Cerca del hero o del token input: un número (“X analyses run”) o un testimonial corto con resultado (“Saved $X/month”). Aunque sea un solo dato, reduce la sensación de riesgo al pegar el token.

2. **Reposicionar o acortar “About Me”**  
   - Si la prioridad es conversión en esta página: mover “About the Creator” al footer o reducir a 1–2 líneas + link “About me”. Mantiene credibilidad sin competir con el CTA.

3. **Simplificar o reenfocar la navegación en landing**  
   - En desktop: menos links o agrupar bajo “How it works” y dejar el CTA como único elemento fuerte. En móvil, mantener menú pero asegurar que el CTA sea el elemento más visible al abrir el menú.

4. **Título de la sección token**  
   - Sustituir “Enter the Mainframe” por algo que comunique valor o acción: p. ej. “Paste your token. Get your report in under 30 seconds.” o “See your savings — paste your read-only token below.”

---

### Ideas para tests A/B

1. **Orden del contenido**  
   - Variante A: Hero → How It Works (3 pasos) → Token Input → Current State → Future State → Features → FAQs.  
   - Variante B: estructura actual.  
   - Hipótesis: usuarios que ya conocen el problema convierten más con el form más arriba.

2. **Headline del hero**  
   - A: “Find Hidden Savings” (actual).  
   - B: “Find Hidden Savings in Your DigitalOcean Bill”.  
   - C: “Stop Paying for What You Don’t Use”.  
   - Medir: CTR al scroll hacia token input y/o análisis completados.

3. **Copy del CTA principal**  
   - A: “See My Savings”.  
   - B: “Get my free report”.  
   - C: “Run free analysis”.  
   - Medir: clicks al CTA y análisis iniciados.

4. **Presencia de prueba social**  
   - A: sin número ni testimonial.  
   - B: “Join X+ developers who’ve found savings” (o similar) cerca del hero o del form.  
   - Medir: tasa de análisis completados desde la landing.

---

### Alternativas de copy (elementos clave)

**Headline (hero)**  
- **A (actual):** “Find Hidden Savings” — claro, orientado a resultado.  
- **B:** “Find Hidden Savings in Your DigitalOcean Bill” — más específico y SEO-friendly.  
- **C:** “Stop Paying for What You Don’t Use” — enfocado en dolor, buena alineación con Current State.

**CTA principal (hero y navbar)**  
- **A (actual hero):** “See My Savings” — comunica resultado.  
- **B:** “Get my free report” — comunica qué reciben.  
- **C:** “Run free analysis” — comunica acción; útil si el tráfico viene de “audit” o “analysis”.

**Título sección token**  
- **A (actual):** “Enter the Mainframe” — memorable pero poco orientado a conversión.  
- **B:** “Paste your token. Get your report in under 30 seconds.” — refuerza promesa y reduce fricción.  
- **C:** “See your savings — paste your read-only token below.” — valor + acción.

**Botón del form**  
- **A (actual):** “Start Analysis” — correcto pero genérico.  
- **B:** “Get my report” — alineado con el beneficio.  
- **C:** “See my savings” — consistente con el CTA del hero.

---

## Validación

- Revisar en navegador: hero, navbar, scroll hasta token input, form, FAQs y nuevo CTA post-FAQs.
- Si tienes analytics: definir evento de “conversión” (p. ej. análisis completado o resultado mostrado) y medir tasa desde esta landing.
- Tras implementar Quick Wins, comparar tasa de análisis completados antes/después (o con test A/B si hay volumen).

---

*Documento generado a partir del framework Page CRO (.claude/skills/page-cro/SKILL.md).*
