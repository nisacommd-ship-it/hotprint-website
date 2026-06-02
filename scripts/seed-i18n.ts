import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Service translations
  const serviceTranslations: Record<string, any> = {
    'digital-printing': {
      nameRo: 'Tipar digital', nameEn: 'Digital Printing',
      shortDescRo: 'Tipar digital pe echipament Ricoh. Tiraje de la 1 buc, format până la SRA3, rezoluție 2400 dpi. Ideal pentru tiraje mici și medii.', 
      shortDescEn: 'Digital printing on Ricoh equipment. Runs from 1 pc, up to SRA3 format, 2400 dpi resolution. Perfect for small and medium runs.',
      fullDescRo: 'Tiparul digital în Chișinău pe echipament Ricoh. Fără pregătire de tipar — imprimarea directă din fișier. Ideal pentru tiraje de la 1 la 500 buc: cărți de vizită, fluturași, broșuri, cataloage. Rezoluție 2400 dpi, profil CMYK. Pregătirea comenzii — de la 1 oră.',
      fullDescEn: 'Digital printing in Chișinău on Ricoh equipment. No prepress needed — direct file-to-print. Ideal for runs from 1 to 500 pcs: business cards, flyers, brochures, catalogs. 2400 dpi resolution, CMYK profile. Order preparation — from 1 hour.',
      featuresRo: ['Tiraje de la 1 buc', 'Rezoluție 2400 dpi', 'Fără pregătire de tipar', 'Format până la SRA3', 'Tipar variabil de date', 'Gata în 1-2 zile'],
      featuresEn: ['Runs from 1 pc', '2400 dpi resolution', 'No prepress needed', 'Up to SRA3 format', 'Variable data printing', 'Ready in 1-2 days'],
      aeoAnswerRo: 'Tiparul digital este o tehnologie de imprimare directă din fișier, fără forme de tipar. Utilizăm echipament Ricoh cu rezoluție 2400 dpi. Ideal pentru tiraje de la 1 la 500 exemplare.',
      aeoAnswerEn: 'Digital printing is a direct file-to-print technology without printing plates. We use Ricoh equipment with 2400 dpi resolution. Ideal for runs from 1 to 500 copies.',
      faqJsonRo: JSON.stringify([{question:'Care este tirajul minim?',answer:'De la 1 exemplar.'},{question:'Ce formate de fișiere acceptați?',answer:'PDF, AI, EPS, CDR, PSD, TIFF. Recomandăm PDF cu profil CMYK.'},{question:'Care sunt termenele?',answer:'De la 1 oră pentru tiraje mici, 1-2 zile pentru tiraje medii.'}]),
      faqJsonEn: JSON.stringify([{question:'What is the minimum run?',answer:'From 1 copy.'},{question:'What file formats do you accept?',answer:'PDF, AI, EPS, CDR, PSD, TIFF. We recommend PDF with CMYK profile.'},{question:'What are the turnaround times?',answer:'From 1 hour for small runs, 1-2 days for medium runs.'}]),
    },
    'screen-printing': {
      nameRo: 'Serigrafie', nameEn: 'Screen Printing',
      shortDescRo: 'Serigrafie pe semi-automate manuale. Tipar pe orice suprafață: textile, plastic, metal, sticlă. Cerneluri speciale: metalice, fluorescente, texturate.',
      shortDescEn: 'Screen printing on manual semi-automatics. Printing on any surface: textiles, plastic, metal, glass. Special inks: metallic, fluorescent, textured.',
      fullDescRo: 'Serigrafie în Chișinău pe semi-automate manuale. Imprimăm pe orice material: textile, plastic, metal, lemn, sticlă. Cerneluri speciale: metalice, fluorescente, texturate, gonflante. Tiraje de la 100 buc.',
      fullDescEn: 'Screen printing in Chișinău on manual semi-automatics. We print on any material: textiles, plastic, metal, wood, glass. Special inks: metallic, fluorescent, textured, puff. Runs from 100 pcs.',
      featuresRo: ['Tipar pe orice suprafață', 'Cerneluri speciale', 'Tiraje de la 100 buc', 'Culori vii', 'Rezistență la spălare', 'Semi-automate manuale'],
      featuresEn: ['Printing on any surface', 'Special inks', 'Runs from 100 pcs', 'Vivid colors', 'Wash-resistant', 'Manual semi-automatics'],
      aeoAnswerRo: 'Serigrafia este o metodă de tipar prin traseu pe semi-automate manuale. Permite imprimarea pe orice materiale cu cerneluri speciale.',
      aeoAnswerEn: 'Screen printing is a stencil-based method on manual semi-automatics. It allows printing on any materials with special inks.',
      faqJsonRo: JSON.stringify([{question:'Pe ce materiale puteți imprima?',answer:'Textile, plastic, metal, lemn, sticlă, hârtie.'},{question:'Care este tirajul minim?',answer:'De la 100 buc.'},{question:'Cernelurile sunt rezistente?',answer:'Da, cerneluri speciale rezistente la spălare și UV.'}]),
      faqJsonEn: JSON.stringify([{question:'What materials can you print on?',answer:'Textiles, plastic, metal, wood, glass, paper.'},{question:'What is the minimum run?',answer:'From 100 pcs.'},{question:'Are the inks durable?',answer:'Yes, special inks resistant to washing and UV.'}]),
    },
    'uv-varnish': {
      nameRo: 'Lac UV selectiv', nameEn: 'Selective UV Varnish',
      shortDescRo: 'Lac UV selectiv pe semi-automate manuale. Lucios, mat, 3D volumetric. Oferă produselor un aspect premium și protecție.',
      shortDescEn: 'Selective UV varnish on manual semi-automatics. Glossy, matte, 3D volumetric. Gives products a premium look and protection.',
      fullDescRo: 'Lac UV selectiv în Chișinău pe semi-automate manuale. Aplicăm lac UV pe zone selectate ale designului. Variante: lucios, mat, 3D volumetric. Pentru cărți de vizită, ambalaje, broșuri.',
      fullDescEn: 'Selective UV varnish in Chișinău on manual semi-automatics. We apply UV varnish to selected design areas. Options: glossy, matte, 3D volumetric. For business cards, packaging, brochures.',
      featuresRo: ['Lucios, mat, 3D', 'Efect premium', 'Protecție suprafață', 'Semi-automate manuale', 'Orice format', 'Combinabil cu alte finisaje'],
      featuresEn: ['Glossy, matte, 3D', 'Premium effect', 'Surface protection', 'Manual semi-automatics', 'Any format', 'Combinable with other finishes'],
      aeoAnswerRo: 'Lacul UV selectiv este o tehnologie de aplicare a lacului ultraviolet pe zone selectate ale produsului tipografic, creând un contrast lucios-mat.',
      aeoAnswerEn: 'Selective UV varnish is a technology of applying ultraviolet varnish to selected areas of the printed product, creating a glossy-matte contrast.',
      faqJsonRo: JSON.stringify([{question:'Ce tipuri de lac UV oferiți?',answer:'Lucios, mat și 3D volumetric.'},{question:'Pe ce produse se aplică?',answer:'Cărți de vizită, ambalaje, broșuri, coperți.'},{question:'Se poate combina cu alte finisaje?',answer:'Da, se combină perfect cu ștanțarea cu folie și embosarea.'}]),
      faqJsonEn: JSON.stringify([{question:'What types of UV varnish do you offer?',answer:'Glossy, matte, and 3D volumetric.'},{question:'What products is it applied to?',answer:'Business cards, packaging, brochures, covers.'},{question:'Can it be combined with other finishes?',answer:'Yes, it combines perfectly with foil stamping and embossing.'}]),
    },
    'foil-stamping': {
      nameRo: 'Ștanțare cu folie', nameEn: 'Foil Stamping',
      shortDescRo: 'Ștanțare cu folie pe semi-automate manuale. Aur, argint, hologramă, folie colorată. Aspect premium pentru orice produs.',
      shortDescEn: 'Foil stamping on manual semi-automatics. Gold, silver, hologram, colored foil. Premium look for any product.',
      fullDescRo: 'Ștanțare cu folie la cald în Chișinău pe semi-automate manuale. Aur, argint, hologramă, cupru, folie colorată. Pentru cărți de vizită, ambalaje, coperți, diplome.',
      fullDescEn: 'Hot foil stamping in Chișinău on manual semi-automatics. Gold, silver, hologram, copper, colored foil. For business cards, packaging, covers, diplomas.',
      featuresRo: ['Aur, argint, hologramă', 'Semi-automate manuale', 'Orice format', 'Efect premium', 'Combinabil cu embosarea', 'Folie din Germania'],
      featuresEn: ['Gold, silver, hologram', 'Manual semi-automatics', 'Any format', 'Premium effect', 'Combinable with embossing', 'German foil'],
      aeoAnswerRo: 'Ștanțarea cu folie este aplicarea foliei metalizate sub presiune și căldură. Creează un efect strălucitor premium.',
      aeoAnswerEn: 'Foil stamping is the application of metallic foil under pressure and heat. Creates a shiny premium effect.',
      faqJsonRo: JSON.stringify([{question:'Ce tipuri de folie sunt disponibile?',answer:'Aur, argint, hologramă, cupru, folie colorată.'},{question:'Se combină cu alte finisaje?',answer:'Da, perfect cu embosarea și lacul UV.'},{question:'Care este tirajul minim?',answer:'De la 100 buc.'}]),
      faqJsonEn: JSON.stringify([{question:'What foil types are available?',answer:'Gold, silver, hologram, copper, colored foil.'},{question:'Can it be combined with other finishes?',answer:'Yes, perfectly with embossing and UV varnish.'},{question:'What is the minimum run?',answer:'From 100 pcs.'}]),
    },
    'die-cutting': {
      nameRo: 'Ștanțare', nameEn: 'Die Cutting',
      shortDescRo: 'Ștanțare automată pentru ambalaje, dosare, plicuri, materiale POS. Bibliotecă de forme de ștanțare gata.',
      shortDescEn: 'Automatic die cutting for packaging, folders, envelopes, POS materials. Library of ready die-cut forms.',
      fullDescRo: 'Ștanțare în Chișinău pe echipament automat. Tăiere figurată pentru cutii, dosare, plicuri, materiale POS. Bibliotecă de ștanțe gata + forme personalizate.',
      fullDescEn: 'Die cutting in Chișinău on automatic equipment. Figured cutting for boxes, folders, envelopes, POS materials. Ready die-cut library + custom forms.',
      featuresRo: ['Ștanțare automată', 'Bibliotecă de forme gata', 'Forme personalizate', 'Orice grosime de carton', 'Biguire inclusă', 'Format până la B1'],
      featuresEn: ['Automatic die cutting', 'Ready forms library', 'Custom forms', 'Any cardboard thickness', 'Creasing included', 'Up to B1 format'],
      aeoAnswerRo: 'Ștanțarea este tehnologia de tăiere figurată a hârtiei și cartonului pentru crearea ambalajelor, dosarelor și plicurilor.',
      aeoAnswerEn: 'Die cutting is the technology of figured paper and cardboard cutting for creating packaging, folders, and envelopes.',
      faqJsonRo: JSON.stringify([{question:'Ce produse pot fi ștanțate?',answer:'Cutii, dosare, plicuri, materiale POS.'},{question:'Aveți forme gata?',answer:'Da, bibliotecă cu peste 50 de forme standard.'},{question:'Puteți face forme personalizate?',answer:'Da, producem forme la comandă după machetă.'}]),
      faqJsonEn: JSON.stringify([{question:'What products can be die-cut?',answer:'Boxes, folders, envelopes, POS materials.'},{question:'Do you have ready forms?',answer:'Yes, a library of over 50 standard forms.'},{question:'Can you make custom forms?',answer:'Yes, we produce custom forms to order.'}]),
    },
    'pad-printing': {
      nameRo: 'Tampografie', nameEn: 'Pad Printing',
      shortDescRo: 'Tampografie pe obiecte volumetrice: pixuri, brichete, căni, suveniruri. Tipar pe suprafețe curbe și neregulate.',
      shortDescEn: 'Pad printing on volumetric objects: pens, lighters, mugs, souvenirs. Printing on curved and irregular surfaces.',
      fullDescRo: 'Tampografie în Chișinău. Imprimăm pe obiecte volumetrice: pixuri, brichete, căni, suveniruri, gadgeturi. Tipar pe suprafețe curbe. Tiraje de la 100 buc.',
      fullDescEn: 'Pad printing in Chișinău. We print on volumetric objects: pens, lighters, mugs, souvenirs, gadgets. Printing on curved surfaces. Runs from 100 pcs.',
      featuresRo: ['Tipar pe suprafețe curbe', 'Obiecte volumetrice', 'Tiraje de la 100 buc', 'Până la 4 culori', 'Rezistență mecanică', 'Uscare rapidă'],
      featuresEn: ['Curved surface printing', 'Volumetric objects', 'Runs from 100 pcs', 'Up to 4 colors', 'Mechanical resistance', 'Fast drying'],
      aeoAnswerRo: 'Tampografia este o metodă de tipar pe obiecte volumetrice cu suprafețe curbe și neregulate, folosind o tampon de silicon.',
      aeoAnswerEn: 'Pad printing is a method of printing on volumetric objects with curved and irregular surfaces using a silicone pad.',
      faqJsonRo: JSON.stringify([{question:'Pe ce obiecte puteți imprima?',answer:'Pixuri, brichete, căni, suveniruri, gadgeturi.'},{question:'Câte culori?',answer:'Până la 4 culori.'},{question:'Care este tirajul minim?',answer:'De la 100 buc.'}]),
      faqJsonEn: JSON.stringify([{question:'What objects can you print on?',answer:'Pens, lighters, mugs, souvenirs, gadgets.'},{question:'How many colors?',answer:'Up to 4 colors.'},{question:'What is the minimum run?',answer:'From 100 pcs.'}]),
    },
    'large-format': {
      nameRo: 'Tipar de format mare', nameEn: 'Large Format Printing',
      shortDescRo: 'Tipar de format mare pe echipament Roland. Bannere, autocolante, grafică de interior, postere. Lățime până la 1600 mm.',
      shortDescEn: 'Large format printing on Roland equipment. Banners, stickers, interior graphics, posters. Width up to 1600 mm.',
      fullDescRo: 'Tipar de format mare în Chișinău pe echipament Roland. Imprimăm bannere, autocolante, grafică de interior, postere, decoruri. Cerneluri eco-solvent și UV. Lățime până la 1600 mm.',
      fullDescEn: 'Large format printing in Chișinău on Roland equipment. We print banners, stickers, interior graphics, posters, decor. Eco-solvent and UV inks. Width up to 1600 mm.',
      featuresRo: ['Echipament Roland', 'Lățime până la 1600 mm', 'Cerneluri eco-solvent și UV', 'Rezistență la exterior', 'Tipar pe vinil, mesh, canvas', 'Tăiere de contur'],
      featuresEn: ['Roland equipment', 'Width up to 1600 mm', 'Eco-solvent and UV inks', 'Outdoor resistant', 'Vinyl, mesh, canvas printing', 'Contour cutting'],
      aeoAnswerRo: 'Tiparul de format mare este imprimarea pe materiale de mari dimensiuni pe echipament Roland cu lățime până la 1600 mm.',
      aeoAnswerEn: 'Large format printing is printing on large materials using Roland equipment with width up to 1600 mm.',
      faqJsonRo: JSON.stringify([{question:'Ce lățime maximă?',answer:'Până la 1600 mm.'},{question:'Este rezistent la exterior?',answer:'Da, cerneluri eco-solvent rezistente la intemperii.'},{question:'Pe ce materiale?',answer:'Vinil, mesh, canvas, hârtie foto, film autoadeziv.'}]),
      faqJsonEn: JSON.stringify([{question:'What is the maximum width?',answer:'Up to 1600 mm.'},{question:'Is it outdoor resistant?',answer:'Yes, eco-solvent inks resistant to weather.'},{question:'What materials?',answer:'Vinyl, mesh, canvas, photo paper, self-adhesive film.'}]),
    },
    'offset-printing': {
      nameRo: 'Tipar offset', nameEn: 'Offset Printing',
      shortDescRo: 'Tipar offset pe echipament Heidelberg. Cea mai înaltă calitate CMYK pentru tiraje de la 100 buc. Cataloage, broșuri, fluturași, ambalaje.',
      shortDescEn: 'Offset printing on Heidelberg equipment. Highest CMYK quality for runs from 100 pcs. Catalogs, brochures, flyers, packaging.',
      fullDescRo: 'Tipar offset în Chișinău pe echipament Heidelberg. Cel mai înalt standard de calitate pentru producția pe hârtie. Format până la B2, tiraje de la 100 buc. Cataloage, broșuri, fluturași, ambalaje, etichete.',
      fullDescEn: 'Offset printing in Chișinău on Heidelberg equipment. The highest quality standard for paper production. Up to B2 format, runs from 100 pcs. Catalogs, brochures, flyers, packaging, labels.',
      featuresRo: ['Echipament Heidelberg', 'Tiraje de la 100 buc', 'Format până la B2', 'Calitate CMYK superioară', 'Culori Pantone', 'Preț optim pentru tiraje mari'],
      featuresEn: ['Heidelberg equipment', 'Runs from 100 pcs', 'Up to B2 format', 'Superior CMYK quality', 'Pantone colors', 'Optimal price for large runs'],
      aeoAnswerRo: 'Tiparul offset este o metodă de tipar industrial pe echipament Heidelberg, oferind cea mai înaltă calitate pentru tiraje de la 100 exemplare.',
      aeoAnswerEn: 'Offset printing is an industrial printing method on Heidelberg equipment, offering the highest quality for runs from 100 copies.',
      faqJsonRo: JSON.stringify([{question:'Care este tirajul minim?',answer:'De la 100 buc.'},{question:'Ce format maxim?',answer:'Până la B2 (500x700 mm).'},{question:'Puteți imprima culori Pantone?',answer:'Da, suportăm Pantone și culorile speciale.'}]),
      faqJsonEn: JSON.stringify([{question:'What is the minimum run?',answer:'From 100 pcs.'},{question:'What is the maximum format?',answer:'Up to B2 (500x700 mm).'},{question:'Can you print Pantone colors?',answer:'Yes, we support Pantone and special colors.'}]),
    },
    'embossing': {
      nameRo: 'Embosare și debosare', nameEn: 'Embossing & Debossing',
      shortDescRo: 'Embosare și debosare pe semi-automate manuale. Relief fără folie. Efect tactil premium pentru cărți de vizită, ambalaje, coperți.',
      shortDescEn: 'Embossing and debossing on manual semi-automatics. Relief without foil. Premium tactile effect for business cards, packaging, covers.',
      fullDescRo: 'Embosare și debosare în Chișinău pe semi-automate manuale. Embosarea — relief convex, debosarea — relief adâncit. Fără folie, relief pur. Ideal pentru cărți de vizită, ambalaje, coperți, invitații.',
      fullDescEn: 'Embossing and debossing in Chișinău on manual semi-automatics. Embossing — raised relief, debossing — recessed relief. Without foil, pure relief. Ideal for business cards, packaging, covers, invitations.',
      featuresRo: ['Relief fără folie', 'Semi-automate manuale', 'Efect tactil premium', 'Combinabil cu ștanțare cu folie', 'Orice format', 'Ideal pentru hârtie groasă'],
      featuresEn: ['Relief without foil', 'Manual semi-automatics', 'Premium tactile effect', 'Combinable with foil stamping', 'Any format', 'Ideal for thick paper'],
      aeoAnswerRo: 'Embosarea este un relief convex pe hârtie sau carton fără utilizarea cernelii sau foliei. Debosarea creează un relief adâncit.',
      aeoAnswerEn: 'Embossing is a raised relief on paper or cardboard without ink or foil. Debossing creates a recessed relief.',
      faqJsonRo: JSON.stringify([{question:'Care este diferența între embosare și debosare?',answer:'Embosarea — relief convex, debosarea — relief adâncit.'},{question:'Se combină cu alte finisaje?',answer:'Da, perfect cu ștanțarea cu folie.'},{question:'Pe ce hârtie se recomandă?',answer:'Hârtie de la 250 g/m² pentru cel mai bun efect.'}]),
      faqJsonEn: JSON.stringify([{question:'What is the difference between embossing and debossing?',answer:'Embossing — raised relief, debossing — recessed relief.'},{question:'Can it be combined with other finishes?',answer:'Yes, perfectly with foil stamping.'},{question:'What paper is recommended?',answer:'Paper from 250 g/m² for the best effect.'}]),
    },
  }

  for (const [slug, data] of Object.entries(serviceTranslations)) {
    await prisma.service.update({ where: { slug }, data }).catch((e: any) => console.log(`Service ${slug} skip:`, e.message))
  }

  // Product translations
  const productTranslations: Record<string, any> = {
    'business-cards': { nameRo: 'Cărți de vizită', nameEn: 'Business Cards', descriptionRo: 'Cărți de vizită premium pe hârtie design, cu lac UV selectiv, ștanțare cu folie și embosare.', descriptionEn: 'Premium business cards on design paper with selective UV varnish, foil stamping and embossing.', categoryRo: 'Cărți de vizită', categoryEn: 'Business Cards' },
    'packaging': { nameRo: 'Ambalaje', nameEn: 'Packaging', descriptionRo: 'Cutii, ambalaje, etichete cu tipar offset, lac UV și ștanțare.', descriptionEn: 'Boxes, packaging, labels with offset printing, UV varnish and die-cutting.', categoryRo: 'Ambalaje', categoryEn: 'Packaging' },
    'brochures': { nameRo: 'Broșuri și cataloage', nameEn: 'Brochures & Catalogs', descriptionRo: 'Broșuri și cataloage de înaltă calitate pe echipament Heidelberg și Ricoh.', descriptionEn: 'High quality brochures and catalogs on Heidelberg and Ricoh equipment.', categoryRo: 'Broșuri', categoryEn: 'Brochures' },
    'stickers': { nameRo: 'Autocolante și etichete', nameEn: 'Stickers & Labels', descriptionRo: 'Autocolante și etichete pe hârtie autoadezivă, vinil, folie transparentă.', descriptionEn: 'Stickers and labels on self-adhesive paper, vinyl, transparent film.', categoryRo: 'Autocolante', categoryEn: 'Stickers' },
    'banners': { nameRo: 'Bannere și standuri', nameEn: 'Banners & Stands', descriptionRo: 'Bannere de format mare pe echipament Roland. Vinil, mesh, canvas.', descriptionEn: 'Large format banners on Roland equipment. Vinyl, mesh, canvas.', categoryRo: 'Bannere', categoryEn: 'Banners' },
    'tshirts': { nameRo: 'Tricouri cu imprimeu', nameEn: 'Printed T-Shirts', descriptionRo: 'Tipar pe textile prin serigrafie: tricouri, hanorace, șepci.', descriptionEn: 'Textile printing by screen printing: t-shirts, hoodies, caps.', categoryRo: 'Textile', categoryEn: 'Textiles' },
    'mugs': { nameRo: 'Căni cu logo', nameEn: 'Branded Mugs', descriptionRo: 'Tipar pe căni prin tampografie. Suveniruri corporative.', descriptionEn: 'Mug printing by pad printing. Corporate souvenirs.', categoryRo: 'Suveniruri', categoryEn: 'Souvenirs' },
    'notebooks': { nameRo: 'Blocnotesuri', nameEn: 'Notebooks', descriptionRo: 'Blocnotesuri corporative cu logo, embosare pe copertă.', descriptionEn: 'Corporate notebooks with logo, cover embossing.', categoryRo: 'Blocnotesuri', categoryEn: 'Notebooks' },
    'plastic-cards': { nameRo: 'Carduri de plastic', nameEn: 'Plastic Cards', descriptionRo: 'Carduri de discount, club, VIP cu bandă magnetică, cod de bare, embosare.', descriptionEn: 'Discount, club, VIP cards with magnetic stripe, barcode, embossing.', categoryRo: 'Carduri de plastic', categoryEn: 'Plastic Cards' },
    'calendars': { nameRo: 'Calendare', nameEn: 'Calendars', descriptionRo: 'Calendare de perete, de birou și de buzunar cu design individual.', descriptionEn: 'Wall, desk and pocket calendars with custom design.', categoryRo: 'Calendare', categoryEn: 'Calendars' },
    'flyers': { nameRo: 'Fluturași', nameEn: 'Flyers', descriptionRo: 'Fluturași și pliante pe echipament Heidelberg și Ricoh.', descriptionEn: 'Flyers and leaflets on Heidelberg and Ricoh equipment.', categoryRo: 'Fluturași', categoryEn: 'Flyers' },
    'folders': { nameRo: 'Dosare', nameEn: 'Folders', descriptionRo: 'Dosare corporative cu buzunare, ștanțare și lac UV.', descriptionEn: 'Corporate folders with pockets, die-cutting and UV varnish.', categoryRo: 'Dosare', categoryEn: 'Folders' },
    'envelopes': { nameRo: 'Plicuri', nameEn: 'Envelopes', descriptionRo: 'Plicuri branduite cu fereastră, ștanțare cu folie.', descriptionEn: 'Branded envelopes with window, foil stamping.', categoryRo: 'Plicuri', categoryEn: 'Envelopes' },
  }

  for (const [slug, data] of Object.entries(productTranslations)) {
    await prisma.product.update({ where: { slug }, data }).catch((e: any) => console.log(`Product ${slug} skip:`, e.message))
  }

  console.log('i18n translations seeded successfully')
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1) })
