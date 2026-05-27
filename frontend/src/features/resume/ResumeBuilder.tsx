"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Input from "@/components/ui/Input";
import SectionTitle from "@/components/ui/SectionTitle";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useToast } from "@/hooks/useToast";
import type { ResumeData } from "@/types/resume";
import {
  createResume,
  deleteResume,
  getAllResumes,
  getResumeById,
  updateResume,
  type ResumeResponse,
} from "@/services/resume.service";

const resumeSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  title: z.string().min(1, "Title is required"),
  bio: z.string().min(1, "Bio is required"),
  skills: z
    .array(
      z.object({
        name: z.string().min(1, "Skill name is required"),
        level: z.coerce
          .number()
          .min(0.5, "Level must be at least 0.5")
          .max(10, "Level must be 10 or less"),
      }),
    )
    .min(1, "At least one skill is required"),
  projects: z
    .array(
      z.object({
        name: z.string().min(1, "Project name is required"),
        description: z.string().min(1, "Project description is required"),
      }),
    )
    .min(1, "At least one project is required"),
  experience: z
    .array(
      z.object({
        company: z.string().min(1, "Company is required"),
        role: z.string().min(1, "Role is required"),
        duration: z.string().min(1, "Duration is required"),
      }),
    )
    .min(1, "At least one experience entry is required"),
});

const defaultResume: ResumeData = {
  fullName: "Dhananjay Gupta",
  title: "Software Engineer",
  bio: "Building animated resume experiences that blend visuals, data, and modern UI.",
  skills: [
    { name: "Next.js", level: 9 },
    { name: "Node.js", level: 9 },
    { name: "TypeScript", level: 9 },
  ],
  projects: [
    {
      name: "Portfolio Dashboard",
      description: "Interactive analytics previews for modern resumes.",
    },
    {
      name: "Launch Metrics",
      description: "Chart-driven storytelling for professional achievements.",
    },
  ],
  experience: [
    {
      company: "Launch Labs",
      role: "Lead Product Engineer",
      duration: "2024–Present",
    },
    {
      company: "Pixel Studio",
      role: "Senior UI Engineer",
      duration: "2021–2024",
    },
  ],
};

const emptyResume: ResumeData = {
  fullName: "",
  title: "",
  bio: "",
  skills: [],
  projects: [],
  experience: [],
};

const freshStartResume: ResumeData = {
  fullName: "",
  title: "",
  bio: "",
  skills: [{ name: "", level: 5 }],
  projects: [{ name: "", description: "" }],
  experience: [{ company: "", role: "", duration: "" }],
};

// Animation variants
const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
};

export default function ResumeBuilder() {
  const [resume, setResume] = useState<ResumeData>(defaultResume);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [history, setHistory] = useState<ResumeResponse[]>([]);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    title: string;
    message: string;
    confirmLabel: string;
    onConfirm: () => void;
  } | null>(null);
  const toast = useToast();

  const form = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: defaultResume,
    mode: "onChange",
  });

  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = form;

  // Watch all fields for real-time updates
  const watchedFullName = watch("fullName");
  const watchedTitle = watch("title");
  const watchedBio = watch("bio");
  const watchedSkills = watch("skills");
  const watchedProjects = watch("projects");
  const watchedExperience = watch("experience");

  // Local state for immediate skill updates
  const [localSkills, setLocalSkills] = useState(
    watchedSkills || defaultResume.skills,
  );

  // Check dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // Sync localSkills with form when form changes
  useEffect(() => {
    if (
      watchedSkills &&
      JSON.stringify(watchedSkills) !== JSON.stringify(localSkills)
    ) {
      setLocalSkills(watchedSkills);
    }
  }, [watchedSkills]);

  // Update resume preview in real-time
  useEffect(() => {
    setResume({
      fullName: watchedFullName || "",
      title: watchedTitle || "",
      bio: watchedBio || "",
      skills: localSkills || [],
      projects: watchedProjects || [],
      experience: watchedExperience || [],
    });
  }, [
    watchedFullName,
    watchedTitle,
    watchedBio,
    localSkills,
    watchedProjects,
    watchedExperience,
  ]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const resumes = await getAllResumes();
        setHistory(resumes);
      } catch (error) {
        console.error("Error loading resume history:", error);
      }
    };
    loadHistory();
  }, []);

  const skillsChartData = useMemo(() => {
    const skills = localSkills || [];
    if (!skills || skills.length === 0) return [];
    return skills
      .filter((skill) => skill && skill.name?.trim())
      .map((skill, index) => {
        let level =
          typeof skill.level === "number"
            ? skill.level
            : parseFloat(skill.level);
        if (isNaN(level)) level = 0;
        return {
          name: skill.name || "Unnamed Skill",
          level: Math.min(10, Math.max(0, level)),
          color: ["#38bdf8", "#0ea5e9", "#6366f1", "#8b5cf6", "#ec4899"][
            index % 5
          ],
        };
      });
  }, [localSkills]);

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control,
    name: "skills",
  });

  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({
    control,
    name: "projects",
  });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: "experience",
  });

  const refreshHistory = async () => {
    try {
      const resumes = await getAllResumes();
      setHistory(resumes);
    } catch (error) {
      console.error("Error refreshing resume history:", error);
    }
  };

  const promptDeleteResume = (id: string, fullName: string) => {
    setConfirmDialog({
      title: "Delete Resume",
      message: `Are you sure you want to delete ${fullName}? This action cannot be undone.`,
      confirmLabel: "Delete",
      onConfirm: async () => {
        setConfirmDialog(null);
        await removeResume(id);
      },
    });
  };

  const loadResume = async (id: string) => {
    try {
      const selected = await getResumeById(id);
      if (selected) {
        const { fullName, title, bio, skills, projects, experience } = selected;
        form.reset({ fullName, title, bio, skills, projects, experience });
        setLocalSkills(skills || []);
        setEditingId(selected._id ?? null);
        setSaveMessage(`Editing ${selected.fullName}`);
        setErrorMessage(null);
        toast.info("Resume loaded for editing");
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load resume for editing.";
      setErrorMessage(message);
      toast.error(message);
    }
  };

  const removeResume = async (id: string) => {
    const previousHistory = history;
    setHistory((current) => current.filter((item) => item._id !== id));

    try {
      await deleteResume(id);
      setEditingId((current) => (current === id ? null : current));
      toast.success("Resume deleted successfully.");
    } catch (error) {
      setHistory(previousHistory);
      const message =
        error instanceof Error ? error.message : "Unable to delete resume.";
      setErrorMessage(message);
      toast.error(message);
    }
  };

  const performSave = async (values: ResumeData) => {
    setSaveMessage(null);
    setErrorMessage(null);
    setIsSaving(true);

    try {
      const result = editingId
        ? await updateResume(editingId, values)
        : await createResume(values);
      setResume(result);
      setSaveMessage(
        editingId
          ? "Resume updated successfully."
          : "Resume saved successfully.",
      );
      toast.success(
        editingId
          ? "Resume updated successfully."
          : "Resume created successfully.",
      );
      setEditingId(null);
      await refreshHistory();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to save resume. Please try again.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmit = async (values: ResumeData) => {
    if (editingId) {
      setConfirmDialog({
        title: "Confirm Update",
        message: "Update this saved resume with your latest changes?",
        confirmLabel: "Update",
        onConfirm: async () => {
          setConfirmDialog(null);
          await performSave(values);
        },
      });
      return;
    }
    await performSave(values);
  };

  const onSubmitError = () => {
    toast.error("Please fix validation errors before saving.");
  };

  const handleClearAll = () => {
    form.reset(emptyResume);
    setLocalSkills([]);
    setEditingId(null);
    setSaveMessage(null);
    setErrorMessage(null);
    toast.info("All fields cleared");
  };

  const handleFreshStart = () => {
    form.reset(freshStartResume);
    setLocalSkills([{ name: "", level: 5 }]);
    setEditingId(null);
    setSaveMessage(null);
    setErrorMessage(null);
    toast.info("Ready to add your details");
  };

  const handleResetToDefault = () => {
    form.reset(defaultResume);
    setLocalSkills(defaultResume.skills);
    setEditingId(null);
    setSaveMessage(null);
    setErrorMessage(null);
    toast.info("Reset to default example");
  };

  const handleLevelChange = (index: number, value: string) => {
    let numValue = parseFloat(value);
    if (isNaN(numValue)) numValue = 1;
    if (numValue < 0.5) numValue = 0.5;
    if (numValue > 10) numValue = 10;
    // Round to 1 decimal place
    numValue = Math.round(numValue * 10) / 10;
    setValue(`skills.${index}.level`, numValue);
    const newSkills = [...localSkills];
    newSkills[index] = { ...newSkills[index], level: numValue };
    setLocalSkills(newSkills);
  };

  const handleSkillNameChange = (index: number, value: string) => {
    setValue(`skills.${index}.name`, value);
    const newSkills = [...localSkills];
    newSkills[index] = { ...newSkills[index], name: value };
    setLocalSkills(newSkills);
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 p-3 shadow-lg">
          <p className="text-sm font-semibold text-gray-900 dark:text-slate-500">
            {payload[0].payload.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-slate-500">
            Level:{" "}
            <span className="font-bold text-sky-600 dark:text-sky-400">
              {payload[0].value.toFixed(1)}/10
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-[1600px] gap-8 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="space-y-6">
          <SectionTitle
            title="Resume Builder"
            description="Add sections, update skills, and see your resume animate in real time."
          >
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button
                type="button"
                onClick={handleClearAll}
                variant="secondary"
              >
                Clear All
              </Button>
            </div>
          </SectionTitle>

          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(onSubmit, onSubmitError)}
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Full name *
                </label>
                <Input
                  {...form.register("fullName")}
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="text-xs text-rose-400">
                    {errors.fullName.message?.toString()}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Title *
                </label>
                <Input
                  {...form.register("title")}
                  placeholder="e.g., Software Engineer"
                />
                {errors.title && (
                  <p className="text-xs text-rose-400">
                    {errors.title.message?.toString()}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block">
                Bio *
              </label>
              <textarea
                rows={4}
                placeholder="Tell us about yourself..."
                className="w-full rounded-2xl border px-4 py-3 text-sm shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 theme-input"
                {...form.register("bio")}
              />
              {errors.bio && (
                <p className="text-xs text-rose-400">
                  {errors.bio.message?.toString()}
                </p>
              )}
            </div>

            {/* Skills Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-slate-950 dark:text-white">
                    Skills *
                  </h3>
                  <p className="text-xs text-slate-500">
                    At least one skill required
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => {
                    appendSkill({ name: "", level: 5 });
                    setLocalSkills([...localSkills, { name: "", level: 5 }]);
                  }}
                  variant="secondary"
                >
                  Add Skill
                </Button>
              </div>
              {errors.skills && (
                <p className="text-xs text-rose-400">
                  {errors.skills.message?.toString()}
                </p>
              )}
              <AnimatePresence mode="wait">
                <div className="space-y-4">
                  {skillFields.length === 0 ? (
                    <motion.div
                      key="empty-skills"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="rounded-3xl border border-dashed theme-card p-8 text-center"
                    >
                      <p className="text-sm text-slate-500">
                        No skills added yet. Click on Add Skill to get started.
                      </p>
                    </motion.div>
                  ) : (
                    skillFields.map((field, index) => (
                      <motion.div
                        key={field.id}
                        variants={listItemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                        transition={{ duration: 0.2 }}
                        className="grid gap-3 rounded-3xl border theme-card p-4 sm:grid-cols-[1.5fr_1fr_auto]"
                      >
                        <div>
                          <Input
                            placeholder="Skill name"
                            value={localSkills[index]?.name || ""}
                            onChange={(e) =>
                              handleSkillNameChange(index, e.target.value)
                            }
                          />
                          {errors.skills?.[index]?.name && (
                            <p className="mt-1 text-xs text-rose-400">
                              {errors.skills[index]?.name?.message?.toString()}
                            </p>
                          )}
                        </div>
                        <div>
                          <Input
                            type="number"
                            step="0.5"
                            min={0.5}
                            max={10}
                            placeholder="Level (0.5-10)"
                            value={localSkills[index]?.level || 5}
                            onChange={(e) =>
                              handleLevelChange(index, e.target.value)
                            }
                          />
                          {errors.skills?.[index]?.level && (
                            <p className="mt-1 text-xs text-rose-400">
                              {errors.skills[index]?.level?.message?.toString()}
                            </p>
                          )}
                        </div>

                        <Button
                          type="button"
                          onClick={() => {
                            removeSkill(index);
                            setLocalSkills(
                              localSkills.filter((_, i) => i !== index),
                            );
                          }}
                          variant="secondary"
                        >
                          Remove
                        </Button>
                      </motion.div>
                    ))
                  )}
                </div>
              </AnimatePresence>
            </section>

            {/* Projects Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-slate-950 dark:text-white">
                    Projects *
                  </h3>
                  <p className="text-xs text-slate-500">
                    At least one project required
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => appendProject({ name: "", description: "" })}
                  variant="secondary"
                >
                  Add Project
                </Button>
              </div>
              {errors.projects && (
                <p className="text-xs text-rose-400">
                  {errors.projects.message?.toString()}
                </p>
              )}
              <AnimatePresence mode="wait">
                <div className="space-y-4">
                  {projectFields.length === 0 ? (
                    <motion.div
                      key="empty-projects"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="rounded-3xl border border-dashed theme-card p-8 text-center"
                    >
                      <p className="text-sm text-slate-500">
                        No projects added yet. Click on Add Project to get
                        started.
                      </p>
                    </motion.div>
                  ) : (
                    projectFields.map((field, index) => (
                      <motion.div
                        key={field.id}
                        variants={listItemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                        transition={{ duration: 0.2 }}
                        className="space-y-3 rounded-3xl border theme-card p-4"
                      >
                        <div>
                          <Input
                            placeholder="Project name"
                            {...form.register(`projects.${index}.name`)}
                            onChange={(e) =>
                              setValue(`projects.${index}.name`, e.target.value)
                            }
                          />
                          {errors.projects?.[index]?.name && (
                            <p className="mt-1 text-xs text-rose-400">
                              {errors.projects[
                                index
                              ]?.name?.message?.toString()}
                            </p>
                          )}
                        </div>
                        <div>
                          <textarea
                            {...form.register(`projects.${index}.description`)}
                            rows={2}
                            className="w-full rounded-2xl border px-4 py-3 text-sm shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 theme-input"
                            placeholder="Short description"
                            onChange={(e) =>
                              setValue(
                                `projects.${index}.description`,
                                e.target.value,
                              )
                            }
                          />
                          {errors.projects?.[index]?.description && (
                            <p className="mt-1 text-xs text-rose-400">
                              {errors.projects[
                                index
                              ]?.description?.message?.toString()}
                            </p>
                          )}
                        </div>
                        <Button
                          type="button"
                          onClick={() => removeProject(index)}
                          variant="secondary"
                        >
                          Remove Project
                        </Button>
                      </motion.div>
                    ))
                  )}
                </div>
              </AnimatePresence>
            </section>

            {/* Experience Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-slate-950 dark:text-white">
                    Experience *
                  </h3>
                  <p className="text-xs text-slate-500">
                    At least one experience entry required
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() =>
                    appendExperience({ company: "", role: "", duration: "" })
                  }
                  variant="secondary"
                >
                  Add Role
                </Button>
              </div>
              {errors.experience && (
                <p className="text-xs text-rose-400">
                  {errors.experience.message?.toString()}
                </p>
              )}
              <AnimatePresence mode="wait">
                <div className="space-y-4">
                  {experienceFields.length === 0 ? (
                    <motion.div
                      key="empty-experience"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="rounded-3xl border border-dashed theme-card p-8 text-center"
                    >
                      <p className="text-sm text-slate-500">
                        No experience added yet. Click on Add Role to get
                        started.
                      </p>
                    </motion.div>
                  ) : (
                    experienceFields.map((field, index) => (
                      <motion.div
                        key={field.id}
                        variants={listItemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                        transition={{ duration: 0.2 }}
                        className="space-y-3 rounded-3xl border theme-card p-4"
                      >
                        <div>
                          <Input
                            placeholder="Company"
                            {...form.register(`experience.${index}.company`)}
                            onChange={(e) =>
                              setValue(
                                `experience.${index}.company`,
                                e.target.value,
                              )
                            }
                          />
                          {errors.experience?.[index]?.company && (
                            <p className="mt-1 text-xs text-rose-400">
                              {errors.experience[
                                index
                              ]?.company?.message?.toString()}
                            </p>
                          )}
                        </div>
                        <div>
                          <Input
                            placeholder="Role"
                            {...form.register(`experience.${index}.role`)}
                            onChange={(e) =>
                              setValue(
                                `experience.${index}.role`,
                                e.target.value,
                              )
                            }
                          />
                          {errors.experience?.[index]?.role && (
                            <p className="mt-1 text-xs text-rose-400">
                              {errors.experience[
                                index
                              ]?.role?.message?.toString()}
                            </p>
                          )}
                        </div>
                        <div>
                          <Input
                            placeholder="Duration (e.g., 2024-Present)"
                            {...form.register(`experience.${index}.duration`)}
                            onChange={(e) =>
                              setValue(
                                `experience.${index}.duration`,
                                e.target.value,
                              )
                            }
                          />
                          {errors.experience?.[index]?.duration && (
                            <p className="mt-1 text-xs text-rose-400">
                              {errors.experience[
                                index
                              ]?.duration?.message?.toString()}
                            </p>
                          )}
                        </div>
                        <Button
                          type="button"
                          onClick={() => removeExperience(index)}
                          variant="secondary"
                        >
                          Remove Role
                        </Button>
                      </motion.div>
                    ))
                  )}
                </div>
              </AnimatePresence>
            </section>

            <div className="space-y-2">
              <div className="flex flex-col items-end gap-3 sm:flex-row sm:justify-between sm:items-center">
                <div className="space-y-1 text-right">
                  {saveMessage && (
                    <p className="text-sm text-emerald-400">{saveMessage}</p>
                  )}
                  {errorMessage && (
                    <p className="text-sm text-rose-400">{errorMessage}</p>
                  )}
                </div>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Resume"}
                </Button>
              </div>
            </div>
          </form>
        </Card>

        {/* Live Preview Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card>
            <div className="space-y-4">
              <div className="rounded-3xl border theme-card p-6">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-sky-300/80">
                      Live Preview
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">
                      {resume.fullName || "Your Name"}
                    </h1>
                    <p className="text-lg text-slate-700 dark:text-slate-300">
                      {resume.title || "Your Title"}
                    </p>
                  </div>
                </div>
                <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">
                  {resume.bio || "Your bio will appear here..."}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="p-5">
                  <h3 className="mb-4 text-base font-semibold text-slate-950 dark:text-white">
                    Top Skills
                  </h3>
                  {skillsChartData.length > 0 ? (
                    <ResponsiveContainer
                      width="100%"
                      height={Math.max(240, skillsChartData.length * 60)}
                    >
                      <BarChart
                        layout="vertical"
                        data={skillsChartData}
                        margin={{ top: 8, right: 60, left: 0, bottom: 8 }}
                        barCategoryGap="24%"
                      >
                        <XAxis
                          type="number"
                          domain={[0, 10]}
                          ticks={[0, 2, 4, 6, 8, 10]}
                          stroke={isDarkMode ? "#64748b" : "#94a3b8"}
                          axisLine={false}
                          tickLine={false}
                          tick={false}
                        />
                        <YAxis
                          dataKey="name"
                          type="category"
                          width={100}
                          stroke={isDarkMode ? "#64748b" : "#94a3b8"}
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fontSize: 12,
                            fill: isDarkMode ? "#cbd5e1" : "#334155",
                            fontWeight: 500,
                          }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={false} />
                        <Bar
                          dataKey="level"
                          radius={[8, 8, 8, 8]}
                          activeBar={false}
                          cursor="pointer"
                        >
                          {skillsChartData.map((entry) => (
                            <Cell
                              key={entry.name}
                              fill={entry.color}
                              style={{
                                cursor: "pointer",
                                transition: "all 0.3s ease-in-out",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.filter =
                                  "brightness(1.15)";
                                e.currentTarget.style.transform =
                                  "scaleX(1.03)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.filter = "none";
                                e.currentTarget.style.transform = "scaleX(1)";
                              }}
                            />
                          ))}
                          <LabelList
                            dataKey="level"
                            position="right"
                            offset={8}
                            formatter={(value) => {
                              const numValue = Number(value);
                              return !isNaN(numValue) && numValue > 0
                                ? `${numValue.toFixed(1)}/10`
                                : "0/10";
                            }}
                            style={{
                              fill: isDarkMode ? "#e2e8f0" : "#0f172a",
                              fontWeight: 700,
                              fontSize: 12,
                              dominantBaseline: "middle",
                            }}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm text-slate-500">
                      No skills added yet
                    </p>
                  )}
                </Card>

                <Card className="p-5">
                  <h3 className="mb-4 text-base font-semibold text-slate-950 dark:text-white">
                    Highlights
                  </h3>
                  {resume.projects && resume.projects.length > 0 ? (
                    <AnimatePresence>
                      <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                        {resume.projects.slice(0, 3).map((project, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.1 }}
                            whileHover={{ scale: 1.02, x: 5 }}
                            className="rounded-3xl border theme-card p-4 transition-all duration-200 hover:shadow-md"
                          >
                            <p className="font-semibold text-slate-950 dark:text-white">
                              {project.name || "Untitled Project"}
                            </p>
                            <p className="text-slate-600 dark:text-slate-400">
                              {project.description || "No description"}
                            </p>
                          </motion.li>
                        ))}
                      </ul>
                    </AnimatePresence>
                  ) : (
                    <p className="text-sm text-slate-500">
                      No projects added yet
                    </p>
                  )}
                </Card>
              </div>

              <Card className="p-5">
                <h3 className="mb-4 text-base font-semibold text-slate-950 dark:text-white">
                  Experience Timeline
                </h3>
                {resume.experience && resume.experience.length > 0 ? (
                  <AnimatePresence>
                    <div className="mt-4 space-y-4">
                      {resume.experience.map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.1 }}
                          whileHover={{ x: 6 }}
                          className="rounded-3xl border theme-card p-4 transition-all duration-200 hover:shadow-md"
                        >
                          <p className="font-semibold text-slate-950 dark:text-white">
                            {item.role || "Role"}
                          </p>
                          <p className="text-slate-600 dark:text-slate-400">
                            {item.company || "Company"}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {item.duration || "Duration"}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </AnimatePresence>
                ) : (
                  <p className="mt-4 text-sm text-slate-500">
                    No experience added yet
                  </p>
                )}
              </Card>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* History Section */}
      <Card className="mt-8">
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
                Resume History
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Manage saved resumes and select any item to edit.
              </p>
            </div>
          </div>

          {history.length === 0 ? (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              No saved resumes yet. Submit a resume to build history.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="px-4 py-3 text-slate-500 dark:text-slate-400">
                      Full Name
                    </th>
                    <th className="px-4 py-3 text-slate-500 dark:text-slate-400">
                      Title
                    </th>
                    <th className="px-4 py-3 text-slate-500 dark:text-slate-400">
                      Skills
                    </th>
                    <th className="px-4 py-3 text-slate-500 dark:text-slate-400">
                      Last Updated
                    </th>
                    <th className="px-4 py-3 text-slate-500 dark:text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => {
                    const updatedAt = item.updatedAt || item.createdAt || "";
                    const updatedLabel = updatedAt
                      ? new Date(updatedAt).toLocaleString()
                      : "N/A";
                    const isSelected = editingId === item._id;

                    return (
                      <tr
                        key={item._id}
                        className={`transition-colors duration-200 ${
                          isSelected
                            ? "bg-sky-50 dark:bg-slate-800"
                            : "bg-transparent"
                        } hover:bg-slate-100 hover:dark:bg-slate-900`}
                      >
                        <td className="px-4 py-4 text-slate-950 dark:text-slate-100">
                          {item.fullName}
                        </td>
                        <td className="px-4 py-4 text-slate-700 dark:text-slate-300">
                          {item.title}
                        </td>
                        <td className="px-4 py-4 text-slate-700 dark:text-slate-300">
                          {item.skills.length} skills
                        </td>
                        <td className="px-4 py-4 text-slate-500 dark:text-slate-400">
                          {updatedLabel}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              type="button"
                              onClick={() => loadResume(item._id ?? "")}
                              variant="secondary"
                            >
                              Edit
                            </Button>
                            <Button
                              type="button"
                              onClick={() =>
                                promptDeleteResume(
                                  item._id ?? "",
                                  item.fullName,
                                )
                              }
                              variant="secondary"
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>

      <ConfirmDialog
        open={Boolean(confirmDialog)}
        title={confirmDialog?.title ?? ""}
        message={confirmDialog?.message ?? ""}
        confirmLabel={confirmDialog?.confirmLabel ?? "Confirm"}
        onConfirm={confirmDialog?.onConfirm ?? (() => null)}
        onCancel={() => setConfirmDialog(null)}
      />
    </main>
  );
}
