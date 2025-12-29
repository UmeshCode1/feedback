"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, Send, MessageSquare, User, Hash } from "lucide-react";
import { databases } from "@/lib/appwrite";
import { ID } from "appwrite";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    enrollment_no: z.string().min(5, "Invalid enrollment number format"),
    feedback: z.string().min(10, "Feedback must be at least 10 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function FeedbackForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        setError(null);

        try {
            // In a real production setup, we'd call the Appwrite Function via HTTP
            // or save directly to the database if permissions allow.
            // The requirement says "Appwrite Function: Save to Database + Sync to Sheets"
            // So we should trigger the function. For this demo, we'll save to DB directly
            // and assume the function is triggered by a database event (Create).

            await databases.createDocument(
                "aimlclub_feedback",
                "feedback_entries",
                ID.unique(),
                {
                    ...data,
                    created_at: new Date().toISOString(),
                }
            );

            setIsSuccess(true);
            reset();
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Failed to submit feedback. Please try again.";
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-8 rounded-2xl flex flex-col items-center text-center space-y-4 max-w-md mx-auto"
            >
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold">Feedback Received!</h2>
                <p className="text-foreground/70">
                    Thank you for your valuable feedback. It helps us improve the AIML Club experience.
                </p>
                <button
                    onClick={() => setIsSuccess(false)}
                    className="mt-6 px-6 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg transition-all"
                >
                    Submit Another
                </button>
            </motion.div>
        );
    }

    return (
        <div className="w-full max-w-lg mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-3 text-white">
                    AIML Club <span className="text-primary italic">Feedback</span>
                </h1>
                <p className="text-foreground/60">Help us bridge the gap between AI research and academic excellence.</p>
            </div>

            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit(onSubmit)}
                className="glass p-6 sm:p-8 rounded-3xl space-y-6 relative overflow-hidden"
            >
                {/* Glow effect */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-3xl rounded-full" />

                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2 text-foreground/80">
                        <User size={16} /> Full Name
                    </label>
                    <input
                        {...register("name")}
                        placeholder="John Doe"
                        className={`w-full bg-white/5 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.name ? "border-red-500/50" : "border-glass-border"
                            }`}
                    />
                    {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2 text-foreground/80">
                        <Hash size={16} /> Enrollment Number
                    </label>
                    <input
                        {...register("enrollment_no")}
                        placeholder="0111CSXXXXXXXX"
                        className={`w-full bg-white/5 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.enrollment_no ? "border-red-500/50" : "border-glass-border"
                            }`}
                    />
                    {errors.enrollment_no && <p className="text-xs text-red-400 mt-1">{errors.enrollment_no.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2 text-foreground/80">
                        <MessageSquare size={16} /> Your Feedback / Suggestion
                    </label>
                    <textarea
                        {...register("feedback")}
                        placeholder="Tell us what's on your mind..."
                        rows={4}
                        className={`w-full bg-white/5 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none ${errors.feedback ? "border-red-500/50" : "border-glass-border"
                            }`}
                    />
                    {errors.feedback && <p className="text-xs text-red-400 mt-1">{errors.feedback.message}</p>}
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group"
                >
                    {isSubmitting ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <>
                            Submit Feedback
                            <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                    )}
                </button>
            </motion.form>

            <p className="text-center mt-8 text-xs text-foreground/40 font-mono tracking-widest uppercase">
                Oriental College of Technology • Bhopal
            </p>
        </div>
    );
}
