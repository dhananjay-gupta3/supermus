import mongoose, { Schema, model } from 'mongoose';

const SkillSchema = new Schema({
  name: { type: String, required: true },
  level: { type: Number, required: true }
});

const ProjectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true }
});

const ExperienceSchema = new Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  duration: { type: String, required: true }
});

const ResumeSchema = new Schema(
  {
    fullName: { type: String, required: true },
    title: { type: String, required: true },
    bio: { type: String, required: true },
    skills: { type: [SkillSchema], default: [] },
    projects: { type: [ProjectSchema], default: [] },
    experience: { type: [ExperienceSchema], default: [] }
  },
  {
    timestamps: true
  }
);

const Resume = model('Resume', ResumeSchema);
export default Resume;
