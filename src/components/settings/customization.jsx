import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
export default function Customization() {
    const form = useForm({
        defaultValues: {
            theme: "dark",
            font: "comic sans",
            navbar: "static",
        },
    });

    const onSubmit = (values) => {
        console.log("Saved preferences:", values);
    };

    return (
        <Card className="max-w-2xl mx-auto space-y-8 p-8">
            <h2 className="text-xl font-bold mb-4">Appearance</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Site Theme</h3>
                        <FormField name="theme" control={form.control} render={({ field }) => (
                            <RadioGroup {...field} className="grid grid-cols-2 gap-4">
                                <Card className="p-4 flex items-center justify-center">
                                    <RadioGroupItem value="light" /> Light Theme
                                </Card>
                                <Card className="p-4 flex items-center justify-center">
                                    <RadioGroupItem value="dark" defaultChecked /> Dark Theme
                                </Card>
                            </RadioGroup>
                        )} />
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Base Reading Font</h3>
                        <FormField name="font" control={form.control} render={({ field }) => (
                            <RadioGroup {...field} className="grid grid-cols-3 gap-4">
                                <Card className="p-4 flex items-center justify-center">
                                    <RadioGroupItem value="default" /> default
                                </Card>
                                <Card className="p-4 flex items-center justify-center">
                                    <RadioGroupItem value="comic sans" defaultChecked /> <i>comic sans</i>
                                </Card>
                                <Card className="p-4 flex items-center justify-center">
                                    <RadioGroupItem value="monospace" /> monospace
                                </Card>
                                <Card className="p-4 flex items-center justify-center">
                                    <RadioGroupItem value="open dyslexic" /> open dyslexic
                                </Card>
                                <Card className="p-4 flex items-center justify-center">
                                    <RadioGroupItem value="sans serif" /> sans serif
                                </Card>
                                <Card className="p-4 flex items-center justify-center">
                                    <RadioGroupItem value="serif" /> serif
                                </Card>
                            </RadioGroup>
                        )} />
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Site Navbar</h3>
                        <FormField name="navbar" control={form.control} render={({ field }) => (
                            <RadioGroup {...field} className="grid grid-cols-2 gap-4">
                                <Card className="p-4 flex items-center justify-center">
                                    <RadioGroupItem value="fixed" /> Fixed to window
                                </Card>
                                <Card className="p-4 flex items-center justify-center">
                                    <RadioGroupItem value="static" defaultChecked /> Static top of page
                                </Card>
                            </RadioGroup>
                        )} />
                    </div>

                    <Button type="submit" className="w-full mt-4">Save Settings</Button>
                </form>
            </Form>
        </Card>
    );
}
