export type SkillItem = {
  name: string;
  level: number;
};

export type ProjectItem = {
  name: string;
  description: string;
};

export type ExperienceItem = {
  company: string;
  role: string;
  duration: string;
};

export type ResumeData = {
  fullName: string;
  title: string;
  bio: string;
  skills: SkillItem[];
  projects: ProjectItem[];
  experience: ExperienceItem[];
};
