import type { Lang } from "@/i18n";

// The facts of the CV, from Alfred's LinkedIn profile and his projects. The site shows them as a page,
// without a PDF: each application gets its own version of the CV, sent on request.

export interface PathEntry {
  period: string;
  org: string;
  /** Role or degree. */
  title: string;
  place?: string;
  points: string[];
  /** Slug of the project page that shows this work. */
  project?: string;
}

export interface SkillGroup {
  name: string;
  items: string[];
}

interface Parcours {
  experience: PathEntry[];
  education: PathEntry[];
  /** Only tools used in a project or listed on LinkedIn, without self-rated levels. */
  skills: SkillGroup[];
}

export const parcours: Record<Lang, Parcours> = {
  fr: {
    experience: [
      {
        period: "mars – juil. 2026",
        org: "InnoFaso",
        title: "Projet de synthèse (capstone)",
        place: "Burkina Faso",
        points: [
          "Digitalisation et optimisation des processus de production et de maintenance à partir des données d'exploitation.",
          "Application web livrée en binôme : formulaires configurables, alertes de panne et de stock bas, exports Excel et génération de formulaires par un LLM (Node.js, PostgreSQL, React).",
        ],
        project: "innopro-gestion-maintenance",
      },
      {
        period: "juil. – août 2025",
        org: "EM300",
        title: "Stagiaire Data Science",
        place: "Maroc",
        points: [
          "Data engineering et API : intégration automatisée d'API REST et pipelines de scraping qui synchronisent en continu les données produits (Python, Airflow, SQL).",
          "Système de recommandation : conception et évaluation d'algorithmes mesurés avec des métriques de classement (NDCG) pour personnaliser l'expérience utilisateur (scikit-learn, PyTorch).",
        ],
      },
    ],
    education: [
      {
        period: "2023 – 2027",
        org: "École Centrale Casablanca",
        title: "Bachelor of Science in Engineering, double diplôme",
        place: "Maroc",
        points: ["Sciences de l'ingénieur et management stratégique : finance d'entreprise, gestion de projet, mathématiques avancées, physique."],
      },
      {
        period: "janv. – juil. 2026",
        org: "Institut 2iE",
        title: "Bachelor of Science in Computer Science & AI, double diplôme avec Centrale Casablanca",
        place: "Burkina Faso",
        points: ["Spécialité intelligence artificielle et big data : machine learning, deep learning, big data (Hadoop), bases NoSQL."],
      },
      {
        period: "2024",
        org: "Tam Tam Digital",
        title: "Certification professionnelle Data Science & IA (programme de 2 ans)",
        points: [],
      },
      {
        period: "2021 – 2023",
        org: "École Polytechnique de Lomé",
        title: "Cycle préparatoire d'ingénieur (2 ans), génie mécanique",
        place: "Togo",
        points: [],
      },
    ],
    skills: [
      { name: "Langages", items: ["Python", "SQL", "TypeScript", "JavaScript"] },
      {
        name: "Data science & IA",
        items: ["scikit-learn", "PyTorch", "TensorFlow / Keras", "Hugging Face", "LangChain", "spaCy", "LLM & RAG", "Systèmes de recommandation"],
      },
      {
        name: "Data engineering",
        items: ["Airflow", "Kafka", "pandas / NumPy", "DuckDB", "Web scraping", "API REST", "Google Earth Engine"],
      },
      { name: "Bases de données", items: ["PostgreSQL / PostGIS", "MongoDB", "Hadoop", "SQLite"] },
      {
        name: "Développement & déploiement",
        items: ["FastAPI", "Node.js / Express", "React / Next.js", "Docker", "Git / GitHub Actions"],
      },
    ],
  },
  en: {
    experience: [
      {
        period: "Mar – Jul 2026",
        org: "InnoFaso",
        title: "Academic capstone project",
        place: "Burkina Faso",
        points: [
          "Digitising and optimising production and maintenance processes from operational data.",
          "Web app delivered as a pair: configurable forms, breakdown and low-stock alerts, Excel exports and LLM-generated forms (Node.js, PostgreSQL, React).",
        ],
        project: "innopro-gestion-maintenance",
      },
      {
        period: "Jul – Aug 2025",
        org: "EM300",
        title: "Data Science Intern",
        place: "Morocco",
        points: [
          "Data engineering and APIs: automated REST API integration and scraping pipelines that keep product data continuously in sync (Python, Airflow, SQL).",
          "Recommendation system: built and evaluated algorithms measured with ranking metrics (NDCG) to personalise the user experience (scikit-learn, PyTorch).",
        ],
      },
    ],
    education: [
      {
        period: "2023 – 2027",
        org: "École Centrale Casablanca",
        title: "Bachelor of Science in Engineering, dual degree",
        place: "Morocco",
        points: ["Engineering sciences and strategic management: corporate finance, project management, advanced mathematics, physics."],
      },
      {
        period: "Jan – Jul 2026",
        org: "Institut 2iE",
        title: "Bachelor of Science in Computer Science & AI, dual degree with Centrale Casablanca",
        place: "Burkina Faso",
        points: ["Artificial intelligence and big data track: machine learning, deep learning, big data (Hadoop), NoSQL databases."],
      },
      {
        period: "2024",
        org: "Tam Tam Digital",
        title: "Professional Certification in Data Science & AI (2-year programme)",
        points: [],
      },
      {
        period: "2021 – 2023",
        org: "École Polytechnique de Lomé",
        title: "Two-year engineering foundation programme, mechanical engineering",
        place: "Togo",
        points: [],
      },
    ],
    skills: [
      { name: "Languages", items: ["Python", "SQL", "TypeScript", "JavaScript"] },
      {
        name: "Data science & AI",
        items: ["scikit-learn", "PyTorch", "TensorFlow / Keras", "Hugging Face", "LangChain", "spaCy", "LLMs & RAG", "Recommendation systems"],
      },
      {
        name: "Data engineering",
        items: ["Airflow", "Kafka", "pandas / NumPy", "DuckDB", "Web scraping", "REST APIs", "Google Earth Engine"],
      },
      { name: "Databases", items: ["PostgreSQL / PostGIS", "MongoDB", "Hadoop", "SQLite"] },
      {
        name: "Development & deployment",
        items: ["FastAPI", "Node.js / Express", "React / Next.js", "Docker", "Git / GitHub Actions"],
      },
    ],
  },
};
