/**
 * Validator definitions can be added here as the API expands.
 * This file is a placeholder for structured validation logic.
 */

export type SkillInput = {
  name: string;
  level: number;
};

export type ProjectInput = {
  name: string;
  description: string;
};

export type ExperienceInput = {
  company: string;
  role: string;
  duration: string;
};

export type ResumeInput = {
  fullName: string;
  title: string;
  bio: string;
  skills: SkillInput[];
  projects: ProjectInput[];
  experience: ExperienceInput[];
};
