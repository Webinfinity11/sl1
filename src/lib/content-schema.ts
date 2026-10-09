// Editable site content: defaults (what the site shows until an admin edits it) and the
// field layout the admin editor renders. Client-safe: no server imports here.

export type Link = { label: string; href: string };

export const contentDefaults = {
  site: {
    company: "შპს სმარტლაინი",
    phone: "+995577652564",
    phoneLabel: "(+995) 577 65 25 64",
    email: "vazhapataraia87@gmail.com",
    address: "ჩანტლაძის #30, თბილისი",
    hours: "ორშაბათი – პარასკევი, 9:00-დან",
    freeDeliveryFrom: 100,
    lat: 41.7332305,
    lng: 44.7898552,
  },
  header: {
    topbarText: "უფასო მიწოდება 100 ₾-დან",
    topLinks: [
      { label: "მიწოდება და გადახდა", href: "/delivery" },
      { label: "ხშირად დასმული კითხვები", href: "/faq" },
    ] as Link[],
    navLinks: [
      { label: "მთავარი", href: "/" },
      { label: "პროდუქცია", href: "/catalog" },
      { label: "ჩვენ შესახებ", href: "/about" },
      { label: "კონტაქტი", href: "/contact" },
    ] as Link[],
    offerLabel: "სპეციალური ფასები",
    offerHref: "/catalog?sale=1",
  },
  footer: {
    description: "ყველაფერი საჭირო თქვენი ოფისისთვის, ბიზნესისთვის და სახლისთვის.",
    menuTitle: "SMARTLINE",
    menuLinks: [
      { label: "ჩვენ შესახებ", href: "/about" },
      { label: "პროდუქცია", href: "/catalog" },
      { label: "მიწოდება და გადახდა", href: "/delivery" },
      { label: "ხშირად დასმული კითხვები", href: "/faq" },
      { label: "კონტაქტი", href: "/contact" },
    ] as Link[],
    categoriesTitle: "პოპულარული კატეგორიები",
    contactTitle: "დაგვიკავშირდით",
  },
  home: {
    heroEyebrow: "SMARTLINE / ONLINE SHOP",
    heroTitle: "ყველაფერი საჭირო.",
    heroTitleAccent: "ერთ სივრცეში.",
    heroText: "საკანცელარიო, ჰიგიენის და სამეურნეო პროდუქცია ოფისისთვის, ბიზნესისთვის და სახლისთვის.",
    heroButton: "შეარჩიეთ პროდუქცია",
    heroSecondButton: "ბიზნეს შეთავაზება",
    benefits: [
      { title: "სწრაფი მიწოდება", text: "თქვენთვის მოსახერხებელ მისამართზე" },
      { title: "მარტივი შეკვეთა", text: "რაოდენობა პირდაპირ ბარათიდან" },
      { title: "ბიზნეს ფასები", text: "ინდივიდუალური შეთავაზება ოფისებისთვის" },
      { title: "ყველაფერი ერთად", text: "ასობით პროდუქტი ერთ სივრცეში" },
    ],
    categoriesTitle: "პოპულარული კატეგორიები",
    categoriesText: "მარტივი არჩევანი ნებისმიერი საჭიროებისთვის",
    brandsTitle: "ბრენდები, რომლებსაც იცნობთ",
  },
  about: {
    title: "შპს სმარტლაინი",
    intro:
      "შპს სმარტლაინი წარმოადგენს სადისტრიბუციო კომპანიას, რომელიც კომფორტული სერვისით და კონკურენტული ფასით უწევს მომსახურეობას და ამარაგებს ყველა ტიპის ორგანიზაციებს, 1000 მდე დასახელების პროდუქტით.",
    note: "სმარტლაინის გუნდი დაკომპლექტებულია მოტივირებული, განვითარებაზე ორიენტირებული, პოზიტიური კადრებით.",
    stats: [
      { value: "1000-მდე", label: "დასახელების პროდუქტი" },
      { value: "10", label: "ტიპის ორგანიზაცია" },
    ],
    missionTitle: "ჩვენი მიზანი",
    mission: [
      "ჩვენი მიზანია, დავნერგოთ ყველასგან განსხვავებული სტანდარტი გაყიდვების, მომსახურეობის სფეროში და ჩვენს პარტნიორ ორგანიზაციებს შევთავაზოთ დახვეწილი, კომფორტული და მაღალი დონის სერვისი, რაც მოიცავს შეკვეთის გაფორმებას, დამკვეთზე მორგებული პირობებით.",
      "პროდუქტის შერჩევიდან მიწოდების ჩათვლით თქვენ მოგემსახურებათ კვალიფიციური, ენერგიული და პოზიტიური გაყიდვების მენეჯერი, რომელიც ოპერატიულად, მარტივად და ხარისხიანად გადაჭრის თქვენ წინაშე არსებულ გამოწვევებს.",
    ],
    reasonsTitle: "რატომ უნდა შევიძინო თქვენთან?",
    reasonsText: "ჩვენ გთავაზობთ:",
    reasons: [
      "კონკურენტული ფასი",
      "პროდუქციის მრავალფეროვანი არჩევანი",
      "გადახდის მოქნილი სისტემა",
      "ოპერატიული, კომფორტული მომსახურეობა",
    ],
    clientsTitle: "რა ტიპის ორგანიზაციებს ამარაგებთ?",
    clientsText: "კომპანია სმარტლაინი თანამშრომლობს და ამარაგებს:",
    clients: [
      "ოფისები",
      "სამედიცინო დაწესებულებები",
      "საწარმოები",
      "სასტუმროები",
      "რესტორნები",
      "ფიტნეს და სპა ცენტრები",
      "სკოლები",
      "საბავშო ბაღები",
      "სტომატოლოგიური კლინიკები",
      "სილამაზის სალონები",
    ],
    howtoEyebrow: "როგორ შევიძინო?",
    howtoTitle: "შეკვეთის განთავსება და შეძენა შეგიძლიათ საიტზე",
    howtoText:
      "ასევე შეგიძლიათ დაუკავშირდეთ ჩვენს გაყიდვების მენეჯერს მითითებულ ნომერზე ან მოგვწეროთ ელ.ფოსტაზე — ჩვენ ოპერატიულად დაგეხმარებით.",
  },
  contact: {
    title: "დაგვიკავშირდით",
    text: "ნებისმიერი კითხვის შემთხვევაში დაგვირეკეთ ან მოგვწერეთ — ოპერატიულად დაგეხმარებით.",
    boxEyebrow: "ორგანიზაციებისთვის",
    boxTitle: "შეკვეთა თქვენზე მორგებული პირობებით",
    boxText:
      "პროდუქტის შერჩევიდან მიწოდების ჩათვლით მოგემსახურებათ გაყიდვების მენეჯერი, რომელიც ოპერატიულად, მარტივად და ხარისხიანად გადაჭრის თქვენ წინაშე არსებულ გამოწვევებს.",
    boxPoints: ["კონკურენტული ფასი", "გადახდის მოქნილი სისტემა", "ოპერატიული, კომფორტული მომსახურება"],
    boxButton: "მოგვწერეთ",
  },
  delivery: {
    title: "მიწოდება და გადახდა",
    sections: [
      {
        title: "მიწოდება",
        text: "100 ₾-დან შეკვეთაზე მიწოდება უფასოა. მიწოდების დროს მენეჯერი შეკვეთის დადასტურებისას შეგითანხმებთ.\n\nთუ პროდუქტი არ იქნება შეკვეთის იდენტური ან იქნება წუნდებული, დაექვემდებარება შეცვლას. ხარვეზი უნდა დაფიქსირდეს მიღება-ჩაბარების პროცესის დროს.",
      },
      {
        title: "გადახდა",
        text: "შეკვეთის გაფორმების შემდეგ გაყიდვების მენეჯერი დაგიკავშირდებათ დასადასტურებლად და შეგითანხმებთ გადახდის პირობებს.",
      },
    ],
  },
  faq: {
    title: "ხშირად დასმული კითხვები",
    items: [
      {
        question: "რატომ უნდა შევიძინო თქვენთან?",
        answer:
          "ჩვენ გთავაზობთ კონკურენტულ ფასს, პროდუქციის მრავალფეროვან არჩევანს, გადახდის მოქნილ სისტემას, ოპერატიულ და კომფორტულ მომსახურებას.",
      },
      {
        question: "როგორ შევიძინო?",
        answer:
          "დაამატეთ პროდუქცია კალათაში და გააფორმეთ შეკვეთა საიტზე. ასევე შეგიძლიათ დაუკავშირდეთ ჩვენს გაყიდვების მენეჯერს ნომერზე (+995) 577 65 25 64 ან მოგვწეროთ ელფოსტაზე vazhapataraia87@gmail.com — ოპერატიულად დაგეხმარებით.",
      },
      {
        question: "რა ტიპის ორგანიზაციებს ამარაგებთ?",
        answer:
          "სმარტლაინი თანამშრომლობს და ამარაგებს ოფისებს, სამედიცინო დაწესებულებებს, საწარმოებს, სასტუმროებს, რესტორნებს, ფიტნეს და სპა ცენტრებს, სკოლებს, საბავშვო ბაღებს, სტომატოლოგიურ კლინიკებს და სილამაზის სალონებს.",
      },
      {
        question: "როგორ ხდება პროდუქციის მიწოდება?",
        answer:
          "თუ პროდუქტი არ იქნება შეკვეთის იდენტური ან იქნება წუნდებული, დაექვემდებარება შეცვლას. ხარვეზი უნდა დაფიქსირდეს მიღება-ჩაბარების პროცესის დროს. ჩვენი ერთ-ერთი მთავარი ღირებულება კმაყოფილი მომხმარებელია.",
      },
    ],
  },
};

export type Content = typeof contentDefaults;
export type ContentKey = keyof Content;

// ───────── admin editor layout ─────────

type Sub = { name: string; label: string; long?: boolean };
export type FieldSpec =
  | { name: string; label: string; type: "text" | "textarea" | "number"; hint?: string }
  | { name: string; label: string; type: "list"; hint?: string; long?: boolean }
  | { name: string; label: string; type: "objects"; hint?: string; fields: Sub[]; fixed?: boolean };

const link: Sub[] = [
  { name: "label", label: "ტექსტი" },
  { name: "href", label: "ბმული (მაგ. /about)" },
];

export const contentSections: { key: ContentKey; title: string; description: string; fields: FieldSpec[] }[] = [
  {
    key: "site",
    title: "საკონტაქტო ინფორმაცია",
    description: "ტელეფონი, ელფოსტა, მისამართი — ჩანს ჰედერში, ფუტერში, კონტაქტის გვერდზე და შეკვეთისას.",
    fields: [
      { name: "company", label: "კომპანიის სახელი", type: "text" },
      { name: "phoneLabel", label: "ტელეფონი (როგორც ჩანს)", type: "text", hint: "მაგ. (+995) 577 65 25 64" },
      { name: "phone", label: "ტელეფონი დასარეკად", type: "text", hint: "მხოლოდ ციფრები, მაგ. +995577652564" },
      { name: "email", label: "ელფოსტა", type: "text" },
      { name: "address", label: "მისამართი", type: "text" },
      { name: "hours", label: "სამუშაო საათები", type: "text" },
      { name: "freeDeliveryFrom", label: "უფასო მიწოდება (₾-დან)", type: "number" },
      { name: "lat", label: "რუკა: განედი (lat)", type: "number", hint: "Google Maps-ზე წერტილზე მარჯვენა კლიკი → კოორდინატები" },
      { name: "lng", label: "რუკა: გრძედი (lng)", type: "number" },
    ],
  },
  {
    key: "header",
    title: "ჰედერი",
    description: "ზედა ზოლი და მთავარი მენიუ.",
    fields: [
      { name: "topbarText", label: "ზედა ზოლის ტექსტი", type: "text" },
      { name: "topLinks", label: "ზედა ზოლის ბმულები", type: "objects", fields: link },
      { name: "navLinks", label: "მენიუს ბმულები", type: "objects", fields: link },
      { name: "offerLabel", label: "მარჯვენა ბმულის ტექსტი", type: "text" },
      { name: "offerHref", label: "მარჯვენა ბმული", type: "text" },
    ],
  },
  {
    key: "footer",
    title: "ფუტერი",
    description: "საიტის ქვედა ნაწილი. კატეგორიების სვეტი ავტომატურად ივსება.",
    fields: [
      { name: "description", label: "მოკლე აღწერა ლოგოს ქვეშ", type: "textarea" },
      { name: "menuTitle", label: "მენიუს სათაური", type: "text" },
      { name: "menuLinks", label: "მენიუს ბმულები", type: "objects", fields: link },
      { name: "categoriesTitle", label: "კატეგორიების სათაური", type: "text" },
      { name: "contactTitle", label: "კონტაქტის სათაური", type: "text" },
    ],
  },
  {
    key: "home",
    title: "მთავარი გვერდი",
    description: "ბანერი, უპირატესობები და ბლოკების სათაურები.",
    fields: [
      { name: "heroEyebrow", label: "ბანერი: ზედა წარწერა", type: "text" },
      { name: "heroTitle", label: "ბანერი: სათაური", type: "text" },
      { name: "heroTitleAccent", label: "ბანერი: სათაურის ლურჯი ნაწილი", type: "text" },
      { name: "heroText", label: "ბანერი: ტექსტი", type: "textarea" },
      { name: "heroButton", label: "ბანერი: მთავარი ღილაკი", type: "text" },
      { name: "heroSecondButton", label: "ბანერი: მეორე ღილაკი", type: "text" },
      {
        name: "benefits",
        label: "უპირატესობები (4 ცალი)",
        type: "objects",
        fixed: true,
        fields: [
          { name: "title", label: "სათაური" },
          { name: "text", label: "ტექსტი" },
        ],
      },
      { name: "categoriesTitle", label: "კატეგორიების სათაური", type: "text" },
      { name: "categoriesText", label: "კატეგორიების ქვესათაური", type: "text" },
      { name: "brandsTitle", label: "ბრენდების სათაური", type: "text" },
    ],
  },
  {
    key: "about",
    title: "ჩვენ შესახებ",
    description: "„ჩვენ შესახებ“ გვერდის ყველა ტექსტი.",
    fields: [
      { name: "title", label: "სათაური", type: "text" },
      { name: "intro", label: "აღწერა", type: "textarea" },
      { name: "note", label: "დამატებითი ტექსტი", type: "textarea" },
      {
        name: "stats",
        label: "ციფრები",
        type: "objects",
        fields: [
          { name: "value", label: "ციფრი" },
          { name: "label", label: "წარწერა" },
        ],
      },
      { name: "missionTitle", label: "მიზნის ბლოკის სათაური", type: "text" },
      { name: "mission", label: "მიზნის აბზაცები", type: "list", long: true },
      { name: "reasonsTitle", label: "„რატომ ჩვენ“ სათაური", type: "text" },
      { name: "reasonsText", label: "„რატომ ჩვენ“ ქვესათაური", type: "text" },
      { name: "reasons", label: "„რატომ ჩვენ“ პუნქტები", type: "list" },
      { name: "clientsTitle", label: "„ვის ვამარაგებთ“ სათაური", type: "text" },
      { name: "clientsText", label: "„ვის ვამარაგებთ“ ქვესათაური", type: "text" },
      { name: "clients", label: "ორგანიზაციების ტიპები", type: "list" },
      { name: "howtoEyebrow", label: "ქვედა ბლოკი: ზედა წარწერა", type: "text" },
      { name: "howtoTitle", label: "ქვედა ბლოკი: სათაური", type: "text" },
      { name: "howtoText", label: "ქვედა ბლოკი: ტექსტი", type: "textarea" },
    ],
  },
  {
    key: "contact",
    title: "კონტაქტი",
    description: "კონტაქტის გვერდის ტექსტები. ტელეფონი და მისამართი — „საკონტაქტო ინფორმაციაში“.",
    fields: [
      { name: "title", label: "სათაური", type: "text" },
      { name: "text", label: "ქვესათაური", type: "textarea" },
      { name: "boxEyebrow", label: "ლურჯი ბლოკი: ზედა წარწერა", type: "text" },
      { name: "boxTitle", label: "ლურჯი ბლოკი: სათაური", type: "text" },
      { name: "boxText", label: "ლურჯი ბლოკი: ტექსტი", type: "textarea" },
      { name: "boxPoints", label: "ლურჯი ბლოკი: პუნქტები", type: "list" },
      { name: "boxButton", label: "ლურჯი ბლოკი: ღილაკი", type: "text" },
    ],
  },
  {
    key: "delivery",
    title: "მიწოდება და გადახდა",
    description: "„მიწოდება და გადახდა“ გვერდი.",
    fields: [
      { name: "title", label: "სათაური", type: "text" },
      {
        name: "sections",
        label: "ბლოკები",
        type: "objects",
        fields: [
          { name: "title", label: "სათაური" },
          { name: "text", label: "ტექსტი", long: true },
        ],
      },
    ],
  },
  {
    key: "faq",
    title: "ხშირად დასმული კითხვები",
    description: "FAQ გვერდის კითხვები და პასუხები.",
    fields: [
      { name: "title", label: "სათაური", type: "text" },
      {
        name: "items",
        label: "კითხვები",
        type: "objects",
        fields: [
          { name: "question", label: "კითხვა" },
          { name: "answer", label: "პასუხი", long: true },
        ],
      },
    ],
  },
];

/** Settings row holding the home page category picks ({ ids: number[] }); kept outside the content sections. */
export const HOME_CATEGORIES_KEY = "homeCategories";
