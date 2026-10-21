import { describe, expect, it } from "vitest";
import { describeSource } from "@/lib/attribution";

const OWN = "kwami.dev";

describe("describeSource", () => {
  it("prefers the utm_source of a tagged link", () => {
    expect(describeSource("?utm_source=linkedin", "https://www.google.com/", OWN)).toBe("LinkedIn");
    expect(describeSource("?utm_source=cv&utm_campaign=stage-2027", "", OWN)).toBe("CV (stage-2027)");
    expect(describeSource("?utm_source=newsletter", "", OWN)).toBe("newsletter");
  });

  it("names the usual referrers", () => {
    expect(describeSource("", "https://www.linkedin.com/feed/", OWN)).toBe("LinkedIn");
    expect(describeSource("", "https://lnkd.in/abc", OWN)).toBe("LinkedIn");
    expect(describeSource("", "https://www.google.co.ma/", OWN)).toBe("Google");
    expect(describeSource("", "https://github.com/mysteriodataweb", OWN)).toBe("GitHub");
    expect(describeSource("", "https://t.co/xyz", OWN)).toBe("X");
  });

  it("keeps the host of an unknown referrer", () => {
    expect(describeSource("", "https://www.welcometothejungle.com/fr/jobs", OWN)).toBe("welcometothejungle.com");
  });

  it("treats no referrer, or the site itself, as a direct visit", () => {
    expect(describeSource("", "", OWN)).toBe("Accès direct");
    expect(describeSource("", "https://www.kwami.dev/projets", "www.kwami.dev")).toBe("Accès direct");
    expect(describeSource("", "https://kwami.dev/", "www.kwami.dev")).toBe("Accès direct");
  });
});
