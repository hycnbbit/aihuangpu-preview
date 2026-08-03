import { useEffect, useState } from "react";
import { deployPath } from "./deployPath";

export type StudentWork = {
  id: string;
  slug: string;
  title: string;
  authors: string[];
  authorLabel: string;
  description: string;
  category: string;
  tags: string[];
  accent: string;
  accentSoft: string;
  cover: string | null;
  entry: string;
  playable: boolean;
  projectCount: number;
  source: string;
  signature: string;
  works: Array<{
    id: string;
    title: string;
    entry: string;
    cover: string | null;
    playable: boolean;
  }>;
};

export type StudentWorkManifest = {
  generatedAt: string;
  archives: string[];
  stats: {
    studentCount: number;
    projectCount: number;
    workCount: number;
    playableCount: number;
    coverCount: number;
  };
  warnings: string[];
  projects: StudentWork[];
};

export const EMPTY_MANIFEST: StudentWorkManifest = {
  generatedAt: "fallback",
  archives: [],
  stats: {
    studentCount: 0,
    projectCount: 0,
    workCount: 0,
    playableCount: 0,
    coverCount: 0,
  },
  warnings: [],
  projects: [],
};

let manifestRequest: Promise<StudentWorkManifest> | null = null;

export function loadStudentWorks(): Promise<StudentWorkManifest> {
  if (!manifestRequest) {
    manifestRequest = fetch(deployPath("/student-works/manifest.json"), {
      cache: "no-store",
    })
      .then(response => {
        if (!response.ok)
          throw new Error(`作品清单加载失败：${response.status}`);
        return response.json() as Promise<StudentWorkManifest>;
      })
      .catch(() => EMPTY_MANIFEST);
  }
  return manifestRequest;
}

export function useStudentWorks() {
  const [manifest, setManifest] = useState<StudentWorkManifest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    loadStudentWorks().then(nextManifest => {
      if (!active) return;
      setManifest(nextManifest);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  return {
    manifest: manifest ?? EMPTY_MANIFEST,
    loading,
  };
}

export function findStudentWork(manifest: StudentWorkManifest, slug: string) {
  return manifest.projects.find(project => project.slug === slug);
}
