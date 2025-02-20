import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import AccentSelector from "./AccentSelector";
import authService from "@/appwrite/auth";
import Loader from "../Loader";
import { useSelector } from "react-redux";

const FormSchema = z.object({
    theme: z.enum(["light", "dark"], {
        required_error: "You need to select a theme.",
    }),
    font: z.enum([
        "default", "comic sans", "monospace", "open dyslexic", "sans serif", "serif"
    ], {
        required_error: "You need to select a font.",
    }),
    accentColor: z.string(),
});

const themeOptions = [
    { value: "light", label: "Light Theme" },
    { value: "dark", label: "Dark Theme" },
];

const fontOptions = [
    { value: "default", label: "Default" },
    { value: "comic sans", label: <i>Comic Sans</i> },
    { value: "monospace", label: "Monospace" },
    { value: "open dyslexic", label: "Open Dyslexic" },
    { value: "sans serif", label: "Sans Serif" },
    { value: "serif", label: "Serif" },
];

const accentColors = [
    'orange-500', // Coral
    'teal-500',   // Teal
    'yellow-500', // Mustard Yellow
    'violet-500', // Lavender
    'sky-500',
    'cyan-500',
    'orange-700', // Burnt Orange
    'emerald-500',
    'green-200',  // Mint Green
    'red-600',    // Crimson Red
    'yellow-400'  // Gold
];

export default function Customization() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const prefs = useSelector((state) => state.auth.userData?.prefs);
    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            theme: prefs?.theme || "dark",
            font: prefs?.font || "comic sans",
            accentColor: prefs?.accentColor || accentColors[7],
        },
    });

    const onSubmit = async (values) => {
        setLoading(true);
        try {
            await authService.updateUserPref(values);
        } catch (err) {
            setError("Failed to update profile.");
            console.log(err.message); // Log the error to the console
        } finally {
            setLoading(false);
        }

    };

    const renderRadioGroup = (name, options) => (
        <RadioGroup
            onValueChange={(value) => form.setValue(name, value)}
            value={form.watch(name)}
            className="flex gap-4 flex-wrap space-y-1"
        >
            {options.map(({ value, label }) => (
                <Card key={value} className="flex flex-row gap-2 items-center p-4">
                    <FormItem className="flex items-center space-x-3 space-y-0 w-full h-full">
                        <FormControl>
                            <RadioGroupItem value={value} />
                        </FormControl>
                        <FormLabel className="font-normal h-full">{label}</FormLabel>
                    </FormItem>
                </Card>
            ))}
        </RadioGroup>
    );

    return (
        <Card className="max-w-2xl mx-auto space-y-8 p-8">
            {loading && <Loader />}
            {error && <p className="text-red-500">{error}</p>}
            <h2 className="text-2xl font-bold mb-4">Appearance</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold">Site Theme</h2>
                        <FormField name="theme" control={form.control} render={() => (
                            <FormItem>
                                <FormControl>
                                    {renderRadioGroup("theme", themeOptions)}
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold">Base Reading Font</h2>
                        <FormField name="font" control={form.control} render={() => (
                            <FormItem>
                                <FormControl>
                                    {renderRadioGroup("font", fontOptions)}
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold">Accent Color</h2>
                        <AccentSelector
                            selectedColor={form.watch("accentColor")}
                            onSelect={(color) => form.setValue("accentColor", color)}
                        />
                        <FormMessage />
                    </div>

                    <Button type="submit" className="w-full mt-4" disabled={loading}>
                        {loading ? "Saving..." : "Save Settings"}
                    </Button>

                </form>
            </Form>
        </Card>
    );
}
