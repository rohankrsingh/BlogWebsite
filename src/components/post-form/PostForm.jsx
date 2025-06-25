import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { RTE } from "..";
import { Button, Input, Label, Card } from "../ui/index";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { X } from "lucide-react";
export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
            tags: post?.tags || "",
        },
    });

    const [tags, setTags] = useState(post?.tags ? post.tags : []);
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const submit = async (data) => {
        data.tags = tags;
        data.userProfile = userData.$id;

        if (post) {
            const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

            if (file) {
                appwriteService.deleteFile(post.featuredImage);
            }

            const dbPost = await appwriteService.updatePost(post.$id, {
                ...data,
                featuredImage: file ? file.$id : undefined,
            });

            if (dbPost) {
                navigate(`/post/${dbPost.$id}`);
            }
        } else {
            const file = await appwriteService.uploadFile(data.image[0]);

            if (file) {
                const fileId = file.$id;
                data.featuredImage = fileId;
                // data.tags = tags;
                data.userId = userData.$id;

                const dbPost = await appwriteService.createPost({ ...data });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            }
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string") {
            const transformed = value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "_") // Replace invalid chars with underscores
                .replace(/^\_+/, "") // Remove leading underscores
                .replace(/\s+/g, "_"); // Replace spaces with underscores

            // Ensure the UID is at most 36 characters
            return transformed.slice(0, 36);
        }

        return "";
    }, []);


    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    const handleTagInput = (e) => {
        const value = e.target.value;
        if (value.endsWith(" ") && value.trim() !== "") {
            if (tags.length < 4) {
                setTags([...tags, value.trim()]);
                setValue("tags", "");
                e.target.value = "";
            } else {
                // Optionally show a toast or warning here
            }
        }
    };

    const removeTag = (index) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap w-full">
            <div className="max-md:max-w-[100vw] grid grid-flow-col-dense gap-6 m-auto justify-items-center ,
            max-lg:grid-flow-row-dense max-md:flex max-md:flex-col">
                <Card className="grid m-auto p-6 space-y-4 max-sm:p-4">
                    <div className="">
                        <div className="flex gap-4 max-sm:flex-col">
                            <Label htmlFor="picture" className="text-xl font-normal"> Add your Cover Image: </Label>
                            <Input
                                label="Cover Image :"
                                type="file"
                                className="w-30 mb-4 flex justify-center align-middle max-sm:w-min"
                                accept="image/png, image/jpg, image/jpeg, image/gif"
                                {...register("image")}
                            />
                        </div>

                        {post && (
                            <div className="bg-[--background] h-96 overflow-hidden rounded-lg  ">
                                <img
                                    src={appwriteService.getFilePreview(post.featuredImage)}
                                    alt={post.title}
                                    className="rounded-lg object-cover w-full h-full hover:scale-105 transition delay-150 duration-300 ease-in-out"
                                />
                            </div>
                        )}

                    </div>

                    <div className="max-md:w-[90vw] space-y-4">

                        <Input
                            label="Slug :"
                            type="text"
                            placeholder="Unique URL-friendly identifier (auto-generated from title)"
                            className="!ring-0 outline-none font-normal shadow-none !text-2xl placeholder:text-2xl max-md:placeholder:text-xl"
                            {...register("slug", { required: true })}
                            onInput={(e) => {
                                setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                            }}
                        />
                        <Input
                            label="Title :"
                            type="text"
                            placeholder="Enter a catchy post title (required)"
                            className="!ring-0 outline-none border-none font-normal shadow-none line-clamp-3  !text-4xl placeholder:text-4xl max-md:placeholder:text-3xl"
                            {...register("title", { required: true })}

                        />
                        <div className="flex gap-2 content-center">
                            {tags?.map((val, index) => (
                                <span key={index} className="">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className=""
                                        onClick={() => removeTag(index)}
                                    >
                                        {val}
                                        <X />
                                    </Button>
                                </span>
                            ))}
                        </div>
                        <Input
                            label="Tags :"
                            placeholder="Type a tag without # and press space (max 4, first is highest priority)"
                            className="mb-4"
                            onInput={handleTagInput}
                        />

                        <RTE label="" name="content" control={control} defaultValue={getValues("content")} />

                    </div>

                </Card>
                <Card className='flex flex-col items-center p-4 space-y-4 ,
                 max-lg:col-span-full max-lg:w-full '>
                    <div className="w-full mb-2 text-center text-foreground-600 text-base">
                        {/* Instructions for adding posts */}
                        <p>
                            <strong>Instructions:</strong> Fill in the post details, add tags by typing and pressing space, select the post status, and click {post ? 'Update' : 'Submit'} to {post ? 'update' : 'create'} your post.
                        </p>
                    </div>
                    <Select value={register.status} // Integrate React Hook Form's state
                        onValueChange={(value) => setValue("status", value)}
                        className='w-full'
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button type="submit" className="w-full">
                        {post ? "Update" : "Submit"}
                    </Button>
                </Card>
            </div>


        </form>
    );
}
