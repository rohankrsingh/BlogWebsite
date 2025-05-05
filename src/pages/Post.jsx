import { useEffect, useState } from "react";
import { addToast } from "@heroui/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Container } from "../components";
import { useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Button } from "../components/ui/index";
import { Card, Image } from "@heroui/react";
import ScrollProgress from "../components/ui/scroll-progress";
import SideInfoBar from "../components/SideInfoBar";
import Tags from "../components/ui/Tags";
import { motion } from 'framer-motion';
import Loader from "@/components/Loader";
import AvatarCard from "@/components/AvatarCard";
import service from "../appwrite/config";
import { Query } from "appwrite";
import BlogCards from "@/components/BlogCards";
import markdownElements from "@/components/markdownElements";
export default function Post() {
  const [post, setPost] = useState("");
  const [recommendedPosts, setRecommendedPosts] = useState([]);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState([]);
  const { slug } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAuthor = post && userData ? post.userId === userData.$id : false;
  console.log("Post Author ID:", post.userId);
  console.log("Current User ID:", userData ? userData.$id : "No user data");
  
  useEffect(() => {
    const fetchPost = async () => {
      if (slug) {
        try {
          const fetchedPost = await appwriteService.getPost(slug);
          if (fetchedPost) {
            setPost(fetchedPost);
            setLikes(fetchedPost.likes);
            setLiked(fetchedPost.likes.includes(userData?.$id));
            console.log(post.$id);

          } else {
            navigate("/");
          }
        } catch (err) {
          addToast({
            title: "Error Loading Post",
            description: "There was an error loading the post.",
            color: "danger",
          });
          setError(err);
        } finally {
          setLoading(false);
        }
      } else {
        navigate("/");
      }
    };

    fetchPost();

  }, [slug, navigate, userData]);

  useEffect(() => {
    const fetchRecommendedPosts = async () => {
      if (!post || post.tags?.length <= 0) return;

      const query = [
        Query.select(["title", "featuredImage", "userId", "tags", "likesCount", "$id", "$createdAt"]),
        Query.limit(5),
        Query.contains("tags", post.tags || ["none"]),
        Query.notEqual("$id", [post.$id]),
      ];

      try {
        const { documents } = await service.getPosts(query);
        setRecommendedPosts(documents);
      } catch (error) {
        console.error("Error fetching recommended posts:", error);
        addToast({
          title: "Error",
          description: "Could not load recommended posts.",
          color: "danger",
        });
      }
    };

    fetchRecommendedPosts();
  }, [slug, post, post.$id]);


  const deletePost = async () => {
    addToast({
      title: "Deleting Post",
      description: "Your post is being deleted...",
      color: "info",
    });

    try {
      const status = await appwriteService.deletePost(post.$id);
      if (status) {
        await appwriteService.deleteFile(post.featuredImage);
        addToast({
          title: "Post Deleted",
          description: "Your post has been deleted successfully.",
          color: "success",
        });
        navigate("/");
      }
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  if (loading) return <div className="text-center"><Loader /></div>;
  if (error) addToast({
    title: "Error",
    description: "Failed to load post.",
    color: "error",
  });

  return post ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="py-4 font-system max-md:py-0">
        <ScrollProgress className="top-[64px] max-md:top-[56px] z-30" />
        <div className="max-w-[1300px] px-2 max-lg:w-full mx-auto grid grid-cols-12 gap-5 max-md:px-0">
          <SideInfoBar
            isLiked={liked}
            likes={likes}
            slug={slug}
            className="max-md:fixed h-min left-0 bottom-0 max-md:z-30"
            onLikeUpdate={(updatedLikes, userLiked) => {
              setLikes(updatedLikes);
              addToast({
                title: userLiked ? "Post Liked" : "Post Unliked",
                description: userLiked ? "You liked the post." : "You unliked the post.",
                color: userLiked ? "success" : "info",
              });
              setLiked(userLiked);
            }}
          />
          <Card className="col-span-12 md:col-span-8 max-md:rounded-none max-md:bg-card">
            <Container>
              <div className="w-full flex justify-center relative rounded-t-xl max-md:rounded-t-none">
                <Image
                  src={appwriteService.getFilePreview(post.featuredImage)}
                  alt={post.title}
                  isBlurred
                  classNames={{
                    wrapper: "rounded-t-xl max-md:rounded-t-none w-full !max-w-full z-0",
                    img: "rounded-none rounded-t-xl max-md:rounded-t-none max-w-full w-full  object-cover !max-h-[400px]",
                  }}
                  className="rounded-t-xl max-h-[450px] max-w-full object-cover max-md:rounded-t-none"
                />
                {isAuthor && (
                  <div className="absolute right-6 top-6">
                    <Link to={`/edit-post/${post.$id}`}>
                      <Button className="mr-3">Edit</Button>
                    </Link>
                    <Button onClick={deletePost}>Delete</Button>
                  </div>
                )}
              </div>
              <div className="mx-10 space-y-4 max-md:mx-3">
                <h1 className="text-4xl mt-8 font-semibold">{post.title}</h1>
                <div className="flex space-x-2">
                  <Tags tags={post.tags} className="p-2 h-auto" />
                </div>
                <div className="list-disc">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={markdownElements}
                    className="space-y-5 mb-10"
                  >
                    {post.content}
                  </ReactMarkdown>
                </div>
              </div>
            </Container>
          </Card>
          {/* Recomended Posts */}
          <div className="col-span-12 md:col-span-3 space-y-6 mx-2">
            <AvatarCard userId={post.userId} variant="detailed" />
            {recommendedPosts?.length > 0 && (
              <div className="flex flex-col">
                <h3 className="font-poppins max-md:mx-3">You might like</h3>
                <div className="py-4 flex overflow-visible max-md:overflow-x-auto space-y-4 max-md:grid max-md:grid-cols-1">
                  <div className="max-md:grid grid-flow-col auto-cols-[280px] gap-4 max-md:px-2 space-y-4 max-md:space-y-0">
                    {recommendedPosts?.map((recommendedPost, index) => (
                      <BlogCards key={index} postData={recommendedPost} variant="compact" />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  ) : null;
}
