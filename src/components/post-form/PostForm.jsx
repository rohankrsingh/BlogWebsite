import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { RTE } from "..";
import { Button, Input, Label, Card } from "../ui/index";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
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
    console.log(tags);



    const submit = async (data) => {
        data.tags = tags;
        console.log(data.tags);

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
            console.log(file);

            if (file) {
                const fileId = file.$id;
                data.featuredImage = fileId;
                // data.tags = tags;
                data.userId = userData.$id;
                console.log(data);

                const dbPost = await appwriteService.createPost({ ...data });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            }
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

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
        if (e.key === " " && e.target.value.trim() !== "") {
            setTags([...tags, e.target.value.trim()]);
            setValue("tags", "");
            e.target.value = "";
        }
        console.log(tags)
    };

    const removeTag = (index) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap w-full">
            <div className="grid grid-flow-col-dense gap-6 m-auto justify-items-center ,
            max-lg:grid-flow-row-dense">
                <Card className="grid m-auto p-6 space-y-4 ">
                    <div className="">
                        <div className="flex gap-4">
                            <Label htmlFor="picture" className="text-xl font-normal"> Add your Cover Image: </Label>
                            <Input
                                label="Cover Image :"
                                type="file"
                                className="w-30 mb-4 flex justify-center align-middle max-sm:w-auto"
                                accept="image/png, image/jpg, image/jpeg, image/gif"
                                {...register("image", { required: !post })}
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

                    <div className=" space-x-2 space-y-4">

                        <Input
                            label="Slug :"
                            type="text"
                            placeholder="Add your post title here..."
                            className="!ring-0 outline-none border-none font-normal shadow-none line-clamp-3  !text-4xl placeholder:text-4xl max-md:placeholder:text-3xl"
                            {...register("slug", { required: true })}
                            onInput={(e) => {
                                setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                            }}
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
                            placeholder="Add a tag and press space"
                            className="mb-4"
                            onKeyDown={handleTagInput}
                        />

                        <RTE label="" name="content" control={control} defaultValue={getValues("content")} />

                    </div>

                </Card>
                <Card className='flex flex-col items-center p-4 space-y-4 ,
                 max-lg:col-span-full max-lg:w-full '>
                    
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

                    
                    <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                        {post ? "Update" : "Submit"}
                    </Button>
                </Card>
            </div>


        </form>
    );
}
