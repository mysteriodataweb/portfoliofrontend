import type { EngagementPageData } from "@/hooks/use-engagement-data";

export interface EngagementChapter {
  slug: string;
  title: string;
  pitch: string;
  defaults: EngagementPageData;
}

const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1200&auto=format&fit=crop&q=70`;

export const engagementChapters: EngagementChapter[] = [
  {
    slug: "competitions",
    title: "Compétitions",
    pitch: "Un jeu de données, une métrique, une date limite. Rien n'apprend plus vite à trancher.",
    defaults: {
      version: 3,
      events: [
        {
          date: "Pourquoi j'y vais",
          title: "Un problème, une métrique, une échéance",
          description:
            "En compétition, personne ne vous dit quoi essayer. Il faut poser le problème, lire les données et choisir vite ce qui mérite une soirée de travail.",
        },
        {
          date: "Kaggle & hackathons",
          title: "Chaque challenge est un laboratoire",
          description:
            "Feature engineering, XGBoost, optimisation bayésienne : j'y essaie ce que je n'ai pas encore eu l'occasion de mettre en production.",
          image: photo("1551288049-bebda4e38f71"),
        },
        {
          date: "Algorithmique",
          title: "La rigueur sous contrainte",
          description:
            "Programmation dynamique, graphes, complexité. Ces exercices m'ont appris à estimer le coût d'une solution avant de l'écrire.",
          image: photo("1526374965328-7f61d4dc18c5"),
        },
        {
          date: "En équipe",
          title: "Défendre une idée, puis en changer",
          description:
            "Les meilleures soumissions viennent rarement d'une seule tête. On argumente, on mesure, et c'est le score qui tranche.",
          image: photo("1522071820081-009f0129c71c"),
        },
        {
          date: "Ce que j'en garde",
          title: "Revenir, encore",
          description:
            "Un mauvais classement dit où chercher. Un bon dit que la méthode tient. Dans les deux cas, je m'inscris au suivant.",
        },
      ],
    },
  },
  {
    slug: "conferences",
    title: "Conférences & meetups",
    pitch: "Expliquer un projet devant une salle, c'est le meilleur moyen de savoir si on l'a compris.",
    defaults: {
      version: 3,
      events: [
        {
          date: "Pourquoi je prends la parole",
          title: "Expliquer oblige à comprendre",
          description:
            "Préparer une présentation, c'est découvrir tout ce qu'on croyait savoir. Je monte sur scène pour ça, et pour les questions qui suivent.",
        },
        {
          date: "Mars 2026 · Abidjan, Côte d'Ivoire",
          title: "Data Science Summit",
          description:
            "J'y ai présenté un projet de prédiction du churn client devant plus de 200 data scientists : le pipeline ML, les choix d'architecture et les résultats obtenus en production.",
          image: photo("1540575467063-178a50c2df87"),
        },
        {
          date: "Janvier 2026 · Ouagadougou, Burkina Faso",
          title: "AI/ML Meetup Ouaga",
          description:
            "Retour d'expérience sur les LLM en production : la latence, les coûts, et quoi faire quand le modèle ne répond pas. Suivi d'un échange animé avec la communauté locale.",
          image: photo("1515187029135-18ee286d815b"),
        },
        {
          date: "Novembre 2025 · Dakar, Sénégal",
          title: "Hackathon Tech4Good",
          description:
            "Une équipe de quatre et un sujet concret : optimiser la distribution d'eau potable. Un hackathon consacré aux solutions tech pour le développement durable.",
          image: photo("1559223607-a43c990c692c"),
        },
        {
          date: "La suite",
          title: "Parler plus souvent",
          description:
            "Mon objectif est simple : proposer davantage de sujets, dans davantage de villes. Si vous organisez un événement, écrivez-moi.",
        },
      ],
    },
  },
  {
    slug: "benevolat",
    title: "Bénévolat & mentorat",
    pitch: "Ce que je sais ne sert pas à grand-chose si je le garde pour moi.",
    defaults: {
      version: 3,
      events: [
        {
          date: "Pourquoi je transmets",
          title: "Rendre l'entrée plus simple",
          description:
            "J'accompagne des débutants et je contribue à des projets communautaires, pour que les premiers pas dans la tech soient moins rudes pour ceux qui arrivent.",
        },
        {
          date: "2025 – Aujourd'hui · Côte d'Ivoire",
          title: "Mentorat individuel",
          description:
            "Cinq étudiants en informatique, un point chaque semaine. On part de Python, on arrive aux premiers projets de data science, avec de la revue de code et des discussions d'orientation en chemin.",
          image: photo("1531482615713-2afd69097998"),
        },
        {
          date: "2025 · Ouagadougou & Abidjan",
          title: "Ateliers d'initiation",
          description:
            "Des ateliers pour lycéens et étudiants : le web, la logique algorithmique, et à quoi ressemblent vraiment les métiers de la tech.",
          image: photo("1557804506-669a67965ba0"),
        },
        {
          date: "Contributions",
          title: "Open source",
          description:
            "Je contribue à des projets open source et à des initiatives à impact social. Un outil n'aide personne s'il n'est pas accessible.",
          image: photo("1521737711867-e3b97375f902"),
        },
        {
          date: "Sur la durée",
          title: "Former ceux qui formeront",
          description:
            "Le bénévolat se joue sur des années. L'objectif est que chaque personne accompagnée puisse, à son tour, en accompagner d'autres.",
        },
      ],
    },
  },
  {
    slug: "recherche",
    title: "Recherche & veille",
    pitch: "Chaque semaine sort un modèle présenté comme une révolution. Je préfère le faire tourner moi-même.",
    defaults: {
      version: 3,
      events: [
        {
          date: "Pourquoi je cherche",
          title: "Tester avant de croire",
          description:
            "Je lis l'article, je lance le modèle, je mesure, et je note ce qui tient une fois sorti de la démonstration.",
        },
        {
          date: "Ce que j'explore",
          title: "Les LLM, une fois en production",
          description:
            "Latence, coûts, stratégies de repli : ce qui m'intéresse, c'est ce qui se passe après la démo.",
          image: photo("1677442136019-21780ecad995"),
        },
        {
          date: "Ce que j'en fais",
          title: "Écrire pour vérifier que j'ai compris",
          description:
            "Ce que j'apprends finit en article sur le blog. Si je n'arrive pas à l'expliquer, c'est que je n'ai pas fini.",
          image: photo("1455390582262-044cdead277a"),
        },
      ],
    },
  },
];

export const getEngagementChapter = (slug?: string) =>
  engagementChapters.find((c) => c.slug === slug);
